// rp.js

module.exports = {
  name: 'rp',
  description: 'Handles creating and modifying raid protection',
  args: false,
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const filter = m => m.author.id === message.author.id
    const config = require('../config/config.js')
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const RpRepository = require('../modules/raid_repository')
    const rpRepo = new RpRepository(dao)
    var command = args[0]
    var channelid = message.channel.id

    function rpset(Type, Clan, Days) {
      var startdate = new Date()
      var enddate = new Date()
      enddate.setDate(startdate.getDate() + Days)
      // Code to remove split the Time settings off the variable
      startdate = startdate.toString().split(' ').slice(0, 4).join(' ')
      enddate = enddate.toString().split(' ').slice(0, 4).join(' ')
      // Create table if it doesn't exist then create entry
      rpRepo.createTable()
        .then(() => rpRepo.create(Type, Clan, startdate, enddate, message.author.username))
        .then((data) => {
          message.channel.send({embed: {
            title: `Raid Protection Initiated by ${message.author.username}`,
            description: `Clan: ${Clan}`,
            fields: [
              {
                name: 'ProtectionType',
                value: `${Type}`,
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
                      name: 'Type',
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
            name: '!rp',
            value: 'Prompts users for input of what type of raid protection is needed and name of clan',
          },
          {
            name: '!rp list',
            value: 'Lists all protections currently in the system',
          },
        ],
      }})
    }
    function setType() {
      return new Promise((resolve, reject) => {
        message.channel.send('What kind of protection do you pray for from the Gods? \n  newbie\n  raid\n  hiatus\n  event')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                var RaidSet = new Set(['newbie', 'raid', 'hiatus', 'event'])
                if (RaidSet.has((collected.first().content))){
                  var Type = (collected.first().content)
                  message.channel.send(`Your choice has been accepted: ${Type}`)
                  resolve(Type)
                } else {
                  reject(Error('Your choice of protection has been rejected!'))
                }
              })
              .catch(collected => { message.channel.send('Your prayer for protection was too long, if you still require protection re-submit!') })
          })
      })
    }
    function setClan() {
      return new Promise((resolve, reject) => {
        message.channel.send('What clan requests the Gods protection?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then((collected) => {
                var Clan = (collected.first().content)
                message.channel.send(`Your choice has been made: ${Clan}`)
                resolve(Clan)
              })
              .catch(collected => { message.channel.send('Your prayer for protection was too long, if you still require protection re-submit!') })
          })
      })
    }
    function setDays(Type) {
      var Days = ''
      return new Promise((resolve, reject) => {
        switch (Type) {
          case 'newbie':
            Days = Number('5')
            resolve(Days)
            break
          case 'raid':
            Days = Number('3')
            resolve(Days)
            break
          case 'hiatus':
            message.channel.send('How many days do you request the Gods protection?')// .then(r => r.delete(10000))
              .then(() => {
                message.channel.awaitMessages(filter, {
                  max: 1,
                  time: 30000,
                  errors: ['time'],
                })
                  .then((collected) => {
                    Days = Number((collected.first().content))
                    message.channel.send(`Your choice has been made: ${Days}`);
                    resolve(Days)
                  }).catch(collected => { message.channel.send('Your request has taken to long and the Gods have rejected it!') })
              })
            break
          case 'event':
            Days = Number('0')
            resolve(Days)
            break
          default:
            reject(Error('Days have not been set!'))
            break
        }
      })
    }
    // This will run the default command to add new raid protection.
    async function RaidProtection() {
      var Type = await setType()
      var Clan = await setClan()
      var Days = await setDays(Type)
      rpset(Type, Clan, Days)
      return
    }
    if (channelid == (config.get('clan_status_id'))){
      switch (command) {
        case 'list':
          rpstatus()
          break
        case 'help':
          help()
          break
        default:
          RaidProtection()
          break
      }
    }
  },
}
