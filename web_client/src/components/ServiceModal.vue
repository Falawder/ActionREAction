<template>
	<modal 
				name="toggleServices"
				transition="nice-modal-fade"
				height=auto
				:delay="100"
				:draggable="true"
				:scrollable="true">
		<div class="modal-content">

			Google -> Slack : If new mail inbox, then post a message in slack's channel
			<toggle-button @change="modifyAREA(1)" :sync="true" v-bind:value="this.$store.state.GgSk"/>

			Slack -> Google : If a reaction was added to a message, then send a mail
			<toggle-button @change="modifyAREA(2)" :sync="true" v-bind:value="this.$store.state.SkGg1"/>

			Slack -> Google : If someone uploaded a file on slack, then upload it to user's drive
			<toggle-button @change="modifyAREA(3)" :sync="true" v-bind:value="this.$store.state.SkGg2"/>

			Slack -> Spotify : If someone post a message on slack with a spotify link, then add it to spotify user's track list
			<toggle-button @change="modifyAREA(4)" :sync="true" v-bind:value="this.$store.state.SkSpoti"/>

			Time -> Spotify : If date is X day, then create a X named playlist on spotify
			<toggle-button @change="modifyAREA(5)" :sync="true" v-bind:value="this.$store.state.TimeSpoti1"/>

			Time -> Spotify : Every X minute / sec / day, create a X named playlist on spotify
			<toggle-button @change="modifyAREA(6)" :sync="true" v-bind:value="this.$store.state.TimeSpoti2"/>

		</div>
	</modal>
</template>

<script>
	import axios from 'axios'
	import { myUrl } from '../main.js'

	export default {
		name: 'ServiceModal',
		data: () => ({
		}),
		created: async function() {
			let pute = this;
			//url: "https://area2019.serveo.net/acar",				
			var response = await axios({
				method: 'get',
				url: myUrl + "acar",
				params: {
					params : this.$store.state.token
				}
			});
			if (response.data.code == 200) {
				pute.$store.dispatch('checkChangeACAR', response);
				console.log("acar successful")
			}
		},
		methods: {
			modifyAREA: async function(arg) {
				let pute = this;
				switch(arg) {

					case 1 :
						//"https://area2019.serveo.net/parser"
						console.log('Button 1 toggled');
						pute.$store.dispatch('changeGgSk');
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle : "google",
								action: "googlenotification",
								reactiontitle : "slack",
								reaction: "slackpostmsg"
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeGgSk');
							}
						})
						break;


					case 2 :
						console.log('Button 2 toggled');
						pute.$store.dispatch('changeSkGg1');
						//"https://area2019.serveo.net/parser"
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle: "slack",
								action: "slackreact",
								reactiontitle: "google",
								reaction: "sendmail"
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeSkGg1');
							}
						})
						break;


					case 3 :
						console.log('Button 3 toggled');
						pute.$store.dispatch('changeSkGg2');
						//"https://area2019.serveo.net/parser"
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle: "slack",
								action: "slackupload",
								reactiontitle: "google",
								reaction: "googleuploadfile"
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeSkGg2');
							}
						})
						break;

					case 4 :
						console.log('Button 4 toggled');
						pute.$store.dispatch('changeSkSpoti');
						//"https://area2019.serveo.net/parser"
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle: "slack",
								action: "slackmsg",
								reactiontitle: "spotify",
								reaction: "savesong",
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeSkSpoti');
							}
						})
						break;


					case 5 :
						console.log('Button 5 toggled');
						pute.$store.dispatch('changeTimeSpoti1');
						//"https://area2019.serveo.net/parser"
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle: "time",
								action: "dayjob",
								reactiontitle: "spotify",
								reaction: "createplaylist"
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeTimeSpoti1');
							}
						})
						break;


						case 6 :
						console.log('Button 6 toggled');
						pute.$store.dispatch('changeTimeSpoti2');
						//"https://area2019.serveo.net/parser"
						await axios({
							method: 'post',
							url: myUrl + "parser",
							data: {
								token : this.$store.state.token,
								actiontitle: "time",
								reactiontitle: "spotify"
							}
						})
						.then(function (response) {
							console.log(response);
							if (response.data.code == 400) {
								pute.$store.dispatch('changeTimeSpoti2');
							}

						})
						break;


						default:
							console.log('euhmabite');
							return;
				}
			}
		}
	}
</script>

<style type="text/css">
</style>