import { useId } from 'react';
import type { Media } from '../data/types';

export function Arrow({ diagonal = false, className = '' }: { diagonal?: boolean; className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d={diagonal ? 'M6 18 18 6M6 6h12v12' : 'M4 12h15m-6-6 6 6-6 6'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

export function ArmDiagram({ pose = 0, compact = false }: { pose?: number; compact?: boolean }) {
  const id = useId().replaceAll(':', '');
  return <svg viewBox="0 0 600 460" className={`arm-diagram ${compact ? 'compact' : ''}`} role="img" aria-label="Illustrative articulated robot arm, shown as a technical drawing">
    <defs>
      <pattern id={`${id}-grid`} width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0v28" fill="none" stroke="currentColor" strokeOpacity=".09" strokeWidth=".6"/></pattern>
      <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#23353b"/><stop offset="1" stopColor="#101a22"/></linearGradient>
      <linearGradient id={`${id}-edge`}><stop stopColor="#74b5b6"/><stop offset="1" stopColor="#35545e"/></linearGradient>
    </defs>
    <rect width="600" height="460" fill={`url(#${id}-grid)`}/>
    <g fill="none" stroke="currentColor" opacity=".16" strokeWidth="1">
      <circle cx="300" cy="227" r="174" strokeDasharray="3 8"/>
      <circle cx="300" cy="227" r="131" strokeDasharray="2 5"/>
      <path d="M300 28v390M76 227h448M130 391l357-206M119 303l303 113" strokeDasharray="4 7"/>
      <path d="M122 55h-14v14m370-14h14v14M108 385v14h14m356 0h14v-14" strokeOpacity=".8"/>
    </g>
    <g className="diagram-labels" fill="#8b9ca7" fontSize="9" fontFamily="monospace" letterSpacing="1">
      <text x="32" y="31">KINEMATIC STUDY / 001</text><text x="514" y="431">X / Y / Z</text>
      <text x="303" y="44" opacity=".65">Z</text><text x="520" y="231" opacity=".65">X</text>
    </g>
    <g stroke={`url(#${id}-edge)`} strokeWidth="1.4" strokeLinejoin="round">
      <path d="m181 363 111 57 119-66-111-53Z" fill="#0c151d"/>
      <path d="m181 355 111 57 119-66-111-53Z" fill="#142229"/>
      <path d="M181 355v8l111 57v-8m119-66v8l-119 66" fill="none"/>
      <path d="m210 349 82 42 90-49-82-42Z" fill="none" strokeOpacity=".4"/>
      <ellipse cx="291" cy="342" rx="45" ry="23" fill="#12212a"/>
      <path d="M246 342v-23h90v23c-7 31-82 31-90 0Z" fill={`url(#${id}-metal)`}/>
      <ellipse cx="291" cy="319" rx="45" ry="22" fill="#21343b"/>
      <path d="M267 320v-61l35-18 19 10v61l-30 17Z" fill={`url(#${id}-metal)`}/>
      <path d="m267 259 24 12 30-20m-30 20v58" fill="none"/>
      <g className="arm-pose" style={{ transform: `rotate(${pose ? -17 : 0}deg)`, transformOrigin: '288px 264px' }}>
        <path d="m270 273-63-104 24-15 24 9 62 100-25 15Z" fill={`url(#${id}-metal)`}/>
        <path d="m207 169 23 11 62 98m-62-98 25-17" fill="none"/>
        <path d="m227 187 50 78m-39-84 51 79" fill="none" strokeOpacity=".25"/>
        <ellipse cx="289" cy="263" rx="21" ry="23" fill="#12222c"/>
        <ellipse cx="289" cy="263" rx="12" ry="14" fill="#1b333b"/>
        <ellipse cx="289" cy="263" rx="5" ry="6" fill="#71d4d2" stroke="none"/>
        <g className="arm-pose" style={{ transform: `rotate(${pose ? 34 : 0}deg)`, transformOrigin: '230px 168px' }}>
          <path d="m218 154 99-82 26 9 10 23-108 82-22-8Z" fill={`url(#${id}-metal)`}/>
          <path d="m218 154 24 11 101-84m-101 84 3 21" fill="none"/>
          <path d="m255 162 80-62m-87 51 74-58" fill="none" strokeOpacity=".3"/>
          <ellipse cx="230" cy="168" rx="23" ry="25" fill="#142730"/>
          <ellipse cx="230" cy="168" rx="14" ry="16" fill="#203a40"/>
          <ellipse cx="230" cy="168" rx="5" ry="6" fill="#71d4d2" stroke="none"/>
          <path d="m327 82 84 53 7 24-23 11-80-54Z" fill={`url(#${id}-metal)`}/>
          <path d="m327 82 4 24 87 53m-87-53-16 10" fill="none"/>
          <ellipse cx="331" cy="99" rx="19" ry="21" fill="#142730"/>
          <ellipse cx="331" cy="99" rx="11" ry="13" fill="#203a40"/>
          <ellipse cx="331" cy="99" rx="4" ry="5" fill="#71d4d2" stroke="none"/>
          <path d="m395 141 14-9 24 16-14 10Z" fill="#2e3633" stroke="#e6a16d"/>
          <path d="m395 141 24 17v21l-24-17Zm24 17 14-10v21l-14 10Z" fill="#44362b" stroke="#e6a16d"/>
          <g stroke="#f6a467" strokeWidth="3" fill="none"><path d="m401 168-5 16 12 14m21-27 6 16-12 14"/></g>
        </g>
      </g>
      <g fill="#5c9d9e" stroke="none"><ellipse cx="205" cy="353" rx="3" ry="2"/><ellipse cx="292" cy="400" rx="3" ry="2"/><ellipse cx="386" cy="347" rx="3" ry="2"/></g>
    </g>
    {!compact && <g className="diagram-labels" fontSize="10" fontFamily="monospace" letterSpacing=".5">
      <g stroke="#65808a" strokeWidth=".7" fill="none"><path d="m239 166-53-44h-87"/><path d="m336 97 47-40h83"/><path d="m419 186 40 55h75"/><path d="m291 334-69 58H91"/></g>
      <g fill="#91a3ad"><text x="99" y="112">02 / ARTICULATION</text><text x="384" y="47">03 / POSITION</text><text x="460" y="255">END EFFECTOR</text><text x="91" y="408">01 / FOUNDATION</text></g>
      <g fill="#6de5e0"><circle cx="239" cy="166" r="2"/><circle cx="336" cy="97" r="2"/><circle cx="291" cy="334" r="2"/></g>
    </g>}
  </svg>;
}

export function ProjectDiagram({ kind }: { kind: Media['diagram'] }) {
  if (kind === 'arm') return <ArmDiagram compact/>;
  return <svg className="project-diagram" viewBox="0 0 500 270" role="img" aria-label={`Illustrative ${kind} engineering schematic`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <g opacity=".1"><path d="M40 135h420M250 25v220" strokeDasharray="4 7"/><circle cx="250" cy="135" r="100" strokeDasharray="2 7"/></g>
    {kind === 'sumo' && <>
      <g opacity=".24"><path d="M230 95 178 25a90 90 0 0 1 144 0l-52 70"/><path d="M174 127 85 83a100 100 0 0 1 76-61l35 92M326 127l89-44a100 100 0 0 0-76-61l-35 92"/><path d="M250 65V29m-35 45-12-21m82 21 12-21"/></g>
      <path d="M181 109 214 88h72l33 21 12 94H169Z" fill="#251e1a"/>
      <path d="m176 189-17 30h182l-17-30Z" fill="#35281e"/>
      <path d="M198 119h104v62H198Z" opacity=".4"/><path d="M228 123h44v43h-44Z" fill="#35281e"/>
      <g fill="#1d1c1a"><rect x="147" y="125" width="24" height="60" rx="3"/><rect x="329" y="125" width="24" height="60" rx="3"/>
      <circle cx="236" cy="91" r="9"/><circle cx="262" cy="91" r="9"/><circle cx="184" cy="111" r="8"/><circle cx="316" cy="111" r="8"/></g>
      <g opacity=".5"><path d="M147 135h24m-24 10h24m-24 10h24m-24 10h24m-24 10h24M329 135h24m-24 10h24m-24 10h24m-24 10h24m-24 10h24"/><path d="M181 234h138m-138-5v10m138-10v10"/></g>
      <circle cx="250" cy="144" r="4" fill="currentColor"/>
    </>}
    {kind === 'hydrofoil' && <>
      <ellipse cx="250" cy="137" rx="146" ry="55" transform="rotate(-16 250 137)" strokeDasharray="4 7" opacity=".3"/>
      <path d="m118 150 126-56 142 20-127 56Z" fill="#152b34"/>
      <path d="m118 150 141 20 127-56v10l-127 58-141-22Z" fill="#101e27"/>
      <path d="m244 94 15 76v53l-14-6-1-123M259 170l127-56"/>
      <path d="m218 214 47-18 46 8-47 21Z" fill="#19343c"/>
      <path d="M250 144V51m-6 9 6-9 6 9m-6 84 155 11m-8-7 8 7-8 5m-155-16-89 62m2-10-2 10 11-1" opacity=".7"/>
      <circle cx="250" cy="143" r="9" fill="#102731"/><circle cx="250" cy="143" r="3" fill="currentColor"/>
      <g stroke="none" fill="currentColor" fontSize="10" fontFamily="monospace"><text x="263" y="56">YAW</text><text x="394" y="176">ROLL</text><text x="117" y="225">PITCH</text></g>
    </>}
    {kind === 'education' && <>
      <path d="M137 137h54m115 0h61" strokeDasharray="4 5" opacity=".7"/>
      <rect x="192" y="75" width="114" height="124" rx="8" fill="#122a26"/>
      <rect x="218" y="104" width="62" height="54" rx="3" fill="#193b31"/>
      <path d="M231 116v29m11-29v29m11-29v29m11-29v29" opacity=".4"/>
      <g fill="currentColor">{[0,1,2,3,4,5,6].map(i => <g key={i}><circle cx={204+i*15} cy="88" r="2"/><circle cx={204+i*15} cy="185" r="2"/></g>)}</g>
      <rect x="69" y="106" width="68" height="61" rx="5" fill="#122a26"/><circle cx="103" cy="137" r="18"/><circle cx="103" cy="137" r="11" opacity=".5"/>
      <rect x="367" y="113" width="64" height="49" rx="5" fill="#122a26"/><circle cx="398" cy="136" r="11"/><path d="m398 136 22-31" strokeWidth="5"/>
      <g stroke="none" fill="currentColor" fontSize="10" fontFamily="monospace"><text x="86" y="195">INPUT</text><text x="234" y="223">LOGIC</text><text x="378" y="195">OUTPUT</text></g>
    </>}
    {kind === 'racer' && <>
      <path d="m133 165 196-64 57 48-195 66Z" fill="#29231c"/>
      <path d="m191 215 195-66v12l-195 66-58-50v-12Z" fill="#1b1c1b"/>
      <path d="m171 121 71 60m55-98 72 61" strokeWidth="3"/>
      <g fill="#17212a"><ellipse cx="172" cy="127" rx="20" ry="32" transform="rotate(-18 172 127)"/><ellipse cx="240" cy="188" rx="20" ry="32" transform="rotate(-18 240 188)"/><ellipse cx="299" cy="88" rx="17" ry="28" transform="rotate(-18 299 88)"/><ellipse cx="366" cy="150" rx="17" ry="28" transform="rotate(-18 366 150)"/></g>
      <path d="m215 147 46-15 20 17-46 15Z" fill="#433523"/><path d="m198 149 36-12 11 10-36 13Z"/>
      <path d="m206 147 85-30m-79 37 86-30" strokeWidth="2" strokeDasharray="3 3" opacity=".7"/>
      <path d="m127 211 68 57m-59-57-9 0v9M332 58l50-17m-10-3 10 3-5 9" opacity=".6"/>
    </>}
    {kind === 'pcb' && <>
      <rect x="187" y="35" width="126" height="200" rx="4" fill="#122a26"/>
      <rect x="220" y="98" width="61" height="58" fill="#233b35"/>
      <path d="M220 107h-17V67h70m-53 49h-22v63h27m56-65h19v91h-41m-31-49v58m11-58v42m13-42v30"/>
      <g fill="currentColor">{[0,1,2,3].map(i => <rect key={i} x={203+i*24} y="44" width="10" height="17"/>)}</g>
      <circle cx="287" cy="78" r="11"/><circle cx="217" cy="193" r="12"/>
    </>}
    {kind === 'door' && <><rect x="185" y="40" width="130" height="190" rx="8" fill="#26392e"/><path d="M200 60h100v150H200Z" opacity=".4"/><circle cx="287" cy="142" r="7"/><path d="M130 110h54m132 0h54" strokeDasharray="5 7"/><path d="M230 128v-12a20 20 0 0 1 40 0v12"/><rect x="224" y="128" width="52" height="43" rx="3" fill="#343e30"/><circle cx="250" cy="147" r="4"/><path d="M250 151v8"/></>}
    {kind === 'spoiler' && <><path d="m110 105 232-35 49 53-228 38Z" fill="#263c31"/><path d="m163 161 228-38v12l-228 39-53-56v-13Z"/><path d="M188 165v53m115-73v73M155 221h190"/><circle cx="188" cy="199" r="12"/><circle cx="303" cy="199" r="12"/><path d="m188 199 24-23m91 23 23-23"/></>}
    {kind === 'scale' && <><path d="m152 93 161-22 57 49-158 29Z" fill="#263b2f"/><path d="M152 93v83l60 43 158-29v-70m-158 29v70"/><rect x="220" y="161" width="79" height="33" rx="3" fill="#14291e"/><path d="M231 174h28m-28 9h46M374 87q24 12 0 24m8-34q40 23 0 44"/><g fill="currentColor" stroke="none"><circle cx="163" cy="190" r="4"/><circle cx="355" cy="206" r="4"/></g></>}
  </svg>;
}

export function EquipmentIcon({ kind }: { kind: string }) {
  return <svg viewBox="0 0 100 90" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    {kind === 'printer' && <><path d="M19 15h62v62H19Z"/><path d="M26 22h48v43H26Z" opacity=".5"/><path d="M31 60h38M50 22v15m-8 0h16l-8 10Z"/><path d="m41 61 0-10 9-5 9 5v10m-18-10 9 5 9-5m-9 5v7"/><path d="M26 71h5m4 0h5m25 0h9"/></>}
    {kind === 'soldering' && <><path d="M15 51h40v24H15Z"/><rect x="21" y="57" width="16" height="9"/><circle cx="46" cy="62" r="4"/><path d="M55 66h8c10 0 12-13 6-18L57 35m-4-8 25 25 7-7-25-25Z"/><path d="m57 23-8-8-3 3 7 9m22 31-4 17h17"/><path d="M32 42c-9-7 6-7-1-16m8 16c-7-7 7-7 1-16" opacity=".4"/></>}
    {kind === 'tools' && <><path d="m20 67 47-47 10 10-47 47Z"/><path d="m32 55 8 8m0-16 8 8m0-16 8 8m0-16 8 8" opacity=".6"/><path d="M24 18v18l13 13 8-8-13-13V15m-8 3 8-3m15 36 17 19c7 8 18-3 10-10L55 43"/><circle cx="68" cy="65" r="3"/></>}
  </svg>;
}
