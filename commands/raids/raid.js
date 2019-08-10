const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class RaidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'raid',
            group: 'raids',
            memberName: 'raid',
            description: 'Allows a user to add a clan to raid protection on Cascade Exiles',
            examples: ['raid'],
            guildOnly: true,
            args: [
                {
                    key: 'type',
                    prompt: 'What type of protection do you require? \n new \n raided \n hiatus \n event',
                    type: 'string',
                    wait: timeout,
                    validate: type => {
                       switch (type) {
                         case 'event':
                          return true
                         case 'raided':
                          return true
                         case 'new':
                          return true
                         case 'hiatus':
                          return true
                         default: return 'The selection you provided does not match a valid option. Please input a valid choice verbatim. \n new \n raided \n hiatus \n event'
                        }
                    }
                },
                {
                    key: 'clan',
                    prompt: 'What clan needs protection?',
                    type: 'string',
                    wait: timeout,
                },
            ]
        })
    }

    hasPermission(msg) {
      if (msg.member.roles.some(r=>["Cascader","Mod Squad"].includes(r.name))) {
        return true;}
      else{
        return false;
      }
  }

    hasPermission(msg) {
      if (msg.channel.id !== (config.get('bot_commands_id'))) {
        msg.delete()
        return `Must run commands in ${commandchannel}`
        }
      else{
        return true}
    }

    run(msg, { type, clan }) {
      type = type.toLowerCase()
      const RaidRepository = require('../../modules/raid_repository')
      const rpRepo = new RaidRepository(db_conn)
      var Days = ''
        switch (type) {
          case 'new':
            Days = Number('5')
            break
          case 'raided':
            Days = Number('3')
            break
          case 'event':
            Days = Number('1')
            break
          case 'hiatus':
            Days = Number('8')
            break
        }
      var startdate = new Date()
      var enddate = new Date()
      enddate.setDate(startdate.getDate() + Days)
      // Code to remove split the Time settings off the variable
      startdate = startdate.toString().split(' ').slice(0, 4).join(' ')
      enddate = enddate.toString().split(' ').slice(0, 4).join(' ')
      // Create table if it doesn't exist then create entry
      let guild_id = msg.guild.id
      rpRepo.createTable()
        .then(() => rpRepo.create(guild_id, type, clan, startdate, enddate, msg.author.username))
        .then((data) => {
            const embed = new RichEmbed()
                .setTitle(`Raid protection initiated by ${msg.author.username}`)
                .setDescription(`Clan: ${clan}`)
                .addField('Protection Type', `${type}`, true)
                .addField('Start Date', `${startdate}`, true)
                .addField('End Date', `${enddate}`, true)
                .setFooter(`ID: ${data.id}`)
                return this.client.channels.get((config.get('clan_status_id'))).send(embed)
        })
      }
}
