(async () => {
	await Promise.all([faceapi.nets.tinyFaceDetector.loadFromUri("models"), faceapi.nets.faceLandmark68Net.loadFromUri("models"), faceapi.nets.faceRecognitionNet.loadFromUri("models"), faceapi.nets.faceExpressionNet.loadFromUri("models")]);
	const videoBtn = document.querySelector(".video-btn");
	const loadingText = document.querySelector(".loading-text");
	videoBtn.style.display = "flex";
	loadingText.style.display = "none";
	let stream,
		videoStatus = false;
	videoBtn.addEventListener("click", async () => {
		videoBtn.classList.toggle("video-btn-active");
		if (videoStatus) {
			videoStatus = false;
			const tracks = stream.getTracks();
			tracks.forEach((track) => track.stop());
			video.srcObject = null;
		} else {
			videoStatus = true;
			stream = await navigator.mediaDevices.getUserMedia({ video: true });
			video.srcObject = stream;
		}
	});
})();
const studentNumber = 14;
const video = document.getElementById("video");
video.addEventListener("play", () => {
	const canvas = faceapi.createCanvasFromMedia(video);

	const displaySize = { width: video.getBoundingClientRect().width, height: video.getBoundingClientRect().height };
	faceapi.matchDimensions(canvas, displaySize);
	setInterval(async () => {
		const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();

		//append canvas on html
		// const videoSection = document.querySelector(".video");
		// videoSection.append(canvas);

		//draw with canvas
		// const resizedDetections = faceapi.resizeResults(detections, displaySize);
		// canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
		// faceapi.draw.drawDetections(canvas, resizedDetections);
		// faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
		// faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

		//render on analyst tab approach 1
		// const ul = document.querySelector(".analyst ul");
		// const numberLi = document.querySelector(".analyst ul li.student-number");
		// const qualityLi = document.querySelector(".analyst ul li.quality-class");
		// if (detections.length > 0) {
		// 	numberLi.innerHTML = `Student Number: ${detections.length}`;
		// 	detections.forEach((detection, i) => {
		// 		const qualityClass = detection.expressions.asSortedArray()[0].expression;
		// 		const percent = detection.expressions.asSortedArray()[0].probability.toFixed(0);
		// 		qualityLi.innerHTML = `Class Quality: ${qualityClass} (${percent * 100}%)`;
		// 	});
		// }

		//render on analyst tab approach 2
		document.querySelector(".general-number").innerHTML = studentNumber;
		if (detections.length > 0) {
			document.querySelector(".general-onclass").innerHTML = detections.length;
			document.querySelector(".general-offclass").innerHTML = studentNumber - detections.length;
			detections.forEach((detection) => {
				document.querySelector(".general-quality").innerHTML = detection.expressions.asSortedArray()[0].expression;
			});
		}

		//post data to server
		// const data = {
		// 	studentNumber,
		// 	onClass: detections.length,
		// 	offClass: studentNumber - detections.length,
		// 	quality: detections.length > 0 ? detections[0].expressions.asSortedArray()[0].expression : ""
		// };
		//post data to server use fetch
		// fetch("http://localhost:3000/data", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify(data),
		// });
		//post data to server use axios
		// axios.post("http://localhost:3000/data", data);
	}, 1e3);
});
