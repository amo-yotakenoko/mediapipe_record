let record = []
let recoading = false
window.onload = function () {
    // alert("ページが読み込まれました！");
    const videoElement = document.getElementsByClassName('input_video')[0];
    const canvasElement = document.getElementsByClassName('output_canvas')[0];
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.fillStyle = '#FF0000'; // 塗りつぶし色を赤に設定
    canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    console.log("onload")
    function onResults(results) {
        // canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        console.log(results)
        // console.log(JSON.stringify(results))
        if (recoading) {

            record.push(results)
        }
        document.getElementById('length').innerHTML = `${record.length}`
        console.log(canvasCtx)

        // canvasCtx.fillStyle = 'red'; // 一時的にスタイルを変更
        // canvasCtx.fillRect(10, 10, 100, 100); // 赤い四角を描画

        canvasCtx.globalCompositeOperation = 'source-in';
        canvasCtx.fillStyle = '#00FF00';
        canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

        // Only overwrite missing pixels.
        canvasCtx.globalCompositeOperation = 'destination-atop';
        // canvasCtx.drawImage(
        //     results.image, 0, 0, canvasElement.width, canvasElement.height);

        canvasCtx.globalCompositeOperation = 'source-over';
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
            { color: '#00FF00', lineWidth: 4 });
        drawLandmarks(canvasCtx, results.poseLandmarks,
            { color: '#FF0000', lineWidth: 2 });
        drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION,
            { color: '#C0C0C070', lineWidth: 1 });
        drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS,
            { color: '#CC0000', lineWidth: 5 });
        drawLandmarks(canvasCtx, results.leftHandLandmarks,
            { color: '#00FF00', lineWidth: 2 });
        drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS,
            { color: '#00CC00', lineWidth: 5 });
        drawLandmarks(canvasCtx, results.rightHandLandmarks,
            { color: '#FF0000', lineWidth: 2 });
        canvasCtx.restore();
    }



    // if(results)
    // console.log(results.poseLandmarks)

    const holistic = new Holistic({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
        }
    });
    holistic.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        enableSegmentation: true,
        smoothSegmentation: true,
        refineFaceLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    holistic.onResults(onResults);

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            await holistic.send({ image: videoElement });

        },
        width: 1280,
        height: 720
    });


    camera.start();

    setTimeout(() => {

        const videoAspectRatio = videoElement.videoWidth / videoElement.videoHeight;

        // ビデオのアスペクト比を保持しつつ、スマホに合わせてcanvasのサイズを変更
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        let newWidth, newHeight;

        if (screenWidth / screenHeight > videoAspectRatio) {
            // 画面の幅に合わせる
            newHeight = screenHeight;
            newWidth = screenHeight * videoAspectRatio;
        } else {
            // 画面の高さに合わせる
            newWidth = screenWidth;
            newHeight = screenWidth / videoAspectRatio;
        }
    }, 1000);


    // 新しいサイズをcanvasに適用
    canvasElement.width = newWidth;
    canvasElement.height = newHeight;


    document.getElementById('start').addEventListener('click', () => {
        record = []
        recoading = true;

    })


    document.getElementById('stop').addEventListener('click', () => {
        recoading = false;
        let exportText = "";
        record.forEach((r) => {
            exportText += JSON.stringify(r) + "\n";
        });
        // const json=JSON.stringify(record.join("\n"))
        // const json="abcdef"
        const blob = new Blob([exportText], { type: "text/plain" })
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${new Date().toLocaleTimeString()}`;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        //   console.log(JSON.stringify(record.join("\n")))

    })

}; 