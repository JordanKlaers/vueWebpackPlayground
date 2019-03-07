<template>
	<div id="app">
		<button v-on:click='updateStore'>update store</button>
		<Container :value="undefined"></Container>
		<div> {{ innerValue }} </div>
		<div> test value ^^ and testValue two below VV </div>
		<div> {{ additionalKey }} </div>
		<!-- <div> {{ testValueTwo_innerValue }} </div> -->
	</div>
</template>

<script>
import Container from './components/container'
import { mapGetters } from 'vuex'
import store from './main.js'
export default {
	name: 'app',
	components: {
		Container
	},
	data() {
		return {
			count: 1
		}
	},
	computed: {
		...mapGetters(['testValue', 'innerValue', 'additionalKey'])
	},
	mounted() {
		console.log('testValue getter', this.testValue);
	},
	methods: {
		updateStore() {
			this.count ++
			store.commit('UPDATE_TEST_VALUE', {
				innerValue: this.count,
				additionalKey: this.count
			})
		}
	}
};
</script>
<style lang="scss" src="./assets/scss/app">
</style>