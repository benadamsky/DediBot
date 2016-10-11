////////////////////////////////////////////////////////////////////////////////
//					      Copyright (C) agubelu 2016                          //   
//                                                                            //   
//    This program is free software: you can redistribute it and/or modify    //   
//    it under the terms of the GNU General Public License as published by    //   
//    the Free Software Foundation, either version 3 of the License, or       //   
//    (at your option) any later version.                                     //   
//                                                                            //   
//    This program is distributed in the hope that it will be useful,         //   
//    but WITHOUT ANY WARRANTY; without even the implied warranty of          //   
//    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the           //   
//    GNU General Public License for more details.                            //   
//                                                                            //   
//    You should have received a copy of the GNU General Public License       //   
//    along with this program.  If not, see <http://www.gnu.org/licenses/>.   //   
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// DEFAULT MESSAGES ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var replyTextToDirectMessages = "I'm agubot! Use !commands on a public chat room to see the command list.";
var replyTextToMentions = "Use !commands to see the command list.";

////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// COMMANDS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////

var commands = [

	{
		command: "stop",
		description: "Stops playlist (will also skip current song!)",
		parameters: [],
		permissions: ['admin'],
		execute: function(message, params) {
			bot.reply(message, "Stopping!");
			bot.voiceConnection.stopPlaying();
			stopped = true;
		}
	},
	
	{
		command: "resume",
		description: "Resumes playlist",
		parameters: [],
		permissions: ['admin'],
		execute: function(message, params) {
			bot.reply(message, "Resuming playlist!");
			stopped = false;
		}
	},

	{
		command: "request",
		description: "Adds the requested video to the playlist queue",
		parameters: ["YouTube URL or video ID"],
		permissions: [],
		execute: function(message, params) {
			if(queueLimit != -1 && queue.length >= queueLimit) {
				bot.reply(message, "Queue is full!");
				return;
			}
			var videoID = getVideoId(params[1]);
			addVideoToQueue(videoID, message);
		}
	},

	{
		command: "np",
		description: "Displays the current song",
		parameters: [],
		permissions: [],
		execute: function(message, params) {
			bot.reply(message, "Now Playing: " + getNowPlaying());
		}
	},

	{
		command: "commands",
		description: "Displays this message, duh!",
		parameters: [],
		permissions: [],
		execute: function(message, params) {
			var response = "Available commands:";
			
			for(var i = 0; i < commands.length; i++) {
				var c = commands[i];
				response += "\n!" + c.command;
				
				for(var j = 0; j < c.parameters.length; j++) {
					response += " <" + c.parameters[j] + ">";
				}
				
				response += ": " + c.description;
			}
			
			bot.reply(message, response);
		}
	},

	{
		command: "setnp",
		description: "Sets whether the bot will announce the current song or not",
		parameters: ["on/off"],
		permissions: ['admin'],
		execute: function(message, params) {
			var response;
			if(params[1].toLowerCase() == "on") {
				response = "Will announce song names in chat";
				np = true;
			} else if(params[1].toLowerCase() == "off") {
				response = "Will no longer announce song names in chat";
				np = false;
			} else {
				response = "Sorry?";
			}
			
			bot.reply(message, response);
		}
	},

	{
		command: "skip",
		description: "Skips the current song",
		parameters: [],
		permissions: ['admin'],
		execute: function(message, params) {
			playNextTrack();
		}
	},

	{
		command: "queue",
		description: "Displays the queue",
		parameters: [],
		permissions: [],
		execute: function(message, params) {
			getSongQueue(message);
		}
	},

	{
		command: "clearqueue",
		description: "Removes all songs from the queue",
		parameters: [],
		permissions: ['admin'],
		execute: function(message, params) {
			clearQueue(message);
		}
	},
	
	{
		command: "permissions",
		description: "Checks the required role to use a command",
		parameters: ["command name"],
		permissions: [],
		execute: function(message, params) {
			
			var command = searchCommand(params[1]);
			var response;
			
			if(command) {
				response = "Roles that can use command \"" + params[1] + "\": ";
				var permissions = command.permissions;
				if(permissions.length == 0){
					response += "(any role)";
				} else {
					for(var i = 0; i < permissions.length; i++) {
						response += permissions[i];
						
						if(i != permissions.length - 1) {
							response += ", ";
						}
					}
				}
			} else {
				response = "Unknown command: \"" + params[1] + "\"";
			}
			
			bot.reply(message, response);
		}
	},
	
	{
		command: "addpermission",
		description: "Allows a role to execute a certain command",
		parameters: ["command name", "role name"],
		permissions: ['admin'],
		execute: function(message, params) {
			
			var command = searchCommand(params[1]);
			
			if(!command) {
				bot.reply(message, "Unknown command: \"" + params[1] + "\"");
				return;
			}
			
			var pos = inArray(params[2].toLowerCase(), command.permissions);
			
			if(pos !== false) {
				bot.reply(message, "That role can already execute that command");
				return;
			}
			
			command.permissions.push(params[2].toLowerCase());
			bot.reply(message, "Users with role " + params[2] + " can now execute command " + params[1]);
		}
	},
	
	{
		command: "removepermission",
		description: "Revokes a role's permission to execute a certain command",
		parameters: ["command name", "role name"],
		permissions: ['admin'],
		execute: function(message, params) {
			
			var command = searchCommand(params[1]);
			
			if(!command) {
				bot.reply(message, "Unknown command: \"" + params[1] + "\"");
				return;
			}
			
			var pos = inArray(params[2].toLowerCase(), command.permissions);
			
			if(pos === false) {
				bot.reply(message, "That role cannot already execute that command");
				return;
			}
			
			command.permissions.splice(pos,1);
			bot.reply(message, "Users with role " + params[2] + " can no longer execute command " + params[1]);
			
			if(command.permissions.length == 0) {
				bot.reply(message, "Command " + params[1] + " can now be executed by anyone.");
			}
		}
	},
	
	{
		command: "queuelimit",
		description: "Displays the current queue limit",
		parameters: [],
		permissions: [],
		execute: function(message, params) {
			if(queueLimit != -1) {
				bot.reply(message, "Current queue limit is set to " + queueLimit + " songs.");
			} else {
				bot.reply(message, "There is no queue limit currently.");
			}
			
		}
	},
	
	{
		command: "setqueuelimit",
		description: "Changes the queue limit. Set to -1 for no limit.",
		parameters: ['limit'],
		permissions: ['admin'],
		execute: function(message, params) {
			var newLimit = parseInt(params[1]);
			var response;
			
			if(isNaN(newLimit) || newLimit < -1) {
				response = "Please, provide a valid number";
			} else {
				queueLimit = newLimit;
				response = (newLimit == -1) ? "Queue limit removed" : "New queue limit set to " + newLimit + " songs"; 
			}
			
			bot.reply(message, response);
		}
	}
	
];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// STUFF DECLARATION ///////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var myID, serverName, channelName, textChannelName;
var stopped = false;
var np = true;

