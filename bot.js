/* Copyright (c) 2016, Ben Adamsky */


/*Variable area*/
var dat = require('./data.json');

var Discord = require('discord.io');
var bot = new Discord.Client({
	token: dat.token,
	autorun: true
});

var sID = dat.sID;
var icon = dat.icon;

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
    console.log("I'm currently running on version " + bot.internals.version);
});

bot.on("message", function(user, userID, channelID, message, event) {
    console.log(user + " - " + userID);
    console.log("in " + channelID);
    console.log(message);
    console.log("----------");
	
	var serverID = "";
	try {
		serverID = bot.channels[channelID].guild_id;
	}
	catch(err) {
		console.log("Got a message from a DM channel. Not dealing with this :)");
		return;
	}
	var server = bot.servers[serverID];
	var list = Object.keys(server.members).length;
	var sMem = server.members;
	
    if (message === "!ping") {
        sendMessages(channelID, [dat.icon + "  pong!"]); //Test message...
    } else if (message === "!website" || message === "!web" || message === "!site") {
        sendMessages(channelID, [dat.icon + "  https://www.dedifire.com/"]); //DediFire site
    } else if (message === "!users" || message === "!user" || message === "!members" || message === "!member") {
        sendMessages(channelID, [dat.icon + "  Member count: **" + list + "**"]); //Get Member Count
	} else if (message === "!staff") { //List Users in Staff Role
			var strRole = "";
			for(var member in sMem) {
				var uRole = sMem[member].roles.map(roleId=>{return server.roles[roleId].name}).join(",");
				if(uRole.includes("Staff"))
				{
					if(strRole === "")
						strRole += bot.users[member].username;
					else
						strRole += ",  " + bot.users[member].username;
				}
			}
			sendMessages(channelID, [dat.icon + "  Users with the Staff role:  *" + strRole + "*"]);
	} else if (message === "!support") { //List Users in Support Role
			var strRole = "";
			for(var member in sMem) {
				var uRole = sMem[member].roles.map(roleId=>{return server.roles[roleId].name}).join(",");
				if(uRole.includes("Support"))
				{
					if(strRole === "")
						strRole += bot.users[member].username;
					else
						strRole += ",  " + bot.users[member].username;
				}
			}
			sendMessages(channelID, [dat.icon + "  Users with the Support role:  *" + strRole + "*"]);
	} else if (message === "!partner" || message === "!partners") { //List Users in Partners Role
			var strRole = "";
			for(var member in sMem) {
				var uRole = sMem[member].roles.map(roleId=>{return server.roles[roleId].name}).join(",");
				if(uRole.includes("Partner"))
				{
					if(strRole === "")
						strRole += bot.users[member].username;
					else
						strRole += ",  " + bot.users[member].username;
				}
			}
			sendMessages(channelID, [dat.icon + "  Users with the Partner role:  *" + strRole + "*"]);
	} else if (message === "!client" || message === "!clients") { //List Users in Client Role
			var strRole = "";
			for(var member in sMem) {
				var uRole = sMem[member].roles.map(roleId=>{return server.roles[roleId].name}).join(",");
				if(uRole.includes("Client"))
				{
					if(strRole === "")
						strRole += bot.users[member].username;
					else
						strRole += ",  " + bot.users[member].username;
				}
			}
			sendMessages(channelID, [dat.icon + "  Users with the Client role:  *" + strRole + "*"]);
	} else if (message === "!bot" || message === "!bots") { //List Bots on Server
			var strRole = "";
			for(var member in sMem) {
				var uRole = sMem[member].roles.map(roleId=>{return server.roles[roleId].name}).join(",");
				if(uRole.includes("Bot"))
				{
					if(strRole === "")
						strRole += bot.users[member].username;
					else
						strRole += ",  " + bot.users[member].username;
				}
			}
			sendMessages(channelID, [dat.icon + "  Current bots on this server:  *" + strRole + "*"]);
	} else if (message === "!info") {
		bot.sendMessage({
			to: channelID,
			message: dat.icon + "  Sending my information to **" + user + "**!"
		}, function(err, message) {
			if (err) return console.log(err);
			setTimeout(function() {
				bot.deleteMessage({
					channelID: channelID,
					messageID: message.id
				});
			}, 6000);
		});
		sendMessages(userID,["\n```So you want to know about me, huh? I'm DediBot, created by Ben Adamsky for DediFire's Discord Server. I was created in August of 2016 and am still being developed to this day. Think I could be improved? Email ben.adamsky@dedifire.com your suggestions!```"]); //DediFire Info 
    } else if (message === "!help") {
        bot.sendMessage({
            to: channelID,
            message: dat.icon + "  Sending my help menu to **" + user + "**!"
        }, function(err, message) {
            if (err) return console.log(err);
            setTimeout(function() {
                bot.deleteMessage({
                    channelID: channelID,
                    messageID: message.id
                });
            }, 6000);
        });
        sendMessages(userID, ["\n```md\n\n#DediBot Commands\n[ !website ]( View DediFire's official website )\n[ !users ]( View member count on the Discord )\n[ !info ]( View information on my origin as well as my creator )\n[ !staff ]( View users with the Staff role )\n[ !support ]( View users with the Support role )\n[ !partners ]( View users with the Partner role )\n[ !clients ]( View users with the Client role )\n[ !bots ]( View all current bots on the server ) \n\n#Important Links\n[ DediBot Wiki ]( https://github.com/BenAdamsky/DediBot/wiki )\n[ Knowledgebase ]( https://www.dedifire.com/client-area/knowledgebase.php )\n[ Game Servers ]( https://www.dedifire.com/game-servers/ )\n[ Dedicated Servers ]( https://www.dedifire.com/dedicated-servers/ )\n[ Partners ]( https://www.dedifire.com/partnerships/ )\n[ Meet the Team ]( https://www.dedifire.com/meet-the-team/ )\n[ Network Status ]( https://www.dedifire.com/client-area/serverstatus.php )\n\n#Social Media\n[ Twitter ]( https://twitter.com/dedifirehosting/ )\n[ Facebook ]( https://www.facebook.com/DediFire/ )\n[ YouTube ]( https://www.youtube.com/channel/UCjvdESt3NUCf3w83a5DYgww/ )\n[ Discord Invite Link ]( https://discordapp.com/invite/Ahwk66u )\n```"]); //DediFire help menu
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
    sendMessages(sID, [dat.icon + "  **New Member:**  <@" + member.id + ">\n ```diff\n- Welcome to the official DediFire Discord server! -```"]);
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
