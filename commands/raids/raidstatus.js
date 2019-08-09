const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
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
            userPermissions: ['ADMINISTRATOR'],
        })
    }

    hasPermission(msg) {
        if (msg.member.roles.some(r=>["Mod Squad"].includes(r.name))) {
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
      const RaidRepository = require('../../modules/raid_repository')
      const rpRepo = new RaidRepository(db_conn)
      let guild_id = msg.guild.id
      // Create table if it doesn't exist then create entry
      rpRepo.createTable()
        .then(() => rpRepo.getAll(guild_id)
            .then((rows) => {
            if (rows == 0) {
                const embed = new RichEmbed()
                .setTitle('Raid Protection List')
                .setDescription('No Active Raid Protections found.')
                return msg.author.send(embed)
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
                    return msg.author.send(embed)
                })
            }
        }))
    }
}
