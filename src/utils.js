import * as THREE from 'three';

export function drawHitPoint(normal, point, scene, camera) {

    const previousNormalLine = scene.getObjectByName("normalLine");
    if (previousNormalLine) scene.remove(previousNormalLine);

    const normalEnd = new THREE.Vector3().addVectors(point, normal.multiplyScalar(0.5));
    const normalGeometry = new THREE.BufferGeometry().setFromPoints([point, normalEnd]);
    const normalMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const normalLine = new THREE.Line(normalGeometry, normalMaterial);
    normalLine.name = "normalLine";
    scene.add(normalLine);

    const circleGeometry = new THREE.SphereGeometry(0.05, 32, 32);
    const circleMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.copy(point);
    circle.lookAt(camera.position); // Orient the circle to face the camera
    circle.name = "hitPointCircle";

    // Remove previous hit point circle if it exists
    const previousCircle = scene.getObjectByName("hitPointCircle");
    if (previousCircle) scene.remove(previousCircle);

    scene.add(circle);

    return normal.toArray();
}
