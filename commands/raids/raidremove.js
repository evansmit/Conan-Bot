const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')

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
            args: [
                {
                    key: 'id',
                    prompt: 'Input the ID of the clan you would like to remove from raid protection?',
                    type: 'string',
                },
            ]
        })
    }
    run(msg, { id }) {
        const dao = new AppDAO('./database/' + msg.guild.id + '-' + (config.get('env')) + '.sqlite3')
        const RaidRepository = require('../../modules/raid_repository')
        const RaidRepo = new RaidRepository(dao)
        var channelid = msg.channel.id
        if (channelid == (config.get('clan_status_id'))){
        RaidRepo.createTable()
        .then(() => RaidRepo.getById(id)
          .then((clan) => {
            const embed = new RichEmbed()
            .setDescription(`${msg.author.username} has removed a clan from raid protection.`)
            .addField('Clan Name:', `${clan.Clan}`, true)
            .addField('Protection Type', `${clan.ProtectionType}`, true)
            return msg.say(embed)
          })
          .then(() => RaidRepo.delete(id))
        )
        }
    }
}
