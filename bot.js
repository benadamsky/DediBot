/*Variable area*/
var Discord = require('discord.io');
var bot = new Discord.Client({
    token: dat.token,
    autorun: true
});

var evalers = ['150441161088040960']

/*Event area*/
function cb(err, res) {
    console.log("ERR", err);
    console.log("RES", res);
}

bot.on("ready", function(event) {
    console.log("DediBot Connected!");
    console.log("Logged in as: ");
    console.log(bot.username + " - (" + bot.id + ")");
    bot.setPresence({
        game: {
            name: "!help"
        }
    });
    console.log("DediBot currently running on version " + bot.internals.version);
});

bot.on("message", function(user, userID, channelID, message, event) {
    console.log(user + " - " + userID);
    console.log("in " + channelID);
    console.log(message);
    console.log("----------");
    if (message === "!ping") {
        sendMessages(channelID, ["<:dedifire:230196247221370880>  pong!"]); //Test message...
    } else if (message === "!website" || message === "!web" || message === "!site") {
        sendMessages(channelID, ["<:dedifire:230196247221370880>  https://www.dedifire.com/"]); //DediFire site
    } else if (message === "!members" || message === "!member") {
        var serverID = bot.channels[channelID].guild_id;
        var server = bot.servers[serverID];
        var list = Object.keys(server.members).length;
        sendMessages(channelID, ["<:dedifire:230196247221370880>  Member count: **" + list + "**"]);
    } else if (message === "!help") {
        bot.sendMessage({
            to: channelID,
            message: "<:dedifire:230196247221370880>  Help menu sent to **" + user + "**"
        }, function(err, message) {
            if (err) return console.log(err);
            setTimeout(function() {
                bot.deleteMessage({
                    channelID: channelID,
                    messageID: message.id
                });
            }, 6000);
        });
        sendMessages(userID, ["\n```md\n\n#DediBot Commands\n[ !website ]( View DediFire's official website )\n[ !members ]( View member count on the Discord ) \n\n#Important Links\n[ Knowledgebase ]( https://www.dedifire.com/client-area/knowledgebase.php )\n[ Game Servers ]( https://www.dedifire.com/game-servers/ )\n[ Dedicated Servers ]( https://www.dedifire.com/dedicated-servers/ )\n[ Partners ]( https://www.dedifire.com/partnerships/ )\n[ Meet the Team ]( https://www.dedifire.com/meet-the-team/ )\n[ Network Status ]( https://www.dedifire.com/client-area/serverstatus.php )\n\n#Social Media\n[ Twitter ]( https://twitter.com/dedifirehosting/ )\n[ Facebook ]( https://www.facebook.com/DediFire/ )\n[ YouTube ]( https://www.youtube.com/channel/UCjvdESt3NUCf3w83a5DYgww/ )\n[ Discord Invite Link ]( https://discordapp.com/invite/Ahwk66u )\n```"]); //DediFire help menu
    } else if (message.indexOf('!eval') === 0 && evalers.indexOf(userID) > -1) {
        let step = message.split(' ');
        let evalContent = step.shift().join(' ');
        try {
            bot.sendMessage({
                to: channelID,
                message: "```\n" + eval(evalContent) + "\n```"
            })
        } catch (e) {
            bot.sendMessage({
                to: channelID,
                message: "```\n" + e + "\n```"
            })           
        }
    }
});

bot.on("disconnect", function() {
    console.log("DediBot disconnected....attempting to reconnect...");
    bot.connect(); //Auto reconnect
    console.log("DediBot reconnected successfully!");
});

bot.on("guildMemberAdd", function(member) {
    console.log("" + member.username + " has joined the server for the first time.");
    //Put number as ID of channel
    sendMessages("187775969430470656", ["\n<:dedifire:230196247221370880>  **New Member:**  <@" + member.id + ">\n ```diff\n- Welcome to the official DediFire Discord server! -```"]);
});

/*Function declaration area*/
function sendMessages(ID, messageArr, interval) {
    var resArr = [],
        len = messageArr.length;
    var callback = typeof(arguments[2]) === 'function' ? arguments[2] : arguments[3];
    if (typeof(interval) !== 'number') interval = 1000;

    function _sendMessages() {
        setTimeout(function() {
            if (messageArr[0]) {
                bot.sendMessage({
                    to: ID,
                    message: messageArr.shift()
                }, function(err, res) {
                    if (err) {
                        resArr.push(err);
                    } else {
                        resArr.push(res);
                    }
                    if (resArr.length === len)
                        if (typeof(callback) === 'function') callback(resArr);
                });
                _sendMessages();
            }
        }, interval);
    }
    _sendMessages();
}

function sendFiles(channelID, fileArr, interval) {
    var resArr = [],
        len = fileArr.length;
    var callback = typeof(arguments[2]) === 'function' ? arguments[2] : arguments[3];
    if (typeof(interval) !== 'number') interval = 1000;

    function _sendFiles() {
        setTimeout(function() {
            if (fileArr[0]) {
                bot.uploadFile({
                    to: channelID,
                    file: fileArr.shift()
                }, function(err, res) {
                    if (err) {
                        resArr.push(err);
                    } else {
                        resArr.push(res);
                    }
                    if (resArr.length === len)
                        if (typeof(callback) === 'function') callback(resArr);
                });
                _sendFiles();
            }
        }, interval);
    }
    _sendFiles();
}
