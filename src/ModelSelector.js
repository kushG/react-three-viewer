import React, { useState } from 'react';

function ModelSelector({ onModelSelected }) {
    const [isSpawnLocationValid, setIsSpawnLocationValid] = useState(true);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const blob = new Blob([e.target.result], {
                    type: file.name.endsWith(".glb") ? "model/gltf-binary" : "model/gltf+json",
                });
                const url = URL.createObjectURL(blob);
                
                const spawnLocation = getSpawnLocation();
                if (!spawnLocation) return;

                onModelSelected(url, spawnLocation);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            };
            reader.readAsArrayBuffer(file);
        }
    };

    const handleUrlLoad = () => {
        const url = document.querySelector('input[type="text"]').value;
        if (url) {
            const spawnLocation = getSpawnLocation();
            if (!spawnLocation) return;

            onModelSelected(url, spawnLocation);
        } else {
            alert("Please enter a valid URL.");
        }
    };

    const getSpawnLocation = () => {
        const spawnLocationInput = document.getElementById('spawnLocation').value;
        let spawnLocation = [0, 0, 0]; // Default spawn location

        if (spawnLocationInput.trim() !== "") {
            spawnLocation = spawnLocationInput
                .split(",")
                .map((v) => parseFloat(v))
                .filter((v) => !isNaN(v));
            
            if (spawnLocation.length !== 3) {
                // alert("Please enter a valid spawn location with x, y, and z coordinates.");
                setIsSpawnLocationValid(false);
                return null;
            }
        }

        setIsSpawnLocationValid(true);
        return spawnLocation;
    };

    const handleSpawnLocationChange = () => {
        getSpawnLocation();
    };

    return (
        <div style={{ 
            width: '30%', 
            flexDirection: 'column', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'left', 
            height: '100vh', 
            margin: 'auto' 
        }}>
            <div>Spawn Location:</div>
            <input 
                type="text" 
                placeholder="x, y, z (optional)" 
                id="spawnLocation" 
                onChange={handleSpawnLocationChange}
            />
            <br />
            <div>Load GLTF Model:</div>
            <input 
                type="file" 
                accept=".glb,.gltf" 
                onChange={handleFileChange} 
                disabled={!isSpawnLocationValid}
            />
            <br />
            <div>Or enter file URL:</div>
            <input 
                type="text" 
                width="100%" 
                placeholder="https://"
                disabled={!isSpawnLocationValid}
            />
            <button onClick={handleUrlLoad} disabled={!isSpawnLocationValid}>
                Load Model
            </button>
        </div>
    );
}

export default ModelSelector;
