// rp.js

module.exports = {
  name: 'rp',
  description: 'Handles creating and modifying raid protection',
  args: true,
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const config = require('../config/config.js')
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const RpRepository = require('../modules/raid_repository')
    const rpRepo = new RpRepository(dao)

    // variables for commands to pass
    var protectiontype = args[0]
    var clan = args[1]

    function rpset(protectiontype, clan, days) {
      var startdate = new Date()
      var enddate = new Date()
      enddate.setDate(startdate.getDate() + days)
      // Code to remove split the Time settings off the variable
      startdate = startdate.toString().split(' ').slice(0, 4).join(' ')
      enddate = enddate.toString().split(' ').slice(0, 4).join(' ')
      // Create table if it doesn't exist then create entry
      rpRepo.createTable()
        .then(() => rpRepo.create(protectiontype, clan, startdate, enddate, message.author.username))
        .then((data) => {
          message.channel.send({embed: {
            title: `Raid Protection Initiated by ${message.author.username}`,
            description: `Clan: ${clan}`,
            fields: [
              {
                name: 'ProtectionType',
                value: `${protectiontype}`,
                inline: true,
              },
              {
                name: 'StartDate',
                value: `${startdate}`,
                inline: true,
              },
              {
                name: 'EndDate',
                value: `${enddate}`,
                inline: true,
              },
            ],
          }})
        })
    }
    function rpstatus() {
      rpRepo.createTable()
        .then(() => rpRepo.getAll()
          .then((rows) => {
            if (rows == 0) {
              message.channel.send({embed: {
                title: 'Raid Protection List',
                description: 'No Active Raid Protections.',
              }})
            }
            if (rows !== 0) {
              rows.forEach(function(rp) {
                message.channel.send({embed: {
                  title: 'Raid Protection List',
                  description: `Clan: ${rp.Clan}`,
                  fields: [
                    {
                      name: 'ProtectionType',
                      value: `${rp.ProtectionType}`,
                      inline: true,
                    },
                    {
                      name: 'StartDate',
                      value: `${rp.StartDate}`,
                      inline: true,
                    },
                    {
                      name: 'EndDate',
                      value: `${rp.EndDate}`,
                      inline: true,
                    },
                    {
                      name: 'CreatedBy',
                      value: `${rp.CreatedBy}`,
                      inline: true,
                    },
                  ],
                }})
              })
            }
          })
        )
    }
    function help(){
      message.reply({embed: {
        fields: [
          {
            name: 'Description',
            value: 'Command used to initiate raid protection for your clan.',
          },
          {
            name: 'newbie protection',
            value: '!rp ;newbie ;clanname',
          },
          {
            name: 'raid protection',
            value: '!rp ;raid ;clanname',
          },
          {
            name: 'hiatus protection',
            value: '!rp :hiatus :clanname',
          },
          {
            name: 'event protection',
            value: '!rp ;event ;clanname',
          },
        ],
      }})
    }
    // sets up rp database if it doesn't exist.
    var days
    var channelid = message.channel.id;
    if (channelid == (config.get('clan_status_id'))){
      switch (protectiontype) {
        case 'newbie':
          days = Number('5')
          rpset(protectiontype, clan, days)
          break
        case 'raid':
          days = Number('3')
          rpset(protectiontype, clan, days)
          break
        case 'hiatus':
          days = Number('8')
          rpset(protectiontype, clan, days)
          break
        case 'event':
          days = Number('0')
          rpset(protectiontype, clan, days)
          break
        case 'list':
          rpstatus()
          break
        case 'help':
          help()
          break
        default:
          message.reply({embed: {
            fields: [
              {
                name: 'Description',
                value: `Unexpected command. :${protectiontype} is not an accepted command.`,
              },
              {
                name: 'newbie protection',
                value: '!rp ;newbie ;clanname',
              },
              {
                name: 'raid protection',
                value: '!rp ;raid ;clanname',
              },
              {
                name: 'hiatus protection',
                value: '!rp ;hiatus ;clanname',
              },
              {
                name: 'event protection',
                value: '!rp ;event ;clanname',
              },
              {
                name: 'Raid Protection help',
                value: '!rp ;help',
              },
            ],
          }})
          break
      }
    }
  },
}
