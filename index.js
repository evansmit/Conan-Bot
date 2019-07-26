const Commando = require('discord.js-commando')
const path = require('path');
const sqlite = require('sqlite')
const { token } = require('./auth/auth.json')
var config = require('./config/config.js')

const client = new Commando.Client({
  commandPrefix: '!',
  owner: '216407004724330507',
  disableEveryone: true,
  unknownCommandResponse: false
})

client.registry
  .registerDefaultTypes()
  // Registers your custom command groups
  .registerGroups([
    ['bounties', 'bounty commands group'],
    ['members', 'member commands group'],
    ['raids', 'raid protection commands group'],
    ['rules', 'rules agreement commands group'],
  ])

  // Registers all built-in groups, commands, and argument types
  .registerDefaultGroups()
  .registerDefaultCommands()
  // Registers all of your commands in the ./commands/ directory
  .registerCommandsIn(path.join(__dirname, 'commands'))

client.setProvider(
  sqlite.open(path.join(__dirname, 'settings.sqlite3')).then(db => new Commando.SQLiteProvider(db))
).catch(console.error)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// run reminder for server reset.
var schedule = require('node-schedule')

// Reminder for server reset
schedule.scheduleJob((config.get('reset_remind_time')), function(){
  client.channels.get((config.get('general_chat_id'))).send({embed: {
    title: 'Daily Server Reset (12AM EST)',
    description: '@everyone The server will reset in 10 minutes. Make sure you are somewhere safe. \n Remember no looting unconscious bodies for 30 minutes after reset and crashes',
  }})
})
// Welcome new members and direct to channels
var readmefirst = '<#' + (config.get('read_me_first_id')) + '>'
var stopandidentify = '<#' + (config.get('stop_and_identify_id')) + '>'
client.on('guildMemberAdd', member => {
  member.send({embed: {
    description: `Welcome ${member} to Cascade Exiles! Please be sure to thoroughly read ${readmefirst} and then post in ${stopandidentify}.`,
  }})
})

client.login(token)