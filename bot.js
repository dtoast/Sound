/*

Soundbot Revamp

This might not work with the new plug update but w/e

Copyright (c) 2014 FourBit (Pr0Code)

*/

(function(){
	var motdMsg = ["Welcome to the FourBit plug.dj room!"];
	var settings = {
		woot: true,
		motd: {
			enabled: true,
			interval: 1500000
		},
		antiAfk: {
			enabled: true,
			limit: 3600000
		},
		blacklist: true,
		stats: true,
		historySkip: true,
		party: false,
		roulette: false
	};

	function loadSettings(){
		var a = JSON.parse(localStorage.getItem('SoundbotSave'));
		if(a) settings = a;
		else if(typeof a === undefined) saveSettings();
	}

	//Init() and shutdown()

	function init(){
		API.on(API.CHAT, eventDataChat);
		API.on(API.CHAT, eventCommandChat);
		API.on(API.USER_JOIN, eventJoin);
		API.on(API.USER_LEAVE, eventLeave);
		API.on(API.DJ_ADVANCE, eventDjAdvance);
		API.setVolume(0);
		loadSettings();
		blacklist();
		var zux = setInterval(saveSettings, 300000);
		zux();
		if(settings.woot) $('#woot').click();
		API.sendChat('/em now sprinting!');
	}

	function shutdown(){
		API.off(API.CHAT, eventDataChat);
		API.off(API.CHAT, eventCommandChat);
		API.off(API.CHAT, eventJoin);
		API.off(API.USER_LEAVE, eventLeave);
		API.setVolume(15);
		saveSettnigs();
		clearInterval(zux);
		clearInterval(yis);
		if(settings.motd.enabled) clearInterval(motdInt);
		delete data;
		delete settings;
		API.sendChat('Soundbot Shutdown.');
	}

	//Userdata

	var data = {};
	var u = API.getUsers();
	for(var i in u){
		data[u[i].id] = {
			username: u[i].username,
			afktime: Date.now();
			warning: false,
			removed: false,
			muted: false,
			roulSelect: false,
			roulChat: false
		};
	}

	function eventJoin(a){
		data[a.id] = {
			username: a.username,
			afktime: Date.now();
			warning: false,
			removed: false,
			muted: false,
			roulSelect: false,
			roulChat: false
		};
	}

	function eventLeave(a){
		delete data[a.id];
	}

	function eventDataChat(a){
		data[a.fromID].afkTime = Date.now();
		data[a.fromID].warning = false;
		data[a.fromID].roulChat = false;
	}

	//AntiAfk

	function AntiAFK(){
		if(settings.antiAfk.enabled){
			var z = API.getWaitList();
			var y = Date.now();
			for(var i in z){
				var x = data[z[i].id].afktime;
				var w = y - x;
				var v = Math.floor((y - x) / 50000) % 60;
				if(w > settings.antiAfk.limit && !data[a[i].id].warning){
					API.sendChat('@' + z[i].username + ' AFK Time: ' + v + ' minutes. Chat soon or I will remove you.');
					data[a[i].id].warning = true;
					setTimeout(function(){
						z = API.getWaitList();
						for(var c in z){
							if(data[z[e].id].warning){
								API.sendChat('@' + z[e].username + ' last warning (AFK).');
								data[z[e].id].removed = true;
								setTimeout(function(){
									z = API.getWaitList();
									for(var e in z){
										if(z[e].warning && z[e].removed){
											API.moderateRemoveDJ(z[e].id);
											data[z[e].id].warning = false;
											data[z[e].id].removed = false;
											data[z[e].id].afktime = Date.now();
										}
										else if(!z[e].warning && z[e].removed){
											API.sendChat('/em Uh oh! There\'s been an error in the UserData. ' + z[e].username + ' has removed set to true, but not warning!');
										}
									}
								}, 120000);
							}
						}
					}, 120000);
				}
			}
		}
	}

	//MOTD

	function motd(){
		if(settings.motd.enabled){
			var motdInt = setInterval(function(){
				API.sendChat('/em ' + [Math.floor(Math.random() * motdMsg.length;)]);
			}, settings.motd.interval);
		}
	}

	//Blacklist

	function blacklist(){
		var a = API.getMedia().title;
		for(var i = 0; i < blacklist.length; i++){
			if(blacklist[i] === a){
				API.sendChat('@' + API.getDJ().username + ' that song is blacklisted!');
				var b = new Array();
				b.push(API.getDJ().id);
				if($('.cycle-toggle').hasClass('disabled')){
					$(this).click();
				}
				API.moderateLockWaitList(true, false);
				API.moderateForceSkip();
				for(var c = 0; c < b.length; c++){
					setTimeout(function(){
						API.moderateMoveDJ(b[c], 4);
					}, 500);
				}
			}
		}
	}

	//History skip

	function hist(){
		API.on(API.HISTORY_UPDATE, function (a){
			var b = API.getMedia().title;
			for(var i = 0; i < a.length; ++i){
				if(a[i] === b){
					API.sendChat('@' + API.getDJ().username + ' that song is in history!');
					var c = new Array();
					c.push(API.getDJ().id);
					if($('.cycle-toggle').hasClass('disabled')){
						$(this).click();
					}
					API.moderateLockWaitList(true, false);
					API.moderateForceSkip();
					API.moderateMoveDJ(b[1], 5);
				}
			}
		});
	}

	function eventDjAdvance(){
		if(settings.woot) $('#woot').click();
		blacklist();
		hist();
	}

	function listenFor(a, b){
		API.on(API.CHAT, function (z){
			a = a.trim();
			b = b.trim();
			for(var i = 0; i < u.length; i++){
				if(u[i].id === a){
					if(b === false){
						if(z.fromID === a || z.fromID === u[i].id && b === false){
							return true;
							return null;
						}
						else{
							if(z.fromID === a || z.fromID === u[i].id && b === false){
								return false;
								return null;
							}
						}
					}
					if(b === true){
						if(z.fromID === a || z.fromID === u[i].id && b === true){
							return true;
							return z.message;
						}
						else{
							if(z.fromID !== a || z.fromID !== u[i].id && b === true){
								return false;
								return null;
							}
						}
					}
				}
			}
			if(z.message === '!pass' && data[z.fromID].roulSelect && data[z.fromID].roulChat) API.moderateDeleteChat(z.chatID);
		});
	}

	function eventCommandChat(a){
		if(a.message.substr(1) === '!') var str = a.message.substr(1).trim();
		var opt    = str.split('@') + 1;
		var arg    = str.lastIndexOf(' ') + 1;
		var noarg  = str.split(' ') + 1;
		var from   = a.from;
		var fromid = a.fromID;
		var chatid = a.chatID;
		var check  = function(){
			if(API.getUser(a.fromID).permission >= 2){
				return true;
			}else{
				return false;
			}
		}
		if(a.message.substr(1) === '!') API.moderateDeleteChat(chatid);
		var roul = new Array();
		var tempRoul = new Array();
		var safeRoul = new Array();
		switch(str){
			case 'help':
				API.sendChat('/em [' + from + '] Soundbot was just recoded, so please wait for commands. Ask staff for questions.');
				break;
			case 'web':
				API.sendChat('/em [' + from + '] FourBit website: NaN');
				break;
			case 'ping':
				API.sendChat('/em [' + from + '] Pong!');
				break;
			case 'link':
				if(API.getMedia().format === 1){
					API.sendChat('/em [' + from + '] Link to current song: http://youtu.be/' + API.getMedia().cid);
				}else{
					var z = API.getMedia().cid;
					SC.get('/tracks', { ids: id, }, function (tracks){
						API.sendChat('/em [' + from + '] Link to current song: ' + tracks[0].permalink_url);
					});
				}
				break;
			case 'ad':
				API.sendChat('/em [' + from + '] ADBlock (the version that isn\'t bad): https://www.getadblock.com');
				break;
			case 'pic':
				function t(e,t){
					if(e===null){
						return"";
					}
					t=t===null?"big":t;
					var n;
					var r;
					r=e.match("[\\?&]v=([^&#]*)");
					n=r===null?e:r[1];
					if(t=="small"){
						return"http://img.youtube.com/vi/"+n+"/2.jpg";
					}else{
						return"http://img.youtube.com/vi/"+n+"/0.jpg";
					}
				}
				var n=API.getMedia();
				if(n.format==1){
					API.sendChat("/em ["+from+"][!pic] "+t(n.cid));
				}else{
					var r=SC.get("/tracks/"+n.cid,function(e){
						return e.permalink_url;
					});
					var i=SC.get(r,function(e){
						var t=e.artwork;
						return t;
					});
					if(!i){
						API.sendChat("Um, I kinda couldn't get the Soundcloud album link...");
					}else{
						API.sendChat("/em ["+from+"][!pic] "+i);
					}
				}
				break;
			
			//For now, bouncer + commands. User cmds will be done later.

			//Start roulette

			case 'roul':
				if(check()){
					if(noarg === 'start' && !settings.roulette){
						API.sendChat('/em [' + from + '] Started roulette! Type "!join" to play.');
						settings.roulette = true;
					}
					if(noarg === 'stop' && settings.roulette){
						clearInterval(z);
						settings.roulette = false;
						data.roulSelect = false;
						data.roulChat = false;
						API.sendChat('/em [' + from + '] Stopped roulette! :frowning:');
					}
				}
				break;
			case 'join':
				for(var i = 0; i < roul.length; i++){
					if(roul[i] !== from && roul.length < 10){
						API.sendChat('/em [' + from + '] Joined roulette!');
						roul.push(from);
					}else{
						API.sendChat('/em [' + from + '] It seems that you already joined!');
					}
				}
				break;
			case 'start':
				if(check() && settings.roulette){
					API.sendChat('/em [' + from + '] Game started!');
					var y = Math.floor(Math.random() * roul.length);
					var z = setInterval(function(){
						API.sendChat('@' + roul[y] + ' you have the gun! Type !pass to pass it!!!');
						tempRoul.push(y);
						if(tempRoul[1] === roul[y]){
							for(var i = 0; i < u.length; i++){
								if(tempRoul === u[i].username){
									if(data[u[i].id].roulSelect && !data[u[i].id].roulChat){
										data[u[i].id].roulChat = true;
										if(listenFor(u[i].id, false) === true && listenFor(u[i].id, true) === '!pass'){
											API.sendChat('/em [' + from + '] Passed the gun!');
											data[u[i].id].roulSelect = false;
											data[u[i].id].roulChat = false;
											tempRoul.pop(u[i].username);
											safeRoul.push(u[i].username);
											roul.pop(u[i].username);
										}
									}
								}else clearInterval(this) z();
							}
						}else clearInterval(this) z();
					}, 2000);
					z();
				}
				break;

			//End Roulette

			case 'add':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + ' used add]');
							API.moderateAddDJ(u[i].id);
						}
						else API.sendChat('/em [' + from + '] User not found.');
					}
				}
				break;

			case 'remove':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + ' used remove]');
							API.moderateRemoveDJ(u[i].id);
						}
						else API.sendChat('/em [' + from + '] User not found.');
					}
				}
				break;

			case 'move':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							if(arg !== null || undefined){
								API.sendChat('/em [' + from + ' used move]');
								var z = API.getWaitList();
								var y = parseInt(arg);
								for(var c = 0; c < z.length; c++){
									if(z[c].username !== u[i].username){
										API.moderateAddDJ(u[c].id);
										API.moderateMoveDJ(u[c].id, y);
									}else{
										if(z[c].username === u[i].username){
											API.moderateMoveDJ(u[c].id, y);
										}
									}
								}
							}
						}
						else API.sendChat('/em [' + from + '] User not found.');
					}
				}
				break;

			case 'skip':
				if(check()){
					API.moderateForceSkip();
				}
				break;

			case 'lockskip':
				if(check()){
					if(noarg === 'op'){
						API.sendChat('/em [' + from + ' used lockskip]');
						var b = new Array();
						b.push(API.getDJ());
						if($('.cycle-toggle').hasClass('disabled')) $(this).click();
						API.moderateLockWaitList(true, false);
						API.moderateForceSkip();
						API.sendChat('@' + b[1].username + ' please pick another song because that one is overplayed!');
						setTimeout(function(){
							API.moderateMoveDJ(b[1].id, 5);
						}, 500);
					}
					if(noarg !== 'op' || noarg === null || noarg === undefined){
						API.sendChat('/em [' + from + ' used lockskip]');
						var b = new Array();
						b.push(API.getDJ().id);
						if($('.cycle-toggle').hasClass('disabled')) $(this).click();
						API.moderateLockWaitList(true, false);
						API.moderateForceSkip();
						setTimeout(function(){
							API.moderateMoveDJ(b[1], 5);
						}, 500);
					}
				}
				break;

			case 'ban':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							if(arg !== null || undefined){
								var z = parseInt(arg);
								if(z === 1){
									API.sendChat('/em [' + from + ' used ban]');
									API.moderateBanUser(u[i].username, 1, API.BAN.HOUR);
								}
								if(z === 2){
									API.sendChat('/em [' + from + ' used ban]');
									API.moderateBanUser(u[i].username, 1, API.BAN.DAY);
								}
								if(z === 3){
									API.sendChat('/em [' + from + ' used ban]');
									API.moderateBanUser(u[i].username, 1, API.BAN.PERMA);
								}
								else if(z >= 4) API.sendChat('/em [' + from + '] Valid inputs are 1, 2, 3.');
							}
						}
						else API.sendChat('/em [' + from + '] User not found.');
					}
				}
				break;
			case 'party':
				if(API.getUser(fromid).permission === 5){
					if(!settings.party && noarg === null || noarg === undefined || arg === null || arg === undefined || opt === null || opt === undefined){
						settings.party = true;
						API.sendChat('/em [' + from + ' started a party]');
						API.moderateLockWaitList(true, true);
						var z = API.getUsers();
						var y = new Array();
						for(var i = 0; i < z.length; i++){
							if(z[i].permission === 1){
								y.push(z[i].id);
							}
						}
						var x = setInterval(function(){
							if(y.length !== 0){
								for(var c = 0; c < y.length; c++){
									API.moderateAddDJ(y[c].id);
								}
							}else clearInterval(x);
						}, 6e3);
						API.moderateForceSkip();
						$.ajax({
							type: 'POST',
							url: 'http://plug.dj/_/gateway/moderate.update_name_1',
							contentType: 'application/json',
							data: '{"service":"moderate.update_name_1","body":["Join the party! | FourBit"]}'
						});
						if($('.cycle-toggle').hasClass('disabled')){
							$(this).click();
						}
					}else{
						API.sendChat('/em [' + from + '] It seems that a party is already in progress!');
					}
					if(settings.party && noarg === 'end' || settings.party && noarg === 'stop'){
						API.sendChat('/em [' + from + ' stopped the current party]');
						$.ajax({
							type: 'POST',
							url: 'http://plug.dj/_/gateway/moderate.update_name_1',
							contentType: 'application/json',
							data: '{"service":"moderate.update_name_1","body":["FourBitProductions | plug.dj"]}'
						});
						API.moderateLockWaitList(false);
						if($('.cycle-toggle').hasClass('enabled')){
							$(this).click();
						}
					}
				}
				break;
			case 'status':
				if(check()){
					var z = Date().getTime();
					var y = Math.floor(joinTime - z);
					API.sendChat('/em [' + from + '] Uptime: ' + y + ' ~ Party: ' + settings.party + ' ~ Blacklist: ' + settings.blacklist);
				}
				break;
			case 'woot':
				if(check()){
					$('#woot').click();
				}
				break;
			case 'grab':
				if(check()){
					$('.icon-curate').click();
					$($('.curate').children('.menu').children().children()[0]).mousedown();
				}
				break;
			case 'kill':
				if(check()){
					shutdown();
				}
				break;
			case 'vr':
				if(check()){
					//Broken down to show how I'm get percentages.
					var z = API.getRoomScore();
					var y = new Array();
					//Exclude bot
					var w = Math.floor(u.length - 1);
					//Get woot percent
					var b = Math.floor((w / z.positive) * 100);
					//Get cur percent
					var c = Math.floor((w / z.curates) * 100);
					//Get meh percent
					var d = Math.floor((w / z.negative) * 100);
					//Send
					API.sendChat('/em [' + from + '] Votes: ' + b + '% wooted, ' + c + '% grabbed, ' + d + '% meh\'d!');
				}
				break;
			case 'clear':
				if(check()){
					var z = $('#chat-messages').children();
					for(var i = 0; i < z.length; i++){
						for(var c = 0; c < z[i].classList.length; c++){
							if(z[i].classList[c].indexOf('cid-') === 0){
								API.moderateDeleteChat(z[i].classList[c].substr(4));
							}
						}
					}
					API.sendChat('/em [' + from + ' used clear]');
				}
				break;
			case 'lock':
				if(check()){
					API.sendChat('/em [' + from + ' used lock]');
					API.moderateLockWaitList(true, false);
				}
				break;
			case 'cycle':
				if(check()){
					API.sendChat('/em [' + from + ' used cycle]');
				}
				break;
			case 'mute':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							data[u[i].id].mute = true;
							API.sendChat('/em [' + from + ' muted ' + u[i].username + ']');
						}
					}
				}
				break;
			case 'unmute':
				if(check()){
					if(data[fromid].mute = true){
						API.sendChat('/em [' + from + '] Tried unmuting themselves, but can\'t! Muahahahaha!!!');
					}
					else{
						for(var i in u){
							if(u[i].username === opt){
								data[u[i].id].mute = false;
							}
						}
					}
				}
				break;
			case 'kick':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + ' used kick]');
							API.moderateBanUser(u[i].id, 1, API.BAN,HOUR);
							setTimeout(function(){
								API.moderateUnbanUser(u[i].id);
								API.sendChat('/em [' + from + '] Kicked user can login now.');
							}, 15000);
						}
					}
				}
				break;
			case 'reg':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + '] Removed ' + u[i].username + ' from the staff!');
							API.moderateSetRole(u[i].id, API.ROLE.NONE);
						}
					}
				}
				break;
			case 'rdj':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a Resident DJ!');
							API.moderateSetRole(u[i].id, API.ROLE.RESIDENTDJ);
						}
					}
				}
				break;
			case 'bouncer':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a bouncer!');
							API.moderateSetRole(u[i].id, API.ROLE.BOUNCER);
						}
					}
				}
				break;
			case 'manager':
				if(check()){
					for(var i in u){
						if(u[i].username === opt){
							API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a manager!');
							API.moderateSetRole(u[i].id, API.ROLE.MANAGER);
						}
					}
				}
				break;
		}
	}

	//Whitelist names have to be spelled EXacTlY as they actually are, else, it won't work.

	var a = $('#chat-messages').last().text();
	var u = API.getUsers();
	var whitelist = ["Ambassador1", "Admin1", "Admin2", "Ambassador2"];

	function antiRemove(){
		var a = $('#chat-messages').last().text();
		var whitelist = ["Ambassador1", "Admin1", "Admin2", "Ambassador2"];
		for(var i = 0; i < a.length; i++){
			for(var c in u){
				for(var x = 0; x < whitelist.length; x++){
					var z = u[c].permission;
					if(a[i].split(' ')[0] === u[c].username){
						if(u[c].permission >= 3 && u[c].permission <= 5){
							API.sendChat('@' + u[c].username + ' pls don\'t do that m8, you are not manager.');
							var b = a[i].split(' ')[2];
							API.moderateSetRole(a[i].id, z);
						}else{
							if(a[i].split(' ')[0] !== null){
								if(u[c].username !== whitelist[x]){
									API.sendChat('@' + u[c].username + ' pls don\'t do that m8, you are not manager.');
									var b = a[i].split(' ')[2];
									API.moderateSetRole(a[i].id, z);
								}
							}
						}
					}
				}
			}
		}
	}

	var yis = setInterval(function(){
		antiRemove();
	}, 50);

	yis();

	function executeCommand(){
		var userData = {};
		var users = API.getUsers();
		 
		for(var i in users){
		        userData[users[i].id] = {
		                warn: false,
		                executeChat: false
		        };
		}
		 
		var b = [];
		 
		API.on(API.USER_JOIN, function(user){
		        userData[user.id] = {
		                warn: false,
		                executeChat: false
		        };
		});
		 
		API.on(API.USER_LEAVE, function(user){
		        delete userData[user.id];
		});
		 
		function hasChatted(){
		        var z = API.getUsers();
		        for(var x in z){
		                for(var n = 0; n < b.length; n++){
		                        if(z[x].username == b[n]) return 'userHasChatted';
		                        else return;
		                }
		        }
		}
		 
		var b = [];
		 
		API.on(API.CHAT, function(data){
		        if(data.message.indexOf('!execute') !=-1){
		                if(API.getUser(data.fromID).permission >= 2){
		                        var a = API.getUsers();
		                        for(var i in a){
		                                if(a[i].username === data.message.substr(10)){
		                                        API.sendChat('/em [' + data.from + '][!execute] @' + data.message.substr(10) + ' you are being executed for commiting crimes against this community. Any last words?');
		                                        b.push(a[i].id);
		                                        userData[a[i].id].warn = true;
		                                        setInterval(function(){
		                                                if(hasChatted() === 'userHasChatted'){
		                                                        userData[a[i].id].executeChat = true;
		                                                        API.sendChat(Math.floor(Math.random() * outro.length));
		                                                        API.moderateBanUser(a[i].id, 1, 1);
		                                                        clearInterval(this);
		                                                        b = [];
		                                                }
		                                                setTimeout(function(){
		                                                        if(userData[a[i].id].executeChat === false){
		                                                                API.sendChat('Wow. ' + a[i].username + ' chickened out of the execution. GET BANNED ANYWAY!!!');
		                                                                API.moderateBanUser(a[i].id, 1, 1);
		                                                                clearInterval(this);
		                                                                clearTimeout(this);
		                                                                b = [];
		                                                        }else{
		                                                                API.sendChat('Huh. I missed the user chatting. They still get to be banned!!!');
		                                                                API.moderateBanUser(a[i].id, 1, 1);
		                                                                clearInterval(this);
		                                                                clearTimeout(this);
		                                                                b = [];
		                                                        }
		                                                        a = API.getUsers();
		                                                        for(var c in a){
		                                                                if(a[c].id !== b[1]){
		                                                                        API.sendChat('Well then, ' + data.message.substr(10) + ' left. Goodbye then.');
		                                                                        $.ajax({
		                                                                                type:"POST",
		                                                                                url:"http://plug.dj/_/gateway/moderate.ban_1",
		                                                                                contentType:"application/json",
		                                                                                data:'{"service":"moderate.ban_1","body":["' + b[1] + '"]}'
		                                                                        });
		                                                                }
		                                                        }
		                                                }, 60000);
		                                        }, 1000);
		                                }
		                        }
		                }
		        }
		});
	}

	init();

}).call(this);
