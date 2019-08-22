const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var members = ''
var timeout = (config.get('arg_timeout'))
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
                    wait: timeout,
                },
            ]
        })
    }

    hasPermission(msg) {
      if (msg.member.roles.some(r=>["Cascader","Mod Squad"].includes(r.name))) {//return `You do not have permission to run this command`;
        return true;}
      else{
        return false;
      }
  }

    hasPermission(msg) {
      if (msg.channel.id !== (config.get('bot_commands_id'))) {
        msg.delete()
        return `Must run commands in ${commandchannel}`
        }
      else{
        return true}
    }

    run(msg, { term }) {
      let guild_id = msg.guild.id
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(db_conn)
        MemberRepo.createTable()
        .then(() => MemberRepo.find(guild_id, term)
          .then((rows) => {
            if (rows == 0) {
              return msg.author.send(`Unable to find history of ${term}`)
            }
            if (rows !== 0) {
              msg.author.send(`PSN_ID / Discord_ID / Conan_Name / Clan / Clan Leader`)
              rows.forEach(function(data) {
                return msg.author.send(`${data.pl_psn} ${data.pl_discord} ${data.pl_ign} ${data.pl_clan} ${data.pl_clanldr}`)
              })
            }
        }))
    }
}
