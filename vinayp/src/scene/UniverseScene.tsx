import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import type { SceneProps } from './types'
import {
  BlocksStack,
  CameraRig,
  CodeSymbol,
  COLORS,
  Core,
  Interactive,
  NodesGraph,
  Orbiter,
  Particles,
  ProjectMarker,
  SceneCtx,
  ShieldMark,
} from './objects'
import { goTo } from '../lib/dom'

/** Turns the whole universe as the section scrolls through the viewport. */
function Universe({ motion }: { motion: boolean }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    const rect = state.gl.domElement.getBoundingClientRect()
    const vh = window.innerHeight
    const progress = THREE.MathUtils.clamp((vh - rect.top) / (vh + rect.height), 0, 1)
    const target = motion ? (progress - 0.5) * Math.PI * 0.7 : 0
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, target, 3, dt)
  })

  return (
    <group ref={group}>
      <Interactive
        scale={1}
        spin={0}
        hit={1.8}
        label="Contact"
        labelOffset={-2.1}
        onActivate={() => goTo('contact')}
      >
        <Core scale={0.95} />
      </Interactive>

      <Interactive
        position={[-3.6, 1.5, 0.4]}
        scale={0.9}
        label="Skills"
        onActivate={() => goTo('skills')}
      >
        <CodeSymbol />
      </Interactive>

      <Interactive
        position={[3.5, 1.7, -0.3]}
        scale={0.9}
        label="About"
        onActivate={() => goTo('about')}
      >
        <ShieldMark />
      </Interactive>

      <Interactive
        position={[-3.2, -1.7, 0.7]}
        scale={0.9}
        label="Journey"
        onActivate={() => goTo('journey')}
      >
        <BlocksStack />
      </Interactive>

      <Interactive
        position={[3.4, -1.6, 0.5]}
        scale={0.9}
        label="Vaultix"
        onActivate={() => goTo('projects', { projectId: 'vaultix' })}
      >
        <NodesGraph />
      </Interactive>

      {/* Project markers orbit the core; each opens its project. */}
      <Orbiter radius={2.3} tilt={[0.25, 0.1]} speed={0.35} phase={0}>
        <Interactive
          scale={1}
          spin={1.2}
          hit={0.5}
          label="Vaultix"
          labelOffset={-0.55}
          onActivate={() => goTo('projects', { projectId: 'vaultix' })}
        >
          <ProjectMarker kind="octa" color={COLORS.volt} />
        </Interactive>
      </Orbiter>
      <Orbiter radius={2.3} tilt={[0.25, 0.1]} speed={0.35} phase={2.1} ring={false}>
        <Interactive
          scale={1}
          spin={1.2}
          hit={0.5}
          label="GapBridge"
          labelOffset={-0.55}
          onActivate={() => goTo('projects', { projectId: 'gapbridge' })}
        >
          <ProjectMarker kind="ico" color={COLORS.iris} />
        </Interactive>
      </Orbiter>
      <Orbiter radius={2.3} tilt={[0.25, 0.1]} speed={0.35} phase={4.2} ring={false}>
        <Interactive
          scale={1}
          spin={1.2}
          hit={0.5}
          label="DCET Predictor"
          labelOffset={-0.55}
          onActivate={() => goTo('projects', { projectId: 'dcet' })}
        >
          <ProjectMarker kind="tetra" color={COLORS.bone} />
        </Interactive>
      </Orbiter>
    </group>
  )
}

export default function UniverseScene({ active, mobile, reduceMotion }: SceneProps) {
  const motion = !reduceMotion
  return (
    <div className="fade-in absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 10], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={active ? 'always' : 'never'}
        aria-label="Interactive 3D universe. Click any floating object to jump to the matching section."
      >
        <SceneCtx.Provider value={{ motion, mobile }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 5]} intensity={2} />
          <pointLight position={[-5, -2, 3]} intensity={16} color={COLORS.iris} />
          <pointLight position={[5, 2, -3]} intensity={12} color={COLORS.volt} />
          <Environment frames={1} resolution={128}>
            <Lightformer
              form="rect"
              intensity={2}
              color="#8aa4ff"
              position={[0, 5, -5]}
              scale={[12, 4, 1]}
            />
            <Lightformer
              form="ring"
              intensity={1.4}
              color="#b9a3ff"
              position={[-5, 1, 3]}
              scale={4}
            />
          </Environment>

          <Universe motion={motion} />
          <Particles count={420} radius={11} size={0.028} />
          <CameraRig base={[0, 0, 10]} strength={1.1} />
        </SceneCtx.Provider>
      </Canvas>
    </div>
  )
}
