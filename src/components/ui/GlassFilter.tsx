export function GlassFilter() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="0"
      height="0"
      className="absolute overflow-hidden"
      aria-hidden="true"
    >
      <defs>
        <filter id="glass-distortion">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.01"
            numOctaves="4"
            seed="100"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="20" result="blurred" />

          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="200"
            xChannelSelector="R"
            yChannelSelector="G"
          />
          
        </filter>
      </defs>
    </svg>
  );
}
