const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
var commandchannel = '<#' + (config.get('stop_and_identify_id')) + '>'
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
            userPermissions: ['ADMINISTRATOR'],
            guildOnly: true,
        })
    }

    hasPermission(msg) {
      if (msg.channel.id !== (config.get('stop_and_identify_id'))) return `Command is not valid in this channel. Please use in ${commandchannel}`;
      return true;
  }

    run(msg) {
      const dao = new AppDAO('./database/' + msg.guild.id + '-' + (config.get('env')) + '.sqlite3')
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(dao)
        MemberRepo.createTable()
        .then(() => MemberRepo.getAll()
          .then((rows) => {
            if (rows == 0) {
              return msg.say(`Unable to find member history`)
            }
            if (rows !== 0) {
              msg.say(`ID / PSN_ID / Discord_ID / Conan_Name / Clan`)
              rows.forEach(function(data) {
                return msg.say(`${data.id} ${data.pl_psn} ${data.pl_discord} ${data.pl_ign} ${data.pl_clan}`)
              })
            }
        }))
      }
}
