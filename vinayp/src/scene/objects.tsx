import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Edges, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { emitCursorHover } from '../lib/dom'

export const COLORS = {
  volt: '#6a8bff',
  iris: '#9b7bff',
  bone: '#ecebe6',
  steel: '#161922',
}

/** Shared flags so every 3D piece can honour reduced-motion / mobile without prop-drilling. */
export const SceneCtx = createContext({ motion: true, mobile: false })

/* ------------------------------------------------------------------ */
/* Interaction wrapper: hover scale + spin, click handler, hover label */
/* ------------------------------------------------------------------ */

type Vec3 = [number, number, number]

export function Interactive({
  children,
  position = [0, 0, 0],
  scale = 1,
  spin = 0.5,
  hit = 0.9,
  label,
  labelOffset = -1.2,
  onActivate,
}: {
  children: ReactNode
  position?: Vec3
  scale?: number
  spin?: number
  /** Radius of the invisible hit sphere — makes thin geometry easy to hover/tap. */
  hit?: number
  label?: string
  labelOffset?: number
  onActivate?: () => void
}) {
  const { motion } = useContext(SceneCtx)
  const inner = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => () => emitCursorHover(false), [])

  useFrame((_, dt) => {
    const g = inner.current
    if (!g) return
    if (motion) g.rotation.y += dt * spin * (hovered ? 3 : 1)
    const target = scale * (hovered ? 1.22 : 1)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 7, dt))
  })

  return (
    <group position={position}>
      <group
        ref={inner}
        scale={scale}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation()
          setHovered(true)
          emitCursorHover(true)
        }}
        onPointerOut={() => {
          setHovered(false)
          emitCursorHover(false)
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation()
          onActivate?.()
        }}
      >
        <mesh>
          <sphereGeometry args={[hit, 12, 12]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        {children}
      </group>
      {label && hovered && (
        <Html center position={[0, labelOffset, 0]} style={{ pointerEvents: 'none' }}>
          <span className="scene-label">{label}</span>
        </Html>
      )}
    </group>
  )
}

/* ------------------------------------------------------------------ */
/* Miniature icons built from primitives (no external model files)      */
/* ------------------------------------------------------------------ */

function useMetal(color: string, emissive = 0.28, roughness = 0.25) {
  return useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        metalness: 0.75,
        roughness,
        emissive: color,
        emissiveIntensity: emissive,
      }),
    [color, emissive, roughness],
  )
}

/** </>  — code */
export function CodeSymbol({ color = COLORS.volt }: { color?: string }) {
  const mat = useMetal(color)
  const arm = [0.1, 0.62, 0.1] as const
  return (
    <group scale={0.9}>
      {/* < */}
      <mesh position={[-0.7, 0.22, 0]} rotation={[0, 0, -Math.PI / 4]} material={mat}>
        <boxGeometry args={arm} />
      </mesh>
      <mesh position={[-0.7, -0.22, 0]} rotation={[0, 0, Math.PI / 4]} material={mat}>
        <boxGeometry args={arm} />
      </mesh>
      {/* / */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, -Math.PI / 9]} material={mat}>
        <boxGeometry args={[0.1, 1.1, 0.1]} />
      </mesh>
      {/* > */}
      <mesh position={[0.7, 0.22, 0]} rotation={[0, 0, Math.PI / 4]} material={mat}>
        <boxGeometry args={arm} />
      </mesh>
      <mesh position={[0.7, -0.22, 0]} rotation={[0, 0, -Math.PI / 4]} material={mat}>
        <boxGeometry args={arm} />
      </mesh>
    </group>
  )
}

