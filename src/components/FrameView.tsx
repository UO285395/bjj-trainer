import { memo } from 'react';
import Svg, { G, Line, Path } from 'react-native-svg';

import { solve } from '../skeleton/model';
import { type Frame, FIGHTER_COLORS, VIEW, arrowPaths, frameParts } from '../skeleton/shapes';
import { colors } from '../theme';

export const GROUND_Y = 200;

const THUMB_RATIO = 0.62;

/** Encuadre ajustado a las figuras, con la proporción de las miniaturas. */
function fitBox(frame: Frame) {
  const points = frame.poses.flatMap((p) => Object.values(solve(p)));
  const pad = 16;
  let minX = Math.min(...points.map((p) => p.x)) - pad;
  let maxX = Math.max(...points.map((p) => p.x)) + pad;
  let minY = Math.min(...points.map((p) => p.y)) - pad;
  let maxY = Math.max(...points.map((p) => p.y)) + pad;
  const w = maxX - minX;
  const h = maxY - minY;
  if (h / w > THUMB_RATIO) {
    const extra = h / THUMB_RATIO - w;
    minX -= extra / 2;
    maxX += extra / 2;
  } else {
    const extra = w * THUMB_RATIO - h;
    minY -= extra / 2;
    maxY += extra / 2;
  }
  return `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;
}

type Props = {
  frame: Frame;
  width: number;
  /** Encuadra las figuras para usarlo como miniatura. */
  compact?: boolean;
  children?: React.ReactNode;
};

function FrameViewBase({ frame, width, compact, children }: Props) {
  const viewBox = compact ? fitBox(frame) : `0 0 ${VIEW.width} ${VIEW.height}`;
  const ratio = compact ? THUMB_RATIO : VIEW.height / VIEW.width;
  return (
    <Svg width={width} height={width * ratio} viewBox={viewBox}>
      <Line x1={0} y1={GROUND_Y} x2={VIEW.width} y2={GROUND_Y} stroke={colors.matLine} strokeWidth={2} />
      {frameParts(frame).map((p) => (
        <Path key={p.key} d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth={1} strokeLinejoin="round" />
      ))}
      {frame.arrows?.map((a, i) => {
        const { line, head } = arrowPaths(a);
        const color = FIGHTER_COLORS[a.fighter].main;
        return (
          <G key={i}>
            <Path d={line} fill="none" stroke={color} strokeWidth={2.2} strokeDasharray="6 5" />
            <Path d={head} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
          </G>
        );
      })}
      {children}
    </Svg>
  );
}

export const FrameView = memo(FrameViewBase);
