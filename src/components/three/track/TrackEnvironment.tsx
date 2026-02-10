import { Sky } from '@react-three/drei'

export function TrackEnvironment() {
  return (
    <>
      {/* Brighter ambient light for cartoon look */}
      <ambientLight intensity={0.7} color="#ddeeff" />

      {/* Main directional light (sun) - brighter and warmer */}
      <directionalLight
        position={[50, 80, 30]}
        intensity={1.5}
        color="#fff4dd"
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

      {/* Fill light - brighter for cartoon flatness */}
      <directionalLight position={[-30, 20, -20]} intensity={0.5} color="#88bbff" />

      {/* Rim light for cartoon edge highlight */}
      <directionalLight position={[0, 30, -50]} intensity={0.4} color="#ffddaa" />

      {/* Bright cartoon sky */}
      <Sky
        distance={450000}
        sunPosition={[50, 80, 30]}
        inclination={0.6}
        azimuth={0.25}
        rayleigh={0.3}
      />

      {/* Snowy ground plane - brighter white */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, -100]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshToonMaterial color="#f0f5ff" />
      </mesh>

      {/* Cartoon mountains in background */}
      <CartoonMountain position={[-80, -5, -120]} scale={1.2} color="#6688bb" snowColor="#e8f0ff" />
      <CartoonMountain position={[-40, -5, -150]} scale={1.8} color="#5577aa" snowColor="#ddeeff" />
      <CartoonMountain position={[20, -5, -160]} scale={2.0} color="#4466aa" snowColor="#e0eeff" />
      <CartoonMountain position={[70, -5, -130]} scale={1.4} color="#5588bb" snowColor="#e5f0ff" />
      <CartoonMountain position={[110, -5, -155]} scale={1.6} color="#4477aa" snowColor="#dde8ff" />
      <CartoonMountain position={[-120, -5, -140]} scale={1.5} color="#5577aa" snowColor="#e0eeff" />

      {/* Lighter, more colorful fog */}
      <fog attach="fog" args={['#d8e8ff', 60, 350]} />
    </>
  )
}

function CartoonMountain({
  position,
  scale,
  color,
  snowColor,
}: {
  position: [number, number, number]
  scale: number
  color: string
  snowColor: string
}) {
  return (
    <group position={position} scale={scale}>
      {/* Mountain body */}
      <mesh castShadow>
        <coneGeometry args={[30, 50, 6]} />
        <meshToonMaterial color={color} />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, 18, 0]}>
        <coneGeometry args={[15, 20, 6]} />
        <meshToonMaterial color={snowColor} />
      </mesh>
    </group>
  )
}
