import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';
import './App.css';

const binColorMap = {
    'bottle': 'blue',
    'paper': 'blue',
    'newspaper': 'blue',
    'magazine': 'blue',
    'envelope': 'blue',
    'cardboard': 'blue',
    'pizza box': 'blue',
    'cereal box': 'blue',
    'glass': 'green',
    'jar': 'green',
    'bottle cap': 'green',
    'can': 'yellow',
    'aluminum foil': 'yellow',
    'metal lid': 'yellow',
    'food': 'brown',
    'vegetable peel': 'brown',
    'fruit peel': 'brown',
    'coffee grounds': 'brown',
    'tea bags': 'brown',
    'eggshell': 'brown',
    'yard waste': 'brown',
    'leaves': 'brown',
    'branches': 'brown',
    'grass clippings': 'brown',
    'non-recyclable': 'black',
    'plastic bag': 'black',
    'styrofoam': 'black',
    'chip bag': 'black',
    'candy wrapper': 'black',
    'battery': 'black',
    'electronics': 'black',
    'light bulb': 'black',
    'broken dishes': 'black',
    'mirrors': 'black',
    'toys': 'black',
    'textiles': 'red', // In some places, textiles might go in a separate bin
    'clothing': 'red',
    'fabric scraps': 'red',
    'shoes': 'red',
    'hazardous': 'orange', // Hazardous waste often requires special disposal
    'paint': 'orange',
    'chemicals': 'orange',
    'oil': 'orange',
    'pesticides': 'orange',
    'medication': 'orange',
    'sharps': 'orange',
};


const WebcamCapture = () => {
    const webcamRef = useRef(null);
    const [predictionResult, setPredictionResult] = useState('');
    const [binColor, setBinColor] = useState('');

    const [model, setModel] = useState(null);
    useEffect(() => {
        const loadModel = async () => {
            const mobilenetModel = await mobilenet.load();
            setModel(mobilenetModel);
        };
        loadModel();
    }, []);

    const classifyImage = async () => {
      const imageSrc = webcamRef.current.getScreenshot();
  
      if (model && imageSrc) {
          const img = new Image();
          img.src = imageSrc;
          await img.decode();
          const tensor = tf.browser.fromPixels(img);
          const predictions = await model.classify(tensor);
  
          if (predictions && predictions.length > 0) {
              const result = predictions[0].className.toLowerCase();
              let matchedColor = 'gray'; // Default color
  
              for (let key of Object.keys(binColorMap)) {
                  if (result.includes(key)) {
                      matchedColor = binColorMap[key];
                      break;
                  }
              }
  
              setPredictionResult(result);
              setBinColor(matchedColor);
          }
      }
  };

    return (
        <div className="webcam-container">
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg" className="webcam" />
            <button onClick={classifyImage} className="classify-button">Classify</button>
            {predictionResult && (
                <div className="result">
                    <p>Prediction: {predictionResult}</p>
                    <p>Dispose in: <span className={`bin-color ${binColor}`}>{binColor} bin</span></p>
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <div className="App">
            <h1>TrashTales</h1>
            <p>Each piece of waste has its own 'tale' or journey to the correct bin</p>
            <WebcamCapture />
        </div>
    );
};

export default App;
