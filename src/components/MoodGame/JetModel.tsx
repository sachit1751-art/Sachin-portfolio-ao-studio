import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface JetModelProps {
  scene: THREE.Scene;
  position?: THREE.Vector3;
  scale?: number;
}

export const JetModel: React.FC<JetModelProps> = ({ scene, position = new THREE.Vector3(-6, 0, 0), scale = 1.5 }) => {
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(
      '/models/paper_airplane.glb',
      (gltf) => {
        if (cancelled) return;

        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              color: 0xf5f0e8,
              roughness: 0.6,
              metalness: 0.0,
              emissive: 0x000000,
              emissiveIntensity: 0,
              side: THREE.DoubleSide,
            });
            child.castShadow = true;
          }
        });

        const group = new THREE.Group();
        group.add(model);
        group.position.copy(position);
        group.scale.setScalar(scale);

        scene.add(group);
        groupRef.current = group;
      },
      undefined,
      (error) => {
        console.error('Failed to load jet model:', error);
      }
    );

    return () => {
      cancelled = true;
      if (groupRef.current) {
        scene.remove(groupRef.current);
        groupRef.current = null;
      }
    };
  }, [scene]);

  return null;
};

export function getJetGroup(scene: THREE.Scene): THREE.Group | null {
  let found: THREE.Group | null = null;
  scene.traverse((child) => {
    if (child instanceof THREE.Group && child.position.x < -3) {
      found = child;
    }
  });
  return found;
}
