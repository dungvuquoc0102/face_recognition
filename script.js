const video = document.getElementById("video");
const videoSection = document.querySelector(".video");

Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("models"), faceapi.nets.faceLandmark68Net.loadFromUri("models"), faceapi.nets.faceRecognitionNet.loadFromUri("models"), faceapi.nets.faceExpressionNet.loadFromUri("models")]).then(startVideo);

function startVideo() {
	navigator.getUserMedia(
		{ video: {} },
		(stream) => (video.srcObject = stream),
		(err) => console.error(err)
	);
}
video.addEventListener("play", () => {
	const canvas = faceapi.createCanvasFromMedia(video);
	videoSection.append(canvas);
	const displaySize = { width: video.getBoundingClientRect().width, height: video.getBoundingClientRect().height };
	faceapi.matchDimensions(canvas, displaySize);
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

		//render above the video
		// const resizedDetections = faceapi.resizeResults(detections, displaySize);
		// canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		// faceapi.draw.drawDetections(canvas, resizedDetections);
		// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
		// faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

		//render on analyst tab
		const ul = document.querySelector(".analyst ul");
		const numberLi = document.querySelector(".analyst ul li.student-number");
		const qualityLi = document.querySelector(".analyst ul li.quality-class");
		if (detections.length > 0) {
			numberLi.innerHTML = `Student Number: ${detections.length}`;
			detections.forEach((detection, i) => {
				const qualityClass = detection.expressions.asSortedArray()[0].expression;
				const percent = detection.expressions.asSortedArray()[0].probability.toFixed(0);
				qualityLi.innerHTML = `Quality Class: ${qualityClass} (${percent * 100}%)`;
			});
		}
	}, 1e3);
});
