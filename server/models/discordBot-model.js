var express = require('express');
var router = express.Router();
var auth = require('../config/auth.json');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}! ${client.guilds.size} Connected Discord`);
});

client.on('message', msg => {
  if (msg.content[0] === '!') {
    msg.reply('Responf to \'' + msg.content + '\': Message receive, Area say Hello!');
  }
});

client.login(auth.token);


module.exports = router;
