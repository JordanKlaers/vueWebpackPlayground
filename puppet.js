const { now } = require('lodash');
const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false, args: ['--autoplay-policy=no-user-gesture-required'] });
	const page = await browser.newPage();
	await page.goto('http://localhost:9001/');
	await page._client.send('Page.setDownloadBehavior', {behavior: 'allow', downloadPath: 'C:\\Projects\\vueWebpackPlayground\\frames'})
	setTimeout(async () => {
		// console.log(Object.keys(page._client));
		await page.evaluate(async () => {
			//console.log(document);
			function initAudioStream(evt) {
				var audioCtx = new AudioContext();
				// create a stream from our AudioContext
				var dest = audioCtx.createMediaStreamDestination();
				// connect our video element's output to the stream
				var sourceNode = audioCtx.createMediaElementSource(this.audioElement);
				sourceNode.connect(dest);
				return dest.stream;
			};
			function record() {
				const canvas = document.getElementsByTagName('canvas')[0];
				// const audio = initAudioStream();
				var recordedChunks = [];
				// console.log(audio.getAudioTracks()[0]);

				var stream = canvas.captureStream(60 /*fps*/);
				// const video = document.getElementsByTagName('video')[0];
				// video.srcObject = stream;
				console.log(stream);
				/*
				stream.addTrack(audio.getAudioTracks()[0]);
				this.mediaRecorder = new MediaRecorder(stream, {
					mimeType: "video/webm; codecs=vp9"
				});
				console.log('this.mediaRecorder', this.mediaRecorder);

				//ondataavailable will fire in interval of `time || 4000 ms`
				this.mediaRecorder.start(time || 10);
					
				setTimeout(() => {
					this.mediaRecorder.stop();
				}, 5000);

				this.mediaRecorder.ondataavailable = function (e) {
					recordedChunks.push(event.data);
					// if (this.mediaRecorder.state === 'recording') {
					// 	// after stop data avilable event run one more time
					// 	this.mediaRecorder.stop();
					// }
				}

				this.mediaRecorder.onstop = () => {
					console.log('stopping');
					var blob = new Blob(recordedChunks, {
						type: "video/mp4"
					});
					this.audioElement.pause();
					// fileSaver(blob);
				}
				*/
			}
			record();
		});
		// await browser.close();
	}, 1000);
})();


var recordedChunks = [];
	const canvas = document.getElementsByTagName('canvas')[0];
	var stream = canvas.captureStream(60);
	const mediaRecorder = new MediaRecorder(stream, {
		mimeType: "video/webm; codecs=vp9"
	});
	mediaRecorder.start(time || 10);
	setTimeout(() => {
		mediaRecorder.stop();
	}, 5000);
	mediaRecorder.ondataavailable = function (e) {
		recordedChunks.push(e.data);
	}
	mediaRecorder.onstop = () => {
		var blob = new Blob(recordedChunks, {
			type: "video/mp4"
		});
		fileSaver(blob);
	}