'use strict';
import Vue from 'vue';
import App from './App';
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {},
	getters: {},
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