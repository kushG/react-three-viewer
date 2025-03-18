import './App.css';
import './styles.css';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useState, useEffect, Suspense } from 'react';
import { saveAs } from 'file-saver';
import Model from './Model';
import ModelSelector from './ModelSelector';
import FloatingLabelContainer from './FloatingLabelContainer';
import Stats from 'stats.js';

function PerformanceMonitor() {
  useEffect(() => {
      const stats = new Stats();
      stats.showPanel(0); // 0 = FPS, 1 = MS, 2 = MB, 3 = Custom
      document.body.appendChild(stats.dom);

      function animate() {
          stats.begin();
          stats.end();
          requestAnimationFrame(animate);
      }
      requestAnimationFrame(animate);
      
      return () => document.body.removeChild(stats.dom);
  }, []);

  return null; // No UI needed
}


// App Component
function App() {
  const [modelUrl, setModelUrl] = useState(null);
  const [spawnLocation, setSpawnLocation] = useState([0,0,0]);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [surfaceNormal, setSurfaceNormal] = useState(null);
  const handleModelClick = (position, normal) => {
    setClickedPosition(position);
    setSurfaceNormal(normal);
  }
  const handleModelSelected = (url, spawnLocation) => {
    setModelUrl(url);
    setSpawnLocation(spawnLocation);
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PerformanceMonitor />

      {!modelUrl && <ModelSelector  onModelSelected={(url, spawnLocation) => handleModelSelected(url, spawnLocation) } />}

      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <OrbitControls />
        {modelUrl && spawnLocation && (
          <Suspense fallback={null}>
            <Model
              url={modelUrl}
              position={spawnLocation}
              onClick={(position, normal) => handleModelClick(position, normal)}
            />
          </Suspense>          
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