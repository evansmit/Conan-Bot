const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
var commandchannel = '<#' + (config.get('bounty_board_id')) + '>'
module.exports = class BountyremoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bountyremove',
            group: 'bounties',
            memberName: 'bountyremove',
            description: 'Allows a user to remove an open bounties',
            examples: ['bountyremove', 'bountyremove 1'],
            guildOnly: true,
            args: [
                {
                    key:'id',
                    prompt: 'What is the ID of the bounty you want removed?',
                    type: 'integer'
                },
            ]
        })
    }

    hasPermission(msg) {
        if (msg.channel.id !== (config.get('bounty_board_id'))) return `Command is not valid in this channel. Please use in ${commandchannel}`;
        return true;
    }

    run(msg, { id }) {
        const dao = new AppDAO('./database/' + msg.guild.id + '-' + (config.get('env')) + '.sqlite3')
        const BountyRepository = require('../../modules/bounty_repository')
        const bountyRepo = new BountyRepository(dao)
        bountyRepo.createTable()
            bountyRepo.getById(id)
                .then((bounty) => {
                    const embed = new RichEmbed()
                    .setDescription(`${msg.author.username} has recinded the bounty for ${bounty.Target}`)
                    return msg.say(embed)
                })
                .then(() => bountyRepo.delete(id))
        }
}
