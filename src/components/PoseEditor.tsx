import { useLayoutEffect, useRef, useState } from 'react';
import { type GestureResponderEvent, PanResponder, StyleSheet, Text, View } from 'react-native';
import { Circle } from 'react-native-svg';

import {
  BONE_ENDING_AT,
  BONES,
  type Bone,
  JOINTS,
  type Joint,
  type Point,
  type Pose,
  angleBetween,
  currentBend,
  mirrorPose,
  rotateBone,
  rotatePose,
  solve,
  solveTwoBone,
  translate,
} from '../skeleton/model';
import { FIGHTER_COLORS, type Frame, VIEW } from '../skeleton/shapes';
import { colors } from '../theme';
import { FrameView } from './FrameView';
import { Chip } from './ui';

const GRAB_RADIUS = 20;

// Articulaciones finales que se mueven con IK de dos huesos.
const IK_CHAINS: Partial<Record<Joint, [Bone, Bone]>> = {
  handL: ['upperArmL', 'forearmL'],
  handR: ['upperArmR', 'forearmR'],
  footL: ['thighL', 'shinL'],
  footR: ['thighR', 'shinR'],
};

const inFront = (p: Pose) => (p.layers?.torso ?? 0) > 3;

/** Capas que ponen toda la figura delante de la otra, conservando su lado lejano. */
function frontLayers(p: Pose): Pose['layers'] {
  const near = p.far === 'L' ? 'R' : 'L';
  return {
    torso: 4,
    [`arm${p.far}`]: 3,
    [`leg${p.far}`]: 3,
    [`arm${near}`]: 5,
    [`leg${near}`]: 5,
  };
}

type Drag = { fighter: number; joint: Joint; last: Point; bend: 1 | -1 };

function dragPose(pose: Pose, drag: Drag, p: Point): Pose {
  if (drag.joint === 'pelvis') return translate(pose, p.x - drag.last.x, p.y - drag.last.y);
  const chain = IK_CHAINS[drag.joint];
  if (chain) return solveTwoBone(pose, chain[0], chain[1], p, drag.bend);
  const bone = BONE_ENDING_AT[drag.joint]!;
  const origin = solve(pose)[BONES[bone].from];
  return rotateBone(pose, bone, angleBetween(origin, p) - pose.angles[bone]);
}

type Props = {
  frame: Frame;
  onChange: (frame: Frame) => void;
  width: number;
  /** Avisa al contenedor para que bloquee su scroll mientras se arrastra. */
  onDragChange?: (dragging: boolean) => void;
};

/**
 * Editor de poses: arrastra cualquier articulación. Manos y pies usan IK; el
 * resto rota su hueso arrastrando lo que cuelga de él; la pelvis mueve la figura.
 */
