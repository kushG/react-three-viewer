import React, { useState, useEffect } from 'react';
import './styles.css';

function FloatingLabelContainer({ clickedPosition, surfaceNormal }) {
    const [isSaved, setIsSaved] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        setIsSaved(false);
    }, [clickedPosition]);

    const handleSave = () => {
        const data = {
            point: clickedPosition,
            surfaceNormal,
            inputValue,
            timestamp: Date.now(),
        };

        const sessionData = JSON.parse(sessionStorage.getItem('sessionData')) || [];
        sessionData.push(data);
        sessionStorage.setItem('sessionData', JSON.stringify(sessionData));

        setIsSaved(true);
    };

    return (
        <div className='floating-label-container'>
            <div>
                Point: ({clickedPosition.map((coord) => coord.toFixed(4)).join(", ")})<br />
                Normal: ({surfaceNormal ? surfaceNormal.map((coord) => coord.toFixed(4)).join(", ") : "N/A"})<br />
            </div>
            <input 
                type="text" 
                placeholder="Enter Value..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isSaved}
                className="input-field"
            />
            <button 
                onClick={handleSave} 
                disabled={isSaved} 
                className="button"                
                style={{
                    backgroundColor: isSaved ? "#4CAF50" : "#008CBA",
                    cursor: isSaved ? "not-allowed" : "pointer",
                }}
            >
                {isSaved ? "Saved!" : "Save"}
            </button>
        </div>
    );
}

export default FloatingLabelContainer;
