import dimensions from '../data/generated/image-dimensions.json';

const imageSizes: Record<string, { width: number; height: number }> = dimensions;

export function imageDimensions(source: string): { width?: number; height?: number } {
  return imageSizes[source] || {};
}

export function mediaUrl(source: string) {
  if (source.startsWith('https://')) return source;
  return `${import.meta.env.BASE_URL}${source.replace(/^\/+/, '')}`;
}
