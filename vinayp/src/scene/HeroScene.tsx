import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows, Environment, Float, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { SceneProps } from './types'
import {
  CameraRig,
  CodeSymbol,
  COLORS,
  Core,
  Interactive,
  NodesGraph,
  Orbiter,
  Particles,
  SceneCtx,
  ShieldMark,
  WorkDeck,
} from './objects'
import { goTo } from '../lib/dom'

/** Reacts to scroll progress through the hero + pointer position. */
function World({ mobile, motion }: { mobile: boolean; motion: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const p = Math.min(1, window.scrollY / Math.max(1, window.innerHeight))
    const px = motion ? state.pointer.x : 0
    const py = motion ? state.pointer.y : 0
    g.position.y = THREE.MathUtils.damp(g.position.y, p * 1.8, 4, dt)
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, p * 1.3 + px * 0.28, 3, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -py * 0.16 + p * 0.25, 3, dt)
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, 1 - p * 0.28, 4, dt))
  })

  const body = (
    <group ref={group}>
      <Core />
      <WorkDeck radius={5.2} y={-2.9} />

      <Orbiter radius={2.35} tilt={[0.35, 0.15]} speed={0.22} phase={0.4}>
        <Interactive
          scale={0.5}
          label="Skills"
          labelOffset={-0.9}
          onActivate={() => goTo('skills')}
        >
          <CodeSymbol />
        </Interactive>
      </Orbiter>

      <Orbiter radius={3.0} tilt={[-0.5, -0.25]} speed={-0.16} phase={2.3}>
        <Interactive
          scale={0.5}
          label="About"
          labelOffset={-0.9}
          onActivate={() => goTo('about')}
        >
          <ShieldMark />
        </Interactive>
      </Orbiter>

      <Orbiter radius={3.6} tilt={[0.12, 0.5]} speed={0.12} phase={4.4}>
        <Interactive
          scale={0.5}
          label="Projects"
          labelOffset={-0.9}
          onActivate={() => goTo('projects', { projectId: 'vaultix' })}
        >
          <NodesGraph />
        </Interactive>
      </Orbiter>
    </group>
  )

  return motion ? (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.55}>
      {body}
    </Float>
  ) : (
    body
  )
}

export default function HeroScene({ active, mobile, reduceMotion }: SceneProps) {
  const motion = !reduceMotion
  return (
    <div className="fade-in absolute inset-0">
      <Canvas
        dpr={[1, mobile ? 1.25 : 1.75]}
        shadows={!mobile}
        camera={{ position: [0, 0, mobile ? 10.5 : 9], fov: 38 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        aria-label="Interactive 3D scene: a rotating geometric core with orbiting code, security and blockchain icons"
      >
        <SceneCtx.Provider value={{ motion, mobile }}>
          <ambientLight intensity={0.35} />
          <directionalLight
            position={[4, 6, 5]}
            intensity={2.2}
            castShadow={!mobile}
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-5, -2, 3]} intensity={18} color={COLORS.iris} />
          <pointLight position={[5, 2, -3]} intensity={14} color={COLORS.volt} />

          {!mobile && (
            <Environment frames={1} resolution={128}>
              <Lightformer
                form="rect"
                intensity={2.2}
                color="#8aa4ff"
                position={[0, 5, -5]}
                scale={[12, 4, 1]}
              />
              <Lightformer
                form="ring"
                intensity={1.6}
                color="#b9a3ff"
                position={[-5, 1, 3]}
                scale={4}
              />
            </Environment>
          )}

          <World mobile={mobile} motion={motion} />
          <Particles count={mobile ? 140 : 380} radius={9} />
          <CameraRig base={[0, 0, mobile ? 10.5 : 9]} strength={mobile ? 0 : 1} />

          {!mobile && (
            <ContactShadows
              position={[0, -3.4, 0]}
              opacity={0.45}
              scale={14}
              blur={2.6}
              far={5}
              resolution={256}
              color="#05060a"
            />
          )}
        </SceneCtx.Provider>
      </Canvas>
    </div>
  )
}
