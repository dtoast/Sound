/*
	Copyright (c) 2014 FourBit.
	
	If you want to modify, please
	fork this and include the
	link to this repository.

	Found a bug? Make an issue! ->
*/
SockJS.prototype.cmd = function(z){this.send(JSON.parse(z));};
(function(){
	function makeSb(){
		var version = '1.1',
		u = [],
		settings = {
			autowoot: true,
			stats: false,
			hidden: false,
			blackEnabled: true,
			opEnabled: false,
			histSkp: false,
			activeP: false,
			activeR: false,
			userCmds: true,
			advStat: true,
			chatFil: true,
			cd: false,
			cdTime: 1000,
			queue: true,
			gqueue: [],
			lockdown: false,
			chkUpdate: true,
			pendingUp: false,
			motd: true,
			mI: 1500000,
			motdMsg: ['Welcome to The Lounge!'],
			antiAfk: true,
			aaI: 3600000,
			songChk: true,
			dcLookUp: true,
			removeStaffBecauseTheyWereADickEnabled: true,
			removeStaffBecauseTheyWereADick: null,
			allowSafeMode: false,
			safeMode: false,
			maxDisc: 7200000,
			bouncerPlus: true,
			showVer:true,
			songLim: 10
		},refr,cmds={},
		bouncerList = {
			users: [],
			enabled: true
		},sock,connect,
		data={},services={},
		rule=true,
		_services_afk,
		_services_motd,
		blacklist = ['Pink Fluffy Unicorns', '#SELFIE', 'Troll Song'],
		motdMsg = settings.motdMsg,
		oplist = ['Pegboard Nerds - Here It Comes', 'Astronaut - Champions'],
		cookies = ['sugar', 'lemon', 'peanut butter', 'chocolate', 'chocolate chip', 'vanilla', 'rose', 'cookie with frosting', 'frog cookie'],
		outcome = ['You eat it. Man that was good!', 'Tasty!', 'They take it back D:', 'They smack it out of your hand </3', 'Touching it duplicates it into more. Weird, but AWESOME! :D', 'I never give it to you, but I can\'t eat it. D:', 'Wow what a taste!', 'It becoms your favorite :3'],
		questions = ['If you could throw any kind of party, what would it be like and what would it be for?', 'If you could paint a picture of any scenery you’ve seen before, what would you paint?', 'If you could change one thing about the world, regardless of guilt or politics, what would you do?', 'What is the key to finding happiness?', 'What do you think about tis song? http://goo.gl/koaB8R', 'ou’ve been hired to write a teen dictionary.  What would be the first 10 words all teens should know about?', 'When someone has bad breath do you tell them or try and ignore it?', 'I will never forgive ________ for ________ .', 'If the entire world is in debt, where did all the money go?', 'RANDOM GIFS! GOGOGOGO', 'What’s something valuable that you accidentally dropped and broke?', 'What’s something you should throw away, but can’t?', 'f there was a public execution on TV would you watch it?', 'hi. wassap?'];
		cmds.users = {};
		cmds.staff = {};
		cmds.bplus = {};
		cmds.manager = {};
		cmds.host = {};
		refr = 4;
	}
	
	if(lolwut()){makeSb();}

	function checkUpdate(){
		$.ajax({
			cache:false,
			url:'http://astroshock.bl.ee/_/static/sb/update.json',
			dataType:'json',
			success:function(a){
				if(version!==a.version){
					API.sendChat('/em An update is available for Soundbot. Type !update to get it!');
					settings.pendingUp=true;
				}
			},
			error:function(){throw new Error('Failed to GET the update json!');}
		});
	}
	function loadSettings(){
		var a = JSON.parse(localStorage.getItem('SoundbotSettings'));
		var z = JSON.parse(localStorage.getItem('BouncerList'));
		if(a){
			var b = Object.keys(settings);
			for(var i = 0; i < b.length; i++){
				if(a[b[i]]!==null&&settings[b[i]]!==null){
					settings[b[i]]=a[b[i]];
				}
			}
		}
		if(z){
			var y = Object.keys(bouncerList);
			for(var i = 0; i < y.length; i++){
				if(z[y[i]]!==null&&bouncerList[y[i]]!==null){
					bouncerList[y[i]]=z[y[i]];
				}
			}
		}
	}
	function startup(){
		if(lolwut()){
			makeSb();
			if(settings.hidden)return API.sendChat('/em Error (hidden enabled)');
			if(API.getUser().role<3)return API.sendChat('/em I need to have permission!');
			loadSettings();
			loadEvents();
			setupData();
			//socket();
			$('#users-button').click();
			$('.button.bans').click();
			setTimeout(function(){
				$('.button.room').click();
				$('#chat-button').click();
			}, 100);
			if(settings.autowoot)$('#woot').click();
			_services_afk = setInterval(function(){services.antiAfk();},60000);
			if(!settings.antiAfk)clearInterval(_services_afk);
			else _services_afk;
			API.sendChat('/em Now running'+(settings.showVer?' v'+version+'!':'!'));
			var temp = API.getUsers();
			for(var i = 0; i < temp.length; i++){
				u.push(temp[i]);
				break;
			}
			return true;
		}
	}
	function socket(){
		// experimental - I can only see it
		// because it runs local for me
		sock = new SockJS('http://localhost:9999/echo');
		sock.onopen = function(){
			connect = 2;
			console.log('[Soundbot]', 'Connected to socket!');
			sock.cmd({t:'sb',m:settings,o:API.getUser()});
			return true;
		};
		sock.onmessage = function(z){
			var data = JSON.parse(z.data);
			switch(data.io){
				case 'err':
					API.chatLog(data.e, true);
					break;
				case 'load':
					return;
				case 'say':
					return API.sendChat(data.s);
			}
		};
		sock.onclose = function(){
			console.log('[Soundbot]', 'Disconnected from socket!');
		};
	}
	function loadEvents(){
		API.on({
			'chat':eventChat,
			'advance':eventAdvance,
			'waitListUpdate':eventWlUp,
			'userJoin':eventJoin,
			'userLeave':eventLeave,
			'chatCommand':eventCmd,
			'voteUpdate':eventVote,
			'grabUpdate':eventGrab,
			'modSkip':eventMod,
		});
	}
	function shutdown(){
		if(settings.hidden)return API.chatLog('Can\'t shutdown if hidden!', true);
		API.off({
			'chat':eventChat,
			'advance':eventAdvance,
			'waitListUpdate':eventWlUp,
			'userJoin':eventJoin,
			'userLeave':eventLeave,
			'chatCommand':eventCmd,
			'voteUpdate':eventVote,
			'grabUpdate':eventGrab,
			'modSkip':eventMod,
		});
		saveSettings();
	}
	function setupData(){
		for(var i = 0; i < u.length; i++){
			if(API.getUser().id===u[i].id)return;
			data[u[i].id] = {
				name: u[i].username,
				id: u[i].id,
				afkTime: Date.now(),
				afkWarn: false,
				afkFinal: false,
				cd: false,
				isAfk: false,
				afkMsg: 'I\'m away right now. Talk to me later!',
				lastDC: Date.now(),
				lastDCpos: 50,
				dis: false
			};
		}
	}
	function refreshUsers(){
		u = [];
		var a = API.getUsers();
		for(var i = 0; i < a.length; i++){
			for(var c = 0; c < u.length; c++){
				if(u[c].id !== a[i].id){
					u.pop(u[c]);
				}else{
					u.push(a[i]);
				}
			}
		}
	}
	services.refresh = setInterval(function(){refreshUsers();},Math.pow(2,refr)*1000);
	services.antiAfk = function(){
		refreshUsers();
		var a = API.getWaitList(),
		b = Date.now();
		for(var i in a){
			var c = data[a[i].id].afkTime,
			d = b - c,
			e = Math.floor((b - c) / 50000);
			if(d>settings.aaI&&!data[a[i].id].afkWarn&&!data[a[i].id].afkFinal){
				API.sendChat('@'+a[i].username+' you\'ve been AFK for '+e+' minutes. Chat soon or I will remove you.');
				data[a[i].id].afkWarn = true;
				setTimeout(function(){
					for(var x in a){
						if(data[a[x].id].afkWarn&&!data[a[x].id].afkFinal){
							API.sendChat('@'+a[x].username+' last warning (AFK).');
							data[a[x].id].afkFinal = true;
							setTimeout(function(){
								for(var j in a){
									if(data[a[j].id].afkWarn&&data[a[j].id].afkFinal){
										API.moderateRemoveDJ(a[j].id);
										data[a[j].id].afkWarn = false;
										data[a[j].id].afkFinal = false;
										data[a[j].id].afkTime = Date.now();
									}
								}
							}, 120000);
						}
					}
				}, 120000);
			}
		}
	};
	services.motd = function(a){
		if(settings.motd){
			API.sendChat('/em '+motdMsg[Math.floor(Math.random()*motdMsg.length)]);
		}
	};
	function goWhenSpot(){
		API.once(API.WAIT_LIST_UPDATE, function(){
			return true;
		});
	}
	function dclookup(a){
		refreshUsers();
		var b = API.getUser(a);
		if(typeof b === 'boolean')return API.sendChat('/em ['+b.username+'] [!dc] wut.');
		var c = b.username;
		if(data[b.id].lastDC === null)return API.sendChat('/em ['+b.username+'] [!dc] Your lastDC is null!');
		var d = data[b.id].lastDC;
		var e = data[b.id].lastDCpos;
		if(e===null)return null;
		var f = Date.now()-d;
		var valid = false;
	    if(settings.maxDC*60*1000>f){
	      valid=true;
	    }else{
	      valid=false;
	    }
	    if(!valid)API.sendChat('/em ['+b.username+'] [!dc] Invalid DC!');
		if(valid && API.getWaitList().length < 50){
			API.sendChat('/em ['+b.username+'] [!dc] You should be at pos '+data[a.id].lastDCpos+'.');
			API.moderateAddDJ(b.id);
			API.moderateMoveDJ(b.id, data[a.id].lastDCpos);
		}else if(valid && API.getWaitList().length >= 50){
			API.sendChat('/em ['+b.username+'] [!dc] You should be at pos '+data[a.id].lastDCpos+'. Queue: '+settings.gqueue.length+' users being added.');
			var h;
			goWhenSpot()?h=true:h=false;
			while(h){
				API.moderateAddDJ(b.id);
				API.moderateMoveDJ(b.id, data[a.id].lastDCpos);
				h = false;
			}
			return true;
		}
	}

	//events

	function eventChat(a){
		refreshUsers();
		if(a.message.substr(0,1).indexOf('!') !=-1){
			var cmd = a.message.substr(1).split(' ')[0].toLowerCase();
			var chatData = {message:a.message,un:a.un,uid:a.uid,type:a.type,cmd:cmd,role:a.role},
			msg='/em ['+a.un+'] [!'+cmd+'] Unknown command.';
			if(API.getUser(a.uid).role===2){
				if(settings.bouncerPlus){
					if(cmds.bplus[cmd]){
						cmds.bplus[cmd](chatData);
					}
				}
				if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
				}else if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
				}
			}
			if(API.getUser(a.uid).role > 2 && API.getUser(a.uid).role < 5){
				if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
				}else if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
				}else if(cmds.manager[cmd]){
					cmds.manager[cmd](chatData);
				}else if(cmds.bplus[cmd]){
					cmds.bplus[cmd](chatData);
				}
			}
			if(API.getUser(a.uid).role===5){
				if(cmds.host[cmd]){
					cmds.host[cmd](chatData);
				}else if(cmds.manager[cmd]){
					cmds.manager[cmd](chatData);
				}else if(cmds.bplus[cmd]){
					cmds.bplus[cmd](chatData);
				}else if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
				}else if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
				}
			}
			if(settings.userCmds&&!data[a.uid].cd&&API.getUser(a.uid).role<2)cmds.users[cmd]?cmds.users[cmd](chatData):API.sendChat(msg);
			if(settings.cd){
				var _;
				if(settings.cdTime<0)_ = 99999999999;
				else _ = settings.cdTime;
				if(API.getUser(a.uid).role<2){
					data[a.uid].cd = true;
					setTimeout(function(){
						data[a.uid].cd = false;
					}, _);
				}
			}
			API.moderateDeleteChat(a.cid);
		}
		if(a.message.substr(0,2).indexOf('!!') !=-1)return API.sendChat('@'+a.un+' you put !! instead of !');
		/*if(settings.chatFil){
			var bank = ['give points', 'points pls', 'givememypoint', 'points4free', 'canihaspoint', 'canihavepoint', 'givemepoint', 'mypoint', 'friend', 'friend4friend', 'fan4fan', 'fan', 'fan me', 'fanz', 'fan', 'friend', 'friendz pls', 'friends plz', 'give me my friend', 'be my friend', 'xp please', 'xp plz', 'xp pls', 'give me avatar', 'canihasavatar'];
			var str = a.message.toLowerCase();
			for(var i = 0; i < bank.length; i++)if(bank[i] === str)API.sendChat('@'+a.un+' please do not beg!');
			var e = /(\bhttps?:\/\/(www.)?plug\.dj[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/g;
			if(str.match(e))API.moderateDeleteChat(a.cid);return API.sendChat('@'+a.un+' please do not send that!');
		}*/
		//{
			function afkchat(){
				var rcon = {},re=2;
				rcon.tryC = setTimeout(function(){
					try{
						for(var i in u){
							if(a.message.indexOf('@'+u[i].username) && u[i].id !== a.uid){
								var uid = u[i].id;
								if(data[uid].isAfk){
									API.sendChat('[AFK Message] @'+a.un+', '+data[uid].afkMsg);
								}
							}
							if(a.uid === u[i].id){
								var diu = u[i].id;
								data[diu].isAfk = false;
								data[diu].afkMsg = 'I\'m away right now. Talk to me later!';
							}
						}
					}catch(e){
                				re++;
                				afkchat();
						throw new Error(e);
					}
				}, Math.pow(2,re)*1000);
			}
			afkchat();
		//}
		var id = a.uid;
		if(data[id].afkWarn)data[id].afkWarn = false;data[id].afkTime = Date.now();
		if(data[id].afkFinal)data[id].afkFinal = false;data[id].afkTime = Date.now();
		if(bouncerList.enabled){
			for(var i in bouncerList.users){
				if(a.message.substr(1).toLowerCase() === 'promote' && API.getUser(a.uid).role < 1 && a.un === bouncerList.users[i]){
					API.sendChat('/em [Promoting '+a.un+']');
					API.moderateSetRole(a.uid, API.ROLE.BOUNCER);
				}
				if(a.message.substr(1).toLowerCase() === 'demote' && API.getUser(a.uid).role === 2 && a.un === bouncerList.users[i]){
					API.sendChat('/em [Demoting '+a.un+' so they can afk]');
					API.moderateSetRole(a.uid, API.ROLE.NONE);
				}
			}
		}
	}
	function eventAdvance(a){
		if(settings.autowoot)$('#woot').click();
		if(settings.advStat){
			API.sendChat('/em '+a.lastPlay.media.author+' - '+a.lastPlay.media.title+' received '+a.lastPlay.score.positive+' woots, '+a.lastPlay.score.negative+' mehs, and '+a.lastPlay.score.grabs+' grabs!');
		}
		if(settings.blackEnabled){
			var b = a.media.title;
			for(var i = 0; i < blacklist.length; i++){
				if(blacklist[i] === b){
					API.sendChat('@'+API.getDJ().username+' that song is blacklisted. Please pick another one.');
					settings.gqueue.push(API.getDJ().id);
					API.moderateLockWaitList(true, false);
					API.moderateForceSkip();
				}
			}
		}
		if(settings.opEnabled){
			var b = a.media.title;
			for(var i = 0; i < oplist.length; i++){
				if(oplist[i].indexOf(b)){
					API.sendChat('@'+API.getDJ().username+' that song is overplayed. Please pick another one.');
					settings.gqueue.push(API.getDJ().id);
					API.moderateLockWaitList(true, false);
					API.moderateForceSkip();
				}
			}
		}
		if(settings.songChk){
			if(API.getTimeRemaining() > Math.floor(settings.songLim*60)){
				API.sendChat('@'+API.getDJ().username+' that song is over the limit (10min)');
				settings.gqueue.push(API.getDJ().id);
				API.moderateLockWaitList(true, false);
			}
		}
		if(settings.queue){
			//advance queue
			if(settings.gqueue.length===0)return;
			else if(API.getWaitList().length <= 49){
				API.moderateAddDJ(settings.gqueue[1]);
				API.moderateMoveDJ(settings.gqueue[1], 4);
				settings.gqueue.pop(settings.gqueue[1]);
				for(var i = 0; i < settings.gqueue.length; i++){
					if(settings.gqueue.length > 0&&API.getWaitList().length <= 49){
						var b = settings.gqueue[i];
						if(API.getWaitList().length <= 49){
							API.moderateAddDJ(b);
							API.moderateMoveDJ(b, 4);
							break;
						}
					}
				}
				API.moderateLockWaitList(false);
			}
		}
		if(settings.removeStaffBecauseTheyWereADickEnabled&&settings.activeP){
			var b = settings.removeStaffBecauseTheyWereADick;
			API.sendChat('@'+b+' wow such disappoint.');
			for(var i in u){
				if(u[i].username === b && u[i].role === 2){
					API.moderateSetRole(u[i].id, NONE);
					setTimeout(function(){
						API.sendChat('Just kidding. Here\'s your rank :p');
						API.moderateSetRole(u[i].id, BOUNCER);
					},1000);
				}
			}
		}
		if(settings.dcLookUp){
			var wl = API.getWaitList();
			for(var i = 0; i < wl.length; i++){
				data[wl[i].id].lastDC = Date.now();
				data[wl[i].id].lastDCpos = API.getWaitListPosition(wl[i].id);
				break;
			}
		}
	}
	function eventWlUp(a){
		if(settings.queue){
			if(settings.gqueue.length >= 1){
				API.moderateAddDJ(settings.gqueue[1]);
				API.moderateMoveDJ(settings.gqueue[1], 5);
				settings.gqueue.pop(settings.gqueue[1]);
				for(var i = 0; i < settings.gqueue.length; i++){
					if(settings.gqueue.length > 0&&API.getWaitList().length <= 49){
						var b =  settings.gqueue[i];
						if(API.getWaitList().length <= 49){
							API.moderateAddDJ(b);
							API.moderateMoveDJ(b, API.getTimeRemaining()>10?5:4);
						}
					}
				}
			}
		}
	}
	function eventJoin(a){
		u.push(API.getUser(a.id));
		for(var i = 0; i < data.length; i++){
			if(data[i].id === a.id){
				data[i].dis = false;
				return true;
			}
		}
		if(API.getUser().id===a.id)return;
		data[a.id] = {
			name: a.username,
			id: a.id,
			afkTime: Date.now(),
			afkWarn: false,
			afkFinal: false,
			cd: false,
			isAfk: false,
			afkMsg: 'I\'m away right now. Talk to me later!',
			lastDC: null,
			lastDCpos: null,
			dis: false
		};
	}
	function eventLeave(a){
		for(var i in u){
			if(u[i].id === a.id){
				u.pop(a.id);
			}
		}
		if(API.getUser().id===a.id)return;
		data[a.id].dis = true;
		data[a.id].lastDC = Date.now();
		setTimeout(function(){
			for(var i = 0; i < data.length; i++){
				if(data[i].dis === true && data[i].id === a.id){
					delete data[i];
				}
			}
		}, settings.maxDisc);
	}
	function eventCmd(a){
		var cmd = a.trim().substr(1).split(' ')[0].toLowerCase();
		switch(cmd){
			case 'set':
			if(a.trim().substr(1).split(' ')[1] === undefined)return API.chatLog('Available arguments: woot, stats, blacklist, hist, usercmds, filter, cd, queue, update, motd, afk', true);
			var arg = a.trim().split(' ')[1].toLowerCase();
			var str = '';
				switch(arg){
					case 'woot':
						settings.autowoot = !settings.autowoot;
						settings.autowoot?str+='on':str+='off';
						API.chatLog('Autowoot now '+str);
						break;
					case 'stats':
						settings.stats = !settings.stats;
						settings.stats?str+='on':str+='off';
						API.chatLog('Stats now '+str);
						break;
					case 'blacklist':
						settings.blackEnabled = !settings.blackEnabled;
						settings.blackEnabled?str+='on':str+='off';
						API.chatLog('Blacklist now '+str);
						break;
					case 'op':
						settings.opEnabled = !settings.opEnabled;
						settings.opEnabled?str+='on':str+='off';
						API.chatLog('OP Check now '+str);
						break;
					case 'hist':
						settings.histSkp = !settings.histSkp;
						settings.histSkip?str+='on':str+='off';
						API.chatLog('History skip now '+settings.histSkp?'on':'off');
						break;
					case 'usercmds':
						settings.userCmds = !settings.userCmds;
						settings.userCmds?str+='on':str+='off';
						API.chatLog('User Commands now '+str);
						break;
					case 'filter':
						settings.chatFil = !settings.chatFil;
						settings.chatFil?str+='on':str+='off';
						API.chatLog('Chat Filter now '+str);
						break;
					case 'cd':
						settings.cd = !settings.cd;
						settings.cd?str+='on':str+='off';
						API.chatLog('Cooldown now '+str);
						break;
					case 'queue':
						settings.queue = !settings.queue;
						settings.queue?str+='on':str+='off';
						API.chatLog('Queue now '+str);
						break;
					case 'update':
						if(a.trim().substr(1).split(' ')[2] === undefined)return API.chatLog('Available arguments: toggle, check, use');
						var opt = a.trim().substr(1).split(' ')[2].toLowerCase();
						switch(opt){
							case 'toggle':
								settings.chkUpdate = !settings.chkUpdate;
								settings.chkUpdate?str+='on':str+='off';
								API.chatLog('Update check now '+str);
								break;
							case 'check':
								$.ajax({
									cache:false,
									url:'http://astroshock.bl.ee/_/update.json?callback=_msg',
									dataType:'json',
									success:function(a){
										if(parseInt(version)<parseInt(a.version)){
											settings.pendingUp = true;
											API.chatLog('An update is available!', true);
										}
									},
									error:function(){
										API.chatLog('Couldn\'t get the json.');
									}
								});
								break;
							case 'use':
								if(settings.pendingUp){
									shutdown();
									API.sendChat('/em [Local] [/use] Updating...');
									setTimeout(function(){
										$.getScript('https://raw.githubusercontent.com/FourBitus/Sound/master/bot.js');
									}, 1000);
								}
								break;
						}
						break;
					case 'motd':
						if(a.trim().substr(1).split(' ')[2] === undefined)return API.chatLog('Available arguments: toggle, interval');
						var opt = a.trim().substr(1).split(' ')[2].toLowerCase();
						switch(opt){
							case 'toggle':
								settings.motd = !settings.motd;
								settings.motd?str+='on':str+='off';
								API.chatLog('Motd now '+str);
								break;
							case 'interval':
								var extra = a.message.split(' ')[3].toLowerCase();
								if(!extra)return API.chatLog('Please give a MILLISECONDS answer.', true);
								settings.mI = parseInt(extra);
								break;

						}
					break;
					case 'afk':
						if(a.trim().substr(1).split(' ')[2] === undefined)return API.chatLog('Available arguments: toggle, interval');
						var opt = a.trim().substr(1).split(' ')[2].toLowerCase();
						switch(opt){
							case 'toggle':
								settings.antiAfk = !settings.antiAfk;
								settings.antiAfk?str+='on':str+='off';
								API.chatLog('AntiAFK now '+str);
								break;
							case 'interval':
								var xtra = a.message.split(' ')[3].toLowerCase();
								if(!xtra)return API.chatLog('Please give a MILLISECONDS answer.', true);
								settings.aaI = parseInt(extra);
								break;
						}
						break;
					case 'songchk':
						settings.songChk = !settings.songChk;
						settings.songChk?str+='on':str+='off';
						API.chatLog('Song Check now '+str);
						break;
					default:
						return API.chatLog('Available arguments: woot, stats, blacklist, hist, usercmds, filter, cd, queue, update, motd, afk', true);
				}
				break;
			case 'shutdown':
				API.sendChat('/em [Local] [/shutdown] Shutting down...');
				shutdown();
				break;
			case 'reload':
				API.sendChat('/em [Local] [/reload] Reloading...');
				shutdown();
				window.location.reload();
				setTImeout(function(){
					$.getScript('https://raw.githubusercontent.com/FourBitus/Sound/master/bot.js');
				}, 5000);
				break;
			case 'commands':
			case 'help':
				API.chatLog('Local commands: set [argument] ~ shutdown ~ reload ~ commands | help ~ lol ~ hide', true);
				break;
			case 'lol':
				API.sendChat('!lolomgwtfbbq');
				break;
			/*case 'hide':
				if(!settings.hidden){
					settings.hidden = true;
					API.sendChat('/em [Local] [/hide] Now hidden!');
					shutdown();
					API.on(API.CHAT_COMMAND, eventCmd);
				}else{
					settings.hidden = false;
					API.sendChat('/em [Local] [/hide] no longer hidden!');
					API.off(API.CHAT_COMMAND, eventCmd);
					startup();
				}
				break;*/
			case 'save':
				saveSettings();
				break;
		}
		str = '';
	}
	function eventVote(a){
		if(settings.activeP){
			if(API.getMedia().author==='FourBit'&&API.getDJ().username==='FourBit'){
				if(a.vote === 1){
					API.sendChat('@'+a.username+' thanks for wooting!');
				}
			}
		}
	}
	function eventGrab(a){
		if(settings.activeP){
			if(API.getMedia().author==='FourBit'&&API.getDJ().username==='FourBit'){
				if(a.vote === 1){
					API.sendChat('@'+a.username+' wow! Thanks for grabbing. Really appreciate it. Here\'s a gift. <3 http://i.imgur.com/FxPmtH9.gif');
				}
			}
		}
	}
	function eventMod(a){
		if(settings.activeP){
			API.sendChat('@'+a+' thou shall not skip songs on parties.');
			settings.removeStaffBecauseTheyWereADick = a;
			settings.removeStaffBecauseTheyWereADickEnabled = true;
		}
	}
	function lockdownChat(z){
		if(API.getUser(z.uid).role===0){
			API.moderateDeleteChat(z.cid);
		}
	}

	//cmds

	cmds.users.help = function(a){
		API.sendChat('/em ['+a.un+'] [!help] Commands: http://astroshock.bl.ee/soundbot');
	};
	cmds.users.dc = function(a){
		dclookup(a.uid);
	};
	cmds.users.theme = function(a){
		API.sendChat('/em ['+a.un+'] [!theme] The theme is Electronic Dance Music (EDM)');
	};
	cmds.users.emoji = function(a){
		API.sendChat('/em ['+a.un+'] [!emoji] http://emoji-cheat-sheet.com');
	};
	cmds.users.adblock = function(a){
		API.sendChat('/em ['+a.un+'] [!adblock] http://getadblock.com');
	};
	cmds.users.support = function(a){
		API.sendChat('/em ['+a.un+'] [!support] http://support.plug.dj/');
	};
	cmds.users.tech = function(a){
		API.sendChat('/em ['+a.un+'] [!tech] http://tech.plug.dj');
	};
	cmds.users.blog = function(a){
		API.sendChat('/em ['+a.un+'] [!blog] http://blog.plug.dj');
	};
	cmds.users.song = function(a){
		API.sendChat('/em ['+a.un+'] [!song] '+API.getMedia().author+' - '+API.getMedia().title);
	};
	cmds.users.pic = function(a){
		if(API.getMedia().format === 1){
			API.sendChat('/em ['+a.un+'] [!pic] http://i.ytimg.com/vi/'+API.getMedia().cid+'/maxresdefault.jpg');
		}else{
			SC.get('/tracks/'+API.getMedia().cid, function(b){
				var link = b.artwork_url;
				API.sendChat('/em ['+a.un+'] [!pic] '+link);
			});
		}
	};
	cmds.users.link = function(a){
		if(API.getMedia().format === 1){
			API.sendChat('/em ['+a.un+'] [!link] http://youtube.com/watch?v='+API.getMedia().cid+'#t='+API.getTimeElapsed());
		}else{
			SC.get('/tracks/'+API.getMedia().cid, function(b){
				API.sendChat('/em ['+a.un+'] [!link] '+b.permalink_url);
			});
		}
	};
	cmds.users.cookie = function(a){
		if(a.message.split('@')[1].substr(1)){
			var opt = a.message.split('@')[1].substr(1);
			for(var i in u){
				if(u[i].username === opt){
					API.sendChat('@'+u[i].username+', '+a.un+' gives you '+cookies[Math.floor(Math.random()*cookies.length)]+'.'+outcome[Math.floor(Math.random()*outcome.length)]);
				}
				if(u[i].username !== opt){
					API.sendChat('/em ['+a.un+'] [!cookie] I couldn\'t find that user in the room, so I\'ll just eat it myself! Nom nom nom...');
				}
			}
		}
	};
	cmds.users.acronym = function(a){
		var letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
		arg = a.message.split(' ')[1].substr(1),
		b=parseInt(arg);
		if(b>10)b=10;
		if(b<3)b=3;
		var str = '',end=true;
    	while(end){
    		if(str.length <= b){
    			str+=letters[Math.floor(Math.random()*letters.length)];
   			}else{
   				end = false;
   			}
    	}
		API.sendChat('/em ['+a.un+'] [!acronym] Make a word with these letters: '+str.toUpperCase());
	};
	cmds.users.rdj = function(a){
		API.sendChat('/em ['+a.un+'] [!rdj] To get Resident DJ you must be a producer or play music most people like.');
	};
	cmds.users.community = function(a){
		API.sendChat('/em ['+a.un+'] [!community] To make a community: you must be level 3+. Go to your profile -> "My Communities" -> "Create Community"');
	};
	cmds.users.web = function(a){
		API.sendChat('/em ['+a.un+'] [!web] FourBit got really tired of hostinger, so let\'s just wait and see if anything changes... That was awkward.');
	};
	cmds.users.pastebin = function(a){
		API.sendChat('/em ['+a.un+'] [!pastebin] FourBit\'s pastebin: http://pastebin.com/u/AstroShock');
	};
	cmds.users.afk = function(a){
		if(a.message.split(' ')[1] === undefined){
			if(!data[a.uid].isAfk){
				data[a.uid].isAfk = true;
				API.sendChat('/em ['+a.un+'] [!afk] AFK message set! It will be disabled next time you chat.');
			}else{
				data[a.uid].isAfk = false;
				API.sendChat('/em ['+a.un+'] [!afk] Disabled afk message.');
			}
		}else{
			if(!data[a.uid].isAfk){
				data[a.uid].isAfk = true;
				data[a.uid].afkMsg = a.message.split(' ')[1].substr(1);
				API.sendChat('/em ['+a.un+'] [!afk] AFK message set! It will be disabled next time you chat.');
			}else{
				data[a.uid].isAfk = false;
				API.sendChat('/em ['+a.un+'] [!afk] Disabled afk message.');
			}
		}
	};
	cmds.users.ask = function(a){
		API.sendChat('/em ['+a.un+'] [!ask] '+questions[Math.floor(Math.random()*questions.length)]);
	};
	cmds.staff.unlock = function(a){
		API.sendChat('/em ['+a.un+'] [!unlock] Unlocking the waitlist.');
		API.moderateLockWaitList(false);
	};
	cmds.staff.lock = function(a){
		API.sendChat('/em ['+a.un+'] [!lock] Locking the waitlist.');
		API.moderateLockWaitList(true, false);
	};
	cmds.staff.lockskip = function(a){
		if(a.message.split(' ')[1] === undefined){
			API.moderateLockWaitList(true, false);
			if($('.cycle-toggle').hasClass('disabled')&&!rule){
				$(this).click();
			}
			API.sendChat('/em ['+a.un+' lockskipped the current song]');
			setTimeout(function(){},1000);
			API.moderateForceSkip();
			if($('.cycle-toggle').hasClass('enabled')&&!rule){
				$(this).click();
			}
			return true;
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'op'){
			API.moderateLockWaitList(true, false);
			if($('.cycle-toggle').hasClass('disabled')&&!rule){
				$(this).click();
			}
			API.sendChat('/em ['+a.un+' lockskipped the current song]');
			setTimeout(function(){},500);
			API.sendChat('@'+API.getDJ().username+' that song is overplayed. Please pick a new one.');
			setTimeout(function(){},500);
			API.moderateForceSkip();
			if($('.cycle-toggle').hasClass('enabled')&&!rule){
				$(this).click();
			}
			return true;
		}
		if(arg === 'hist'){
			API.moderateLockWaitList(true, false);
			if($('.cycle-toggle').hasClass('disabled')&&!rule){
				$(this).click();
			}
			API.sendChat('/em ['+a.un+' lockskipped the current song]');
			setTimeout(function(){},1000);
			API.sendChat('@'+API.getDJ().username+' that song is on the history. Please pick a new one.');
			API.moderateForceSkip();
			if($('.cycle-toggle').hasClass('enabled')&&!rule){
				$(this).click();
			}
			return true;
		}
	};
	cmds.staff.skip = function(a){
		API.sendChat('/em ['+a.un+' skipped the current song]');
		API.moderateForceSkip();
	};
	cmds.staff.queue = function(a){
		if(settings.gqueue.length>0){
			API.sendChat('/em ['+a.un+'] [!queue] There are '+settings.gqueue.length+' users in the queue: '+settings.gqueue.join(', '));
		}
		if(settings.gqueue.length<=0){
			API.sendChat('/em ['+a.un+'] [!queue] No users in the queue!');
		}
	};
	cmds.staff.status = function(a){
		API.sendChat('/em ['+a.un+'] [!status] Stats: '+settings.advStat+', party: '+settings.activeP+', user commands: '+settings.userCmds+', lockdown: '+settings.lockdown);
	};
	cmds.staff.lockdown = function(a){
		if(!settings.lockdown){
			settings.lockdown = true;
			API.sendChat('/em ['+a.un+' enabled lockdown]');
			API.on(API.CHAT, lockdownChat);
			return true;
		}
		if(settings.lockdown){
			settings.lockdown = false;
			API.sendChat('/em ['+a.un+' disabled lockdown]');
			API.off(API.CHAT, lockdownChat);
			return true;
		}
	};
	cmds.staff.stats = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!stats] Stats: '+(settings.advStat?'on':'off'));
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg==='on'||arg==='off'){
			settings.advStat=!settings.advStat;
			saveSettings();
			API.sendChat('/em ['+a.un+' '+(settings.advStat?'enabled':'disabled')+' stats]');
		}
	};
	cmds.staff.add = function(a){
		var opt;
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!add] Please specify a user and position!');
		}
		if(a.message.split(' ')[1] === undefined || typeof parseInt(a.message.split(' ')[1]) === 'number'){
			return API.sendChat('/em ['+a.un+'] [!add] Please specify a user!');
		}
		if(a.message.split(' ')[2] === undefined){
			opt = API.getWaitList().length.toString();
		}else{
			opt = a.message.split(' ')[2];
		}
		var arg = a.message.split(' ')[1].substr(1);
		var pos = parseInt(opt);
		if(pos>50)pos=50;
		if(pos<1)pos=1;
		API.moderateLockWaitList(true, false);
		for(var i in u){
			if(u[i].username === arg && API.getWaitListPosition(u[i].id) === -1){
				if(API.getWaitList().length >= 50){
					if(settings.queue){
						settings.gqueue.push(u[i].id);
						var b = goWhenSpot();
						API.sendChat('/em ['+a.un+'] [!add] Adding '+u[i].username+' to the waitlist. Users in queue: '+settings.gqueue.length);
						while(b){
							API.moderateAddDJ(u[i].id);
							API.moderateMoveDJ(u[i].id, pos);
							API.moderateLockWaitList(false);
							b = false;
						}
					}
				}else{
					API.sendChat('/em ['+a.un+'] [!add] Adding '+u[i].username+' to the waitlist.');
					API.moderateAddDJ(u[i].id);
					API.moderateMoveDJ(u[i].id, pos);
				}
			}
		}
	};
	cmds.staff.ban = function(a){
		var dur;
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!ban] Please specify a user!');
		}
		if(a.message.split(' ')[2] === undefined){
			var arg = a.message.split(' ')[1].substr(1);
			dur = 1;
			for(var i in u){
				if(u[i].username === arg && u[i].role < 1){
					API.sendChat('/em ['+a.un+' used ban]');
					switch(dur){
						case 1:dur=API.BAN.HOUR;break;
					}
					API.moderateBanUser(u[i].id, 1, dur);
				}
			}
			return true;
		}
		var arg = a.message.split(' ')[1].substr(1);
		var opt = a.message.split(' ')[2];
		for(var i in u){
			if(u[i].username === arg && u[i].role < 1){
				API.sendChat('/em ['+a.un+' used ban]');
				if(typeof parseInt(opt) !== 'number'){
					switch(opt.toLowerCase()){
						case 'hour':dur=1;break;
						case 'day':dur=2;break;
						case 'perma':dur=3;break;
						case 'perm':dur=3;break;
					}
				}else dur = parseInt(opt);
				switch(dur){
					case 1:dur=API.BAN.HOUR;break;
					case 2:dur=API.BAN.DAY;break;
					case 3:dur=API.BAN.PERMA;break;
				}
				API.moderateBanUser(u[i].id, 1, dur);
			}
		}
	};
	cmds.staff.kick = function(a){
		var dur;
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!kick] Please specify a user.');
		}
		if(a.message.split(' ')[2] === undefined){
			dur = 1;
		}
		var user = a.message.split(' ')[1].substr(1);
		var time = a.message.split(' ')[2];
		if(typeof parseInt(time) === 'number'){
			dur = parseInt(time);
		}
		for(var i in u){
			if(u[i].username === user){
				if(u[i].role < 1){
					API.sendChat('@'+u[i].username+' you are being kicked for '+dur+' minutes. Any last words?');
					setTimeout(function(){
						API.sendChat('/em ['+a.un+' used kick]');
						API.moderateBanUser(u[i].id, 0, -1);
						setTimeout(function(){
							API.moderateUnbanUser(u[i].id);
						}, Math.floor(dur*1000));
					}, 1500);
				}
			}
		}
	};
	cmds.staff.remove = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!remove] Please specify a user!');
		}
		var arg = a.message.split(' ')[1].substr(1);
		for(var i in u){
			if(u[i].username === arg){
				API.sendChat('/em ['+a.un+' used remove]');
				API.moderateRemoveDJ(u[i].id);
			}
		}
	};
	cmds.staff.ping = function(a){
		API.sendChat('/em ['+a.un+'] [!ping] Pong!');
	};
	cmds.staff.move = function(a){
		if(a.message.split(' ')[1] === undefined || a.message.split(' ')[2] === undefined || a.message.split(' ')[1] === undefined && a.message.split(' ')[2] === undefined){
			return API.sendChat('/em ['+a.un+'] [!move] Please specify a user / position');
		}
		var arg = a.message.split(' ')[1].substr(1);
		var opt = a.message.split(' ')[2];
		for(var i in u){
			if(u[i].username === arg){
				if(typeof parseInt(opt) !== 'number'){
					return API.sendChat('/em ['+a.un+'] [!move] You need to specify a position in numbers.');
				}
				var pos = parseInt(pos);
				if(pos>50)pos=50;
				else if(pos<1)pos=1;
				if(API.getWaitListPosition(u[i].id) === -1){
					return API.sendChat('/em ['+a.un+'] [!move] User is not in the waitlsit!');
				}
				API.sendChat('/em ['+a.un+' used move]');
				API.moderateMoveDJ(u[i].id, pos);
			}
		}
	};
	cmds.bplus.levelup = function(a){
		var cdd;
		if(cdd)return;
		API.sendChat('/em ['+a.un+' leveled up]');
		cdd=true;
		var b = Math.floor(settings.cdTime / 1000),
		c = Math.floor(b+10)*1000;
		setTimeout(function(){
			cdd=false;
		},c);
	};
	cmds.bplus.hist = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+ '] [!hist] Enabled: '+settings.histSkp);
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.histSkip){
				settings.histSkp = true;
				API.sendChat('/em ['+a.un+' enabled history skip]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!hist] Historyskip is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.histSkp){
				settings.histSkp = false;
				API.sendChat('/em ['+a.un+' disabled history skip]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!hist] Historyskip is already disabled!');
			}
		}
	};
	cmds.bplus.op = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!op] Enabled: '+settings.opEnabled);
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.opEnabled){
				settings.opEnabled = true;
				API.sendChat('/em ['+a.un+' enabled opcheck]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!op] opcheck is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.opEnabled){
				settings.opEnabled = false;
				API.sendChat('/em ['+a.un+' disabled opcheck]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!op] opcheck is already disabled!');
			}
		}
	};
	cmds.manager.save = function(a){
		saveSettings();
		API.sendChat('/em ['+a.un+'] [!save] Saved!');
	};
	cmds.bplus.cycle = function(a){
		API.sendChat('/em ['+a.un+' toggled the dj cycle]');
		$('.cycle-toggle').click();
	};
	cmds.manager.reload = function(a){
		API.sendChat('/em ['+a.un+'] [!reload] Reloading...');
		shutdown();
		setTimeout(function(){
			$.getScript('https://raw.githubusercontent.com/FourBitus/Sound/master/bot.js');
		}, 1000);
	};
	cmds.manager.kill = function(a){
		API.sendChat('/em ['+a.un+'] [!kill] Shutdown.');
		shutdown();
	};
	cmds.bplus.deleteimgs = function(a){
		var msg = $('#chat-messages').children('[data-cid="'+a.cid+'"]');
		var b = msg.find('.text'),
		c = b.text().split(' ');
		API.sendChat('/em ['+a.un+' used delete images]');
		for(var i = 0; i < c.length; i++){
	    		if(/.(png|jpg)/i.test(c[i])&&/^https?:\/\//.test(c[i])&&API.getUser(a.uid).role<3){
	    			API.moderateDeleteChat(a.cid);
	    			break;
	    		}
	    	}
	};
	cmds.bplus.deletegifs = function(a){
		var msg = $('#chat-messages').children('[data-cid="'+a.cid+'"]');
		var b = msg.find('.text'),
		c = b.text().split(' ');
		API.sendChat('/em ['+a.un+' used delete gifs]');
		for(var i = 0; i < c.length; i++){
	    		if(/.(gif)/i.test(c[i])&&/^https?:\/\//.test(c[i])&&API.getUser(a.uid).role<3){
	    			API.moderateDeleteChat(a.cid);
	    			break;
	    		}
	    	}
	};
	cmds.bplus.deleteall = function(a){
		var msg = $('#chat-messages').children('[data-cid="'+a.cid+'"]');
		var b = msg.find('.text'),
		c = b.text().split(' ');
		API.sendChat('/em ['+a.un+' deleted all images]');
		for(var i = 0; i < c.length; i++){
	    		if(/.(png|jpg|gif)/i.test(c[i])&&/^https?:\/\//.test(c[i])&&API.getUser(a.uid).role<3){
	    			API.moderateDeleteChat(a.cid);
	    			break;
	    		}
	    	}
	};
	cmds.manager.motd = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!motd] Enabled: '+settings.motd+', interval: '+Math.floor(settings.mI/1000));
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.motd){
				settings.motd = true;
				API.sendChat('/em ['+a.un+' enabled motd]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!motd] Motd is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.motd){
				settings.motd = false;
				API.sendChat('/em ['+a.un+' disabled motd]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!motd] Motd is already disabled!');
			}
		}
		if(arg === 'int'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!motd] Motd Interval: '+Math.floor(settings.mI/1000)+' seconds.');
			}
			var opt = a.message.split(' ')[2];
			if(typeof parseInt(opt) !== 'number'){
				return API.sendChat('/em ['+a.un+'] [!motd] Please specify a number in seconds');
			}
			time = parseInt(opt);
			settings.mI = Math.floor(time*1000);
			API.sendChat('/em ['+a.un+' set the motd interval to '+time+' seconds]');
			saveSettings();
		}
		if(arg === 'msg'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!motd] Messages: '+motdMsg.join(', '));
			}
			var opt = a.message.split(' ')[2].toLowerCase();
			if(typeof parseInt(opt) === 'number')return;
			if(typeof opt === 'boolean')return;
			motdMsg.push(opt);
			saveSettings();
		}
	};
	cmds.manager.roulette = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!roulette] Enabled: '+settings.activeR);
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.activeR){
				settings.activeR = true;
				API.sendChat('/em ['+a.un+' enabled roulette]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!roulette] Roulette is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.activeR){
				settings.activeR = false;
				API.sendChat('/em ['+a.un+' disabled roulette]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!roulette] Roulette is already disabled!');
			}
		}
	};
	cmds.manager.commands = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!commands] '+Object.keys(cmds.users).join(', '));
		}
		if(a.message.split(' ')[1].toLowerCase() === 'manager'){
			API.sendChat('/em ['+a.un+'] [!commands] '+Object.keys(cmds.manager).join(', '));
		}
		if(a.message.split(' ')[1].toLowerCase() === 'staff'){
			API.sendChat('/em ['+a.un+'] [!commands] '+Object.keys(cmds.staff).join(', '));
		}
		if(a.message.split(' ')[1].toLowerCase() === 'host'){
			API.sendChat('/em ['+a.un+'] [!commands] '+Object.keys(cmds.host).join(', '));
		}
	};
	cmds.manager.antiafk = function(a){
		if(a.message.split(' ')[1] === undefined){
			var z = settings.antiAfk?'on':'off';
			var y = Math.floor(settings.aaI/1000);
			return API.sendChat('/em ['+a.un+'] [!antiafk] AntiAFK: '+z+', AFKLimit: '+y+' sec.');
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.antiAfk){
				settings.antiAfk = true;
				_services_afk;
				API.sendChat('/em ['+a.un+' enabled AntiAFK]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!antiafk] AntiAFK is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.antiAfk){
				settings.antiAfk = false;
				clearInterval(_services_afk);
				API.sendChat('/em ['+a.un+' disabled AntiAFK]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!antiafk] AntiAFK is already disabled!');
			}
		}
		if(arg === 'int'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!antiafk] Please specify an integer in seconds!');
			}
			var t = a.message.split(' ')[2];
			if(typeof parseInt(t) === 'number'){
				settings.aaI = Math.floor(parseInt(t)*1000);
				API.sendChat('/em ['+a.un+' set AntiAFK interval to '+t+' seconds]');
				saveSettings();
			}
		}
	};
	cmds.manager.cmdsettings = function(a){
		if(a.message.split(' ')[1] === undefined){
			var cd = settings.cd?'on':'off';
			var uc = settings.userCmds?'on':'off';
			return API.sendChat('/em ['+a.un+'] [!cmdsettings] Cooldown '+cd+', UserCmds: '+uc+'.');
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'cd'){
			if(a.message.split(' ')[2] === undefined){
				var z = settings.cd?'on':'off';
				return API.sendChat('/em ['+a.un+'] [!cmdsettings] Enabled: '+z+', time: '+settings.cdTime/1000);
			}
			var opt = a.message.split(' ')[2].toLowerCase();
			if(opt === 'on'){
				if(!settings.cd){
					settings.cd = true;
					API.sendChat('/em ['+a.un+' enabled command cooldown]');
					saveSettings();
				}else{
					API.sendChat('/em ['+a.un+'] [!cmdsettings] cooldown is already set!');
				}
			}
			if(opt === 'off'){
				if(settings.cd){
					settings.cd = false;
					API.sendChat('/em ['+a.un+' disabled cooldown]');
					saveSettings();
				}else{
					API.sendChat('/em ['+a.un+'] [!cmdsettings] cooldown is already disabled!');
				}
			}
			if(opt === 'int'){
				opt = a.message.split(' ')[3];
				if(typeof parseInt(opt) === 'number'){
					settings.cdTime = Math.floor(parseInt(opt)*1000);
					API.sendChat('/em ['+a.un+' set cooldown time to '+parseInt(opt)+' seconds]');
				}
			}
		}
		if(arg === 'users'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] Arguments (users): on, off');
			}
			var opt = a.message.split(' ')[2].toLowerCase();
			if(opt === 'on'){
				if(!settings.userCmds){
					settings.userCmds = true;
					API.sendChat('/em ['+a.un+' enabled user commands]');
					saveSettings();
				}else{
					API.sendChat('/em ['+a.un+'] [!cmdsettings] User commands are already enabled!');
				}
			}
			if(opt === 'off'){
				if(settings.userCmds){
					settings.userCmds = false;
					API.sendChat('/em ['+a.un+' disabled user commands]');
					saveSettings();
				}else{
					API.sendChat('/em ['+a.un+'] [!cmdsettings] User commands are already disabled!');
				}
			}
		}
	};
	cmds.manager.lolomgwtfbbq = function(a){
		if(API.getWaitList().length < 1){
			return API.sendChat('/em ['+a.un+'] [!lolomgwtfbbq] Looks like you\'re safe! There\'s no users in the waitlist.');
		}
		API.sendChat('/em ['+a.un+'] [!lolomgwtfbbq] What have you done...');
		setTimeout(function(){
			var b = API.getWaitList();
			for(var i = 0; i < b.length; i++){
				var c = API.getWaitListPosition(b[i].id);
				API.moderateMoveDJ(b[i].id, c);
				break;
			}
		}, 125);
	};
	cmds.manager.update = function(a){
		if(settings.pendingUp){
			API.sendChat('/em ['+a.un+'] [!update] Updating...');
			setTimeout(function(){
				shutdown();
				setTimeout(function(){
					$.getScript('https://raw.github.com/FourBitus/Sound/master/bot.js');
				}, 1000);
			}, 1000);
		}else{
			checkUpdate();
		}
	};
	cmds.manager.rule = function(a){
		rule = !rule;
		var str = rule?'enabled':'disabled';
		API.sendChat('/em ['+a.un+' '+str+' "the" rule]');
		return true;
	};
	cmds.manager.addbouncer = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!addbouncer] Please specify a user!');
		}
		var arg = a.message.split(' ')[1].substr(1);
		for(var i in bouncerList.users){
			if(bouncerList.users[i] === arg){
				return API.sendChat('/em ['+a.un+'] [!addbouncer] User is already on the list!');
			}else{
				bouncerList.users.push(arg);
				API.sendChat('/em ['+a.un+' added '+arg+' to the bouncer list]');
			}
			saveBouncers();
			return true;
		}
	};
	cmds.manager.removebouncer = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!addbouncer] Please specify a user!');
		}
		var arg = a.message.split(' ')[1].substr(1);
		for(var i in bouncerList.users){
			if(bouncerList.users[i] !== arg){
				return API.sendChat('/em ['+a.un+'] [!addbouncer] User is not on the list!');
			}else{
				bouncerList.users.pop(arg);
				API.sendChat('/em ['+a.un+' removed '+arg+' to the bouncer list]');
			}
			saveBouncers();
			return true;
		}
	};
	cmds.manager.data = function(a){
		API.sendChat('/em ['+a.un+'] [!data] '+Object.keys(data).join(', '));
	};
	cmds.manager.bouncer = function(a){
		API.sendChat('/em ['+a.un+'] [!bouncer] '+bouncerList.users.join(', '));
	};
	cmds.manager.filter = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!filter] Enabled: '+settings.chatFil);
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.chatFil){
				settings.chatFil = true;
				API.sendChat('/em ['+a.un+' enabled ChatFilter]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!filter] ChatFilter is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.chatFil){
				settings.chatFil = false;
				API.sendChat('/em ['+a.un+' disabled ChatFilter]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!filter] ChatFilter is already disabled!');
			}
		}
	};
	cmds.manager.me = function(a){
		API.sendChat('/em ['+a.un+'] [!me] Hello '+a.un+', you\'re aka '+a.uid+'. Your role is '+a.role+', and this chat type is '+a.type);
	};
	cmds.manager.bouncerplus = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!bouncerplus] Enabled: '+settings.bouncerPlus);
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on'){
			if(!settings.bouncerPlus){
				settings.bouncerPlus = true;
				API.sendChat('/em ['+a.un+' enabled Bouncer+]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+ '] [!bouncerplus] Bouncer+ is already enabled!');
			}
		}
		if(arg === 'off'){
			if(settings.bouncerPlus){
				settings.bouncerPlus = false;
				API.sendChat('/em ['+a.un+' disabled Bouncer+]');
				saveSettings();
			}else{
				API.sendChat('/em ['+a.un+'] [!bouncerplus] Bouncer+ is already disabled!');
			}
		}
	};
	cmds.manager.djsettings = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!djsettings] HistorySkip: '+(settings.histSkp?'on':'off')+', Blacklist: '+(settings.blackEnabed?'on':'off')+', TimeCheck: ['+(settings.songChk?'on':'off')+', Max: '+settings.songLim+']');
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'hist'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!djsettings] HistorySkip: '+(settings.histSkp?'on':'off'));
			}
			var opt = a.message.split(' ')[2].toLowerCase(),
			er = '/em ['+a.un+'] [!djsettings] HistorySkip is alerady '+(settings.histSkp?'enabled':'disabled')+'!';
			if(opt === 'on' || opt === 'off'){
				if(opt==='on'&&settings.histSkp)return API.sendChat(er);else if(opt==='off'&&!settings.histSkp)return API.sendChat(er);
				settings.histSkp = !settings.histSkp;
				API.sendChat('/em ['+a.un+' '+(settings.histSkp?'enabled':'disabled')+' HistorySkip]');
				saveSettings();
			}
		}
		if(arg === 'bl'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!djsettings] BlackList: '+(settings.blackEnabed?'on':'off'));
			}
			var opt = a.message.split(' ')[2].toLowerCase(),
			err = '/em ['+a.un+'] [!djsettings] BlackList is already '+(settings.blackEnabed?'enabled':'disabled')+'!';
			if(opt==='on'&&settings.blackEnabed)return API.sendChat(err);else if(opt==='off'&&!settings.blackEnabed)return API.sendChat(err);
			settings.blackEnabed = !settings.blackEnabed;
			API.sendChat('/em ['+a.un+' '+(settings.blackEnabed?'enabled':'disabled')+' BlackList]');
			saveSettings();
		}
		if(arg === 'tc'){
			if(a.message.split(' ')[2] === undefined){
				return API.sendChat('/em ['+a.un+'] [!djsettings] TimeCheck: '+(settings.songChk?'on':'off'));
			}
			var opt = a.message.split(' ')[2].toLowerCase(),
			e = '/em ['+a.un+'] [!djsettings] TimeCheck is already '+(settings.songChk?'enabled':'disab;ed')+'!';
			if(opt === 'int'){
				if(a.message.split(' ')[3] === undefined){
					return API.sendChat('/em ['+a.un+'] [!djsettings] Please specify a TimeCheck time greater that 5 minutes!');
				}
				var args = a.message.split(' ')[3];
				if(typeof parseInt(arg) !== 'number'){
					return API.sendChat('/em ['+a.un+'] [!djsettings] The specied input is not a number!');
				}
				API.sendChat('/em ['+a.un+' changed the max TimeCheck to '+args+' minutes]');
				settings.songLim = parseInt(args);
				return true;
			}
			if(opt==='on'&&settings.songChk)return API.sendChat(e);else if(opt==='off'&&!settings.songChk)return API.sendChat(e);
			settings.songChk = !settings.songChk;
			API.sendChat('/em ['+a.un+' '+(settings.songChk?'enabled':'disabled')+' TimeCheck]');
		}
	};
	cmds.manager.isanyone8 = function(a){
		var b = [];
		for(var i = 0; i < u.length; i++){
			if(u[i].level === 8){
				b.push(u[i].username);
				break;
			}
		}
		API.sendChat('/em ['+a.un+'] [!isanyone8] '+(b.length>0?b.join(', '):'none!'));
	};
	//list our user obj
	cmds.manager.users = function(a){
		var b = [];
		for(var i = 0; i < u.length; i++){
			b.push(u[i].username);
			break;
		}
		API.sendChat('/em ['+a.un+'] [!users] '+b.join(', '));
	};
	cmds.manager.refresh = function(a){
		refreshUsers();
		API.sendChat('/em ['+a.un+'] [!refresh] Refreshed all users.');
	};
	cmds.host.party = function(a){
		if(!settings.activeP){
			API.sendChat('/em ['+a.un+'] Let the party begin!');
			settings.activeP = true;
		}else{
			API.sendChat('/em ['+a.un+'] Awww! The party ended. That was fun!');
			settings.activeP = false;
		}
	};
	cmds.host.sock = function(a){socket();API.sendChat('/em ['+a.un+'] [!sock] ReadyState: '+sock.readyState);};
	function lolwut(){if(window.location.pathname==='/thelounge'||window.location.pathname==='/thelounge/')return true;else return false;}
	function saveBouncers(){localStorage.setItem('BouncerList', JSON.stringify(bouncerList));}
	function saveSettings(){localStorage.setItem('SoundbotSettings', JSON.stringify(settings));}
	function toggleCycle(){if($('.cycle-toggle').hasClass('disabled')){$(this).click();}else{$('.cycle-toggle').click();}}
	if(typeof API !== 'object')shutdown();
	else startup();
})();
