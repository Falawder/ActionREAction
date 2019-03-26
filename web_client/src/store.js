import Vue from 'vue'
import vuex from 'vuex'

Vue.use(vuex)

export default new vuex.Store({
	state: {
		token : null,
		spotifyIsConnected: false,
		slackIsConnected: false,
		GgSk : false,
		SkGg1 : false,
		SkGg2 : false,
		SkSpoti : false,
		TimeSpoti1 : false,
		TimeSpoti2 : false
	},
	mutations: {
		changeServiceIsConnected : (state, status) => {
			switch (status.service) {
				case "spotify": 
					state.spotifyIsConnected = status.bool;
					break;
				case "slack":
					state.slackIsConnected = status.bool;
					break;
				default:
					return;
			}
		},
		checkACAR : (state, values) => {
			state.GgSk = !!values.data.acars[0].isOn
			state.SkGg1 = !!values.data.acars[1].isOn
			state.SkGg2 = !!values.data.acars[2].isOn
			state.SkSpoti = !!values.data.acars[3].isOn
			state.TimeSpoti1 = !!values.data.acars[4].isOn
			state.TimeSpoti2 = !!values.data.acars[5].isOn
			return;
		},
		getToken : (state, token) => {
			state.token = token
		},
		modifyGgSk : (state) => {
			state.GgSk = !state.GgSk
		},
		modifySkGg1 : (state) => {
			state.SkGg1 = !state.SkGg1
		},
		modifySkGg2 : (state) => {
			state.SkGg2 = !state.SkGg2
		},
		modifySkSpoti : (state) => {
			state.SkSpoti = !state.SkSpoti
		},
		modifyTimeSpoti1 : (state) => {
			state.TimeSpoti1 = !state.TimeSpoti1
		},
		modifyTimeSpoti2 : (state) => {
			state.TimeSpoti2 = !state.TimeSpoti2
		}
	},
	actions: {
		changeServiceStatus ({commit}, status) {
			commit('changeServiceIsConnected', status);
		},
		checkChangeACAR({commit}, values) {
			commit('checkACAR', values);
		},
		getUserToken({commit}, token) {
			commit('getToken', token);
		},
		changeGgSk ({commit}) {
			commit('modifyGgSk');
		},
		changeSkGg1 ({commit}) {
			commit('modifySkGg1');
		},
		changeSkGg2 ({commit}) {
			commit('modifySkGg2');
		},
		changeSkSpoti ({commit}) {
			commit('modifySkSpoti');
		},
		changeTimeSpoti1 ({commit}) {
			commit('modifyTimeSpoti1');
		},
		changeTimeSpoti2 ({commit}) {
			commit('modifyTimeSpoti2');
		}
	}
})