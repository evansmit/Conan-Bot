const Commando = require('discord.js-commando')
const path = require('path');
const { RichEmbed } = require('discord.js');
const sqlite = require('sqlite')
const { token } = require('./auth/auth.json')
var config = require('./config/config.js')

const client = new Commando.Client({
  commandPrefix: '!',
  owner: '216407004724330507',
  disableEveryone: false,
  unknownCommandResponse: false
})

client.registry
  .registerDefaultTypes()
  // Registers your custom command groups
  .registerGroups([
    ['bounties', 'bounty commands group'],
    ['members', 'member commands group'],
    ['raids', 'raid protection commands group'],
  ])

  // Registers all built-in groups, commands, and argument types
  .registerDefaultGroups()
  .registerDefaultCommands({
   ping: false,
   _eval: false
  })
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
  client.channels.get((config.get('general_chat_id'))).send(`Daily Server Reset at (12PM EST) \n @everyone The server will reset in 10 minutes. Make sure you are somewhere safe. \n Remember no looting unconscious bodies for 30 minutes after reset and crashes`)
})
// Welcome new members and direct to channels
let readmefirst = '<#' + (config.get('read_me_first_id')) + '>'
let happydudes = '<#' + (config.get('happy_little_dudes_id')) + '>'
let bot_commands = '<#' + (config.get('bot_commands_id')) + '>'
let protection_system = '<#' + (config.get('protection_system_id')) + '>'
client.on('guildMemberAdd', member => {
  //member.send(`Welcome to Cascade Exiles! Please be sure to thoroughly read ${readmefirst} and ${happydudes}. There are key words hidden within the channels that will need to be posted in the ${bot_commands} channel as a single word with an ! at the begining.`)
  //member.send('If the first word is "key" and the second word is "master", you would enter: ```!keymaster``` In #bot_commands channel')
  member.send(`
  Welcome to **Cascade Exiles** Chill & Mature PvP! We hate to overload you with paperwork, but being familiar with server policy is important. Please take a few minutes to read our rules in ${readmefirst}, ${happydudes}, and ${protection_system}. There are key words hidden within these three channels that will need to be combined in the ${bot_commands} channel as a single word with an **!** at the beginning.

For example, if the first word is "key," the second word is "master", and the third word is "chief," you would enter:` +
'```!keymasterchief```' +
`...in ${bot_commands}.

Thanks for joining us! If you have any questions or problems, please contact. @SOS#0949`)
})

//Send message to member who is added to Cascader with Bot commands
client.on('guildMemberUpdate', (oldMember, newMember) => {
  let bot_commands_channel = '<#' + (config.get('bot_commands_id')) + '>'
  let bounty_board_channel = '<#' + (config.get('bounty_board_id')) + '>'
  let clan_status_channel = '<#' + (config.get('clan_status_id')) + '>'
  if(!oldMember.roles.has((config.get('role_cascader_id'))) && newMember.roles.has((config.get('role_cascader_id')))) {
  newMember.send(`Conan-Bot may be sent commands in the ${bot_commands_channel} channel that assist with features unique to Cascade Exiles:` +
  '```!raid```' +
  `Allows you to activate raid protection for your clan. You'll be prompted the necessary information (i.e. Type of protection and Clan name). Once complete, a post will be added to the ${clan_status_channel} channel announcing your clan's protection.` +
  '```!bounty```' +
  `Allows you to setup in-game bounties against individual players, entire clans, or miscellaneous requests in the ${bounty_board_channel} channel. You'll be prompted for Target of Bounty, Spoils/Reward for bounty, and Reason for Bounty.` +
  '```!memberfind```' +
  `Allows you to search the list of registered players in order to resolve any in-game issues or invite them to PSN party chats. This command will send you a private message with the results.`)
  }
})
client.login(token)