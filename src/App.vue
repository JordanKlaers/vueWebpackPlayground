<template>
	<div id="app">
		<!-- <iframe
			width="600"
			height="450"
			frameborder="0" style="border:0"
			:src="`https://www.google.com/maps/embed/v1/place?key=${myAPIKey}&q=Space+Needle,Seattle+WA`" allowfullscreen>
		</iframe> -->
		computed property: {{ value }}
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'app',
	data() {
		return {
			width: 1000,
			height: 500
		}
	},
	mounted() {
		
	},
	computed: {
		...mapGetters(['storeValue']),
		myAPIKey() {
			return 'AIzaSyACp-lDhd_GVKfQBhUTenu_l3_R65uRZD0';
		},
		value() {
			this.$store.commit('update', 'newValue')
			console.log('evaluated');
			return this.storeValue;
		}
	},
	methods: {
	}
};
</script>
<style lang="less">

</style>