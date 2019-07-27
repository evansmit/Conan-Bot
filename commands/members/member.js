const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
var commandchannel = '<#' + (config.get('stop_and_identify_id')) + '>'
module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'member',
            group: 'members',
            memberName: 'member',
            description: 'Allows a user to be added as a new member of Cascade Exiles',
            examples: ['member'],
            guildOnly: true,
            args: [
                {
                    key: 'pl_psn',
                    prompt: 'Welcome to Cascade Exiles. Lets get you setup as a new member. What is your PSN ID?',
                    type: 'string',
                },
                {
                    key: 'pl_ign',
                    prompt: 'What is your Conan Exiles In-Game Name?',
                    type: 'string',
                },
                {
                    key: 'pl_clan',
                    prompt: 'All members are required to be in a clan, even solo players. What is your clan name?',
                    type: 'string',
                },
                {
                    key: 'pl_clanldr',
                    prompt: `Who is the leader of the clan?`,
                    type: 'string',
                }
            ]
        })
    }

    hasPermission(msg) {
        if (msg.channel.id !== (config.get('stop_and_identify_id'))) return `Command is not valid in this channel. Please use in ${commandchannel}`;
        return true;
    }

    run(msg, { pl_psn, pl_ign, pl_clan, pl_clanldr }) {
      const dao = new AppDAO('./database/' + msg.guild.id + '-' + (config.get('env')) + '.sqlite3')
      const MemberRepository = require('../../modules/member_repository')
      const MemberRepo = new MemberRepository(dao)
        MemberRepo.createTable()
            .then(() => MemberRepo.create(pl_psn, msg.author.username, pl_ign, pl_clan, pl_clanldr))
            .then((data) => {
                const embed = new RichEmbed()
                    .setTitle(`Welcome ${msg.author.username} your now a Cascader!`)
                    .addField('PSN ID', `${pl_psn}`, true)
                    .addField('Discord', `${msg.author.username}`, true)
                    .addField('Conan IGN', `${pl_ign}`, true)
                    .addField('Clan', `${pl_clan}`)
                    .addField('Clan Leader', `${pl_clanldr}`, true)
               return msg.say(embed)
           })
    }
}
