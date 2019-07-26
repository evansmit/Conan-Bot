const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')

var members = ''

module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberfind',
            group: 'members',
            memberName: 'memberfind',
            description: 'Allows a user to search the list of Cascaders',
            examples: ['memberfind', 'memberfind star'],
            guildOnly: true,
            args: [
                {
                    key: 'term',
                    prompt: 'Input what term you would like to find in the member list?',
                    type: 'string',
                },
            ]
        })
    }

    run(msg, { term }) {
      const dao = new AppDAO('./database/' + msg.guild.id + '-' + (config.get('env')) + '.sqlite3')
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(dao)
        MemberRepo.createTable()
        .then(() => MemberRepo.find(term)
          .then((rows) => {
            if (rows == 0) {
              return msg.say(`Unable to find history of ${term}`)
            }
            if (rows !== 0) {
              rows.forEach(function(data) {
                members += `${data.id} - ${data.pl_psn} - ${data.pl_discord} - ${data.pl_ign} - ${data.pl_clan} - ${data.pl_clanldr}\n`
              })
              const embed = new RichEmbed()
              .addField('PSN / Discord / In-Game / Clan / Clan Leader', `${members}`)
              return msg.say(embed)
            }
        }))
    }
}
