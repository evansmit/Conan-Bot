# Conan-Bot
This is a discord bot that allows guilds to add bounties and lists, raid protection notifications, server reset notifications, and welcome messages.
Utlizing sqlite3 to maintain persistence of the bounty and raid protection lists.

Configurations are handled using convict project with .env json files to specify dev or prod environment pointing to specific server channels. Eventually will look at implementing commands to set via bot the channels in use in the config files per server.

Command prefixes for the bot start with an exclamation point (!) followed by the base command and then arguments for each command.
Each argument is seperated by a semi-colon (;) allowing strings to be utilized.

# Bounties #
Commands give you the ability to add a bounty with a target and reward, delete existing bounties based on the bountyid and list all bounties.
## commands ##
* !bounty ;add ;*targetname* ;*reward*
* !bounty ;remove ;*bountyid*
* !bounty ;list
* !bounty ;help

# Raid Protection #
Commands give you the ability to add clans to a raid protection list that can be view for verifying whether clans are under protection. Allows clans to add protection for Raids, Hiatus, New server members, events, and list all active protections.

## commands ##
* !rp ;newbie ;*clanname*
* !rp ;raid ;*clanname*
* !rp ;hiatus ;*clanname*
* !rp ;event ;*clanname*
* !rp ;list
* !rp ;help

# Welcome Message #
A welcome message is sent to new users who join the guild server. Message is sent a DM directly to individuals and directs them to the read_me_first and stop_and_identify channels to read.

# Server reset reminder #
There is a built in server reset reminder that runs using the node-schedule package. This runs based on cron schedule configured in the .env json file and config.js per environment.