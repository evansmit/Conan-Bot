// agree.js
module.exports = {
  name: 'agree',
  description: 'Agree to terms of server and promote to Cascader',
  execute(message) {
    let channelname = message.channel.name;
    if (channelname !== 'stop_and_identify'){
      message.delete()
    } else {
      let role = message.guild.roles.find(role => role.name === 'Cascader')
      let member = message.member
      member.addRole(role).catch(console.error)
    }
  },
}