/** Shield with a check mark — cybersecurity */
export function ShieldMark({ color = COLORS.iris }: { color?: string }) {
  const mat = useMetal(color, 0.22, 0.3)
  const check = useMetal(COLORS.bone, 0.6, 0.4)
  const geo = useMemo(() => {
    const s = new THREE.Shape()
    s.moveTo(0, 0.8)
    s.bezierCurveTo(0.3, 0.7, 0.6, 0.7, 0.7, 0.65)
    s.lineTo(0.7, 0.1)
    s.bezierCurveTo(0.7, -0.4, 0.35, -0.7, 0, -0.95)
    s.bezierCurveTo(-0.35, -0.7, -0.7, -0.4, -0.7, 0.1)
    s.lineTo(-0.7, 0.65)
    s.bezierCurveTo(-0.6, 0.7, -0.3, 0.7, 0, 0.8)
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 20,
    })
    g.translate(0, 0, -0.08)
    return g
  }, [])
  useEffect(() => () => geo.dispose(), [geo])
  return (
    <group scale={0.95}>
      <mesh geometry={geo} material={mat} />
      <mesh position={[-0.17, -0.1, 0.16]} rotation={[0, 0, 0.72]} material={check}>
        <boxGeometry args={[0.09, 0.3, 0.06]} />
      </mesh>
      <mesh position={[0.1, 0.03, 0.16]} rotation={[0, 0, -0.67]} material={check}>
        <boxGeometry args={[0.09, 0.62, 0.06]} />
      </mesh>
    </group>
  )
}

/** Stacked blocks — software architecture */
export function BlocksStack({ color = COLORS.volt }: { color?: string }) {
  const mat = useMetal(COLORS.steel, 0.05, 0.35)
  return (
    <group scale={0.9}>
      <mesh position={[0, -0.45, 0]} material={mat}>
        <boxGeometry args={[1.1, 0.4, 1.1]} />
        <Edges color={color} />
      </mesh>
      <mesh position={[0.08, 0, 0.04]} rotation={[0, 0.3, 0]} material={mat}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <Edges color={COLORS.iris} />
      </mesh>
      <mesh position={[-0.04, 0.44, 0]} rotation={[0, -0.25, 0]} material={mat}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <Edges color={color} />
      </mesh>
    </group>
  )
}

const NODE_POINTS: Vec3[] = [
  [0, 0, 0],
  [0.7, 0.5, 0.1],
  [-0.65, 0.55, -0.1],
  [0.55, -0.6, 0.2],
  [-0.7, -0.5, 0],
]
const NODE_LINKS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [1, 3],
  [2, 4],
  [1, 2],
]

/** Connected nodes — blockchain */
export function NodesGraph({ color = COLORS.volt }: { color?: string }) {
  const mat = useMetal(color, 0.6, 0.2)
  return (
    <group scale={0.95}>
      {NODE_POINTS.map((p, i) => (
        <mesh key={i} position={p} material={mat}>
          <sphereGeometry args={[i === 0 ? 0.17 : 0.12, 20, 20]} />
        </mesh>
      ))}
      {NODE_LINKS.map(([a, b], i) => (
        <Line
          key={i}
          points={[NODE_POINTS[a], NODE_POINTS[b]]}
          color={color}
          lineWidth={1.2}
          transparent
          opacity={0.55}
        />
      ))}
    </group>
  )
}

/** Small orbiting project marker */
export function ProjectMarker({
  kind,
  color = COLORS.iris,
}: {
  kind: 'octa' | 'ico' | 'tetra'
  color?: string
}) {
  const mat = useMetal(color, 0.7, 0.2)
  return (
    <mesh material={mat}>
      {kind === 'octa' && <octahedronGeometry args={[0.28, 0]} />}
      {kind === 'ico' && <icosahedronGeometry args={[0.26, 0]} />}
      {kind === 'tetra' && <tetrahedronGeometry args={[0.3, 0]} />}
    </mesh>
  )
}

/* ------------------------------------------------------------------ */
/* Ambient pieces                                                       */
/* ------------------------------------------------------------------ */

export function Particles({
  count,
  radius = 9,
  size = 0.03,
  color = '#9db1ff',
  speed = 0.02,
}: {
  count: number
  radius?: number
  size?: number
  color?: string
  speed?: number
}) {
  const { motion } = useContext(SceneCtx)
  const ref = useRef<THREE.Points>(null)
  const positions = useMemo(() => {
    const a = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = radius * (0.35 + Math.random() * 0.65)
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      a[i * 3] = r * Math.sin(ph) * Math.cos(th)
      a[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.7
      a[i * 3 + 2] = r * Math.cos(ph)
    }
    return a
  }, [count, radius])
  useFrame((_, dt) => {
    if (motion && ref.current) ref.current.rotation.y += dt * speed
  })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        color={color}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

/** A thin tilted ring with children travelling around it. */
export function Orbiter({
  radius,
  tilt = [0, 0],
  speed = 0.2,
  phase = 0,
  ring = true,
  children,
}: {
  radius: number
  tilt?: [number, number]
  speed?: number
  phase?: number
  ring?: boolean
  children?: ReactNode
}) {
  const { motion } = useContext(SceneCtx)
  const pivot = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (motion && pivot.current) pivot.current.rotation.y += dt * speed
  })
  return (
    <group rotation={[tilt[0], 0, tilt[1]]}>
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.004, 8, 160]} />
          <meshBasicMaterial color={COLORS.volt} transparent opacity={0.3} />
        </mesh>
      )}
      <group ref={pivot} rotation={[0, phase, 0]}>
        <group position={[radius, 0, 0]}>{children}</group>
      </group>
    </group>
  )
}

