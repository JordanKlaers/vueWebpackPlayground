<template>
	<div id="app" ref='app'>
		<button id="rec">record</button>
	</div>
</template>

<script>
import * as fileSaver from 'file-saver';
// import * as fs from 'fs';
const fs = require('fs');
export default {
	name: 'app',
	data() {
		return {
			aStream: null,
			analyser: null,
			audioBufferLength: null,
			dataArray: null,
			myAudio: null
		}
	},
	mounted() {
		// console.log("file saver: ", fileSaver);
		// console.log('THREE', THREE);
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setPixelRatio( window.devicePixelRatio );
		this.$refs.app.appendChild( renderer.domElement );

		const geometry = new THREE.BoxGeometry();

		const material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		//create lights
		var greenLight = new THREE.PointLight( 0x00ff40, 2, 200 );
		// greenLight.position.set( 3, 0, 0 );
		const sphereGreen = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
		greenLight.add( new THREE.Mesh( sphereGreen, new THREE.MeshBasicMaterial( { color: 0x00ff40 } ) ) );

		var pinkLight = new THREE.PointLight( 0xff38ee, 2, 200 );
		const spherePink = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
		pinkLight.add( new THREE.Mesh( spherePink, new THREE.MeshBasicMaterial( { color: 0xff38ee } ) ) );

		var yellowLight = new THREE.PointLight( 0xf8ff2e, 2, 200 );
		const sphereYellow = new THREE.SphereBufferGeometry( 0.5, 16, 8 );
		yellowLight.add( new THREE.Mesh( sphereYellow, new THREE.MeshBasicMaterial( { color: 0xf8ff2e } ) ) );
		
		greenLight.position.set( 3, 0, 0 );
		pinkLight.position.set( 3, 0, 0 );
		yellowLight.position.set( 3, 0, 0 );
		
		// greenLight.position.set( 3, 0, 0 );
		// pinkLight.position.set( 0, 3, 0 );
		// yellowLight.position.set( 0, 0, 3 );

		const groupGreen = new THREE.Group();
		groupGreen.add( greenLight );
		
		const groupPink = new THREE.Group();
		groupPink.add( pinkLight );
		
		const groupYellow = new THREE.Group();
		groupYellow.add( yellowLight );

		scene.add( groupGreen );
		scene.add( groupPink );
		scene.add( groupYellow );

		camera.position.z = 20;

		cube.rotation.x += 0.5;
		cube.rotation.y += 0.5;

		var heightStart = 5; //         # m/s
		var gravity = 10; //         # m/s/s
		var hmax = heightStart; //      # keep track of the maximum height
		var physics = {
			heightStart: 3, //         # m/s
			currentVelocity: 0, //          # m/s, current velocity
			gravity: 10, //         # m/s/s
			t: 0, //          # starting time
			dt: 0.1, //     # time step
			rho: 0.7, //     # coefficient of restitution
			tau: 0.10, //     # contact time for bounce
			hmax: heightStart, //      # keep track of the maximum height
			h: heightStart, //
			hstop: 1.5, //   # stop when bounce is less than 1 cm
			freefall: true, // # state: freefall or in contact
			t_last: -Math.sqrt(2*heightStart/gravity), // # time we would have launched to get to heightStart at t=0
			vmax: Math.sqrt(2 * hmax * gravity),
			H: [],
			T: [],
			oscilation: 1
		}
		var physicsOffSet1 = Object.assign({}, JSON.parse(JSON.stringify(physics)));
		var physicsOffSet2 = Object.assign({}, JSON.parse(JSON.stringify(physics)));

		let animationStartTime = null;// Date.now() * 0.001;
		const rotationTime = 3;
		const rotationTimeSlow = 10;

		let logPosition = true;
		console.log("starting the animation!!");
		const animate = () => {
			if (!animationStartTime) animationStartTime = Date.now() * 0.001;
			const time = (Date.now() * 0.001) - animationStartTime;
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
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
			groupGreen.rotation.z = groupRotationA;
			greenLight.position.z = Math.cos( lightRotation ) * 6;
			greenLight.position.x = -Math.sin( lightRotation ) * 3;

			groupPink.rotation.z = groupRotationB;
			pinkLight.position.z = Math.cos( lightRotation + oneThird ) * 6;
			pinkLight.position.x = -Math.sin( lightRotation + oneThird ) * 3;
			
			groupYellow.rotation.z = groupRotationC;
			yellowLight.position.z = Math.cos( lightRotation + twoThirds ) * 6;
			yellowLight.position.x = -Math.sin( lightRotation + twoThirds ) * 3;

			renderer.render( scene, camera );
			requestAnimationFrame( animate );
		};
		animate();
		const buttonThing = document.querySelector("#rec");
		this.myAudio = document.querySelector('audio');
		buttonThing.addEventListener("click", () => {
			// this.myAudio.play();
			// console.log('Audio should be playing here');
			// this.record(document.getElementsByTagName('canvas')[0]);
		});
		// buttonThing.click();
		this.myAudio.oncanplay = (event) => {
			// this.myAudio.muted = true;
			this.myAudio.play();
			console.log('Audio should be playing here');
			this.record(document.getElementsByTagName('canvas')[0]);
		};
	},
	methods: {
		map(x, in_min, in_max, out_min, out_max){
			return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
		},
		bounce(p, time) {
			if (p.freefall) {
				var hnew = p.h + p.currentVelocity*p.dt - 0.5*p.gravity*p.dt*p.dt;
				// debugger;
				if(hnew<0) {
					p.t = p.t_last + 2*Math.sqrt(2*p.hmax/p.gravity)
					p.freefall = false
					p.t_last = p.t + p.tau
					p.h = 0;
				} else {
					p.t = p.t + p.dt
					p.currentVelocity = p.currentVelocity - p.gravity*p.dt
					p.h = hnew
				}
			} else {
				//is bouncing so new max height set
				
				p.t = p.t + p.tau;
				p.vmax = p.vmax * p.rho;
				p.currentVelocity = p.vmax;
				p.freefall = true;
				p.h = 0;
				p.hmax = 0.5*p.vmax*p.vmax/p.gravity;
				p.H.push(p.h);
				p.T.push(p.t);
				p.oscilation = p.oscilation * -1;
			}
			// greenLight.position.y = h * oscilation;
			// greenLight.position.x = Math.cos( time ) * 7.7;
			if (p.hmax > p.hstop && p.rho < 1) {
				p.rho = 0.7;
			} else if (p.rho < 1) {
				console.log(time);
				p.rho = 1.3;
			}
			if (p.hmax > p.heightStart && p.rho > 1) {
				p.rho = 0.7;
			} else {
				// rho = 1.3;
			}
			return p.h * p.oscilation;
		},
		initAudioStream(evt) {
			var audioCtx = new AudioContext();
			// create a stream from our AudioContext
			var dest = audioCtx.createMediaStreamDestination();
			this.aStream = dest.stream;
			// connect our video element's output to the stream
			var sourceNode = audioCtx.createMediaElementSource(this.myAudio);
			sourceNode.connect(dest)
			// Create a stream from some character device.
			// const stream = fs.createReadStream('src/assets/Ennja-Matsubayashi.mp3');
			console.log('stream: ', fs);
			// this.myAudio.muted = true;
			// debugger;
			// this.myAudio.play();
		},
		record(canvas, time) {
			this.initAudioStream();
			var recordedChunks = [];
			console.log(this.aStream.getAudioTracks()[0]);

			var stream = canvas.captureStream(25 /*fps*/);
			stream.addTrack(this.aStream.getAudioTracks()[0]);
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: "video/webm; codecs=vp9"
			});

			//ondataavailable will fire in interval of `time || 4000 ms`
			mediaRecorder.start(time || 10);
				
			setTimeout(() => {
				mediaRecorder.stop();
			}, 5000);

			mediaRecorder.ondataavailable = function (e) {
				console.log("data avialable");
				recordedChunks.push(event.data);
				// if (mediaRecorder.state === 'recording') {
				// 	// after stop data avilable event run one more time
				// 	mediaRecorder.stop();
				// }
			}

			mediaRecorder.onstop = () => {
				console.log('stopping');
				var blob = new Blob(recordedChunks, {
					type: "video/mp4"
				});
				this.myAudio.pause();
				fileSaver(blob);
			}
		}
	// 	someAudio() {
	// 		var b = document.querySelector("button");
	// 		var clicked = false;
	// 		var chunks = [];
	// 		var ac = new AudioContext();
	// 		var osc = ac.createOscillator();
	// 		var dest = ac.createMediaStreamDestination();
	// 		var mediaRecorder = new MediaRecorder(dest.stream);
	// 		osc.connect(dest);

	// 		// b.addEventListener("click", function(e) {
	// 		// 	if (!clicked) {
	// 		mediaRecorder.start();
	// 		osc.start(0);
	// 		// e.target.textContent = "Stop recording";
	// 		// clicked = true;
	// 			// } else {
	// 		// 		e.target.disabled = true;
	// 		// 	}
	// 		// });

	// 		mediaRecorder.ondataavailable = function(evt) {
	// 			// push each chunk (blobs) in an array
	// 			chunks.push(evt.data);
	// 		};

	// 		mediaRecorder.onstop = function(evt) {
	// 			// Make blob out of our blobs, and open it.
	// 			var blob = new Blob(chunks, { 'type' : 'audio/mpeg3' });
	// 			// document.querySelector("audio").src = URL.createObjectURL(blob);
	// 			fileSaver(blob);
	// 		};
			
	// 		setTimeout(() => {
	// 			mediaRecorder.stop();
	// 			osc.stop(0);
	// 		}, 3000);
	// 	}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_assets_/scss/app.scss';
</style>