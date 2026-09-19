"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

type BaselineSceneProps = {
  paused: boolean;
  onProgressChange: (progress: number) => void;
};

function Person({
  x,
  z,
  shirt = "#7b8d88",
}: {
  x: number;
  z: number;
  shirt?: string;
}) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.45, 0]}>
        <sphereGeometry args={[0.24, 16, 16]} />
        <meshStandardMaterial color="#d8b49a" />
      </mesh>

      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.5, 0.9, 0.34]} />
        <meshStandardMaterial color={shirt} />
      </mesh>

      <mesh position={[-0.14, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshStandardMaterial color="#46514f" />
      </mesh>

      <mesh position={[0.14, 0.25, 0]}>
        <boxGeometry args={[0.14, 0.7, 0.14]} />
        <meshStandardMaterial color="#46514f" />
      </mesh>
    </group>
  );
}

function MovingCrowd({ paused }: { paused: boolean }) {
  const crowdRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (paused || !crowdRef.current) return;

    crowdRef.current.position.z -= delta * 0.75;

    if (crowdRef.current.position.z < -8) {
      crowdRef.current.position.z = 0;
    }
  });

  return (
    <group ref={crowdRef}>
      <Person x={-0.7} z={-2.5} shirt="#738a85" />
      <Person x={0.65} z={-4.1} shirt="#87978e" />
      <Person x={-0.2} z={-5.8} shirt="#657d79" />
      <Person x={0.9} z={-7.4} shirt="#87918b" />
    </group>
  );
}

function RouteArrow({ z }: { z: number }) {
  return (
    <group position={[0, 0.035, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 1.4]} />
        <meshStandardMaterial color="#7da49a" />
      </mesh>

      <mesh position={[0, 0.01, -0.8]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.6, 1.1, 3]} />
        <meshStandardMaterial color="#7da49a" />
      </mesh>
    </group>
  );
}

function Corridor({
  paused,
  onProgressChange,
}: BaselineSceneProps) {
  const progressRef = useRef(0);

  useFrame((state, delta) => {
    if (paused) return;

    progressRef.current = Math.min(
      progressRef.current + delta * 0.04,
      1
    );

    const progress = progressRef.current;

    state.camera.position.z = THREE.MathUtils.lerp(
      7,
      -14,
      progress
    );

    state.camera.position.y = 1.7;
    state.camera.position.x = 0;

    state.camera.lookAt(
      0,
      1.35,
      state.camera.position.z - 6
    );

    onProgressChange(progress);
  });

  return (
    <>
      <color attach="background" args={["#dfe4df"]} />

      <ambientLight intensity={1.6} />
      <directionalLight
        position={[4, 8, 5]}
        intensity={2.2}
      />

      {/* Floor */}
      <mesh position={[0, -0.05, -5]}>
        <boxGeometry args={[6, 0.1, 30]} />
        <meshStandardMaterial color="#c9cec9" />
      </mesh>

      {/* Walls */}
      <mesh position={[-3.05, 1.6, -5]}>
        <boxGeometry args={[0.12, 3.2, 30]} />
        <meshStandardMaterial color="#f2f0e8" />
      </mesh>

      <mesh position={[3.05, 1.6, -5]}>
        <boxGeometry args={[0.12, 3.2, 30]} />
        <meshStandardMaterial color="#f2f0e8" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 3.2, -5]}>
        <boxGeometry args={[6.2, 0.12, 30]} />
        <meshStandardMaterial color="#ebe9e1" />
      </mesh>

      {/* Classroom doors */}
      {[-1, -7, -13].map((z) => (
        <group key={`left-${z}`}>
          <mesh position={[-2.98, 1.15, z]}>
            <boxGeometry args={[0.08, 2.3, 1.35]} />
            <meshStandardMaterial color="#856e58" />
          </mesh>
        </group>
      ))}

      {[2, -4, -10].map((z) => (
        <group key={`right-${z}`}>
          <mesh position={[2.98, 1.15, z]}>
            <boxGeometry args={[0.08, 2.3, 1.35]} />
            <meshStandardMaterial color="#856e58" />
          </mesh>
        </group>
      ))}

      {/* Route markers */}
      <RouteArrow z={2} />
      <RouteArrow z={-4} />
      <RouteArrow z={-10} />

      {/* Neutral moving crowd */}
      <MovingCrowd paused={paused} />

      {/* Exit zone */}
      <mesh position={[0, 1.4, -18]}>
        <boxGeometry args={[3.8, 2.8, 0.18]} />
        <meshStandardMaterial color="#afc8bc" />
      </mesh>

      <mesh position={[0, 2.5, -17.85]}>
        <boxGeometry args={[1.4, 0.45, 0.08]} />
        <meshStandardMaterial color="#31594f" />
      </mesh>
    </>
  );
}

export default function BaselineScene({
  paused,
  onProgressChange,
}: BaselineSceneProps) {
  return (
    <div className="simulation-canvas">
      <Canvas camera={{ position: [0, 1.7, 7], fov: 58 }}>
        <Corridor
          paused={paused}
          onProgressChange={onProgressChange}
        />
      </Canvas>
    </div>
  );
}
