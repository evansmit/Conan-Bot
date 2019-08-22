const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
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

    run(msg) {
      let guild_id = msg.guild.id
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(db_conn)
        MemberRepo.createTable()
        .then(() => MemberRepo.getAll(guild_id)
          .then((rows) => {
            if (rows == 0) {
              msg.author.send(`Unable to find member history`)

            }
            if (rows !== 0) {
              msg.author.send(`PSN_ID / Discord_ID / Conan_Name / Clan`)
              rows.forEach(function(data) {
                msg.author.send(`${data.pl_psn} ${data.pl_discord} ${data.pl_ign} ${data.pl_clan}`)
              })
            }
        }))
      }
}
