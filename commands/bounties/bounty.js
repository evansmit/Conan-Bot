
const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class BountyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bounty',
            group: 'bounties',
            memberName: 'bounty',
            description: 'Allows a user to setup a bounty with a Target and Spoils',
            examples: ['bounty'],
            guildOnly: true,
            args: [
                {
                    key:'target',
                    prompt: 'Which of your enemies do you request to be crushed and driven before you?',
                    type: 'string',
                    wait: timeout,
                },
                {
                    key:'spoils',
                    prompt: 'What spoils will be provided when your enemies are crushed?',
                    type: 'string',
                    wait: timeout,
                },
                {
                    key:'reason',
                    prompt: 'What is the reason for your bounty?',
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

    run(msg, { target, spoils , reason}) {
        const BountyRepository = require('../../modules/bounty_repository')
        const bountyRepo = new BountyRepository(db_conn)
        bountyRepo.createTable()
            .then(() => bountyRepo.create(msg.guild.id, msg.author.username, target, spoils, reason))
            .then((data) => {
                const embed = new RichEmbed()
                    .setDescription(`${msg.author.username} requires someone to crush his enemies!`)
                    .addField('Bounty ID', `${data.id}`, true)
                    .addField('Target', `${target}`, true)
                    .addField('Spoils', `${spoils}`, true)
                    .addField('Reason', `${reason}`, true)
                    msg.reply(`You are all done. Thanks!`)
                    return this.client.channels.get((config.get('bounty_board_id'))).send(embed)
            })
        }
}
