const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const MemberRepository = require('../../modules/member_repository')
const MemberRepo = new MemberRepository(dao)
var members = ''

module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberlist',
            group: 'members',
            memberName: 'memberlist',
            description: 'Allows a user to search the list of Cascaders',
            examples: ['memberlist'],
            aliases: ['listmember'],
            guildOnly: true,
        })
    }

    run(msg) {
        MemberRepo.createTable()
        .then(() => MemberRepo.getAll()
          .then((rows) => {
            if (rows == 0) {
              return msg.say(`Unable to find member history`)
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