export function PoseEditor({ frame, onChange, width, onDragChange }: Props) {
  const [fighter, setFighter] = useState(0);
  const [history, setHistory] = useState<Frame[]>([]);
  const drag = useRef<Drag | null>(null);
  // El PanResponder se crea una vez: lee siempre los valores actuales desde aquí.
  const live = useRef({ frame, onChange, onDragChange, scale: width / VIEW.width });
  useLayoutEffect(() => {
    live.current = { frame, onChange, onDragChange, scale: width / VIEW.width };
  });

  // El SVG no recibe toques, así que locationX/Y son relativos al lienzo.
  const toView = (e: GestureResponderEvent): Point => ({
    x: e.nativeEvent.locationX / live.current.scale,
    y: e.nativeEvent.locationY / live.current.scale,
  });

  const commit = (next: Frame) => {
    setHistory((h) => [...h.slice(-30), live.current.frame]);
    onChange(next);
  };

  const updatePose = (i: number, fn: (p: Pose) => Pose) => {
    const poses = live.current.frame.poses.map((p, k) => (k === i ? fn(p) : p)) as Frame['poses'];
    return { ...live.current.frame, poses };
  };

  // Los manejadores solo leen `live` durante los gestos, nunca al renderizar.
  // eslint-disable-next-line react-hooks/refs
  const [responder] = useState(() =>
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => {
        const p = toView(e);
        let best: Drag | null = null;
        let bestDist = GRAB_RADIUS;
        live.current.frame.poses.forEach((pose, i) => {
          const joints = solve(pose);
          for (const j of JOINTS) {
            const d = Math.hypot(joints[j].x - p.x, joints[j].y - p.y);
            // Las extremidades tienen prioridad sobre la pelvis cuando se solapan.
            if (d < bestDist - (j === 'pelvis' ? 4 : 0)) {
              const chain = IK_CHAINS[j];
              bestDist = d;
              best = {
                fighter: i,
                joint: j,
                last: p,
                bend: chain ? currentBend(pose, chain[0], chain[1]) : 1,
              };
            }
          }
        });
        drag.current = best;
        if (best) {
          live.current.onDragChange?.(true);
          setFighter((best as Drag).fighter);
          setHistory((h) => [...h.slice(-30), live.current.frame]);
        }
      },
      onPanResponderMove: (e) => {
        const d = drag.current;
        if (!d) return;
        const p = toView(e);
        live.current.onChange(updatePose(d.fighter, (pose) => dragPose(pose, d, p)));
        d.last = p;
      },
      onPanResponderRelease: () => {
        drag.current = null;
        live.current.onDragChange?.(false);
      },
      onPanResponderTerminate: () => {
        drag.current = null;
        live.current.onDragChange?.(false);
      },
    }),
  );

  const pose = frame.poses[fighter] ?? frame.poses[0];
  const center = solve(pose).pelvis;

  return (
    <View style={{ gap: 10 }}>
      <View style={styles.canvas} {...responder.panHandlers}>
        <View style={{ pointerEvents: 'none' }}>
          <FrameView frame={frame} width={width}>
            {frame.poses.map((p, i) => {
              const joints = solve(p);
              return JOINTS.map((j) => (
                <Circle
                  key={`${i}-${j}`}
                  cx={joints[j].x}
                  cy={joints[j].y}
                  r={i === fighter ? (j === 'pelvis' ? 5.5 : 4.2) : 3}
                  fill="#fff"
                  stroke={FIGHTER_COLORS[i].main}
                  strokeWidth={i === fighter ? 2 : 1.2}
                  opacity={i === fighter ? 1 : 0.7}
                />
              ));
            })}
          </FrameView>
        </View>
      </View>
      <Text style={styles.hint}>
        Arrastra manos y pies para colocarlos; codos, rodillas, cuello y cabeza giran su hueso; el punto
        grande de la cadera mueve toda la figura.
      </Text>
      <View style={styles.row}>
        {frame.poses.map((_, i) => (
          <Chip
            key={i}
            label={i === 0 ? 'Azul' : 'Rojo'}
            selected={fighter === i}
            onPress={() => setFighter(i)}
          />
        ))}
        <Chip
          label="Deshacer"
          onPress={() => {
            const prev = history[history.length - 1];
            if (!prev) return;
            setHistory((h) => h.slice(0, -1));
            onChange(prev);
          }}
        />
      </View>
      <View style={styles.row}>
        <Chip label="↺ 15°" onPress={() => commit(updatePose(fighter, (p) => rotatePose(p, -15)))} />
        <Chip label="↻ 15°" onPress={() => commit(updatePose(fighter, (p) => rotatePose(p, 15)))} />
        <Chip label="Espejo" onPress={() => commit(updatePose(fighter, (p) => mirrorPose(p, center.x)))} />
        <Chip
          label="Cambiar lado lejano"
          onPress={() => commit(updatePose(fighter, (p) => ({ ...p, far: p.far === 'L' ? 'R' : 'L' })))}
        />
        <Chip
          label={inFront(pose) ? 'Enviar atrás' : 'Traer delante'}
          onPress={() =>
            commit(updatePose(fighter, (p) => ({ ...p, layers: inFront(p) ? undefined : frontLayers(p) })))
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: { borderRadius: 14, overflow: 'hidden', backgroundColor: colors.mat },
  hint: { color: colors.muted, fontSize: 13 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
