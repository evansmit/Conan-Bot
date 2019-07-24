const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const BountyRepository = require('../../modules/bounty_repository')
const bountyRepo = new BountyRepository(dao)

module.exports = class BountylistCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'bountylist',
            group: 'bounties',
            memberName: 'bountylist',
            description: 'Allows a user to list open bounties',
            examples: ['bountylist'],
            guildOnly: true,
        })
    }

    run(msg, { target, spoils }) {
        bountyRepo.createTable()
            .then(() => bountyRepo.getAll())
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
                        return msg.say(embed)
                    })
                }
            })
    }
}