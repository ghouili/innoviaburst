import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Environment, 
  Float, 
  OrbitControls,
  useGLTF,
  Preload
} from "@react-three/drei";
import * as THREE from "three";

interface Hero3DCanvasProps {
  onLoaded?: () => void;
  onError?: () => void;
  animate?: boolean;
}

// Path to the GLB model in public folder
const GLB_MODEL_PATH = "/3d/test01.glb";

// Brand colors from the platform (src/index.css)
const BRAND_CYAN = new THREE.Color("hsl(192, 85%, 50%)");
const BRAND_DEEP_BLUE = new THREE.Color("hsl(210, 70%, 45%)");
const BRAND_ORANGE = new THREE.Color("hsl(24, 95%, 53%)");

/*
 * Check if GLB model exists by attempting to fetch it and verifying content-type
 * SPA servers often return index.html for 404s, so we need to check the actual content
 * COMMENTED OUT: Not needed since we're directly using the GLB model
 */
// function useGLBExists(path: string): boolean {
//   const [exists, setExists] = useState<boolean>(false);

//   useEffect(() => {
//     const controller = new AbortController();
    
//     fetch(path, { method: "HEAD", signal: controller.signal })
//       .then((res) => {
//         // Check if response is OK and content-type is for GLB/binary
//         const contentType = res.headers.get("content-type") || "";
//         const isGLB = res.ok && (
//           contentType.includes("model/gltf-binary") ||
//           contentType.includes("application/octet-stream") ||
//           contentType.includes("model/gltf+json")
//         );
//         setExists(isGLB);
//       })
//       .catch(() => setExists(false));

//     return () => controller.abort();
//   }, [path]);

//   return exists;
// }

/**
 * GLB Model loader component - centered with brand colors and alive animations
 * Features: breathing effect, mouse-following, subtle idle movements
 */
function GLBModel({ animate }: { animate: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(GLB_MODEL_PATH);
  const { viewport } = useThree();
  
  // Mouse position for interactive looking
  const mousePos = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  
  // Track time for idle animations
  const timeRef = useRef(0);

  // Mouse move handler for interactive gaze
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Normalize mouse position to -1 to 1
      mousePos.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mousePos.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Apply brand color to all meshes in the scene
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Clone the material to avoid modifying the cached original
        const material = child.material.clone();
        
        if (material instanceof THREE.MeshStandardMaterial) {
          material.color = BRAND_CYAN;
          material.emissive = BRAND_DEEP_BLUE;
          material.emissiveIntensity = 0.15;
          material.metalness = 0.4;
          material.roughness = 0.3;
        }
        
        child.material = material;
      }
    });
  }, [scene]);

  // Center the model by computing bounding box
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center); // Move model so its center is at origin
  }, [scene]);

  useFrame((state, delta) => {
    if (!groupRef.current || !animate) return;
    
    timeRef.current += delta;
    const t = timeRef.current;
    
    // === BREATHING EFFECT ===
    // Subtle scale pulsing like breathing
    const breathe = 1 + Math.sin(t * 1.5) * 0.015;
    groupRef.current.scale.setScalar(1.5 * breathe);
    
    // === MOUSE-FOLLOWING GAZE ===
    // Robot looks slightly toward mouse position
    targetRotation.current.y = mousePos.current.x * 0.3; // Left-right
    targetRotation.current.x = mousePos.current.y * 0.15; // Up-down (subtle)
    
    // Smooth lerp to target rotation
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.05;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.05;
    
    // === IDLE MICRO-MOVEMENTS ===
    // Subtle random-feeling movements to feel alive
    const idleTiltZ = Math.sin(t * 0.7) * 0.02 + Math.sin(t * 1.3) * 0.01;
    groupRef.current.rotation.z = idleTiltZ;
    
    // === SUBTLE BOBBING ===
    // Small vertical movement (additional to Float)
    const bob = Math.sin(t * 1.2) * 0.05;
    groupRef.current.position.y = bob;
  });

  return (
    <Float
      speed={animate ? 2 : 0}
      rotationIntensity={0} // Disabled - we handle rotation manually
      floatIntensity={animate ? 0.4 : 0}
    >
      <group ref={groupRef} position={[0, 0.5, 0]}>
        <primitive object={scene} scale={0.9} />
      </group>
    </Float>
  );
}

