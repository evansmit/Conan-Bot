// config.js

var convict = require('convict')

var config = convict({
  env: {
    doc: 'The application environment.',
    format: ['dev', 'prod'],
    default: 'dev',
    env: 'NODE_ENV',
  },
  prefix: {
    doc: 'Prefix for commands',
    format: String,
    default: '',
  },
  general_chat_id: {
    doc: 'general_chat_id channel id for messages',
    format: String,
    default: '',
  },
  bounty_board_id: {
    doc: 'bounty_board_id channel id for messages',
    format: String,
    default: '',
  },
  read_me_first_id: {
    doc: 'read_me_first_id channel id for messages',
    format: String,
    default: '',
  },
  stop_and_identify_id: {
    doc: 'stop_and_identify_id channel id for messages',
    format: String,
    default: '',
  },
  clan_status_id: {
    doc: 'clan_status_id channel id for messages',
    format: String,
    default: '',
  },
  guild_mods: {
    doc: 'role group for mods',
    format: String,
    default: '',
  },
  guild_members: {
    doc: 'role group for server members',
    format: String,
    default: '',
  },
})

// Load environment dependent configuration
var env = config.get('env')
config.loadFile('./config/' + env + '.json')

// Perform validation
config.validate({allowed: 'strict'})

module.exports = config
