<template>
	<div>
		<div class="square hackerman-background-image">
			content: {{text}}
		</div>
		<div class="square">
		</div>
	</div>
</template>

<script>
import { pick, flattenDeep, chunk, fromPairs } from 'lodash-es';
// import _ from 'lodash-es';
// import pick from 'lodash-es/pick';
export default {
	name: 'container',
	components: {
	},
	props: {},
	data() {
		return {
			text: ''
		}
	},
	mounted() {
		document.addEventListener('click', this.clickHandler)
	},
	destroyed() {
		document.removeEventListener('click', this.clickHandler)
	},
	methods: {
		async clickHandler() {
				let obj = {
					a: 'hello',
					b: 'dude',
					c: 'world'
				}
			await setTimeout(async () => {
				// const _ = await require('lodash');
			}, 2000);
			if (_) {
				_.flattenDeep([1, [2, [3, [4]], 5]]);
				_.chunk(['a', 'b', 'c', 'd'], 2);
				_.fromPairs([['a', 1], ['b', 2]]);
				this.text = _.pick(obj, ['a', 'c']);
			} else {
				flattenDeep([1, [2, [3, [4]], 5]]);
				chunk(['a', 'b', 'c', 'd'], 2);
				fromPairs([['a', 1], ['b', 2]]);
				this.text = pick(obj, ['a', 'c']);
			}
		}
	},
	watch: {}
};
</script>
<style lang='scss' type="text/scss">
</style>


