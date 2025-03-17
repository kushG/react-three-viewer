import './App.css';
import './styles.css';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState } from 'react';
import { saveAs } from 'file-saver';
import Model from './Model';
import ModelSelector from './ModelSelector';
import FloatingLabelContainer from './FloatingLabelContainer';
import * as THREE from 'three';

// App Component
function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [surfaceNormal, setSurfaceNormal] = useState(null);
  return (
    <div style={{ width: "100vw", height: "80vh" }}>
      {!modelUrl && <ModelSelector onModelSelected={(url) => setModelUrl(url)} />}
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        {modelUrl && (
          <Model
            url={modelUrl}
            onClickData={(position, normal) => {
              setClickedPosition(position);
              setSurfaceNormal(normal);              
            }}
          />
        )}
      </Canvas>      
      {clickedPosition && (
        <FloatingLabelContainer
          clickedPosition={clickedPosition}
          surfaceNormal={surfaceNormal}
        />
      )}
      
      {/* Download */}
      <button style={{ position: 'absolute', top: 10, right: 10 }}
        onClick={() => {
          const sessionData = JSON.parse(sessionStorage.getItem('sessionData')) || [];
          const dataBlob = new Blob([JSON.stringify(sessionData, null, 2)], { type: "application/json;charset=utf-8" });
          saveAs(dataBlob, "sessionData.json");
        }}>
        Download Session Data
      </button>
    </div>
  );
}

export default App;