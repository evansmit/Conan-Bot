const fs = require('fs')
const Discord = require('discord.js')
const { token } = require('./config/auth.json')
var config = require('./config/config.js')

const client = new Discord.Client()
client.commands = new Discord.Collection()

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./commands/${file}`)
  client.commands.set(command.name, command)
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

client.on('message', message => {
  if (!message.content.startsWith((config.get('prefix'))) || message.author.bot) return;

  const args = message.content.slice((config.get('prefix')).length).split(/ +/)
  const commandName = args.shift().toLowerCase()

  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${(config.get('prefix'))}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply)
  }

  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply('I can\'t execute that command inside DMs!');
  }

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('there was an error trying to execute that command!')
  }
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

// login to Discord with your app's token
client.login(token);
