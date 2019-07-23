// bounty.js

module.exports = {
  name: 'bounty',
  description: 'Commands to Add, Remove, List bounties',
  args: false,
  guildOnly: true,
  cooldown: 5,
  execute(message, args) {
    const config = require('../config/config.js')
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const BountyRepository = require('../modules/bounty_repository')
    const bountyRepo = new BountyRepository(dao)
    const filter = m => m.author.id === message.author.id
    let bountyId
    var command = args[0]
    var channelid = message.channel.id;

    function bountyadd(Target, Spoils){
      bountyRepo.createTable()
        .then(() => bountyRepo.create(message.author.username, Target, Spoils))
        .then((data) => {
          bountyId = data.id
          message.channel.send({embed: {
            title: `New Cascader Bounty ID ${bountyId}`,
            description: `${message.author.username} requires someone to crush his enemies!`,
            fields: [
              {
                name: 'Target',
                value: `${Target}`,
                inline: true,
              },
              {
                name: 'Spoils',
                value: `${Spoils}`,
                inline: true,
              },
            ],
          }});
        })
    }

    function bountyremove(args){
      var bountyid = args[1]
      bountyRepo.getById(bountyid)
        .then((bounty) => {
          message.channel.send({embed: {
            title: `Cascader Bounty ID ${bountyid}`,
            description: `Bounty removed by ${message.author.username}`,
            fields: [
              {
                name: 'OfferedBy',
                value: `${bounty.OfferedBy}`,
                inline: true,
              },
              {
                name: 'Target',
                value: `${bounty.Target}`,
                inline: true,
              },
              {
                name: 'Spoils',
                value: `${bounty.Spoils}`,
                inline: true,
              },
            ],
          }})
        })
        .then(() => bountyRepo.delete(bountyid))
    }

    function bountylist(){
      bountyRepo.createTable()
        .then(() => bountyRepo.getAll()
          .then((rows) => {
            if (rows == 0) {
              message.channel.send({embed: {
                title: 'Cascader Bounty',
                description: 'There are no open bounties.',
              }})
            }
            if (rows !== 0) {
              rows.forEach(function(bounty) {
                message.channel.send({embed: {
                  title: `Cascader Bounty ID ${bounty.id}`,
                  fields: [
                    {
                      name: 'OfferedBy',
                      value: `${bounty.OfferedBy}`,
                      inline: true,
                    },
                    {
                      name: 'Target',
                      value: `${bounty.Target}`,
                      inline: true,
                    },
                    {
                      name: 'Spoils',
                      value: `${bounty.Spoils}`,
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
            value: 'This command by default allows users to open a new bounty and prompt for Target and Spoils.',
          },
          {
            name: '!bounty',
            value: 'Add Bounty - Asks users to input a Target and a Reward for a new bounty and posts to the bounty_board channel',
          },
          {
            name: '!bounty list',
            value: 'List Bounties - Lists all bounties currently in on the board',
          },
          {
            name: '!bounty remove <bountyid>',
            value: 'Remove Bounty - Allows a user to remove a bounty based on the BountyId retrived from !bounty list',
          },
        ],
      }})
    }

    function setTarget() {
      return new Promise((resolve, reject) => {
        message.channel.send('Which of your enemies do you request to be crushed and driven before you?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then(collected => {
                if (collected.first().content === 'cancel') {
                  message.channel.send('Your request for destruction has been cancelled.')
                  reject(Error('Your request for destruction has been cancelled.'))
                }
                var Target = (collected.first().content)
                message.channel.send('Your input has been recieved')
                resolve(Target)
              }).catch(collected => { message.channel.send('Your request to have an enemy crushed has timed out!') })
          })
      })
    }

    function setSpoils() {
      return new Promise((resolve, reject) => {
        message.channel.send('What spoils will be provided when your enemies are crushed?')// .then(r => r.delete(10000))
          .then(() => {
            message.channel.awaitMessages(filter, {
              max: 1,
              time: 30000,
              errors: ['time'],
            })
              .then(collected => {
                if (collected.first().content === 'cancel') {
                  message.channel.send('Your request is canceled per your request. If you still need your enemies crushed you can re-submit.')
                  reject(Error('Your request is canceled per your request. If you still need your enemies crushed you can re-submit.'))
                }
                var Spoils = (collected.first().content)
                message.channel.send('Your input has been recieved')
                resolve(Spoils)
              }).catch(collected => { message.channel.send('Your request for a bounty has expired! If you still need your enemies crushed you can re-submit.') })
          })
      })
    }

    // This will run the default command to add new raid protection.
    async function Bounty() {
      var Target = await setTarget()
      var Spoils = await setSpoils()
      bountyadd(Target, Spoils)
      return
    }

    if (channelid == (config.get('bounty_board_id'))){
      switch (command) {
        case 'list':
          bountylist(args)
          break
        case 'remove':
          bountyremove(args)
          break
        case 'help':
          help()
          break
        default:
          Bounty()
          break
      }
    }
  },
}
