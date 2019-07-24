const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const RaidRepository = require('../../modules/raid_repository')
const rpRepo = new RaidRepository(dao)

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
                    prompt: 'What type of protection do you pray for from the Gods? \n newbie \n raid \n hiatus \n event',
                    type: 'string',
                    validate: type => {
                       if (type == ('event')||('raid')||('newbie')||('hiatus')) return true
                       return 'Your type of protection is not allowed. Please input a valid selection'
                    }
                },
                {
                    key: 'clan',
                    prompt: 'What clan requests the God\'s protection?',
                    type: 'string',
                },
            ]
        })
    }

    run(msg, { type, clan }) {
      var channelid = msg.channel.id
      if (channelid == (config.get('clan_status_id'))){
      var Days = ''
        switch (type) {
          case 'newbie':
            Days = Number('5')
            break
          case 'raid':
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
      rpRepo.createTable()
        .then(() => rpRepo.create(type, clan, startdate, enddate, msg.author.username))
        .then((data) => {
            const embed = new RichEmbed()
                .setTitle(`Raid protection initiated by ${msg.author.username}`)
                .setDescription(`Clan: ${clan}`)
                .addField('Protection Type', `${type}`, true)
                .addField('Start Date', `${startdate}`, true)
                .addField('End Date', `${enddate}`, true)
                return msg.say(embed)
        })
      }
  }
}
