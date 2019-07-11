'use strict';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		volatilityData: {
			resultSetOne: [
				{
					StdDevAsOfDate: '2018-06-30',
					AnnReturn10Y: '2018-06-30',
					Symbol:	'CGTD2025',
					InceptionDate:	'2007-02-28',
					ReturnsNetOfHighestFees: 0
				}
			],
			resultSetTwo: [
				{ VehicleType: 'CIT',StrategyID: '1100023',Name: 'Capital Group 2025 Target Date Retirement Strategy',Symbol: 'CGTD2025',StandardDeviation10Yr: 12.18000,AnnualizedReturn10Yr: 7.19000 },
				{ VehicleType:'Other',StrategyID: '1100025',Name:'Capital Group 2010 Target Date Retirement Strategy',Symbol:'CGTD2010',StandardDeviation10Yr:8.81000,AnnualizedReturn10Yr:5.59000 },
				{ VehicleType:'Other',StrategyID:'1100026',Name:'Capital Group 2015 Target Date Retirement Strategy',Symbol:'CGTD2015',StandardDeviation10Yr:9.67000,AnnualizedReturn10Yr:5.91000 },
				{ VehicleType:'Other',StrategyID:'1100022',Name:'Capital Group 2020 Target Date Retirement Strategy',Symbol:'CGTD2020',StandardDeviation10Yr:10.78000,AnnualizedReturn10Yr:6.36000 },
				{ VehicleType:'Other',StrategyID:'1100024',Name:'Capital Group 2030 Target Date Retirement Strategy Unique',Symbol:'CGTD2030_UQE',StandardDeviation10Yr:12.94000,AnnualizedReturn10Yr:7.89000 },
				{ VehicleType:'Other',StrategyID:'1100028',Name:'Capital Group 2035 Target Date Retirement Strategy',Symbol:'CGTD2035',StandardDeviation10Yr:13.26000,AnnualizedReturn10Yr:8.22000 },
				{ VehicleType:'Other',StrategyID:'1100029',Name:'Capital Group 2040 Target Date Retirement Strategy',Symbol:'CGTD2040',StandardDeviation10Yr:13.42000,AnnualizedReturn10Yr:8.39000 },
				{ VehicleType:'Other',StrategyID:'1100030',Name:'Capital Group 2045 Target Date Retirement Strategy',Symbol:'CGTD2045',StandardDeviation10Yr:13.47000,AnnualizedReturn10Yr:8.47000 },
				{ VehicleType:'Other',StrategyID:'1100031',Name:'Capital Group 2050 Target Date Retirement Strategy',Symbol:'CGTD2050',StandardDeviation10Yr:13.46000,AnnualizedReturn10Yr:8.48000 }
			],
			resultSetThree: [
				{
					VehicleType: 'Benchmark',
					VehicleID: 299,
					Name: 'S&P Target Date Through 2025 Index',
					StandardDeviation10Yr: 12.18000,
					StandardDeviationSource: 'Morningstar',
					AnnualizedReturn10Yr: 6.94000,
					AnnualizedReturnSource: 'Capital Group'
				}
			]
		},
		earningsData: [
			{ quarter: 'q4', value: 79, adjustment: 0.2, year: 2015 },
			{ quarter: 'q1', value: 80, adjustment: 0.2, year: 2016 },
			{ quarter: 'q2', value: 82, adjustment: 0.25, year: 2016 },
			{ quarter: 'q3', value: 89, adjustment: 0.17, year: 2016 },
			{ quarter: 'q4', value: 84, adjustment: 0.22, year: 2016 },
			{ quarter: 'q1', value: 91, adjustment: 0.14, year: 2017 },
			{ quarter: 'q2', value: 95, adjustment: 0.18, year: 2017 },
			{ quarter: 'q3', value: 95, adjustment: 0.2, year: 2017 },
			{ quarter: 'q4', value: 99, adjustment: 0.15, year: 2017 },
			{ quarter: 'q1', value: 103, adjustment: 0.12, year: 2018 },
			{ quarter: 'q2', value: 110, adjustment: 0.30, year: 2018 },
			{ quarter: 'q3', value: 106, adjustment: 0.23, year: 2018 },
			{ quarter: 'q4', value: 214, adjustment: 0.2, year: 2018 }
			// {}
			// { quarter: 'q1', value: 114, adjustment: 0.2, year: 2019 }

		],
		storeValue: 'storeValue'
	},
	mutations: {
		updateStore(state, payload) {
			state.storeValue = payload;
		}
	},
	getters: {
		fromStore: state => state.storeValue,
		earningData: (state) => state.earningsData
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