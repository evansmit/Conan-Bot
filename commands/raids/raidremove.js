const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class RaidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'raidremove',
            group: 'raids',
            memberName: 'raidremove',
            description: 'Allows a user to remove a id/user from the list of Cascaders',
            examples: ['raidremove', 'raidremove 2'],
            guildOnly: true,
            aliases: ['removeraid'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'id',
                    prompt: 'Input the ID of the clan you would like to remove from raid protection?',
                    type: 'string',
                    wait: timeout,
                },
            ]
        })
    }

    hasPermission(msg) {
        if (msg.member.roles.some(r=>["Cascader","Mod Squad"].includes(r.name))) {
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
        const RaidRepository = require('../../modules/raid_repository')
        const RaidRepo = new RaidRepository(db_conn)
        let guild_id = msg.guild.id
        RaidRepo.createTable()
        .then(() => RaidRepo.getById(guild_id, id)
          .then((clan) => {
            const embed = new RichEmbed()
            .setDescription(`${msg.author.username} has removed a clan from raid protection.`)
            .addField('Clan Name:', `${clan.Clan}`, true)
            .addField('Protection Type', `${clan.ProtectionType}`, true)
            return this.client.channels.get((config.get('clan_status_id'))).send(embed)
          })
          .then(() => RaidRepo.delete(guild_id, id))
        )
        }
}
