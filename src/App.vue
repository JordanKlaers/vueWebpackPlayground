<template>
	<div id="app" ref='app'>
	</div>
</template>

<script>
export default {
	name: 'app',
	data() {
		return {}
	},
	mounted() {
		console.log('THREE', THREE);
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 0.1, 1000 );

		const renderer = new THREE.WebGLRenderer();
		renderer.setSize( window.innerWidth, window.innerHeight );
		this.$refs.app.appendChild( renderer.domElement );

		const geometry = new THREE.BoxGeometry();

		const material = new THREE.MeshLambertMaterial( { color: 0xFFFFFF } );
		const cube = new THREE.Mesh( geometry, material );
		scene.add( cube );

		const sphere = new THREE.SphereBufferGeometry( 0.5, 16, 8 );

		var greenLight = new THREE.PointLight( 0x00ff40, 2, 200 );
		greenLight.position.set( 3, 0, 0 );
		greenLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00ff40 } ) ) );
		scene.add( greenLight );
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
		var startTime = Date.now() * 0.001;
		const animate = () => {
			
			const time = Date.now() * 0.001;

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			var valY = this.bounce(physics, time - startTime);
			greenLight.position.y = valY;
			// if (time > startTime + 2) {
				// var valX = this.bounce(physicsOffSet1);
				// greenLight.position.x = valX;
			// }
			// if ( time > startTime + 4) {
				// var valZ = this.bounce(physicsOffSet2);
				// greenLight.position.z = valZ;
			// }
			
			// greenLight.position.x = Math.cos( time ) * 7.7;
			renderer.render( scene, camera );
			requestAnimationFrame( animate );
		};
		
		animate();
	},
	computed: {
	},
	methods: {
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
		}
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_assets_/scss/app.scss';
</style>