// =============================================================================
// COMMENTED OUT: AutomationCore component - procedural 3D visualization
// Using the GLB model (test01.glb) instead
// Uncomment this section if you want to use the procedural automation core
// =============================================================================
// function AutomationCore({ animate }: { animate: boolean }) {
//   const groupRef = useRef<THREE.Group>(null);
//   const orbitRef1 = useRef<THREE.Group>(null);
//   const orbitRef2 = useRef<THREE.Group>(null);
//   const orbitRef3 = useRef<THREE.Group>(null);
//
//   useFrame((_, delta) => {
//     if (!animate) return;
//     if (groupRef.current) groupRef.current.rotation.y += delta * 0.15;
//     if (orbitRef1.current) orbitRef1.current.rotation.y += delta * 0.3;
//     if (orbitRef2.current) {
//       orbitRef2.current.rotation.y -= delta * 0.2;
//       orbitRef2.current.rotation.x += delta * 0.1;
//     }
//     if (orbitRef3.current) orbitRef3.current.rotation.z += delta * 0.25;
//   });
//
//   const cyanColor = new THREE.Color("hsl(192, 85%, 50%)");
//   const deepBlueColor = new THREE.Color("hsl(210, 70%, 45%)");
//   const orangeColor = new THREE.Color("hsl(24, 95%, 53%)");
//
//   return (
//     <Float speed={animate ? 1.2 : 0} rotationIntensity={animate ? 0.1 : 0} floatIntensity={animate ? 0.2 : 0}>
//       <group ref={groupRef}>
//         <mesh castShadow>
//           <boxGeometry args={[1.2, 1.2, 1.2]} />
//           <meshStandardMaterial color={cyanColor} metalness={0.3} roughness={0.4} emissive={cyanColor} emissiveIntensity={0.1} />
//         </mesh>
//         {/* ... rest of the procedural core ... */}
//       </group>
//     </Float>
//   );
// }
// =============================================================================

/**
 * Scene content component that handles loading state
 */
function SceneContent({ 
  onLoaded, 
  onError, 
  animate
}: Hero3DCanvasProps) {
  const hasNotified = useRef(false);

  useEffect(() => {
    if (!hasNotified.current) {
      hasNotified.current = true;
      // Small delay to ensure canvas is ready
      const timer = setTimeout(() => {
        onLoaded?.();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [onLoaded]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} color="#6ee7ff" />
      <pointLight position={[0, 0, 3]} intensity={0.5} color="#ff8c42" />
      
      {/* Environment for reflections */}
      <Environment preset="city" />

      {/* Main 3D content */}
      {/* {useGLB ? ( */}
        <GLBModel animate={animate ?? true} />
      {/* ) : (
        <AutomationCore animate={animate ?? true} />
      )} */}

      {/* Preload assets */}
      <Preload all />
    </>
  );
}

/**
 * Main Canvas component
 */
export function Hero3DCanvas({ onLoaded, onError, animate = true }: Hero3DCanvasProps) {
  // const glbExists = useGLBExists(GLB_MODEL_PATH); // Not needed - using GLB directly

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.5]} // Limit pixel ratio for performance
      gl={{ 
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      }}
      style={{ background: "transparent" }}
      onCreated={() => {
        // Canvas created successfully
      }}
      onError={() => {
        onError?.();
      }}
    >
      {/* No background color - transparent canvas */}
      
      <SceneContent 
        onLoaded={onLoaded} 
        onError={onError} 
        animate={animate}
      />

      {/* OrbitControls disabled - using mouse-following gaze instead */}
      <OrbitControls 
        enabled={false}
        enableZoom={false}
        enablePan={false}
      />
    </Canvas>
  );
}

export default Hero3DCanvas;
