export interface SceneProps {
  /** True while the scene is on (or near) screen. Offscreen scenes stop rendering. */
  active: boolean
  /** Phones / small touch tablets → fewer particles, no shadows, lower pixel ratio. */
  mobile: boolean
  /** prefers-reduced-motion → no autonomous rotation, orbiting or camera drift. */
  reduceMotion: boolean
}
