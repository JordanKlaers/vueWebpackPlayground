<template>
	<div id="app" ref='app'>
		<div>
			Record the Canvas animation and save to a mp4 file
			<button id="rec">record</button>
		</div>
		<div>
			Stream the Canvas animation to the api and back into a video element
			<button id="stream">stream</button>
		</div>
		<div id="content"></div>
		<video id ="stream-video" muted controls style="width: 400px; height: 400px;"></video>
		<!-- <audio id="stream-audio" controls></audio> -->
		<!-- <video id="file-video" controls src="http://localhost:3003/video"></video> -->
		<button @click="makeRequest">Make request</button>
		<button @click="emitSocketEvent" id="testSocket">emit test socket event</button>
	</div>
</template>

<script>
import * as fileSaver from 'file-saver';
const io = require("socket.io-client");
const axios = require('axios');
export default {
	name: 'app',
	data() {
		return {
			audioElement: null,
			mediaRecorder: null,
			canvas: {},
			animationStartTime: null,
			socket: null,
			canvasElement: null,
			mimeType: `video/webm; codecs="vp8"`
			//standard is AAC for audio encoding (dvd) library for aac encoding
		}
	},
	mounted() {
		//overflow queue for appending data to the MediaSource
		var queue = [];
		//create the mediaSource and apply it to the video element
		var mediaSource = new MediaSource();
		var url = URL.createObjectURL(mediaSource);
		const video = document.getElementById('stream-video');
		video.src = url;
		// const audio = document.getElementById('stream-audio');
		// audio.src = url;
		var sourceBuffer = null;
		mediaSource.addEventListener("sourceopen", () => {
			// NOTE: Browsers are VERY picky about the codec being EXACTLY
			// right here. Make sure you know which codecs you're using!
			// sourceBuffer = mediaSource.addSourceBuffer("video/webm; codecs=vp9");
			sourceBuffer = mediaSource.addSourceBuffer(this.mimeType);
			sourceBuffer.addEventListener('updateend', function (_) {
				if (queue.length) {
					sourceBuffer.appendBuffer(queue.shift());
				}
			});
		});
		//initiate the connection with the socket. (Used for streaming the canvas feed to the api and back into the video element)
		this.socket = io.connect('http://localhost:3001', { reconnect: true });
		let hasFailed = false;
		let hasLogged = false;
		
		var fileReader = new FileReader();
		fileReader.onload = function() {
			sourceBuffer.appendBuffer(fileReader.result);
		};
		this.socket.on('videoStreamToClient', data => {
			console.log('data', data);
			var blob = new Blob([data], {
				type: this.mimeType//"video/webm; codecs=vp9"
			});
			// debugger;
			fileReader.readAsArrayBuffer(blob);
			/* if (!hasFailed) {
				if (sourceBuffer.updating || queue.length > 0) {
					//if the source buffer (content to be played) is updating or there is already data in the queue, add to the queue
					queue.push(data);
				} else {
					//if there is no data currently, directly add to the source buffer.
					sourceBuffer.appendBuffer(data);
				}
				video.play();
			}
			*/
			// } catch(err) {
			// 	hasFailed = true;
			// 	console.log('err', data, err );
			// }
		});

		document.getElementById('stream').addEventListener('click', () => this.recordAnimation(false));

		this.createInitialCanvasSetUp();
		this.createInitialCubeOrbitingLight();
		this.canvasElement = document.getElementsByTagName('canvas')[0];
		this.canvas.renderer.render( this.canvas.scene, this.canvas.camera );
		this.canvasAnimate();

		const buttonThing = document.querySelector("#rec");
		this.audioElement = document.querySelector('audio');
		buttonThing && buttonThing.addEventListener("click", () => {
			let downloading = true;
			this.audioElement.play();
			this.recordAnimation(downloading);
			console.log('Audio should be playing here');
		});
		// buttonThing.click();
		// this.audioElement.oncanplay = (event) => {
		// 	// this.audioElement.muted = true;
		// 	this.audioElement.play();
		// 	// console.log('Audio should be playing here');
		// 	this.record(document.getElementsByTagName('canvas')[0]);
		// };
	},
	methods: {
		async makeRequest() {
			const test = await axios({
				method: 'get',
				url: "http://localhost:3001/test"
			});
		},
		emitSocketEvent() {
			console.log('emitting');
			this.socket.emit('test', '1');
		},
		beginStream() {
			const source = new EventSource('http://localhost:3001/stream');
			source.onmessage = message => {
				console.log('Got', message.data);
			};
			source.onerror = err => {
				console.log('crap: ', err);
			}
			console.log('source', source);
		},
		createInitialCanvasSetUp() {
			this.canvas['scene'] = new THREE.Scene();
			this.canvas['camera'] = new THREE.PerspectiveCamera( 40, 1, 0.1, 1000 );

			this.canvas['renderer'] = new THREE.WebGLRenderer();
			// this.canvas.renderer.setSize( window.innerWidth, window.innerHeight );
			// this.canvas.renderer.setPixelRatio( window.devicePixelRatio );
			this.canvas.renderer.setSize( 600, 600 );
			this.canvas.renderer.setPixelRatio( window.devicePixelRatio );
			this.$refs.app.appendChild( this.canvas.renderer.domElement );
			this.canvas.camera.position.z = 15;
		},
		createInitialCubeOrbitingLight() {
			this.canvas['cubeLights'] = {};
			const geometry = new THREE.BoxGeometry();

			const material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
			this.canvas.cubeLights['cube'] = new THREE.Mesh( geometry, material );

			this.canvas.scene.add( this.canvas.cubeLights.cube );

			//create lights
			this.canvas.cubeLights['greenLight'] = new THREE.PointLight( 0x00ff40, 2, 200 );
			const sphereGreen = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
			this.canvas.cubeLights.greenLight.add( new THREE.Mesh( sphereGreen, new THREE.MeshBasicMaterial( { color: 0x00ff40 } ) ) );

			this.canvas.cubeLights['pinkLight'] = new THREE.PointLight( 0xff38ee, 2, 200 );
			const spherePink = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
			this.canvas.cubeLights.pinkLight.add( new THREE.Mesh( spherePink, new THREE.MeshBasicMaterial( { color: 0xff38ee } ) ) );

			this.canvas.cubeLights['yellowLight'] = new THREE.PointLight( 0xf8ff2e, 2, 200 );
			const sphereYellow = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
			this.canvas.cubeLights.yellowLight.add( new THREE.Mesh( sphereYellow, new THREE.MeshBasicMaterial( { color: 0xf8ff2e } ) ) );
			
			this.canvas.cubeLights.greenLight.position.set( 3, 0, 0 );
			this.canvas.cubeLights.pinkLight.position.set( 3, 0, 0 );
			this.canvas.cubeLights.yellowLight.position.set( 3, 0, 0 );
			

			this.canvas.cubeLights['groupGreen'] = new THREE.Group();
			this.canvas.cubeLights.groupGreen.add( this.canvas.cubeLights.greenLight );
			this.canvas.cubeLights['groupPink'] = new THREE.Group();
			this.canvas.cubeLights.groupPink.add( this.canvas.cubeLights.pinkLight );
			this.canvas.cubeLights['groupYellow'] = new THREE.Group();
			this.canvas.cubeLights.groupYellow.add( this.canvas.cubeLights.yellowLight );

			this.canvas.scene.add( this.canvas.cubeLights.groupGreen );
			this.canvas.scene.add( this.canvas.cubeLights.groupPink );
			this.canvas.scene.add( this.canvas.cubeLights.groupYellow );

			this.canvas.cubeLights.cube.rotation.x += 0.5;
			this.canvas.cubeLights.cube.rotation.y += 0.5;
		},
		canvasAnimate() {
			const rotationTime = 3;
			const rotationTimeSlow = 10;
			if (!this.animationStartTime) this.animationStartTime = Date.now() * 0.001;
			const time = (Date.now() * 0.001) - this.animationStartTime;
			this.canvas.cubeLights.cube.rotation.x += 0.01;
			this.canvas.cubeLights.cube.rotation.y += 0.01;
			//degree rotation converted to radian
			const empty = 0;
			const oneThird = (2 * Math.PI) / 3;
			const oneForth = Math.PI / 2;
			const half = Math.PI;
			const twoThirds = ((2 * Math.PI) / 3) * 2;
			const threeForths = (3 * Math.PI) / 2;
			const full = 2 * Math.PI;

			const groupRotationA = this.map(time % rotationTimeSlow, 0, rotationTimeSlow, 0, 360) * (Math.PI / 180);
			const groupRotationB = (this.map(time % rotationTimeSlow, 0, rotationTimeSlow, 0, 360) + 120) * (Math.PI / 180);
			const groupRotationC = (this.map(time % rotationTimeSlow, 0, rotationTimeSlow, 0, 360) + 240) * (Math.PI / 180);
			const lightRotation = this.map(time % rotationTime, 0, rotationTime, 0, full);
			this.canvas.cubeLights.groupGreen.rotation.z = groupRotationA;
			this.canvas.cubeLights.greenLight.position.z = Math.cos( lightRotation ) * 6;
			this.canvas.cubeLights.greenLight.position.x = -Math.sin( lightRotation ) * 3;

			this.canvas.cubeLights.groupPink.rotation.z = groupRotationB;
			this.canvas.cubeLights.pinkLight.position.z = Math.cos( lightRotation + oneThird ) * 6;
			this.canvas.cubeLights.pinkLight.position.x = -Math.sin( lightRotation + oneThird ) * 3;
			
			this.canvas.cubeLights.groupYellow.rotation.z = groupRotationC;
			this.canvas.cubeLights.yellowLight.position.z = Math.cos( lightRotation + twoThirds ) * 6;
			this.canvas.cubeLights.yellowLight.position.x = -Math.sin( lightRotation + twoThirds ) * 3;

			this.canvas.renderer.render( this.canvas.scene, this.canvas.camera );
			requestAnimationFrame( this.canvasAnimate );
		},
		map(x, in_min, in_max, out_min, out_max){
			return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		},
		initAudioStream(evt) {
			var audioCtx = new AudioContext();
			// create a stream from our AudioContext
			var dest = audioCtx.createMediaStreamDestination();
			// connect our video element's output to the stream
			var sourceNode = audioCtx.createMediaElementSource(this.audioElement);
			sourceNode.connect(dest);
			return dest.stream;
		},
		recordAnimation(downloading) {
			const audio = this.initAudioStream().getAudioTracks()[0];
			var recordedChunks = [];

			var stream = this.canvasElement.captureStream(60 /*fps*/);

			if (downloading) {
				stream.addTrack(audio);
			}
			this.mediaRecorder = new MediaRecorder(stream, {
				mimeType: this.mimeType//"video/webm; codecs=vp9"
			});

			//ondataavailable will fire in interval of 10 ms
			this.mediaRecorder.start(10);
				
			setTimeout(() => {
				this.mediaRecorder.stop();
			}, 8000);

			this.mediaRecorder.ondataavailable = (e) => {
				recordedChunks.push(e.data);
				var blob = new Blob([e.data], {
					type: this.mimeType//"video/webm; codecs=vp9"
				});
				if (!downloading) {
					this.socket.emit('streamVideo', blob);
				}
			}

			this.mediaRecorder.onstop = () => {
				console.log('stopping');
				var blob = new Blob(recordedChunks, {
					type: "video/mp4"
				});
				this.audioElement.pause();
				//testing ffmpeg thingy
				this.socket.emit('streamVideo', blob);
				if (downloading) {
					fileSaver(blob);
				}
			}
				/**/
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_assets_/scss/app.scss';
</style>