import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { drawHitPoint } from './utils';

function Model({ url, position = [0,0,0], onClick}) {
    const { scene, camera, size } = useThree();
    const { scene: gltfScene, error: gltfError } = useGLTF(url, true, "https://www.gstatic.com/draco/v1/decoders/");

    if (gltfError) {
        console.error("Error loading GLTF model:", gltfError);
        return null;
    }

    const handlePointerDown = (event) => {
        event.stopPropagation();
        const { point, intersections } = event;

        const clickPosition = [point.x, point.y, point.z];
        const vector = new THREE.Vector3(point.x, point.y, point.z).project(camera);
        const screenPosition = [
            ((vector.x + 1) / 2) * size.width,
            ((1 - vector.y) / 2) * size.height
        ];

        const normal = new THREE.Vector3();
        if (intersections.length > 0) {
            const intersection = intersections[0];
            normal.copy(intersection.face.normal).transformDirection(intersection.object.matrixWorld);
        }

        drawHitPoint(normal, point, scene, camera);

        if (onClick) 
            onClick(clickPosition, normal.toArray());
    };
    
    return gltfScene ? (
        // set the position of the model
        <group position={position}>
            <primitive object={gltfScene} onPointerDown={handlePointerDown} /> 
        </group>
    ): null;
}

export default Model;