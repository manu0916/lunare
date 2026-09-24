import { useId } from 'react';
import styles from './SushiAssembly.module.css';

const scales = [
  [174, 285], [205, 268], [236, 257], [268, 251], [300, 249], [332, 251], [364, 257],
  [191, 309], [223, 294], [255, 285], [287, 281], [319, 282], [351, 287], [383, 298],
  [211, 333], [243, 321], [275, 315], [307, 315], [339, 320], [371, 330], [403, 342],
] as const;

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
          <clipPath id={fishClip}>
            <path d="M133 311C176 231 339 211 485 253c40 12 70 31 91 58-21 27-51 47-91 59-146 42-309 21-352-59Z" />
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
          <g data-fish-tail>
            <path className={styles.tail} d="M143 306C101 274 77 231 70 186c50 14 83 42 104 76-4 17-15 33-31 44Z" />
            <path className={styles.tail} d="M143 316C100 347 77 390 70 435c50-14 83-42 104-77-5-16-15-31-31-42Z" />
          </g>
          <g data-fish-core>
            <path className={styles.fishBody} style={{ fill: `url(#${salmonGradient})` }} d="M133 311C176 231 339 211 485 253c40 12 70 31 91 58-21 27-51 47-91 59-146 42-309 21-352-59Z" />
            <g clipPath={`url(#${fishClip})`} className={styles.fishTexture}>
              <path d="M135 278c93 23 191 17 293-19" />
              <path d="M130 305c112 24 222 22 338-27" />
              <path d="M137 334c109 14 220 2 334-34" />
              <path d="M157 356c103 4 200-10 294-38" />
            </g>
          </g>
          <path className={styles.cleanSurface} style={{ fill: `url(#${salmonGradient})` }} data-clean-surface d="M146 311C195 250 339 235 468 269c32 8 59 22 80 42-21 20-48 34-80 43-129 33-273 18-322-43Z" />
          <g className={styles.scales}>
            {scales.map(([x, y], index) => (
              <path key={`${x}-${y}`} data-scale data-scale-index={index} d={`M${x} ${y}q11-9 22 0q-11 14-22 0Z`} />
            ))}
          </g>
          <g className={styles.fishDetails} data-fish-detail>
            <path d="M469 257c-22 18-31 36-29 54 0 20 10 38 31 54" />
            <circle cx="500" cy="292" r="5" />
            <path d="M522 326c14-8 27-13 40-15-13-3-26-8-40-16" />
            <path d="M294 238c23-30 49-47 76-53-6 35-22 57-48 67M289 374c20 27 45 44 75 50-6-31-20-51-43-63" />
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
          <text x="510" y="465">06</text>
        </g>
      </svg>

      <div className={styles.labels} aria-hidden="true">
        <div className={styles.labelOrigin} data-stage-label="origin"><span>01</span><b>origem</b><i /></div>
        <div className={styles.labelPrepare} data-stage-label="prepare"><span>02</span><b>preparo</b><i /></div>
        <div className={styles.labelCut} data-stage-label="cut"><span>03</span><b>corte</b><i /></div>
        <div className={styles.labelBalance} data-stage-label="balance"><span>04</span><b>equilíbrio</b><i /></div>
        <div className={styles.labelAssembly} data-stage-label="assembly"><span>05</span><b>montagem</b><i /></div>
        <div className={styles.labelFinish} data-stage-label="finish"><span>06</span><b>acabamento</b><i /></div>
      </div>

      <div className={styles.caption} aria-hidden="true">
        <span data-caption-number>01</span>
        <div>
          <p data-caption="origin">Da origem ao gesto.</p>
          <p data-caption="prepare">Textura, precisão e preparo.</p>
          <p data-caption="cut">O corte revela a forma.</p>
          <p data-caption="balance">Equilíbrio em cada porção.</p>
          <p data-caption="assembly">Forma, arroz e intenção.</p>
          <p data-caption="finish">Precisão em cada etapa.</p>
        </div>
      </div>
    </div>
  );
}
