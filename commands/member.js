// member.js

module.exports = {
  name: 'member',
  description: 'Command for new users and clan members to fill out required information.',
  guildOnly: true,
  cooldown: 5,
  args: false,
  execute(message, args) {
    const config = require('../config/config.js')
    let channelid = message.channel.id
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const MemberRepository = require('../modules/member_repository')
    const MemberRepo = new MemberRepository(dao)
    const filter = m => m.author.id === message.author.id
    var command = args[0]

    function setMember(pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) {
      MemberRepo.createTable()
        .then(() => MemberRepo.create(pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr))
        .then((data) => {
          message.channel.send({embed: {
            title: 'New Cascader',
            fields: [
              {
                name: 'PSN ID/Username',
                value: `${pl_psn}`,
                inline: true,
              },
              {
                name: 'Discord Name',
                value: `${pl_discord}`,
                inline: true,
              },
              {
                name: 'Conan Name',
                value: `${pl_ign}`,
                inline: true,
              },
              {
                name: 'Clan Name',
                value: `${pl_clan}`,
                inline: true,
              },
              {
                name: 'Clan Leader',
                value: `${pl_clanldr}`,
                inline: true,
              },
            ],
          }})
        })
    }

    function list() {
      var members = ''
      MemberRepo.createTable()
        .then(() => MemberRepo.getAll()
          .then((rows) => {
            if (rows == 0) {
              message.channel.send({embed: {
                title: 'Cascade Exiles Member List',
                description: 'There are no members.',
              }})
            }
            if (rows !== 0) {
              rows.forEach(function(data) {
                members += `${data.id} - ${data.pl_psn} - ${data.pl_discord} - ${data.pl_ign} - ${data.pl_clan}\n`
              })
              message.channel.send({embed: {
                fields: [
                  {
                    name: 'PSN / Discord / In-Game / Clan',
                    value: `${members}`,
                  },
                ],
              }})
            }
          })
        )
    }

    function find(args) {
      var term = args[1]
      var members = ''
      MemberRepo.createTable()
        .then(() => MemberRepo.find(term)
          .then((rows) => {
            if (rows == 0) {
              message.channe.send(`Unable to find history of ${term}`)
            }
            if (rows !== 0) {
              rows.forEach(function(data) {
                members += `${data.id} - ${data.pl_psn} - ${data.pl_discord} - ${data.pl_ign} - ${data.pl_clan} - ${data.pl_clanldr}\n`
              })
              message.channel.send({embed: {
                fields: [
                  {
                    name: 'PSN / Discord / In-Game / Clan / Clan Ldr',
                    value: `${members}`,
                  },
                ],
              }})
            }
          })
        )
    }

    function remove(args){
      var memberid = args[1]
      MemberRepo.getById(memberid)
        .then((member) => {
          message.channel.send({embed: {
            title: `Cascader ID ${memberid}`,
            description: `Member removed by ${message.author.username}`,
            fields: [
              {
                name: 'PSN Name',
                value: `${member.pl_psn}`,
                inline: true,
              },
              {
                name: 'Discord',
                value: `${member.pl_discord}`,
                inline: true,
              },
              {
                name: 'Conan Name',
                value: `${member.pl_ign}`,
                inline: true,
              },
            ],
          }})
        })
        .then(() => MemberRepo.delete(memberid))
    }

    function getPSN() {
      return new Promise((resolve, reject) => {
        message.channel.send('What is your PSN ID?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().content === 'cancel') {
                  reject(Error('Request has been cancelled!'))
                  return message.reply('Request has been cancelled')
                } else {
                  var pl_psn = (collected.first().content)
                  message.channel.send(`Your choice has been made: ${pl_psn}`)
                  resolve(pl_psn)
                }
              })
              .catch(collected => { message.channel.send('Your request has taken to long and the Gods have rejected it!') })
          })
      })
    }

    function getIGN() {
      return new Promise((resolve, reject) => {
        message.channel.send('What is your In-Game Conan Name?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().content === 'cancel') {
                  reject(Error('Request has been cancelled!'))
                  return message.reply('Request has been cancelled')
                } else {
                  var pl_ign = (collected.first().content)
                  message.channel.send(`Your choice has been made: ${pl_ign}`)
                  resolve(pl_ign)
                }
              })
              .catch(collected => { message.channel.send('Your request has taken to long and the Gods have rejected it!') })
          })
      })
    }

    function getClan() {
      return new Promise((resolve, reject) => {
        message.channel.send('What clan are you a member of?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().content === 'cancel') {
                  reject(Error('Request has been cancelled!'))
                  return message.reply('Request has been cancelled')
                } else {
                  var pl_clan = (collected.first().content)
                  message.channel.send(`Your choice has been made: ${pl_clan}`)
                  resolve(pl_clan)
                }
              })
              .catch(collected => { message.channel.send('Your request has taken to long and the Gods have rejected it!') })
          })
      })
    }

    function getClanLeader() {
      return new Promise((resolve, reject) => {
        message.channel.send('Who is your Clan Leader?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                if (collected.first().content === 'cancel') {
                  reject(Error('Request has been cancelled!'))
                  return message.reply('Request has been cancelled')
                } else {
                  var pl_clanldr = (collected.first().content)
                  message.channel.send(`Your choice has been made: ${pl_clanldr}`)
                  resolve(pl_clanldr)
                }
              })
              .catch(collected => { message.channel.send('Your request has taken to long and the Gods have rejected it!') })
          })
      })
    }

    function help(){
      message.reply({embed: {
        fields: [
          {
            name: 'Description',
            value: 'This command by default allows users to view a list of Cascade Exiles members and add new members.',
          },
          {
            name: '!member',
            value: 'Add Member - Asks users to input PSN ID, Discord ID, Conan IGN, Clan Name, Clan Leader',
          },
          {
            name: '!member list',
            value: 'List Members - Lists all members in the system',
          },
          {
            name: '!member find <partialname>',
            value: 'Find a member in the system based on partial information such as name',
          },
          {
            name: '!member remove <memberid>',
            value: 'Remove member - Allows a user to remove a user based on id',
          },
        ],
      }})
    }

    // This will run the default command to add new raid protection.
    async function AddMember() {
      var pl_psn = await getPSN()
      var pl_discord = message.author.username
      var pl_ign = await getIGN()
      var pl_clan = await getClan()
      var pl_clanldr = await getClanLeader()
      setMember(pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr)
      return
    }
    if (channelid == (config.get('stop_and_identify_id'))){
      switch (command) {
        case 'find':
          find(args)
          break
        case 'remove':
          remove(args)
          break
        case 'list':
          list()
          break
        case 'update':
          update(args)
          break
        case 'help':
          help()
          break
        default:
          AddMember()
          break
      }
    }
  },
}
