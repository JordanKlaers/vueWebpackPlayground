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
		var redLight = new THREE.PointLight( 0xff0040, 2, 200 );
		redLight.position.set( -3, 0, 0 );
		redLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
		scene.add( redLight );
		
		
		var yellowLight = new THREE.PointLight( 0xffff00, 2, 200 );
		yellowLight.position.set( 0, 0, 0 );
		yellowLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffff00 } ) ) );
		scene.add( yellowLight );

		var greenLight = new THREE.PointLight( 0x00ff40, 2, 200 );
		greenLight.position.set( 3, 0, 0 );
		greenLight.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0x00ff40 } ) ) );
		scene.add( greenLight );
		camera.position.z = 20;

		cube.rotation.x += 0.5;
		cube.rotation.y += 0.5;

		const animate = function () {
			requestAnimationFrame( animate );
			const time = Date.now() * 0.001;

			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;

			redLight.position.z = Math.sin( time ) * 4;
			redLight.position.y = Math.cos( time ) * 2;
			redLight.position.x = Math.cos( time ) * 2;

			greenLight.position.z = Math.sin( time + 2.0944 ) * 4;
			greenLight.position.x = Math.cos( time + 2.0944) * 2; //+ 4.18879
			greenLight.position.y = -Math.cos( time  + 2.0944) * 2;
			
			yellowLight.position.y = Math.cos( time + 4.18879 ) * 2;
			yellowLight.position.z = Math.sin( time + 4.18879) * 4;

			renderer.render( scene, camera );
		};

		animate();
	},
	computed: {
	},
	methods: {
	}
};
</script>
<style lang='scss' type="text/scss">
@import '~_assets_/scss/app.scss';
</style>