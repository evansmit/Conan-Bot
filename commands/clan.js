// clan.js

module.exports = {
  name: 'clan',
  description: 'Commands to create a repository of clans on the server. including status, leader, members',
  args: true,
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const config = require('../config/config.js')
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const ClanRepository = require('../modules/clan_repository')
    const ClanRepo = new ClanRepository(dao)
    var command = args[0]

    function clanadd(args) {
      let name = args[1]
      let leaderpsn = args[2]
      let leaderdiscord = args[3]
      let status = 'Active'
      ClanRepo.createTable()
        .then(() => ClanRepo.create(name, leaderpsn, leaderdiscord, status))
        .then((data) => {
          message.channel.send({embed: {
            title: `${name} has been recorded in the History of Cascade Exiles`,
          }})
          message.delete()
        })
    }
    function update(args){
      let id = args[1]
      let column = args[2]
      let value = args[3]
      ClanRepo.update(id, column, value)
        .then((data) => {
          message.channel.send({embed: {
            title: `Updated ${id} - ${column} to ${value}`,
          }})
        })
    }
    function clanlist(){
      ClanRepo.createTable()
        .then(() => ClanRepo.getAll()
        .then((rows) => {
          message.delete()
          if (rows == 0) {
            message.channel.send({embed: {
              title: 'Clan List',
              description: 'There are no clans.',
            }})
          }
          if (rows !== 0){
            let clan = ''
            rows.forEach(function (row) {
              clan += `${row.name} --- ${row.leaderpsn} --- ${row.status}\n`
            })
            message.channel.send({embed: {
              fields: [
                {
                  name: 'Clan Name - PSN ID\'s - Status',
                  value: `${clan}`,
                },
              ]
            }})
          }
        }))
    }
    function help(){
      message.delete()
      message.reply({embed: {
        fields: [
          {
            name: 'Description',
            value: 'This command allows users to Add, List, and Wipe clans from clan_intel.',
          },
          {
            name: 'Add Clan',
            value: '!clan ;add ;<name> ;<leaderpsn>',
          },
          {
            name: 'List Clans',
            value: '!clan ;list',
          },
          {
            name: 'Delete Clan',
            value: '!clan ;remove ;id',
          },
          {
            name: 'Update Clan Status',
            value: '!clan ;update ;<id> ;<status>',
          },
        ],
      }})
      message.delete()
    }
//    var channelid = message.channel.id;
//    if (channelid == (config.get('clan_intel_id'))){
      switch (command) {
        case 'add':
          clanadd(args)
          break
        case 'list':
          clanlist(args)
          break
        case 'update':
         update(args)
         break
        case 'help':
          help()
          break
        default:
          message.reply({embed: {
            fields: [
              {
                name: 'Description',
                value: `Unexpected command. ;${command} is not an accepted command.`,
              },
              {
                name: 'Add Clan',
                value: '!clan ;add ;<name> ;<leaderpsn>',
              },
              {
                name: 'List Clans',
                value: '!clan ;list',
              },
              {
                name: 'Update Clan Status',
                value: '!clan ;<id> ;<status>',
              },
              {
                name: 'Clan Help',
                value: '!clan ;help',
              },
            ],
          }})
          break
//      }
    }
  },
}
