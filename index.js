const fs = require('fs')
const Discord = require('discord.js')
const { prefix } = require('./config.json')
const { token } = require('./auth.json')

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
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ :/)
  const commandName = args.shift().toLowerCase()

  if (!client.commands.has(commandName)) return

  const command = client.commands.get(commandName)

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`
    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }
    return message.channel.send(reply)
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
schedule.scheduleJob('0 50 11 ? * *', function(){
  client.channels.get('600439301435555848').send({embed: {
    title: 'Daily Server Reset (12AM EST)',
    description: '@everyone The server will reset in 10 minutes. Make sure you are somewhere safe. \n Remember no looting unconscious bodies for 30 minutes after reset and crashes',
  }})
})
// Welcome new members and direct to channels
client.on('guildMemberAdd', member => {
  // Send meesage to channel
  // member.guild.channels.get('600399488896598028').send({embed: {
  // Send message a DM to user directly
  member.send({embed: {
    description: `Welcome ${member} to Cascade Exiles! Please be sure to thoroughly read <#598296670459002891> and then post in <#598296591513681920>`,
  }})
})

// login to Discord with your app's token
client.login(token);
