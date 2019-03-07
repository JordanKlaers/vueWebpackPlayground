<template>
	<div>
		<div>{{value}}</div>
		<div id="container">
			<div class="item-a"></div>
			<div class="item-b"></div>
			<div class="item-c"></div>
			<div class="item-d"></div>
			<div class="item-e"></div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'container',
	components: {
	},
	props: {
		value: {
			type: String,
			default: 'default value'
		}
	},
	data() {
		return {
		}
	},
	mounted() {
	},
	methods: {
	}
};
</script>

