const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const BountyRepository = require('../../modules/bounty_repository')
const bountyRepo = new BountyRepository(dao)

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
                    type: 'string'
                },
                {
                    key:'spoils',
                    prompt: 'What spoils will be provided when your enemies are crushed?',
                    type: 'string'
                }

            ]
        })
    }

    run(msg, { target, spoils }) {
        bountyRepo.createTable()
            .then(() => bountyRepo.create(msg.author.username, target, spoils))
            .then((data) => {
                const embed = new RichEmbed()
                    .setDescription(`${msg.author.username} requires someone to crush his enemies!`)
                    .addField('Bounty ID', `${data.id}`, true)
                    .addField('Target', `${target}`, true)
                    .addField('Spoils', `${spoils}`, true)
                return msg.say(embed)
            })
    }
}
