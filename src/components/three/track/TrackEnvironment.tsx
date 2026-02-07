import { Sky } from '@react-three/drei'

export function TrackEnvironment() {
  return (
    <>
      {/* Ambient light for general illumination */}
      <ambientLight intensity={0.4} color="#b8d4f0" />

      {/* Main directional light (sun) */}
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.2}
        color="#fff8e7"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />

      {/* Fill light */}
      <directionalLight position={[-30, 20, -20]} intensity={0.3} color="#a8c8e8" />

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[50, 80, 30]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={0.5}
      />

      {/* Snow ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -100]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#e8f0f8" roughness={0.9} metalness={0} />
      </mesh>

      {/* Fog for depth */}
      <fog attach="fog" args={['#c0d8ef', 50, 300]} />
    </>
  )
}
