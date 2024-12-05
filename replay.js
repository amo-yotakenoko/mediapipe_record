let record = []
let recoading = false
// let fileText=""
window.onload = function () {
  //   alert("ページが読み込まれました！");
  // const videoElement = document.getElementsByClassName('input_video')[0];
  const canvasElement = document.getElementsByClassName('output_canvas')[0];
  const canvasCtx = canvasElement.getContext('2d');
  const slider = document.getElementById('slider');

  document.getElementById("inputFile").addEventListener("change", function () {
    var inputFile = this.files[0];
    console.log(inputFile);

    if (inputFile && inputFile.type === "text/plain") {
      var reader = new FileReader();

      reader.onload = function (evt) {
        var fileText = evt.target.result;
        console.log(fileText);
        record = []
        console.log(fileText.split("\n").length)
        fileText.split("\n").forEach(function (item) {
          try {

            console.log(item)
            record.push(JSON.parse(item))
          } catch {
            console.log("上手くいってない", item)
          }

        });

        console.log(record)
        // console.log(slider )
        slider.max = record.length

        //   // ページに表示する場合
        //   document.getElementById("fileContent").textContent = fileText;
      }

      // ファイルをテキストとして読み込む
      reader.readAsText(inputFile);
    } else {
      alert("テキストファイルを選んでください。");
    }
  });





  function onResults(results) {
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    // console.log(JSON.stringify(results))
    if (recoading) {

      record.push(results)
    }
    document.getElementById('length').innerHTML = `${record.length}`
    // canvasCtx.drawImage(results.segmentationMask, 0, 0,
    //     canvasElement.width, canvasElement.height);

    // Only overwrite existing pixels.
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

  //                                 const holistic = new Holistic({
  //                                     locateFile: (file) => {
  //                                         return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
  //                                     }
  //                                 });
  // holistic.setOptions({
  //     modelComplexity: 1,
  //     smoothLandmarks: true,
  //     enableSegmentation: true,
  //     smoothSegmentation: true,
  //     refineFaceLandmarks: true,
  //     minDetectionConfidence: 0.5,
  //     minTrackingConfidence: 0.5
  // });
  // holistic.onResults(onResults);

  // const camera = new Camera(videoElement, {
  //     onFrame: async () => {
  //         await holistic.send({ image: videoElement });
  //     },
  //     width: 1280,
  //     height: 720
  // });
  // camera.start();
  slider.addEventListener('input', function () {
    console.log(slider.value, "を再生")
    onResults(record[slider.value])
  });

}; 