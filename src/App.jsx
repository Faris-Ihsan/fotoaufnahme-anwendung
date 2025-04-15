import { React, useState, useRef, useCallback} from "react";
import Webcam from "react-webcam";

function App() {
    const webcamRef = useRef(null);
    const [imageSrc, setImgSrc] = useState(null);
    const capture = useCallback(
    () => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc)
    }, [webcamRef]
    )

    return (
        <div>
            <h1>fotoaufnahme</h1>
                <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                />
                <button onClick={capture}>Capture</button>
                <img src={imageSrc} alt="capture" />
        </div>
    );
}

export default App;
