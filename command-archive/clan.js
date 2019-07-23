// clan.js

module.exports = {
  name: 'clan',
  description: 'Commands to create a repository of clans on the server. including status, leader, members',
  args: false,
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
            if (rows == 0) {
              message.channel.send({embed: {
                title: 'Clan List',
                description: 'There are no clans.',
              }})
            }
            if (rows !== 0){
              let clans = ''
              rows.forEach(function(row) {
                clans += `${row.id} - ${row.name} --- ${row.leaderpsn}\n`
              })
              message.channel.send({embed: {
                fields: [
                  {
                    name: 'ID / Clan / Leader PSN',
                    value: `${clans}`,
                  },
                ],
              }})
            }
          }))
    }
    function help(){
      message.reply({embed: {
        fields: [
          {
            name: 'Description',
            value: 'This command allows users to Add, List, and Wipe clans from clan_intel.',
          },
          {
            name: '!clan',
            value: 'Asks users to input a Clan name and Leader PSN',
          },
          {
            name: '!clan list',
            value: 'List Clans',
          },
          {
            name: '!clan remove <clanid>',
            value: 'Delete a clan from the repository based on the clanid',
          },
          {
            name: '!clan update <clanid> <column> <value>',
            value: 'Allows users to updated clan information based on prompts provided.',
          },
        ],
      }})
    }
    var channelid = message.channel.id;
    if (channelid == (config.get('clan_intel_id'))){
      switch (command) {
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
          const filter = m => m.author.id === message.author.id
          message.reply('What is the clan name?')// .then(r => r.delete(10000))
          message.channel.awaitMessages(filter, {
            max: 1,
            time: 30000,
          })
            .then(collected => {
              if (collected.first().content === 'cancel') {
                return message.reply('You have cancelled adding a new clan')
              }
              // Set the Target variable based on the user response to the bot question
              // let Target = collected.first().content

              // Delete the users response to the bot for the target
              // collected.first().delete()

              message.reply('What is the clan leaders PSN?')// .then(r => r.delete(10000))
              message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
              }).then(collected => {
                if (collected.first().content === 'cancel') {
                  return message.reply('You have cancelled adding a new clan')
                }
                // Set the Reward variable based on the user response to the bot question
                // let leader_psn = collected.first().content

                // Delete the users response to the bot for Reward
                // collected.first().delete()

                clanadd(args)

              }).catch(collected => {
                message.channel.reply('Your request to add a new clan has expired!')// .then(r => r.delete(5000))
              })
            })
          break
      }
    }
  },
}
