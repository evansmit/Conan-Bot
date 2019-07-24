const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const AppDAO = require('../../modules/dao')
const dao = new AppDAO('./' + (config.get('env')) + '-database.sqlite3')
const MemberRepository = require('../../modules/member_repository')
const MemberRepo = new MemberRepository(dao)

module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'memberremove',
            group: 'members',
            memberName: 'memberremove',
            description: 'Allows a user to remove a id/user from the list of Cascaders',
            examples: ['memberremove', 'memberremove 2'],
            guildOnly: true,
            aliases: ['removemember'],
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'id',
                    prompt: 'Input the ID of the member you would like to remove?',
                    type: 'string',
                },
            ]
        })
    }
    run(msg, { id }) {
        MemberRepo.createTable()
        .then(() => MemberRepo.getById(id)
          .then((member) => {
            const embed = new RichEmbed()
            .setDescription(`${msg.author.username} has removed a cascader from the member list`)
            .addField('PSN ID', `${member.pl_psn}`, true)
            .addField('Discord', `${member.pl_discord}`, true)
            .addField('Conan IGN', `${member.pl_ign}`, true)
            return msg.say(embed)
          })
          .then(() => MemberRepo.delete(id))
        )
    }
}
