/*
	Copyright (c) 2014 FourBit.
	
	If you want to modify, please
	fork this and include the
	link to this repository.

	Found a bug? Make an issue! ->

	Check out the wiki for commands!
*/

SockJS.prototype.cmd = function(z){this.send(JSON.parse(z));};
Math.rand = function(a,b){
	if(Object.prototype.toString.call(a) === '[object Array]'){
		if(!b || b === null || b === undefined){
			return a[Math.floor(Math.random()*a.length)];
		}else{
			throw new SyntaxError('Input "'+b+'" is invalid because the first input is an array');
		}
	}else{
		if(typeof a === 'number'){
			if(!isNaN(a)){
				if(typeof b === 'number'){
					if(!isNaN(b)){
						if(b < a){
							throw new SyntaxError('Input "'+b+'" is less than '+a);
						}else{
							var z = Math.round(a/60)*60,
							y = Math.round(b/60)*60,
							x = Math.floor(Math.random()*z*Math.random());
							if(x > y){
								x = Math.floor(x - y);
								return x;
							}else if(x <= y){
								return x;
							}else if(isNaN(x) || isNaN(y) || isNaN(z)){
								throw new Error((isNaN(x)?x:isNaN(y)?y:isNaN(z)?z:'null')+' is NaN');
							}else{
								throw new Error('An error occurred');
							}
						}
					}else{
						throw new Error('The second input is NaN');
					}
				}else{
					throw new Error(b+' is not a number');
				}
			}else{
				throw new Error('The first input is NaN');
			}
		}else{
			throw new Error(a+' is not a number');
		}
	}
};
(function(){
	var services = {},
		version = '1.1.5.9043',
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
			removeStaffEnabled: true,
			removeStaff: null,
			allowSafeMode: false,
			safeMode: false,
			maxDisc: 7200000,
			bouncerPlus: true,
			showVer:false,
			songLim: 10,
			autoskip: true,
			mcpc: true,
			mcpcUrl: ''
		},refr,cmds={},
		bouncerList = {
			users: [],
			enabled: true
		},sock,connect,
		data={},rule=true,
		_services_afk,
		_services_motd,
		blacklist = ['Pink Fluffy Unicorns', '#SELFIE', 'Troll Song'],
		motdMsg = settings.motdMsg,
		fightArr = [" doesn't like water."," likes to wear thier pants at their knees."," hates cookies."," likes to take hot showers infront of homeless people."," doesn't know how to use an ipad."," abuses people."," wears hello-kitty clothes to work (or school)."," is 40 years old and lives in their parents basement."," takes long walks in volcanos."," has water, never wakes up."," loves one-direction."," eats coconuts",' wears overalls', ' is a brony', ' hates chocolate', ' denys the use of peanut butter for physical therapy', ' no', ' yes', ' does this to you! http://i.imgur.com/ciGpQyC.gif', ' is satan', ' loves unicorns', ' hates me </3', ' loves to fake having a disease', ' not old bay', ' ha lol'],
		oplist = ['Here It Comes', 'Champions'],
		cookies = ['sugar', 'lemon', 'peanut butter', 'chocolate', 'chocolate chip', 'vanilla', 'rose', 'cookie with frosting', 'frog cookie'],
		outcome = ['You eat it. Man that was good!', 'Tasty!', 'They take it back D:', 'They smack it out of your hand </3', 'Touching it duplicates it into more. Weird, but AWESOME! :D', 'I never give it to you, but I can\'t eat it. D:', 'Wow what a taste!', 'It becoms your favorite :3'],
		questions = ["Why is an alarm clock going 'off' when it actually turns on?","If you mated a bull dog and a shitsu, would it be called a bullsh*t?","If an ambulance is on its way to save someone, and it runs someone over, does it stop to help them?","Why is Grape Nuts cereal called that, when it contains neither grapes, nor nuts?","Why is it called a 'drive through' if you have to stop?","Why are Softballs hard?","Do the minutes on the movie boxes include the previews, credits, and special features, or just the movie itself?","If the professor on Giligan's Island can make a radio out of coconut, why can't he fix a hole in a boat?","Why do we scrub Down and wash Up?","Why is an electrical outlet called an outlet when you plug things into it? Shouldn't it be called an inlet.","Why do people point to their wrist when asking for the time, but people don't point to their crotch when they ask where the bathroom is?","Can blind people see their dreams?","Why do most cars have speedometers that go up to at least 130 when you legally can't go that fast on any road?","Why do they call it 'getting your dog fixed' if afterwards it doesn't work anymore?","Why do they call it taking a dump? Shouldn't it be leaving a dump?","Where in the nursery rhyme does it say humpty dumpty is an egg?","Why do they sterilize needles for lethal injections?","Why do banks leave the door wide open but the pens chained to the counter?","If electricity comes from electrons, does morality come from morons?","If all the countries in the world are in debt, where did all the money go?","Why does Donald Duck wear a towel when he comes out of the shower, when he doesn't usually wear any pants?","How come you press harder on a remote control when you know the battery is dead?","If an orange is orange, why isn't a lime called a green or a lemon called a yellow?","If a cat always lands on its feet, and buttered bread always lands butter side down, what would happen if you tied buttered bread on top of a cat?","If the #2 pencil is the most popular, why's it still #2?","What color would a smurf turn if you choked it?","Where's the egg in an egg roll?","Why aren't blue berries blue?","Where is the lead in a lead pencil?","Why is Greenland called green when it is covered in ice?","If a person owns a piece of land, do they own it all the way down to the center of the earth?","Why are they called stairs inside but steps outside?","Why is there a light in the fridge but not in the freezer?","Why does mineral water that has trickled through mountains for centuries have a use by date?","Why do toasters always have a setting on them which burns your toast to a horrible crisp no one would eat?",'If you could throw any kind of party, what would it be like and what would it be for?', 'If you could paint a picture of any scenery you’ve seen before, what would you paint?', 'If you could change one thing about the world, regardless of guilt or politics, what would you do?', 'What is the key to finding happiness?', 'What do you think about tis song? http://goo.gl/koaB8R', 'ou’ve been hired to write a teen dictionary.  What would be the first 10 words all teens should know about?', 'When someone has bad breath do you tell them or try and ignore it?', 'I will never forgive ________ for ________ .', 'If the entire world is in debt, where did all the money go?', 'RANDOM GIFS! GOGOGOGO', 'What’s something valuable that you accidentally dropped and broke?', 'What’s something you should throw away, but can’t?', 'f there was a public execution on TV would you watch it?', 'hi. wassap?'];
		cmds.users = {};
		cmds.staff = {};
		cmds.bplus = {};
		cmds.manager = {};
		cmds.host = {};
		refr = 4;

	function dcTime(a){
		a = Math.floor(a/60000);
		var m = (a-Math.floor(a/60)*60),
		h = ~~((a/3600000)*2)
		o = {hrs:h,min:m};
		return o;
	}

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
			if(settings.hidden)return API.sendChat('/em Error (hidden enabled)');
			if(API.getUser().role<3)return API.sendChat('/em I need to have permission!');
			loadSettings();
			loadEvents();
			setupData();
			socket();
			$('#playback').remove();
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
			return true;
		}
	}
	function socket(){
		// experimental
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
		u = API.getUsers();
		$.each(u, function(z){
			if(z.id === API.getUser().id)return;
			if(z.id === undefined)return;
			else{
				data[z.id] = {
					name: z.username,
					id: z.id,
					afkTime: Date.now(),
					afkWarn: false,
					afkFinal: false,
					cd: false,
					isAfk: false,
					afkMsg: 'I\'m away right now. Talk to me later!'
				};
			}
		});
	}
	function getVideos(){
		if(settings.mcpc && (new Date().getDay() === 4)){
			var a = 'http://gdata.youtube.com/feeds/api/users/monstercatmedia/uploads?max-results=1';
			String.prototype.trunc = String.prototype.trunc || function(z){
				return this.length>z?this.substr(0,z-1)+'...':this;
			};
			$.ajax({
				async: false,
				type: 'GET',
				url: a,
				success: function(data){
					data = xmlToJson(data).feed;
					var video = {
						url: data.entry.link[0]['@attributes'].href,
						id: data.entry.link[0]['@attributes'].href.match(/.*(?:youtu.be\/|v\/|u\/w\/|embed\/watch\?v=)([^#\&\?]*).*/)[1],
						title: data.entry.title['#text']
					};
					if(video.title.match(new RegExp('Podcast', 'g'))){
						settings.mcpcUrl = video.url;
						return true;
					}
				}
			});
		}
	}
	function xmlToJson(xml){
		var obj = {};
		if(xml.nodeType === 1){
			if(xml.attributes.length > 0){
				obj['@attributes'] = {};
				for(var i = 0; i < xml.attributes.length; i++){
					var attribute = xml.attributes.item(i);
					obj['@attributes'][attribute.nodeName] = attribute.nodeValue;
				}
			}
		}else if(xml.nodeType === 3){
			obj = xml.nodeValue;
		}
		if(xml.hasChildNodes()){
			for(var i = 0; i < xml.childNodes.length; i++){
				var item = xml.childNodes.item(i),
				nodeName = item.nodeName;
				if(typeof(obj[nodeName]) === 'undefined'){
					obj[nodeName] = xmlToJson(item);
				}else{
					if(typeof(obj[nodeName].push) === 'undefined'){
						var old = obj[nodeName];
						obj[nodeName] = [];
						obj[nodeName].push(old);
					}
					obj[nodeName].push(xmlToJson(item));
				}
			}
		}
		return obj;
	}
	var dc = {
		users: {},
		getDc: function(a){
			for(var i in dc.users){
				if(dc.users[i] === a){
					return dc.users[i];
				}else{
					return dc.users;
				}
			}
		},
		newDc: function(a){
			this.id = a;
			this.pos = API.getWaitListPosition(a);
			this.time = Date.now();
			this.valid = true;
			dc.users[a] = this;
			setTimeout(function(){if(dc.users[a].valid){dc.users[a].valid = false;}}, 3600000);
		},
		remDc: function(a){
			delete dc.users[a];
		}
	};
	services.antiAfk = function(){
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

	//events

	function eventChat(a){
		if(a.type !== 'message')return;
		if(a.uid === undefined)return;
		if(a.un === undefined)return;
		if(data[a.uid] === undefined){
			data[a.uid] = {
				name: a.un,
				id: a.uid,
				afkTime: Date.now(),
				afkWarn: false,
				afkFinal: false,
				cd: false,
				isAfk: false,
				afkMsg: 'I\'m away right now. Talk to me later!'
			};
		}
		if(a.message.substr(0,1).indexOf('!') !=-1){
			if(bouncerList.enabled){
				for(var i in bouncerList.users){
					if(a.message.substr(1).toLowerCase() === 'promote' && API.getUser(a.uid).role < 1 && a.un === bouncerList.users[i]){
						API.sendChat('/em [Promoting '+a.un+']');
						API.moderateSetRole(a.uid, API.ROLE.BOUNCER);
						return true;
					}
					if(a.message.substr(1).toLowerCase() === 'demote' && API.getUser(a.uid).role === 2 && a.un === bouncerList.users[i]){
						API.sendChat('/em [Demoting '+a.un+' so they can afk]');
						API.moderateSetRole(a.uid, API.ROLE.NONE);
						return true;
					}
				}
			}
			var cmd = a.message.substr(1).split(' ')[0].toLowerCase();
			var chatData = {message:a.message,un:a.un,uid:a.uid,type:a.type,cmd:cmd,role:a.role},
			msg='/em ['+a.un+'] [!'+cmd+'] Unknown command.';
			API.moderateDeleteChat(a.cid);
			if(API.getUser(a.uid).role===2){
				if(settings.bouncerPlus){
					if(cmds.bplus[cmd]){
						cmds.bplus[cmd](chatData);
						return true;
					}
				}
				if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
					return true;
				}else if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
					return true;
				}
			}
			if(API.getUser(a.uid).role > 2 && API.getUser(a.uid).role < 5){
				if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
					return true;
				}else if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
					return true;
				}else if(cmds.manager[cmd]){
					cmds.manager[cmd](chatData);
					return true;
				}else if(cmds.bplus[cmd]){
					cmds.bplus[cmd](chatData);
					return true;
				}
			}
			if(API.getUser(a.uid).role===5){
				if(cmds.host[cmd]){
					cmds.host[cmd](chatData);
					return true;
				}else if(cmds.manager[cmd]){
					cmds.manager[cmd](chatData);
					return true;
				}else if(cmds.bplus[cmd]){
					cmds.bplus[cmd](chatData);
					return true;
				}else if(cmds.staff[cmd]){
					cmds.staff[cmd](chatData);
					return true;
				}else if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
					return true;
				}
			}
			if(settings.userCmds&&data[a.uid].cd===false&&API.getUser(a.uid).role<2){
				if(cmds.users[cmd]){
					cmds.users[cmd](chatData);
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
					return true;
				}else{
					API.sendChat(msg);
					return false;
				}
			}
			return false;
		}
		if(a.message.substr(0,2).indexOf('!!') !=-1)return API.sendChat('@'+a.un+' you put !! instead of !');
		u = API.getUsers();
		if(a.un === API.getUser().username)return;
		for(var i in u){
			if(data[u[i].id] === undefined)return;
			if(data[u[i].id].afkWarn){
				data[u[i].id].afkWarn = false;
				data[u[i].id].afkTime = Date.now();
			}
			if(data[u[i].id].afkFinal){
				data[u[i].id].afkFinal = false;
				data[u[i].id].afkTime = Date.now();
			}
			if(data[a.uid].isAfk && data[a.uid] !== undefined){
				data[a.uid].isAfk = false;
				data[a.uid].afkMsg = '';
				return true;
			}
			if(u[i].username !== undefined && a.message.match(new RegExp('@'+u[i].username, 'g')) && a.type === 'message' && data[u[i].id] !== undefined && data[u[i].id].isAfk === true){
				if(u[i].username !== a.un){
					API.sendChat('['+u[i].username+'] [AFK Message] @'+a.un+' '+(String(data[u[i].id].afkMsg)&&data[u[i].id].afkMsg.length>0?data[u[i].id].afkMsg:'I\'m away right now. Talk to me later!'));
					return true;
				}
			}
		}
	}
	function eventAdvance(a){
		if(settings.autoskip){
			clearTimeout(b);
			var b,c = a.media.duration;
			b = setTimeout(function(){API.moderateForceSkip();},c*1000+5000);
		}
		if(settings.autowoot)$('#woot').click();
		if(settings.advStat){
			if(a.lastPlay !== undefined)API.sendChat('/em '+a.lastPlay.media.author+' - '+a.lastPlay.media.title+' received '+a.lastPlay.score.positive+' woots, '+a.lastPlay.score.negative+' mehs, and '+a.lastPlay.score.grabs+' grabs!');
		}
		if(settings.histSkp){
			var z = API.getHistory();
			for(var i in z){
				if(a.media !== undefined && z[i].title === a.media.title){
					API.sendChat('@'+API.getDJ().username+', that song is on the history!');
					settings.gqueue.push(API.getDJ().id);
					API.moderateLockWaitList(true, false);
					API.moderateForceSkip();
					if(API.getWaitList().length > 49){
						API.sendChat('/em You will be added to the waitlist when there is room. Queue: '+settings.gqueue.length);
						var adv = false;
						goWhenSpot()?adv=true:adv=false;
						do{
							API.moderateAddDJ(settings.gqueue[0]);
							API.moderateMoveDJ(settings.gqueue[0], 3);
							settings.gqueue.pop(settings.gqueue[0]);
							if(API.getWaitList().length > 49)adv = false;
							else if(settings.gqueue.length <= 0)adv = false;
						}while(adv);
					}else{
						for(var i = 0; i < settings.gqueue.length; i++){
							API.moderateAddDJ(settings.gqueue[i]);
							if(API.getWaitList().length < 4)return true;
							else API.moderateMoveDJ(settings.gqueue[i], 3);
							settings.gqueue.pop(settings.gqueue[i]);
							break;
						}
					}
					settings.gqueue.length>0?API.sendChat('/em Users in queue: '+settings.gqueue.join(', ')):returns=false;
					API.moderateLockWaitList(false);
				}
			}
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
			if(a.media.duration > Math.floor(settings.songLim*60)){
				var returns;
				API.sendChat('@'+API.getDJ().username+' that song is over the limit (10min)');
				settings.gqueue.push(API.getDJ().id);
				API.moderateLockWaitList(true, false);
				API.moderateForceSkip();
				if(API.getWaitList().length > 49){
					API.sendChat('/em You will be added to the waitlist when there is room. Queue: '+settings.gqueue.length);
					var adv = false;
					goWhenSpot()?adv=true:adv=false;
					do{
						API.moderateAddDJ(settings.gqueue[0]);
						API.moderateMoveDJ(settings.gqueue[0], 3);
						settings.gqueue.pop(settings.gqueue[0]);
						if(API.getWaitList().length > 49)adv = false;
						else if(settings.gqueue.length <= 0)adv = false;
					}while(adv);
				}else{
					for(var i = 0; i < settings.gqueue.length; i++){
						API.moderateAddDJ(settings.gqueue[i]);
						if(API.getWaitList().length < 4)return true;
						else API.moderateMoveDJ(settings.gqueue[i], 3);
						settings.gqueue.pop(settings.gqueue[i]);
						break;
					}
				}
				settings.gqueue.length>0?API.sendChat('/em Users in queue: '+settings.gqueue.join(', ')):returns=false;
				API.moderateLockWaitList(false);
			}
		}
		if(settings.queue){
			//advance queue
			if(settings.gqueue.length===0)return;
			else if(API.getWaitList().length <= 49){
				API.moderateAddDJ(settings.gqueue[0]);
				API.moderateMoveDJ(settings.gqueue[0], 4);
				settings.gqueue.pop(settings.gqueue[0]);
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
		if(settings.removeStaffEnabled&&settings.activeP){
			var b = settings.removeStaff;
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
        u = API.getUsers();
		if(API.getUser().id===a.id)return;
		data[a.id] = {
			name: a.username,
			id: a.id,
			afkTime: Date.now(),
			afkWarn: false,
			afkFinal: false,
			cd: false,
			isAfk: false,
			afkMsg: 'I\'m away right now. Talk to me later!'
		};
	}
	function eventLeave(a){
		u = API.getUsers();
		delete data[a.id];
		new dc.newDc(a.id);
	}
	function eventCmd(a){
		var cmd = a.substr(1).split(' ')[0].toLowerCase();
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
									url:'http://astroshock.bl.ee/_/update.json',
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
				setTimeout(function(){
					$.getScript('https://raw.githubusercontent.com/FourBitus/Sound/master/bot.js');
				}, 5000);
				break;
			case 'commands':
			case 'help':
				API.chatLog('Local commands: set [argument] ~ shutdown ~ reload ~ commands | help ~ lol ~ hide', true);
				break;
			case 'lol':
				cmds.manager.lolomgwtfbbq({un:'Local'});
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
			case 'podcast':
				cmds.manager.podcast({un:'Local'});
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
			settings.removeStaff = a;
			settings.removeStaffEnabled = true;
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
		var b = API.getMedia();
        if (b.format === '1' || b.format === 1)API.sendChat('/em ['+a.un+'] [!link] Current song: http://youtu.be/'+b.cid);
        else SC.get('/tracks/'+b.cid, function(c){
            API.sendChat('/em ['+a.un+'] [!link] Current song: '+(c.permalink_url?c.permalink_url:'Link not found'));
        });
	};
	cmds.users.rek = function(a){
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!rek] You failed to rek someone.');
		};
		var arg = a.message.split(' ')[1].substr(1),
		z = Math.rand(fightArr, null);
		for(var i in u){
			if(u[i].username === arg){
				API.sendChat('['+a.un+'] [!rek] '+'@'+u[i].username+(z.match(new RegExp(' does this to you', 'g'))?a.un+' ':'')+z);
			}
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
    	do{
    		if(str.length <= b){
    			str+=letters[Math.floor(Math.random()*letters.length)];
   			}else{
   				end = false;
   			}
    	}while(end);
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
				data[a.uid].afkMsg = a.message.split(' ')[1];
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
	cmds.users.dc = function(a){
		if(a.message.split(' ')[1] === undefined){
			if(dc.getDc(a.uid)){
				if((Date.now() - dc.getDc(a.uid).time) <= 3600000){
					var pos = dc.getDc(a.uid).pos;
					API.sendChat('/em ['+a.un+'] [!dc] You will be added to spot '+pos+'.');
					if(API.getWaitList().length < 50){
						API.modereateAddDJ(a.uid);
						setTimeout(function(){API.moderateMoveDJ(a.uid, pos);},250);
					}else{
						do{
							API.modereateAddDJ(a.uid);
							setTimeout(function(){API.moderateMoveDJ(a.uid, pos);},250);
						}while(API.getWaitList().length < 50 && API.getWaitListPosition(a.uid) === -1);
					}
				}else{
					var h = dc.getDc(a.uid).time/3600000,
					m = dc.getDc(a.uid).time/60000.12;
					API.sendChat('/em ['+a.un+'] [!dc] You dc\'d too long ago ('+(dcTime(dc.getDc(a.uid).time).hrs+'h '+dcTime(dc.getDc(a.uid).time).min)+'m)');
				}
			}else{
				API.sendChat('/em ['+a.un+'] [!dc] Your dc wasn\'t found!');
			}
		}else{
			u = API.getUsers();
			for(var i in u){
				if(u[i].username === a.message.split(' ')[1].substr(1)){
					if(dc.getDc(u[i].id)){
						if((Date.now() - dc.getDc(u[i].id).time) <= 3600000){
							var pos = dc.getDc(u[i].id).pos;
							API.sendChat('/em ['+a.un+'] [!dc] '+u[i].username+' will be added to spot '+pos+'.');
							if(API.getWaitList().length < 50){
								API.modereateAddDJ(u[i].id);
								setTimeout(function(){API.moderateMoveDJ(u[i].id, pos);},250);
							}else{
								do{
									API.modereateAddDJ(u[i].id);
									setTimeout(function(){API.moderateMoveDJ(u[i].id, pos);},250);
								}while(API.getWaitList().length < 50 && API.getWaitListPosition(u[i].id) === -1);
							}
						}else{
							API.sendChat('/em ['+a.un+'] [!dc] You dc\'d too long ago ('+(dcTime(dc.getDc(u[i].id).time).hrs+'h '+(dcTime(dc.getDc(u[i].id).time).min))+'m)');
						}
					}else{
						API.sendChat('/em ['+a.un+'] [!dc] That user\'s dc wasn\'t found!');
					}
				}else{
					API.sendChat('/em ['+a.un+'] [!dc] User not found.');
				}
			}
		}
	};
	cmds.staff.woot = function(a){
		if(a.message.split(' ')[1] === undefined){
			return $('#woot').click();
		}
		var arg = a.message.split(' ')[1].toLowerCase();
		if(arg === 'on' || arg === 'off'){
			settings.autowoot = !settings.autowoot;
			saveSettings();
			API.sendChat('/em ['+a.un+' '+(settings.autowoot?'enabled':'disabled')+' autowoot]');
		}
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
				}else if(!isNaN(parseInt(opt)))dur = parseInt(opt);
				else dur = 1;
				dur>3?dur=3:dur=dur;
				dur<1?dur=1:dur=dur;
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
		}else if(isNaN(parseInt(time))){
			dur = 0.2;
		}
		for(var i in u){
			if(u[i].username === user){
				if(u[i].role < 1){
					API.sendChat('@'+u[i].username+' you are being kicked for '+dur+' minutes. Any last words?');
					setTimeout(function(){
						API.sendChat('/em ['+a.un+' used kick]');
						API.moderateBanUser(u[i].id, 0, -1);
						$('#users-button').click();
						$('.button.bans').click();
						setTimeout(function(){
							$('.button.room').click();
							$('#chat-button').click();
						}, 100);
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
	cmds.manager.podcast = function(a){
		if(getVideos()){
			API.sendChat('/em I will now play the monstercat podcast. It can last from 30min. to 1hr. long. It will not be skipped.');
			API.moderateLockWaitList(true, false);
			if($('.cycle-toggle').hasClass('enabled')){
				$('.cycle-toggle').click();
			}
			API.once('waitListUpdate', function(){
				API.moderateAddDJ(API.getUser().id);
				if($('#dj-button').hasClass('.is-leave')){
					API.moderateMoveDJ(API.getUser().id, 2);
					setTimeout(function(){
						$('#playlist-button').click();
						setTimeout(function(){
							$('#search-input-field').val(settings.mcpcUrl);
							setTimeout(function(){
								var e = jQuery.Event('keypress');
								e.which = 13;
								e.keyCode = 13;
								$('#search-input-field').trigger(e);
								API.chatLog('Please add the podcast to my playlist!', true);
							}, 500);
						}, 500);
					}, 500);
				}
			});
		}
	}
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
				_services_afk = false;
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
	cmds.manager.isanyone = function(a){
		u = API.getUsers();
		var b = [];
		if(a.message.split(' ')[1] === undefined){
			return API.sendChat('/em ['+a.un+'] [!isanyone] Please specify a number!');
		}
		if(typeof parseInt(a.message.split(' ')[1]) !== 'number')return API.sendChat('/em ['+a.un+'] [!isanyone] Input is not a number!');
		for(var i in u){
			if(u[i].level === parseInt(a.message.split(' ')[1])){
				b.push(u[i].username);
				break;
			}
		}
		API.sendChat('/em ['+a.un+'] [!isanyone] '+(b.length>0?b.join(', '):'none!'));
	};
	cmds.manager.autoskip = function(a){
		settings.autoskip = !settings.autoskip;
		API.sendChat('/em ['+a.un+' toggled autoskip '+(settings.autoskip?'on':'off')+']');
		saveSettings();
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
