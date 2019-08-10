const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
module.exports = class BountylistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bountylist',
            group: 'bounties',
            memberName: 'bountylist',
            description: 'Allows a user to list open bounties',
            examples: ['bountylist'],
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
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

    run(msg) {
        const BountyRepository = require('../../modules/bounty_repository')
        const bountyRepo = new BountyRepository(db_conn)
        bountyRepo.createTable()
            .then(() => bountyRepo.getAll(msg.guild.id))
            .then((rows) => {
                if (rows == 0) {
                    const embed = new RichEmbed()
                    .setDescription('There are no open bounties')
                    return msg.say(embed)
                }
                if (rows !== 0) {
                    rows.forEach(function(bounty) {
                    const embed = new RichEmbed()
                        .setTitle('Cascase Exiles open bounties')
                        .setDescription(`ID: ${bounty.id}`)
                        .addField('OfferedBy', `${bounty.OfferedBy}`, true)
                        .addField('Target', `${bounty.Target}`, true)
                        .addField('Spoils',`${bounty.Spoils}`, true)
                        .addField('Reason', `${bounty.Reason}`, true)
                        return msg.author.send(embed)
                    })
                }
            })
        }
}
