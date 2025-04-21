import { React, useEffect, useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";

function App() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    // Variabel zu den Komponenten hinzugugen
    const [cvReady, setCvReady] = useState(false);
    const [imageSrc, setImgSrc] = useState(null);

    // Video value einstellen
    const videoConstraints = {
        width: 480,
        height: 360,
    };

    //Variabel zwischen Funktion/Komponent mitteilen
    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImgSrc(imageSrc);
    }, [webcamRef]);

     // useEffect() => nach dem Render laufen (für API, openCv.Js) 
     // openCV.js Laden
    useEffect(() => {
        const checkOpenCV = () => {
            if (window.cv && window.cv.imread) {
                setCvReady(true);
            } else {
                setTimeout(checkOpenCV, 100);
            }
        };
        checkOpenCV();
    }, []);

    // Video analysieren
    useEffect(() => {
        let animationFrameId;

        const realTimeProcess = () => {
            if (
                cvReady &&
                webcamRef.current &&
                webcamRef.current.video.readyState === 4
            ) {
                const video = webcamRef.current.video;
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");

                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                const src = cv.imread(canvas);
                const gray = new cv.Mat();
                const blurred = new cv.Mat();
                const edged = new cv.Mat();
                const contours = new cv.MatVector();
                const hierarchy = new cv.Mat();

                // einer Funktion zur Analyse des Videos.
                cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
                cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
                cv.Canny(blurred, edged, 75, 200);
                cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

                let maxArea = 0;
                let bestContour = null;

                for (let i = 0; i < contours.size(); i++) {
                    const cnt = contours.get(i);
                    const area = cv.contourArea(cnt);
                    const approx = new cv.Mat();
                    cv.approxPolyDP(cnt, approx, 0.02 * cv.arcLength(cnt, true), true);
                    if (area > 1000 && approx.rows === 4 && area > maxArea) {
                        maxArea = area;
                        if (bestContour) bestContour.delete();
                        bestContour = approx;
                    } else {
                        approx.delete();
                    }
                }
                
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                // rotes Rechteck zeichnen
                if (bestContour) {
                    ctx.beginPath();
                    ctx.strokeStyle = "red";
                    ctx.lineWidth = 3;

                    const points = [];
                    for (let i = 0; i < 4; i++) {
                        points.push({
                            x: bestContour.intPtr(i, 0)[0],
                            y: bestContour.intPtr(i, 0)[1],
                        });
                    }

                    for (let i = 0; i < 4; i++) {
                        const pt1 = points[i];
                        const pt2 = points[(i + 1) % 4];
                        ctx.moveTo(pt1.x, pt1.y);
                        ctx.lineTo(pt2.x, pt2.y);
                    }

                    ctx.stroke();
                    bestContour.delete();
                }

                src.delete();
                gray.delete();
                blurred.delete();
                edged.delete();
                contours.delete();
                hierarchy.delete();
            }

            animationFrameId = requestAnimationFrame(realTimeProcess);
        };

        if (cvReady) {
            animationFrameId = requestAnimationFrame(realTimeProcess);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [cvReady]);

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
                        {/* For Webcam Use */}
                        <Webcam ref={webcamRef} videoConstraints={videoConstraints} mirrored="false" screenshotFormat="image/jpeg" />
                        <canvas ref={canvasRef} width={videoConstraints.width} height={videoConstraints.height}></canvas>
                    </div>
                    {/* Geschweifteklamme => ""
                        Gänzefüsschen => {}
                    */}
                    <div className={"bg-slate-50 flex justify-center p-4"}>
                    <button className={"bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-400"} onClick={capture}>Capture</button>
                    </div>
                </div>
                <div className={"shadow rounded-lg overflow-hidden bg-white"}>
                    <div className={"leading-relaxed p-4 "}>
                        {/* Show captured images */}
                        <img className={"w-md"} src={imageSrc} alt="capture" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
