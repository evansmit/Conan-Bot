// bounty.js
module.exports = {
  name: 'bounty',
  description: 'Commands to Add, Remove, List bounties',
  execute(message, args) {
    const config = require('../config/config.js')
    const AppDAO = require('../modules/dao')
    const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
    const BountyRepository = require('../modules/bounty_repository')
    const bountyRepo = new BountyRepository(dao)
    let bountyId
    var channelname
    var command = args[0]

    function bountyadd(args){
      var Target = args[1]
      var Reward = args[2]
      bountyRepo.createTable()
        .then(() => bountyRepo.create(message.author.username, Target, Reward))
        .then((data) => {
          bountyId = data.id
          message.channel.send({embed: {
            title: `New Cascader Bounty ID ${bountyId}`,
            description: 'A new bounty has been offered!',
            fields: [
              {
                name: 'OfferedBy',
                value: `${message.author.username}`,
                inline: true,
              },
              {
                name: 'Target',
                value: `${Target}`,
                inline: true,
              },
              {
                name: 'Reward',
                value: `${Reward}`,
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
                name: 'Reward',
                value: `${bounty.Reward}`,
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
                      name: 'Reward',
                      value: `${bounty.Reward}`,
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
            value: 'This command allows users to Add, List, and Remove open bounties.',
          },
          {
            name: 'Add Bounty',
            value: '!bounty ;add ;<target> ;<reward>',
          },
          {
            name: 'List Bounties',
            value: '!bounty ;list',
          },
          {
            name: 'Remove Bounty',
            value: '!bounty ;<bountyid>',
          },
        ],
      }})
    }
    var channelid = message.channel.id;
    if (channelid == (config.get('bounty_board_id'))){
      switch (command) {
        case 'add':
          bountyadd(args)
          break
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
          message.reply({embed: {
            fields: [
              {
                name: 'Description',
                value: `Unexpected command. ;${command} is not an accepted command.`,
              },
              {
                name: 'Add Bounty',
                value: '!bounty ;add ;<target> ;<reward>',
              },
              {
                name: 'List Bounties',
                value: '!bounty ;list',
              },
              {
                name: 'Remove Bounty',
                value: '!bounty ;<bountyid>',
              },
              {
                name: 'Bounty Help',
                value: '!bounty ;help',
              },
            ],
          }})
          break
      }
    }
  },
}
