import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import microPhoneIcon from "./microphone.svg";
import "./App.css";
import translate from "translate"; // Import the translate package

function App() {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isListening, setIsListening] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState("en-US");
    const [selectedLanguage1, setSelectedLanguage1] = useState("en-US");
    const [timer, setTimer] = useState(null); // To keep track of user speaking time

    useEffect(() => {
        if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
            return;
        }

        startListening(); // Start listening when the app launches

        return () => {
            SpeechRecognition.stopListening(); // Clean up on unmount
        };
    }, []);

    const startListening = () => {
        setIsListening(true);
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStop = () => {
        setIsListening(false);
        SpeechRecognition.stopListening();
        console.log("User Input: ", transcript);

        const languageCode = selectedLanguage.substring(0, 2);
        const languageCode1 = selectedLanguage1.substring(0, 2);

        // Use translate library
        translate(transcript, { from: languageCode1, to: languageCode })
            .then((translatedText) => {
                console.log("Translated Text: ", translatedText);
                const speech = new SpeechSynthesisUtterance();
                speech.lang = selectedLanguage;
                speech.text = translatedText;
                speech.rate = 0.7; // Slow down the speech rate
                window.speechSynthesis.speak(speech);
                resetTranscript();
            })
            .catch((err) => {
                console.log("Translation Error:", err);
                resetTranscript();
            });
    };

    // Effect to monitor if the user stops speaking
    useEffect(() => {
        if (isListening) {
            if (timer) {
                clearTimeout(timer);
            }

            const newTimer = setTimeout(() => {
                handleStop(); // Call handleStop when silence is detected
            }, 6000);

            setTimer(newTimer);
        }

        return () => {
            if (timer) {
                clearTimeout(timer); // Clear timer on component unmount or on re-render
            }
        };
    }, [isListening, transcript]);

    const handleDropdownChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleDropdownChange1 = (event) => {
        setSelectedLanguage1(event.target.value);
    };

    return (
        <div className="App">
            <div className="HeaderContainer">
                <h1 className="Header">Speech Assist</h1>
            </div>
            <div className="SelectorContainer">
                <select className="Selector" value={selectedLanguage} onChange={handleDropdownChange}>
                    <option value="en-US">Listening</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="it-IT">Italian</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="ar-SA">Arabic</option>
                </select>
            </div>
            <div className="SelectorContainer">
                <select className="Selector" value={selectedLanguage1} onChange={handleDropdownChange1}>
                    <option value="en-US">Speaking</option>
                    <option value="es-ES">Spanish</option>
                    <option value="fr-FR">French</option>
                    <option value="de-DE">German</option>
                    <option value="it-IT">Italian</option>
                    <option value="hi-IN">Hindi</option>
                    <option value="ar-SA">Arabic</option>
                </select>
            </div>
            <div className="MicrophoneContainer">
                <div className="MicrophoneIconContainer">
                    <button className="StartButton" onClick={startListening}>
                        <img src={microPhoneIcon} className="MicrophoneIcon" alt="Microphone" />
                    </button>
                </div>
                <div className="MicrophoneStatus">
                    {isListening ? (
                        <h2 className="MicrophoneStatusText">Listening...</h2>
                    ) : (
                        <h2 className="MicrophoneStatusText">Click and Start Speaking</h2>
                    )}
                </div>
                <div className="StopButtonContainer">
                    {isListening && (
                        <button className="StopButton" onClick={handleStop}>
                            Stop
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;