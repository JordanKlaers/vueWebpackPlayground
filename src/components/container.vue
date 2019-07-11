<template>
	<input type='text' @input="(value) => $emit('input', value.target.value)" changeplaceholder="place holder" ref='input'/>
</template>

<script>
export default {
	name: 'container',
	components: {
	},
	props: [
		'prop', 'value'
	],
	data() {
		return {
			text: this.value
		}
	},
	computed: {
		// text() {
		// 	return this.value;
		// }
	},
	watch: {
		value: {
			immediate: true,
			handler: (val) => {
				console.log('prop comes in for the first time', val);
			}
		}
	},
	mounted() {
		this.$refs.input.value = this.value
		console.log('input value on mounted?', this);
	},
	destroyed() {
	},
	methods: {
		updateValue(val) {
			this.$emit('value', val.target.value)
		}
	},
	watch: {}
};
</script>
<style lang='scss' type="text/scss">
.content {
	background-color: gray;
}
</style>


