const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberremove',
            group: 'members',
            memberName: 'memberremove',
            description: 'Allows a user to remove a id/user from the list of Cascaders',
            examples: ['memberremove', 'memberremove 2'],
            guildOnly: true,
            aliases: ['removemember'],
            args: [
                {
                    key: 'id',
                    prompt: 'Input the ID of the member you would like to remove?',
                    type: 'string',
                    wait: timeout,
                },
            ]
        })
    }

    hasPermission(msg) {
      if (msg.member.roles.some(r=>["Mod Squad"].includes(r.name))) {//return `You do not have permission to run this command`;
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

    run(msg, { id }) {
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(db_conn)
        MemberRepo.createTable()
        .then(() => MemberRepo.getById(msg.guild.id,id)
          .then((member) => {
            const embed = new RichEmbed()
            .setDescription(`${msg.author.username} has removed a cascader from the member list`)
            .addField('PSN ID', `${member.pl_psn}`, true)
            .addField('Discord', `${member.pl_discord}`, true)
            .addField('Conan IGN', `${member.pl_ign}`, true)
            return msg.say(embed)
          })
          .then(() => MemberRepo.delete(id))
        )
      }
}
