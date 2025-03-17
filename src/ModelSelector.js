function ModelSelector({ onModelSelected }) {
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const blob = new Blob([e.target.result], {
                    type: file.name.endsWith(".glb") ? "model/gltf-binary" : "model/gltf+json",
                });
                const url = URL.createObjectURL(blob);
                
                onModelSelected(url);
                setTimeout(() => URL.revokeObjectURL(url), 5000);
            };
            reader.readAsArrayBuffer(file);
        }
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
            <div>Load GLTF Model:</div>
            <input type="file" accept=".glb,.gltf" onChange={handleFileChange}/>
            <br />
            <div>Or enter file URL:</div>
            <input type="text" width="100%" placeholder="https://"/>
            <button onClick={() => {
                const url = document.querySelector('input[type="text"]').value;
                if (url) onModelSelected(url);        
                else alert("Please enter a valid URL.");        
            }}>
            Load Model
            </button>
        </div>
    );
}

export default ModelSelector;
