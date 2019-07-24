const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const RaidRepository = require('../../modules/raid_repository')
const rpRepo = new RaidRepository(dao)

module.exports = class RaidCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'raidstatus',
            group: 'raids',
            memberName: 'raidstatus',
            description: 'Allows a user list all clans under raid protection on Cascade Exiles',
            examples: ['raidstatus'],
            aliases: ['raidlist', 'statusraid'],
            guildOnly: true,
        })
    }

    run(msg) {
      // Create table if it doesn't exist then create entry
      rpRepo.createTable()
        .then(() => rpRepo.getAll()
            .then((rows) => {
            if (rows == 0) {
                const embed = new RichEmbed()
                .setTitle('Raid Protection List')
                .setDescription('No Active Raid Protections found.')
            }
            if (rows !== 0) {
                rows.forEach(row => {
                    const embed = new RichEmbed()
                    .setDescription(`Clan: ${row.Clan}`)
                    .addField('Protection Type', `${row.ProtectionType}`, true)
                    .addField('Start Date', `${row.StartDate}`, true)
                    .addField('End Date', `${row.EndDate}`, true)
                    .addField('IniatedBy', `${row.CreatedBy}`, true)
                    .setFooter(`ID: ${row.id}`)
                    return msg.say(embed)
                })
            }
        }))
    }
}