var nowPlayingTitle = "";
var nowPlayingUser = "";

var queue = [];

var request = require('request');
var Discord = require("discord.js");
var bot = new Discord.Client();

var queueLimit = 20;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// EXPORTED METHODS ///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.run = function(email, password, server, channel, textChannel) {
	serverName = server;
	channelName = channel;
	textChannelName = textChannel;
	
	bot.login(email, password);
}

exports.setCommandPermissions = function(commandName, arg1) {
	var command = searchCommand(commandName);
	var args = arguments.length;
	
	if(args < 2) {
		throw new Error("Insufficient arguments!");
	}
	
	if(!command) {
		throw new Error("Command " + commandName + " does not exist");
	}
	
	if(Array.isArray(arg1)) {
		
		for(var i = 0; i < arg1.length; i++) {
			if(typeof arg1[i] !== 'string') {
				throw new Error("Element " + i + " in array is not String");
			}
		}
		
		command.permissions = arg1;
		
	} else {
		var array = [];
		
		for(var i = 1; i < args; i++) {
			if(typeof arguments[i] !== 'string') {
				throw new Error("Argument " + (i+1) + " is not String");
			}
			array.push(arguments[i]);
		}
		
		command.permissions = array;
	}
}

exports.setDefaultAdminRole = function(roleName) {
	
	if(typeof roleName !== 'string') {
		throw new Error('New role name must be String');
	}
	
	for(var i = 0; i < commands.length; i++) {
		var pos = inArray('admin', commands[i].permissions);
		if(pos !== false) {
			commands[i].permissions[pos] = roleName.toLowerCase();
		}
	}
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// EVENT HANDLERS ///////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////

bot.on('ready', function() {
	var channel = bot.servers.get('name', serverName).channels.get('name', channelName);
	bot.joinVoiceChannel(channel, function(error) {
		console.log(error.message);
	});
	
	var mentionText = bot.user.mention();
	myID = mentionText.substring(2, mentionText.length - 1);
	checkQueue();
})

//Message handler
//I should probably reduce this if-else stacking
bot.on("message", function(message) {
	
	if(message.author.id != myID) { // Message sent by somebody else (to prevent an infinite loop with direct messages)
		
		if(message.channel.topic !== undefined) { // Message sent through server channel (instead of DM)
			
			if(message.channel.name == textChannelName) { //Message sent through the text channel the bot is listening to
			
				if(message.content[0] == '!') { // Command issued
					handleCommand(message, message.content.substring(1));
					
				} else if(message.isMentioned(myID)) { //Bot mentioned in message
					bot.reply(message, replyTextToMentions);
				}
			}		
			
		} else { // Direct Message
			bot.reply(message, replyTextToDirectMessages);
		}
	}
});

//Command handler
function handleCommand(message, command) {
	console.log(getTime() + message.author.username + " -> " + command);
	var params = command.split(' ');
	var com = searchCommand(params[0]);
	
	if(com) {
		if(!hasPermission(message.author, com)) {
			bot.reply(message, "Sorry, you don't have permission to use that command.");
		} else if(params.length - 1 < com.parameters.length) {
			bot.reply(message, "Insufficient parameters!");
		} else {
			com.execute(message, params);
		}
	} else {
		bot.reply(message, "Unknown command: \"" + params[0] + "\"");
	}
}

//Queue handler
var checkQueue = function() {
	
	if(!stopped && !queueEmpty() && !bot.voiceConnection.playing) {
		playNextTrack();
	}
	
	setTimeout(checkQueue, 5000);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////// AUXILIARY FUNCTIONS ///////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function hasPermission(user, command) {
	
	var permissions = command.permissions;
	
	if(permissions.length == 0) {
		return true;
	}
	
	var userRoles = bot.servers.get('name', serverName).rolesOfUser(user);
	
	for(var i = 0; i < userRoles.length; i++) {
		if(inArray(userRoles[i].name.toLowerCase(), permissions) !== false) {
			return true;
		}
	}
	
	return false;
	
}

function inArray(needle, haystack) {
	for(var i = 0; i < haystack.length; i++) {
		if(haystack[i] === needle) {
			return i;
		}
	}
	
	return false;
}

function searchCommand(command) {
	
	for(var i = 0; i < commands.length; i++) {
		if(commands[i].command == command.toLowerCase()) {
			return commands[i];
		}
	}
	
	return false;
}

function clearQueue(message) {
	queue = [];
	bot.reply(message, "Queue has been cleared!");
}

function getSongQueue(message) {
	
	var response = "";
	
	if(queueEmpty()) {
		response = "the queue is empty.";
	} else {
		for(var i = 0; i < queue.length; i++) {
			response += "\"" + queue[i]['title'] + "\" (requested by " + queue[i]['user'] + ")\n";
		}
	}
	
	bot.reply(message, response);
}

function playNextTrack() {
	
	if(queueEmpty()) {
		bot.sendMessage(bot.servers.get('name', serverName).channels.get('name', textChannelName), "Queue is empty!");
		bot.voiceConnection.stopPlaying();
		return;
	}
		
	bot.voiceConnection.playFile(queue[0]['url']);
	
	nowPlayingTitle = queue[0]['title'];
	nowPlayingUser = queue[0]['user'];
	
	console.log(getTime() +  "NP: \"" + nowPlayingTitle + "\" (by " + nowPlayingUser + ")");
	
	if(np) {
		bot.sendMessage(bot.servers.get('name', serverName).channels.get('name', textChannelName), "Now Playing: \"" + nowPlayingTitle + "\" (requested by " + queue[0]['mention'] + ")");
	}
	
	queue.splice(0,1);
}

function getNowPlaying() {
	if(bot.voiceConnection.playing) {
		return "\"" + nowPlayingTitle + "\" (requested by " + nowPlayingUser + ")";
	} else {
		return "Nothing!";
	}
}

function addVideoToQueue(videoID, message) {
	
	var baseURL = "https://savedeo.com/download?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D";
	
	request(baseURL + videoID, function (error, response, body) {
		
		if (!error && response.statusCode == 200) {
			var cheerio = require('cheerio'), $ = cheerio.load(body);
			var videoTitle = $('title').text();
			
			if(videoTitle.indexOf('SaveDeo') != -1) {
				bot.reply(message, "Sorry, I couldn't get audio track for that video.");
				return;
			}
			
			var audioURL = $('#main div.clip table tbody tr th span.fa-music').first().parent().parent().find('td a').attr('href');
			
			queue.push({
				title: videoTitle, 
				user: message.author.username, 
				mention: message.author.mention(), 
				url: audioURL
			});
			
			bot.reply(message, "\"" + videoTitle + "\" has been added to the queue.");
			
		} else {
			bot.reply(message, "There has been a problem handling your request.");
			console.log(error);
		}
	});
}

function getVideoId(string) {
	var searchToken = "?v=";
	var i = string.indexOf(searchToken);
	
	if(i == -1) {
		searchToken = "&v=";
		i = string.indexOf(searchToken);
	}
	
	if(i == -1) {
		searchToken = "youtu.be/";
		i = string.indexOf(searchToken);
	}
	
	if(i != -1) {
		var substr = string.substring(i + searchToken.length);
		var j = substr.indexOf("&");
		
		if(j == -1) {
			j = substr.indexOf("?");
		}
		
		if(j == -1) {
			return substr;
		} else {
			return substr.substring(0,j);
		}
	}
	
	return string;
}

function queueEmpty() {
	return queue.length === 0;
}

function getTime() {
	function f(x) {
		return x<10?"0"+x:x;
	}
	var date = new Date();
	return "[" + f(date.getHours()) + ":" + f(date.getMinutes()) + ":" + f(date.getSeconds()) + "] ";
}