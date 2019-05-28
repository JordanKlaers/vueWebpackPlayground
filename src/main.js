'use strict';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		testValue: null
	},
	mutations: {
		UPDATE_TEST_VALUE(state, payload) {
			state.testValue = payload;
		}
	},
	getters: {
		testValue: state => state.testValue, 
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