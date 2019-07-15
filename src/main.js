'use strict';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		earningsData: [
			//change the min or max of the bar or line data to see the y axis scale updated accordingly
			{ quarter: 'q4', value: 79, adjustment: 0.2, year: 2015, subValue: 1.2 },
			{ quarter: 'q1', value: 80, adjustment: 0.2, year: 2016, subValue: 1.24 },
			{ quarter: 'q2', value: 82, adjustment: 0.25, year: 2016, subValue: 1.02 },
			{ quarter: 'q3', value: 89, adjustment: 0.17, year: 2016, subValue: 0.89 },
			{ quarter: 'q4', value: 84, adjustment: 0.22, year: 2016, subValue: 1.2 },
			{ quarter: 'q1', value: 91, adjustment: 0.14, year: 2017, subValue: 1.3 },
			{ quarter: 'q2', value: 95, adjustment: 0.18, year: 2017, subValue: 1.5 },
			{ quarter: 'q3', value: 95, adjustment: 0.2, year: 2017, subValue: 1.22 },
			{ quarter: 'q4', value: 99, adjustment: 0.15, year: 2017, subValue: 1 },
			{ quarter: 'q1', value: 103, adjustment: 0.12, year: 2018, subValue: 1.2 },
			{ quarter: 'q2', value: 110, adjustment: 0.30, year: 2018, subValue: 1.4 },
			{ quarter: 'q3', value: 106, adjustment: 0.23, year: 2018, subValue: 1.34 },
			{ quarter: 'q4', value: 114, adjustment: 0.2, year: 2018, subValue: 1.32 }
			//toggle adding one of the next two valuesand notice  how the labels and bar graph change for the far right value
			// {},
			// { quarter: 'q1', value: 114, adjustment: 0.2, year: 2019 }
		],
		lineGraphData: [
			79, 84, 82, 83,85, 89, 84, 85, 86, 87, 90, 89, 91, 90, 93, 89, 90, 94, 96, 95, 94, 97, 88, 90, 94, 93, 99, 96, 98, 104, 102, 105, 101, 103, 105, 104, 108, 110, 107, 109, 114, 111, 113, 115, 114, 116, 113, 120, 121, 118, 122
		],
		storeValue: 'storeValue'
	},
	getters: {
		earningData: (state) => state.earningsData,
		lineGraphData: (state) => state.lineGraphData
	},
	modules: {}
});

new Vue({
	el: '#crazyapp',
	components: { App },
	store,
	render: function(createElement) {
		return createElement(App);
	}
});

export default store;