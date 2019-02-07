<template>
	<div id="app">
		<button v-on:click='randomizeGrid'>randomize</button>
		<Container></Container>
	</div>
</template>

<script>
import Container from './components/container'
export default {
	name: 'app',
	components: {
		Container
	},
	data() {
		return {
		}
	},
	mounted() {
	},
	methods: {
		randomizeGrid() {
			let containter = document.getElementById('contianer');
			// container.style.setProperty(--named-area, 
			// 	"green		green		green		salmon"
			// 	"yellow		turquoise	turquoise	salmon"
			// 	"yellow		pink		pink		salmon"
			// 	"yellow		pink		pink		salmon");
		}
	}
};
</script>
<style lang="scss" src="./assets/scss/app">
</style>