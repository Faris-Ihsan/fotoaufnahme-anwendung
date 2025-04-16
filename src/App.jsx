import { React, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

function App() {
    const webcamRef = useRef(null);
    const [imageSrc, setImgSrc] = useState(null);
    const videoConstraints = {
        width: 480,
        height: 360,
    };
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

    return (
        <div
            className={
                "bg-slate-100 antialiased flex items-center justify-center min-h-screen text-slate-800 tracking-tight"
            }
        >
            <div className={"max-w-fit w-full flex items-center gap-4"}>
                <div className={"shadow rounded-lg overflow-hidden bg-white"}>
                    <div className={" p-4 border-b border-b-gray-300"}>
                    <h1 className={"text-xl"}>Fotoaufname</h1>
                    </div>
                    <div className={"leading-relaxed p-4 "}>
                        <Webcam ref={webcamRef} videoConstraints={videoConstraints} screenshotFormat="image/jpeg" />
                    </div>
                    <div className="bg-slate-50 flex justify-center p-4">
                    <button className={"bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-400"} onClick={capture}>Capture</button>
                    </div>
                </div>
                <div className={"shadow rounded-lg overflow-hidden bg-white"}>
                    <div className={"leading-relaxed p-4 "}>
                        <img className={"w-md"} src={imageSrc} alt="capture" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