/**
 * A schematic instrument deck suspended beneath the core — concentric hairlines
 * and a graduated tick ring. It reads as laboratory apparatus rather than a
 * glowing prop, and gives the composition a floor without adding solid mass.
 */
export function WorkDeck({ radius = 5.2, y = -2.9 }: { radius?: number; y?: number }) {
  const { motion } = useContext(SceneCtx)
  const g = useRef<THREE.Group>(null)

  useFrame((_, dt) => {
    if (motion && g.current) g.current.rotation.y -= dt * 0.045
  })

  const ticks = useMemo(() => Array.from({ length: 60 }, (_, i) => i), [])

  return (
    <group position={[0, y, 0]}>
      <group ref={g}>
        {/* graduated ticks */}
        {ticks.map((i) => {
          const a = (i / ticks.length) * Math.PI * 2
          const major = i % 5 === 0
          const r1 = radius * (major ? 0.78 : 0.83)
          const r2 = radius * 0.88
          const mid = (r1 + r2) / 2
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * mid, 0, Math.sin(a) * mid]}
              rotation={[0, Math.PI / 2 - a, 0]}
            >
              <boxGeometry args={[major ? 0.022 : 0.009, 0.004, r2 - r1]} />
              <meshBasicMaterial
                color={COLORS.volt}
                transparent
                opacity={major ? 0.5 : 0.2}
                side={THREE.DoubleSide}
              />
            </mesh>
          )
        })}

        {/* concentric hairlines */}
        {[0.6, 0.74].map((f) => (
          <mesh key={f} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius * f, radius * f + 0.006, 160]} />
            <meshBasicMaterial
              color={COLORS.volt}
              transparent
              opacity={f > 0.7 ? 0.18 : 0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}

        {/* faint fill so the deck has a surface, not just edges */}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[radius * 0.88, 96]} />
          <meshBasicMaterial
            color={COLORS.steel}
            transparent
            opacity={0.5}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* static outer boundary — does not rotate, reads as a fixed frame */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 0.88, radius * 0.886, 160]} />
        <meshBasicMaterial color={COLORS.bone} transparent opacity={0.12} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

/** Eases the camera toward the pointer for a gentle parallax. */
export function CameraRig({
  base = [0, 0, 8],
  strength = 1,
}: {
  base?: Vec3
  strength?: number
}) {
  const { motion } = useContext(SceneCtx)
  useFrame((state, dt) => {
    const { camera, pointer } = state
    const tx = base[0] + (motion ? pointer.x * 0.9 * strength : 0)
    const ty = base[1] + (motion ? pointer.y * 0.6 * strength : 0)
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tx, 3, dt)
    camera.position.y = THREE.MathUtils.damp(camera.position.y, ty, 3, dt)
    camera.position.z = THREE.MathUtils.damp(camera.position.z, base[2], 3, dt)
    camera.lookAt(0, 0, 0)
  })
  return null
}

/** The central "digital core": faceted metal body, wire shell, glowing seed. */
export function Core({ scale = 1 }: { scale?: number }) {
  const { motion } = useContext(SceneCtx)
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (!motion || !g.current) return
    g.current.rotation.y += dt * 0.22
    g.current.rotation.x += dt * 0.08
  })
  return (
    <group ref={g} scale={scale}>
      <mesh castShadow>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshPhysicalMaterial
          color="#171a22"
          metalness={0.92}
          roughness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.15}
          flatShading
        />
      </mesh>
      <mesh scale={1.42}>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshBasicMaterial wireframe color={COLORS.volt} transparent opacity={0.28} />
      </mesh>
      <mesh scale={0.5}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={COLORS.iris}
          emissive={COLORS.iris}
          emissiveIntensity={1.4}
          roughness={0.3}
        />
      </mesh>
    </group>
  )
}
