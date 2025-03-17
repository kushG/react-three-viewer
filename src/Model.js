import React, { useState, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { drawHitPoint } from './utils';

function Model({ url, onClickData }) {
    const { scene, camera, size } = useThree();
    const [error, setError] = useState(null);
    const { scene: gltfScene } = useGLTF(url); // Load the model once at the top level
    const modelRef = useRef(gltfScene);

    const handlePointerDown = (event) => {
        if (error || !modelRef.current) return;

        event.stopPropagation();
        const { point } = event;

        console.log("Point clicked:", point);
        const clickePosition = [point.x, point.y, point.z];

        const vector = new THREE.Vector3(point.x, point.y, point.z);
        vector.project(camera);
        const x = ((vector.x + 1) / 2) * size.width;
        const y = ((1 - vector.y) / 2) * size.height;
        const screenPosition = [x,y];

        const normal = new THREE.Vector3();
        const intersects = event.intersections;
        if (intersects.length > 0) {
            const intersection = intersects[0];
            normal.copy(intersection.face.normal);
            normal.transformDirection(intersection.object.matrixWorld);
        }        

        // Draw the hit point and normal
        drawHitPoint(normal, point, scene, camera);

        
        if (onClickData) {
            onClickData(clickePosition, normal.toArray());
        }
    };

    return modelRef.current ? <primitive object={modelRef.current} onPointerDown={handlePointerDown} /> : null;
}

export default Model;