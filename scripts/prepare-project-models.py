"""Run with Blender --background --python scripts/prepare-project-models.py -- [--project ID].

Creates matte GLBs and six orthographic PNGs in .model-build/. Convert PNGs to
WebP with finish-project-models.py using the normal Python/Pillow installation.
Source FBXs are never modified. See MODEL_WORKFLOW.md for the full workflow.
"""
import argparse
import json
import math
import shutil
import sys
from pathlib import Path

import bpy
import bmesh
from mathutils import Matrix, Vector

ROOT = Path(__file__).resolve().parents[1]
MODELS = {
    'cupexs': 'Cupexs car.fbx',
    'lara': 'Lara.fbx',
    'active-spoiler': 'Spoiler arm v2.fbx',
    'sumo-2026': 'Tekkai v2.fbx',
}
CAMERA_DIRECTION = Vector((-6, -8, 5)).normalized()
WIDTH, HEIGHT = 800, 600


def triangles(objects):
    return sum(sum(len(p.vertices) - 2 for p in o.data.polygons) for o in objects)


def prepare(project, filename, frames):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.fbx(filepath=str(ROOT / 'public/3D models' / filename))
    objects = [o for o in bpy.context.scene.objects if o.type == 'MESH']
    original_triangles = triangles(objects)
    # These Fusion FBXs arrive with -Y as up. Bake world transforms and move to Z-up.
    upright = Matrix.Rotation(-math.pi / 2, 4, 'X')
    transforms = {o: upright @ o.matrix_world.copy() for o in objects}
    for obj in objects:
        obj.data = obj.data.copy()
        obj.data.transform(transforms[obj])
        obj.parent = None
        obj.matrix_world = Matrix.Identity(4)
    for obj in list(bpy.context.scene.objects):
        if obj not in objects:
            bpy.data.objects.remove(obj, do_unlink=True)

    # Dissolve almost coplanar faces, preserving material boundaries and corners.
    bpy.ops.object.select_all(action='DESELECT')
    for obj in objects:
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        mod = obj.modifiers.new('Remove redundant CAD tessellation', 'DECIMATE')
        mod.decimate_type = 'DISSOLVE'
        mod.angle_limit = math.radians(1)
        mod.delimit = {'MATERIAL', 'SHARP'}
        bpy.ops.object.modifier_apply(modifier=mod.name)
        obj.select_set(False)

    # Cap heavy assemblies; small hardware keeps its full geometry.
    after_dissolve = triangles(objects)
    if after_dissolve > 280000:
        ratio = 240000 / after_dissolve
        for obj in objects:
            if len(obj.data.polygons) < 2000:
                continue
            bpy.context.view_layer.objects.active = obj
            mod = obj.modifiers.new('Web mesh budget', 'DECIMATE')
            mod.ratio = ratio
            mod.use_collapse_triangulate = True
            bpy.ops.object.modifier_apply(modifier=mod.name)

    for obj in objects:
        # Smooth only within curved surfaces; split normals at mechanical corners.
        mesh = obj.data
        if mesh.has_custom_normals:
            bpy.context.view_layer.objects.active = obj
            bpy.ops.mesh.customdata_custom_splitnormals_clear()
        for poly in mesh.polygons:
            poly.use_smooth = True
        mesh.set_sharp_from_angle(angle=math.radians(30))
        bm = bmesh.new()
        bm.from_mesh(mesh)
        bm.edges.ensure_lookup_table()
        marked = [e.index for e in bm.edges if not e.is_manifold or e.calc_face_angle(0) >= math.radians(25)]
        bm.free()
        marks = mesh.attributes.get('freestyle_edge') or mesh.attributes.new('freestyle_edge', 'BOOLEAN', 'EDGE')
        for index in marked:
            marks.data[index].value = True

    # Preserve imported part colors; remove showroom reflections.
    for material in bpy.data.materials:
        material.use_nodes = True
        for node in material.node_tree.nodes:
            if node.type == 'BSDF_PRINCIPLED':
                # Fusion's FBX diffuse RGB values are display-space colors;
                # shader inputs and glTF factors use linear RGB.
                color = node.inputs['Base Color'].default_value
                for channel in range(3):
                    value = color[channel]
                    color[channel] = value / 12.92 if value <= 0.04045 else ((value + 0.055) / 1.055) ** 2.4
                node.inputs['Metallic'].default_value = 0
                node.inputs['Roughness'].default_value = 0.88
                node.inputs['Specular IOR Level'].default_value = 0.12
                node.inputs['Coat Weight'].default_value = 0

    coords = [obj.matrix_world @ Vector(c) for obj in objects for c in obj.bound_box]
    low = Vector([min(p[i] for p in coords) for i in range(3)])
    high = Vector([max(p[i] for p in coords) for i in range(3)])
    center = (low + high) / 2
    for obj in objects:
        obj.data.transform(Matrix.Translation(-center))

    # A common pivot rotates the complete assembly without moving the camera.
    pivot = bpy.data.objects.new('Assembly turntable', None)
    bpy.context.collection.objects.link(pivot)
    for obj in objects:
        obj.parent = pivot
    bpy.context.view_layer.update()
    model_dir = ROOT / 'public/media/models'
    model_dir.mkdir(parents=True, exist_ok=True)
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.export_scene.gltf(
        filepath=str(model_dir / f'{project}.glb'), export_format='GLB',
        use_selection=True, export_animations=False, export_cameras=False,
        export_lights=False, export_yup=True, export_normals=True,
        export_texcoords=True, export_materials='EXPORT', export_extras=False,
    )
    build = ROOT / '.model-build' / project
    build.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(model_dir / f'{project}.glb', build / 'model.glb')

    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.render.resolution_x, scene.render.resolution_y = WIDTH, HEIGHT
    scene.render.resolution_percentage = 100
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'PNG'
    scene.render.image_settings.color_mode = 'RGBA'
    scene.render.use_file_extension = True
    scene.view_settings.view_transform = 'Standard'
    scene.view_settings.look = 'None'
    scene.world = bpy.data.worlds.new('Soft CAD environment')
    scene.world.use_nodes = True
    scene.world.node_tree.nodes['Background'].inputs[0].default_value = (0.8, 0.8, 0.8, 1)
    scene.world.node_tree.nodes['Background'].inputs[1].default_value = 0.65
    span = (high - low).length
    for name, direction, power in [('Key', (-3, -4, 6), 100), ('Fill', (4, 1, 3), 55)]:
        light = bpy.data.lights.new(name, 'AREA')
        light.energy = power * span * span
        light.shape = 'DISK'
        light.size = span * 3
        obj = bpy.data.objects.new(name, light)
        scene.collection.objects.link(obj)
        obj.location = Vector(direction).normalized() * span * 2
        obj.rotation_euler = (-obj.location).to_track_quat('-Z', 'Y').to_euler()

    camera_data = bpy.data.cameras.new('Fixed orthographic camera')
    camera_data.type = 'ORTHO'
    camera = bpy.data.objects.new('Fixed orthographic camera', camera_data)
    scene.collection.objects.link(camera)
    camera.location = CAMERA_DIRECTION * span * 4
    camera.rotation_euler = (-camera.location).to_track_quat('-Z', 'Y').to_euler()
    scene.camera = camera
    bpy.context.view_layer.update()
    # Fit every actual vertex at all six angles, with a constant frame and scale.
    inverse_rotation = camera.rotation_euler.to_matrix().transposed()
    max_x = max_y = 0
    for step in range(6):
        rotation = Matrix.Rotation(math.radians(step * 60), 3, 'Z')
        for obj in objects:
            for vertex in obj.data.vertices:
                p = inverse_rotation @ rotation @ vertex.co
                max_x = max(max_x, abs(p.x))
                max_y = max(max_y, abs(p.y))
    # Blender's horizontal sensor fit defines ortho_scale as the frame WIDTH.
    camera_data.ortho_scale = max(max_x * 2, max_y * 2 * (WIDTH / HEIGHT)) * 1.14
    camera_data.clip_start = span / 1000
    camera_data.clip_end = span * 20

    scene.render.use_freestyle = True
    settings = bpy.context.view_layer.freestyle_settings
    settings.crease_angle = math.radians(155)
    line_set = settings.linesets[0]
    line_set.select_silhouette = True
    line_set.select_border = True
    line_set.select_crease = False
    line_set.select_edge_mark = True
    line_set.select_material_boundary = True
    line_set.visibility = 'VISIBLE'
    if line_set.linestyle is None:
        line_set.linestyle = bpy.data.linestyles.new('Black CAD feature edges')
    line_set.linestyle.color = (0.008, 0.008, 0.008)
    line_set.linestyle.thickness = 1.8

    report = {
        'project': project, 'source': filename, 'meshes': len(objects),
        'originalTriangles': original_triangles, 'trianglesAfterDissolve': after_dissolve,
        'exportTriangles': triangles(objects), 'glbBytes': (model_dir / f'{project}.glb').stat().st_size,
        'orthoScale': camera_data.ortho_scale, 'cameraPosition': list(camera.location),
        'angles': list(range(0, 360, 60)), 'resolution': [WIDTH, HEIGHT],
    }
    (build / 'report.json').write_text(json.dumps(report, indent=2) + '\n')
    print('PREPARED ' + json.dumps(report), flush=True)
    for step in frames:
        pivot.rotation_euler.z = math.radians(step * 60)
        scene.render.filepath = str(build / f'{step * 60:03d}.png')
        bpy.ops.render.render(write_still=True)
        print(f'RENDERED {project} {step * 60}', flush=True)


parser = argparse.ArgumentParser()
parser.add_argument('--project', choices=list(MODELS))
parser.add_argument('--preview', action='store_true', help='Render only the initial angle.')
args = parser.parse_args(sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else [])
for project, filename in MODELS.items():
    if not args.project or args.project == project:
        prepare(project, filename, [0] if args.preview else range(6))
