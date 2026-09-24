import { useId } from 'react';
import styles from './SushiAssembly.module.css';

const scales = Array.from({ length: 6 }, (_, row) =>
  Array.from({ length: 11 }, (_, column) => [183 + column * 26 + (row % 2) * 13, 264 + row * 17] as const),
).flat();

const backSpots = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 13 }, (_, column) => [190 + column * 21 + (row % 2) * 9, 242 + row * 10] as const),
).flat();

const riceGrains = [
  [254, 366, -14], [284, 359, 8], [316, 361, -5], [350, 357, 12], [384, 361, -9], [417, 366, 14],
  [238, 388, 7], [270, 385, -12], [303, 382, 13], [337, 382, -6], [371, 384, 9], [405, 385, -10], [436, 390, 5],
  [244, 411, -8], [278, 408, 11], [311, 405, -13], [345, 406, 6], [379, 407, -5], [413, 411, 12], [430, 432, -9],
  [260, 432, 13], [294, 430, -6], [328, 429, 9], [362, 430, -11], [396, 433, 5], [325, 450, -3],
] as const;

export function SushiAssembly() {
  const uid = useId().replace(/:/g, '');
  const fishClip = `${uid}-fish`;
  const salmonGradient = `${uid}-salmon`;
  const riceGradient = `${uid}-rice`;
  const skinGradient = `${uid}-skin`;
  const flankGradient = `${uid}-flank`;
  const finGradient = `${uid}-fin`;
  const scalePattern = `${uid}-scales`;
  const fishBody = 'M144 308C169 265 250 231 346 225c77-5 145 10 190 38 20 13 34 29 43 47-9 18-23 34-43 46-45 29-113 44-190 39-96-6-177-40-202-83-7-12-7-18 0-4Z';
  const shadow = `${uid}-shadow`;

  return (
    <div className={styles.stage} data-art-stage>
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.orbitFrame} data-orbit-frame aria-hidden="true">
        <div className={styles.orbit} data-orbit-spin><i /><i /><i /></div>
      </div>

      <svg className={styles.artwork} viewBox="0 0 680 560" role="img" aria-labelledby={`${uid}-title ${uid}-description`}>
        <title id={`${uid}-title`}>Transformação de um salmão em nigiri</title>
        <desc id={`${uid}-description`}>Ilustração editorial que apresenta o peixe, o corte, a porção de arroz e a montagem final.</desc>
        <defs>
          <linearGradient id={salmonGradient} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f1a077" />
            <stop offset="0.48" stopColor="#d96f55" />
            <stop offset="1" stopColor="#a9463d" />
          </linearGradient>
          <linearGradient id={riceGradient} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fffdf7" />
            <stop offset="1" stopColor="#d9d7cf" />
          </linearGradient>
          <linearGradient id={skinGradient} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0" stopColor="#102b3b" />
            <stop offset=".25" stopColor="#315268" />
            <stop offset=".43" stopColor="#6a8794" />
            <stop offset=".59" stopColor="#8fa3a4" />
            <stop offset=".77" stopColor="#d1d9d3" />
            <stop offset="1" stopColor="#f2e6d9" />
          </linearGradient>
          <linearGradient id={flankGradient} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0" stopColor="#9f5155" stopOpacity="0" />
            <stop offset=".38" stopColor="#dc8a78" stopOpacity=".65" />
            <stop offset=".56" stopColor="#f2a78a" stopOpacity=".82" />
            <stop offset="1" stopColor="#b66c60" stopOpacity="0" />
          </linearGradient>
          <linearGradient id={finGradient} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0" stopColor="#53768a" />
            <stop offset=".55" stopColor="#1d4258" />
            <stop offset="1" stopColor="#0b2638" />
          </linearGradient>
          <pattern id={scalePattern} width="24" height="17" patternUnits="userSpaceOnUse" patternTransform="skewX(-12)">
            <path d="M-5 3Q4 16 12 3M7 3q9 13 18 0" fill="none" stroke="#e5e8e0" strokeOpacity=".32" strokeWidth=".8" />
            <path d="M3 6q3 4 6 0M15 6q3 4 6 0" fill="none" stroke="#fff7e8" strokeOpacity=".24" strokeWidth=".65" />
          </pattern>
          <clipPath id={fishClip}>
            <path d={fishBody} />
          </clipPath>
          <filter id={shadow} x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="24" stdDeviation="20" floodColor="#020912" floodOpacity=".5" />
          </filter>
        </defs>

        <g className={styles.technical} aria-hidden="true">
          <circle data-tech-ring pathLength="1" cx="348" cy="310" r="230" />
          <circle data-tech-ring pathLength="1" cx="348" cy="310" r="184" />
          <path data-tech-line pathLength="1" d="M78 170h122l38 36M458 116h111l37 37M492 454h91l31-31" />
          <path data-tech-tick d="M348 67v18M348 536v18M105 310H87M608 310h18" />
        </g>

        <g className={styles.fish} filter={`url(#${shadow})`}>
          <image data-fish-render href="/media/salmon-lunare.webp" x="45" y="174" width="560" height="320" preserveAspectRatio="none" />
          <g data-fish-tail>
            <path className={styles.tail} style={{ fill: `url(#${finGradient})` }} d="M157 306C117 287 80 247 58 192c49 13 87 38 123 80l-7 36Z" />
            <path className={styles.tail} style={{ fill: `url(#${finGradient})` }} d="M157 315C117 334 80 374 58 429c49-13 87-38 123-80l-7-36Z" />
            <g className={styles.finRays}>
              <path d="M161 294C123 265 96 232 69 205M157 296C117 274 84 253 69 224M154 300C118 284 89 278 74 255M158 326C123 354 96 389 69 416M155 324C116 346 84 367 69 398M153 320C118 336 89 342 74 368" />
            </g>
            <path className={styles.tailNotch} d="M160 306c-20 1-33 3-42 5 10 2 23 4 42 5" />
          </g>
          <g data-fish-core>
            <path className={styles.dorsalFin} style={{ fill: `url(#${finGradient})` }} d="M285 235c21-30 43-51 68-65 4 24 13 43 31 62l-3 19-95 6Z" />
            <path className={styles.adiposeFin} d="M214 258c5-24 16-39 35-46 1 18 8 31 19 39l-20 13Z" />
            <path className={styles.analFin} style={{ fill: `url(#${finGradient})` }} d="M218 354c-8 22-23 44-46 59 31-2 60-16 87-40Z" />
            <path className={styles.pelvicFin} style={{ fill: `url(#${finGradient})` }} d="M306 376c-7 20-9 38-2 55 26-13 47-28 58-48Z" />
            <path className={styles.fishBody} style={{ fill: `url(#${skinGradient})` }} d={fishBody} />
            <g clipPath={`url(#${fishClip})`}>
              <path className={styles.darkBack} d="M132 264c79-67 233-84 354-34 50 20 76 45 93 78-89-45-231-66-447-44Z" />
              <path className={styles.lateralBand} style={{ fill: `url(#${flankGradient})` }} d="M137 281c122-40 293-47 447 22l-5 49c-143-60-311-50-442-17Z" />
              <path className={styles.silverBelly} d="M140 343c97 20 235 23 420-16-31 51-112 81-214 75-100-6-181-26-206-59Z" />
              <path className={styles.scaleMesh} style={{ fill: `url(#${scalePattern})` }} d={fishBody} />
              <g className={styles.backSpots}>
                {backSpots.map(([x, y], index) => (
                  <ellipse key={`${x}-${y}`} cx={x} cy={y} rx={index % 5 === 0 ? 2.9 : 1.6} ry={index % 4 === 0 ? 1.5 : 1} />
                ))}
              </g>
              <g className={styles.fishTexture}>
                <path d="M155 291c97-39 196-43 297-22M152 310c110-27 210-25 309-6M164 333c100-9 184-7 271 2M174 352c90 7 175 5 260-7" />
                <path d="M176 277c80-36 165-41 256-30M172 365c86 24 177 25 262 5" />
              </g>
              <path className={styles.lateralLine} d="M153 309c112-10 204-8 291 4 31 4 61 2 93-2" />
            </g>
          </g>
          <path className={styles.cleanSurface} style={{ fill: `url(#${salmonGradient})` }} data-clean-surface d="M146 311C195 250 339 235 468 269c32 8 59 22 80 42-21 20-48 34-80 43-129 33-273 18-322-43Z" />
          <g className={styles.scales} clipPath={`url(#${fishClip})`}>
            {scales.map(([x, y], index) => (
              <path key={`${x}-${y}`} data-scale data-scale-index={index} d={`M${x} ${y}q8-6 16 0q-8 8-16 0Z`} />
            ))}
          </g>
          <g className={styles.fishDetails} data-fish-detail>
            <path className={styles.headPlate} d="M459 249c24 12 48 28 65 51 10 14 15 30 11 48-26 18-58 30-90 37 19-17 28-38 26-66-1-26-5-47-12-70Z" />
            <path className={styles.gillEdge} d="M459 252c15 21 22 45 20 69-1 23-12 43-30 59M480 268c11 18 16 35 15 53-1 20-9 37-23 51" />
            <path className={styles.cheek} d="M491 301c17-8 31-8 42 0M490 339c16 4 31 4 45-3" />
            <path className={styles.jaw} d="M531 342c17-8 33-18 48-32-18-1-29-3-41-6M535 344c8 2 20 2 29-2" />
            <path className={styles.mouth} d="M546 316c11 1 21-1 31-6" />
            <path className={styles.fin} style={{ fill: `url(#${finGradient})` }} d="M451 329c-14 16-24 34-30 56-8 24-8 45-3 62 20-11 37-27 49-46 12-18 16-37 15-57Z" />
            <path className={styles.fin} style={{ fill: `url(#${finGradient})` }} d="M332 246c19-24 31-48 22-67 12 17 24 35 31 55" />
            <g className={styles.finRays}>
              <path d="M464 350c-20 30-34 61-42 88M468 352c-12 27-23 50-35 67M471 353c-6 21-12 39-20 54M292 237c20-25 38-44 57-60M310 232c15-21 28-36 43-48M333 229c9-16 15-29 20-43M312 385c0 15 1 29 3 39M329 388c-1 12-2 23-5 30" />
            </g>
            <path className={styles.finHighlight} d="M422 439c11-39 27-68 47-87M292 236c19-27 38-46 59-60" />
            <ellipse className={styles.eyeRim} cx="526" cy="286" rx="12" ry="10" />
            <circle className={styles.eye} cx="527" cy="286" r="6.2" />
            <circle className={styles.eyeGlint} cx="529" cy="283" r="2" />
            <path className={styles.brow} d="M508 271c12-9 25-11 37-5" />
            <path className={styles.nostril} d="M554 297l4-2" />
          </g>
        </g>

        <g className={styles.cutting} aria-hidden="true">
          <path data-cut-line pathLength="1" d="M177 210 494 407" />
          <path data-cut-line pathLength="1" d="M256 190 530 360" />
          <path className={styles.cutGlow} data-cut-glow d="M174 206 500 411" />
        </g>

        <g className={styles.fillet} filter={`url(#${shadow})`}>
          <path data-fillet-plane d="M182 331c48-68 105-98 171-91 65 7 116 34 153 82-38 42-89 64-153 66-68 3-124-16-171-57Z" />
          <path data-fillet-plane d="M198 317c45-52 97-74 156-67 57 6 103 29 139 68-37 34-83 52-140 54-60 2-111-16-155-55Z" />
          <path data-fillet-plane className={styles.filletTop} style={{ fill: `url(#${salmonGradient})` }} d="M215 305c42-37 88-52 140-46 50 6 91 25 124 58-34 28-75 42-126 44-54 1-100-17-138-56Z" />
          <g className={styles.filletStripes} data-fillet-stripes>
            <path d="M268 277c15 23 23 48 24 75M316 264c14 26 22 56 22 93M365 264c12 25 18 52 17 88M412 278c8 18 12 38 11 58" />
          </g>
        </g>

        <g className={styles.portion} data-slice filter={`url(#${shadow})`}>
          <path style={{ fill: `url(#${salmonGradient})` }} d="M212 288c45-31 94-44 147-38 51 6 94 25 128 58-33 32-77 49-130 50-56 1-104-18-145-70Z" />
          <g className={styles.sliceStripes}>
            <path d="M267 268c17 25 26 52 27 81M320 253c14 29 21 61 20 99M375 259c12 25 17 53 14 89M427 276c7 18 9 37 6 55" />
          </g>
        </g>

        <g className={styles.rice} filter={`url(#${shadow})`}>
          <path data-rice-base style={{ fill: `url(#${riceGradient})` }} d="M236 364c23-24 70-36 116-35 52 0 101 13 125 38l-11 70c-28 26-72 38-117 38-48 0-91-13-115-38l2-73Z" />
          <g className={styles.grains}>
            {riceGrains.map(([x, y, rotate], index) => (
              <ellipse key={`${x}-${y}`} data-rice-grain data-grain-index={index} cx={x} cy={y} rx="15" ry="7" transform={`rotate(${rotate} ${x} ${y})`} />
            ))}
          </g>
        </g>

        <path className={styles.glaze} data-glaze pathLength="1" d="M246 291c58-30 126-29 198 3" aria-hidden="true" />
        <g className={styles.finalMarks} data-final-mark aria-hidden="true">
          <path d="M176 267v-24h24M516 267v-24h-24M176 455v24h24M516 455v24h-24" />
        </g>
      </svg>
    </div>
  );
}
