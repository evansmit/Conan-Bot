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
  clan_intel_id: {
    doc: 'channel id fir clan_intel',
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
  reset_remind_time: {
    doc: 'cron table for the server reset notification',
    format: String,
    default: '',
  },
  role_cascader_id: {
    doc: 'role id for cascader role',
    format: String,
    default: '',
  },
  bot_commands_id: {
    doc: 'channel id for bot commands',
    format: String,
    default: ''
  },
  happy_little_dudes_id: {
    doc: 'id for happy little dudes channel',
    format: String,
    default: ''
  },
  protection_system_id: {
    doc: 'id for protection_system channel',
    format: String,
    default: ''
  },
  faction_sign_in: {
    doc: 'id for faction_sign_in channel',
    format: String,
    default: ''
  },
  arg_timeout: {
    doc: 'argument timeout variable',
    format: Number,
    default: '30'
  }
})

// Load environment dependent configuration
var env = config.get('env')
config.loadFile('./config/' + env + '.json')

// Perform validation
config.validate({allowed: 'strict'})

module.exports = config
