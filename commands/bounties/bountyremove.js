const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class BountyremoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bountyremove',
            group: 'bounties',
            memberName: 'bountyremove',
            description: 'Allows a user to remove an open bounties',
            examples: ['bountyremove', 'bountyremove 1'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key:'id',
                    prompt: 'What is the ID of the bounty you want removed?',
                    type: 'integer',
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
        const BountyRepository = require('../../modules/bounty_repository')
        const bountyRepo = new BountyRepository(db_conn)
        let guild_id = msg.guild.id
        bountyRepo.createTable()
            bountyRepo.getById(guild_id, id)
                .then((bounty) => {
                    const embed = new RichEmbed()
                    .setDescription(`${msg.author.username} has recinded the bounty for ${bounty.Target}`)
                    return this.client.channels.get((config.get('bounty_board_id'))).send(embed)
                })
                .then(() => bountyRepo.delete(guild_id, id))
        }
}
