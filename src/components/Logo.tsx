import Svg, { Defs, G, Line, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '../theme';

// Mismo dibujo que assets/brand/logo.svg: un cinturón anudado con su barra y dos grados.
export function Logo({ size }: { size: number }) {
  return (
    <Svg width={size} height={(size * 600) / 864} viewBox="80 320 864 600">
      <Defs>
        <LinearGradient id="band" x1="0" x2="1" y1="0" y2="0">
          <Stop offset="0" stopColor="#C9842A" stopOpacity={0} />
          <Stop offset="0.22" stopColor="#C9842A" />
          <Stop offset="0.78" stopColor="#C9842A" />
          <Stop offset="1" stopColor="#C9842A" stopOpacity={0} />
        </LinearGradient>
      </Defs>
      <Path d="M90 470 Q512 330 934 470 L934 566 Q512 426 90 566 Z" fill="url(#band)" />
      <G stroke={colors.bg} strokeWidth={16} strokeLinejoin="round">
        <Path d="M452 520 Q430 640 330 850 L222 806 Q340 620 372 500 Z" fill="#C9842A" />
        <Path d="M378 760 L330 850 L222 806 L268 718 Z" fill="#C8372D" />
        <Path d="M520 520 Q600 650 760 830 L668 896 Q540 720 448 540 Z" fill="#F2A93B" />
        <Path d="M700 762 L760 830 L668 896 L612 822 Z" fill="#C8372D" />
        <Path
          d="M392 384 Q512 352 632 384 Q652 470 626 556 Q512 584 398 556 Q372 470 392 384 Z"
          fill="#F2A93B"
        />
        <Path d="M392 384 Q440 371 488 365 L640 520 Q636 540 626 556 Q600 562 570 567 Z" fill="#DD9631" />
      </G>
      <G stroke="#EFE9DA" strokeWidth={16}>
        <Line x1={637} y1={834.8} x2={707.7} y2={786.8} />
        <Line x1={653.5} y1={853.6} x2={724.2} y2={805.6} />
      </G>
    </Svg>
  );
}
