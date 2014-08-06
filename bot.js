/*

Soundbot Revamp

This might not work with the new plug update but w/e

Copyright (c) 2014 FourBit (Pr0Code)

Please refer to the Readme.md for license stuff

*/
    var motdMsg = ["Welcome to the FourBit plug.dj room!"];
    var joinTime = Date.now();
    var blacklist = ['#SELFIE (Official Music Video)', 'Troll Song'];
    var cmds = {};
    var rcon = false;
    var util = {
        getMath: function(a){
            a = Math.floor(a / 6000);
            var b = (a - Math.floor(a / 60) * 60);
            var c = (a - b) / 60;
            var e = '';
            e += c + 'h';
            e += b < 10 ? '0' : '';
            e += b;
            return e;
        }
    };
    var settings = {
        woot: true,
        motd: {
            enabled: false,
            interval: 1500000
        },
        antiAfk: {
            enabled: true,
            limit: 3600000
        },
        songLength: {
            enabled: true,
            limit: 10
        },
        blacklist: true,
        stats: true,
        historySkip: true,
        party: false,
        roulette: false,
        userCmds: true,
        filter: true,
        cooldown: false
    };

    function loadSettings() {
        var a = JSON.parse(localStorage.getItem('SoundbotSave'));
        if (a){
            var b = Object.keys(settings);
          for(var i = 0; i < b.length; i++){
            settings[b[i]] = a[b[i]];
          }
        }
        else if (typeof a === undefined) saveSettings();
    }

    //Init() and shutdown()

    function init(){
        API.on({
            'chat':eventDataChat,
            'chat':eventCommandChat,
            'chat':eventFilterChat,
            'userJoin':eventJoin,
            'userLeave':eventLeave,
            'djAdvance':eventDjAdvance
        });
        API.setVolume(0);
        if (settings.woot) $('#woot').click();
        motd();
        API.sendChat('/em now sprinting!');
    }

    function shutdown(){
        API.off({
            'chat':eventDataChat,
            'chat':eventCommandChat,
            'chat':eventFilterChat,
            'userJoin':eventJoin,
            'userLeave':eventLeave,
            'djAdvance':eventDjAdvance
        });
        API.setVolume(15);
        saveSettings();
        if (settings.motd.enabled) clearInterval(motdInt);
        API.sendChat('/em Shutdown.');
    }

    //Userdata
    var data = {};
    var u = API.getUsers();
    for (var i in u) {
        data[u[i].id] = {
            username: u[i].username,
            afktime: Date.now(),
            warning: false,
            removed: false,
            muted: false,
            roulSelect: false,
            roulChat: false,
            exeChat: false,
            exeWarn: false,
            afk: false,
            afkMsg = 'I\'m away right now. Message me later!',
            lolomgwtfbbqc: false
        };
    }

    function eventJoin(a) {
        data[a.id] = {
            username: a.username,
            afktime: Date.now(),
            warning: false,
            removed: false,
            muted: false,
            roulSelect: false,
            roulChat: false,
            exeChat: false,
            exeWarn: false,
            afk: false,
            afkMsg = 'I\'m away right now. Message me later!',
            lolomgwtfbbqc: false
        };
    }

    function eventLeave(a) {
        delete data[a.id];
    }

    function eventDataChat(a) {
        data[a.fid].afkTime = Date.now();
        if(data[a.fid].warning){
            data[a.fid].warning = false;
        }
        if(data[a.fid].removed){
            data[a.fid].removed = false;
        }
        if(data[a.fid].roulChat && a.message === '!pass'){
            data[a.fid].roulChat = false;
        }
        if(data[a.fid].exeWarn === true){
            data[a.fid].exeChat = true;
        }
        if(data[a.fid].afk === true){
            data[a.fid].afk = false;
        }
        if(a.message === '!lolomgwtfbbq' && data[a.fid].lolomgwtfbbqc){
            API.sendChat('/em The end is near... for you...');
            setTimeout(function(){
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnBanUser(a.fid,0,-1);
                API.sendChat('>:D');
                API.sendChat('But the user can login now ;D');
                data[a.fid].lolomgwtfbbqc = false;
            }, 2000);
        }
    }

    //AntiAfk

    function AntiAFK() {
        if (settings.antiAfk.enabled) {
            var z = API.getWaitList();
            var y = Date.now();
            for (var i in z) {
                var x = data[z[i].id].afktime;
                var w = y - x;
                var v = Math.floor((y - x) / 50000) % 60;
                if (w > settings.antiAfk.limit && !data[z[i].id].warning) {
                    API.sendChat('@' + z[i].username + ' AFK Time: ' + v + ' minutes. Chat soon or I will remove you.');
                    data[z[i].id].warning = true;
                    setTimeout(function() {
                        z = API.getWaitList();
                        for (var c in z) {
                            if (data[z[c].id].warning) {
                                API.sendChat('@' + z[c].username + ' last warning (AFK).');
                                data[z[c].id].removed = true;
                                setTimeout(function() {
                                    z = API.getWaitList();
                                    for (var e in z) {
                                        if (z[e].warning && z[e].removed) {
                                            API.moderateRemoveDJ(z[e].id);
                                            data[z[e].id].warning = false;
                                            data[z[e].id].removed = false;
                                            data[z[e].id].afktime = Date.now();
                                        } else if (!z[e].warning && z[e].removed) {
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

    function motd() {
        if (settings.motd.enabled) {
          var motdInt;
            motdInt = function(){
                setInterval(function(){
                    API.sendChat('/em ' + motdMsg[Math.floor(Math.random() * motdMsg.length)]);
                }, settings.motd.interval);
            };
            motdInt();
        }
    }
    
    function eventDjAdvance(obj) {
        if (settings.woot) $('#woot').click();
        if(settings.historySkip){
            API.once(API.HISTORY_UPDATE, function(a){
                var b = obj.media.title;
                for(var i = 0; i < a.length; i++){
                    if(a[i].title === b){
                        API.sendChat('@' + API.getDJ().username + ' that song in the history!');
                        var c = [];
                        c.push(API.getDJ().id);
                        if($('.cycle-toggle').hasClass('disabled')){
                            $(this).click();
                        }
                        API.moderateLockWaitList(true, false);
                        API.moderateForceSkip();
                        API.moderateMoveDJ(b[1], 5);
                        c = [];
                    }
                }
            });
        }
        if(settings.blacklist){
            var a = obj.media.title;
            for(var i = 0; i < blacklist.length; i++){
                if(blacklist[i].title === a){
                    API.sendChat('@' + API.getDJ().username + ' that song is blacklisted!');
                    var b = [];
                    b.push(API.getDJ().id);
                    if($('.cycle-toggle').hasClass('disabled')){
                        $(this).click();
                    }
                    API.moderateLockWaitList(true, false);
                    API.moderateForceSkip();
                    API.moderateMoveDJ(b[1], 5);
                    b = [];
                }
            }
        }
      if(rcon){settings.stats=true;}
        if(settings.stats){
            var z = obj.lastPlay;
            if(typeof z === 'undefined') return void (0);
            var y = z.score.positive;
            var x = z.score.curates;
            var w = z.score.negative;
            API.sendChat('/em ' + z.media._previousAttributes.author + ' - ' +  z.media._previousAttributes.title + ' received ' + y + ' woots, ' + x + ' grabs, and ' + w + ' mehs!');
        }
        if(settings.songLength.enabled && obj.media.duration > settings.songLength.limit * 60){
            if(settings.stats) settings.stats = false;
            API.sendChat('@' + API.getDJ().username + ' your song is greater than the song limit (10 minutes)!');
            var aa = API.getDJ().id;
            var bb = [];
            bb.push(aa);
            if($('.cycle-toggle').hasClass('disabled')){
                $(this).click();
            }
            API.moderateLockWaitList(true, false);
            API.moderateForceSkip();
            API.sendChat('/em Adding user...');
            API.moderateMoveDJ(bb[1], 1);
            bb = [];
        }
    }

    function listenFor(a, b){
        API.on(API.CHAT, function(z){
            a = a.trim();
            b = b.trim();
            for (var i = 0; i < u.length; i++) {
                if (u[i].id === a) {
                    if (b === false) {
                        if (z.fid === a || z.fid === u[i].id && b === false) {
                            return true;
                        } else {
                            if (z.fid !== a || z.fid !== u[i].id && b === false) {
                                return false;
                            }
                        }
                    }
                    if (b === true) {
                        if (z.fid === a || z.fid === u[i].id) {
                            return true;

                            } else {
                                if (z.fid !== a || z.fid !== u[i].id && b === true) {
                                    return false;
                                }
                            }
                            if (z.fid === a || a.fid === u[i].id && b === true){
                                return z.message;
                            }
                        }
                    }
                }
                if (z.message === '!pass' && data[z.fid].roulSelect && data[z.fid].roulChat) API.moderateDeleteChat(z.cid);
                if(this === true || this === false || this === z.message){
                    API.off(API.CHAT, this);
                }
                API.off(API.CHAT, this);
            });
        }

        var chatFilter = ['fanme','funme','becomemyfan','trocofa','fanforfan','fan4fan','fan4fan','hazcanfanz','fun4fun','fun4fun',
                'meufa','fanz','isnowyourfan','reciprocate','fansme','givefan','fanplz','fanpls','plsfan','plzfan','becomefan','tradefan',
                'fanifan','bemyfan','retribui','gimmefan','fansatfan','fansplz','fanspls','ifansback','fanforfan','addmefan','retribuo',
                'fantome','becomeafan','fan-to-fan','fantofan','canihavefan','pleasefan','addmeinfan','iwantfan','fanplease','ineedfan',
                'ineedafan','iwantafan','bymyfan','fannme','returnfan','bymyfan','givemeafan','sejameufa','sejameusfa',
                'fanzkai','addmetofan','fanzafan','fanzefan','becomeinfan','backfan',
                'viremmeuseguidor','viremmeuseguir','fanisfan','funforfun','anyfanaccept','anyfanme','fan4fan','fan4fan','turnmyfan',
                'turnifan','beafanofme','comemyfan','plzzfan','plssfan','procurofan','comebackafan','fanyfan','givemefan','fan=fan',
                'fan=fan','fan+fan','fan+fan','fanorfan','beacomeafanofme','beacomemyfan','bcomeafanofme','bcomemyfan','fanstofan',
                'bemefan','trocarfan','fanforme','fansforme','allforfan','fansintofans','fanintofan','f(a)nme','prestomyfan',
                'presstomyfan','fanpleace','fanspleace','givemyafan','addfan','addsmetofan','f4f','canihasfan','canihavefan',
                'givetomeafan','givemyfan','phanme','fanforafan','fanvsfan','fanturniturn','fanturninturn','sejammeufa',
                'sejammeusfa','befanofme','faninfan','addtofan','fanthisaccount','fanmyaccount','fanback','addmeforfan',
                'fans4fan','fans4fan','fanme','fanmyaccount','fanback','addmeforfan','fans4fan','fans4fan','fanme','turnfanwhocontribute',
                "bemefan","bemyfan","beacomeafanofme","beacomemyfan","becameyafan","becomeafan",
                "becomefan","becomeinfan","becomemyfan","becomemyfans","bouncerplease","bouncerpls",
                "brbrbrbr","brbrbrbr","bymyfan","canihasfan","canihavefan","caralho",
                "clickmynametobecomeafan","comebackafan","comemyfan","dosfanos","everyonefan",
                "everyonefans","exchangefan","f4f","f&n","f(a)nme","f@nme","f4f","f4n4f4n",
                "f4nforf4n","f4nme","f4n4f4n","fan:four:fan",
                'fanme','funme','becomemyfan','trocofa','fanforfan','fan4fan','fan4fan','hazcanfanz',
                'fun4fun','fun4fun','meufa','fanz','isnowyourfan','reciprocate','fansme','givefan',
                'fanplz','fanpls','plsfan','plzfan','becomefan','tradefan','fanifan','bemyfan',
                'retribui','gimmefan','fansatfan','fansplz','fanspls','ifansback','fanforfan',
                'addmefan','retribuo','fantome','becomeafan','fan-to-fan','fantofan',
                'canihavefan','pleasefan','addmeinfan','iwantfan','fanplease','ineedfan',
                'ineedafan','iwantafan','bymyfan','fannme','returnfan','bymyfan','givemeafan',
                'sejameufa','sejameusfa','sejameufã','sejameusfã','fãplease','fãpls','fãplz',
                'fanxfan','addmetofan','fanzafan','fanzefan','becomeinfan','backfan',
                'viremmeuseguidor','viremmeuseguir','fanisfan','funforfun','anyfanaccept',
                'anyfanme','fan4fan','fan4fan','turnmyfan','turnifan','beafanofme','comemyfan',
                'plzzfan','plssfan','procurofan','comebackafan','fanyfan','givemefan','fan=fan',
                'fan=fan','fan+fan','fan+fan','fanorfan','beacomeafanofme','beacomemyfan',
                'bcomeafanofme','bcomemyfan','fanstofan','bemefan','trocarfan','fanforme',
                'fansforme','allforfan','fnme','fnforfn','fansintofans','fanintofan','f(a)nme','prestomyfan',
                'presstomyfan','fanpleace','fanspleace','givemyafan','addfan','addsmetofan',
                'f4f','canihasfan','canihavefan','givetomeafan','givemyfan','phanme','but i need please fan',
                'fanforafan','fanvsfan','fanturniturn','fanturninturn','sejammeufa',
                'sejammeusfa','befanofme','faninfan','addtofan','fanthisaccount',
                'fanmyaccount','fanback','addmeforfan','fans4fan','fans4fan','fanme','bemyfanpls','befanpls','f4f','fanyfan'
            ];
            
        function eventCommandChat(a){
            if(a.message.substr(0,1)=='!'&&a.message.substr(2)!==' '||a.message.substr(2)!=='!'){
                var str = a.message.substr(1).split(' ')[0].toLowerCase(),cdata = {message:a.message,fid:a.fid,from:a.from,cid:a.cid},a;
                switch(str){
                    case 'help':        cmds.help(cdata);        break;
                    case 'cmdlist':     cmds.cmdlist(cdata);     break;
                    case 'theme':       cmds.theme(cdata);       break;
                    case 'link':        cmds.link(cdata);        break;
                    case 'staff':       cmds.staff(cdata);       break;
                    case 'ad':          cmds.ad(cdata);          break;
                    case 'emoji':       cmds.emoji(cdata);       break;
                    case 'ba':          cmds.ba(cdata);          break;
                    case 'eta':         cmds.eta(cdata);         break;
                    case 'ping':        cmds.ping(cdata);        break;
                    case 'status':      cmds.status(cdata);      break;
                    case 'ban':         cmds.ban(cdata);         break;
                    case 'pong':        cmds.pong(cdata);        break;
                    case 'queue':       cmds.queue(cdata);       break;
                    case 'afk':         cmds.afk(cdata);         break;
                    case 'afkdisable':  cmds.afkdisable(cdata);  break;
                    case 'kick':        cmds.kick(cdata);        break;
                    case 'lolomgwtfbbq':cmds.lolomgwtfbbq(cdata);break;
                    case 'apocalypse':  cmds.apocalypse(cdata);  break;
                }
            }
        }

        cmds.help = function(a){
            API.sendChat('/em [' + a.from + '] [!help] Soundbot commands: http://astroshock.bl.ee/soundbot');
        };
        cmds.cmdlist = function(a){
            API.sendChat('/em [' + a.from + '] [!cmdlist] ' + Object.keys(cmds).join(', '));
        };
        cmds.theme = function(a){
            API.sendChat('/em [' + a.from + '] [!theme] This room\'s theme is EDM (Electronic Dance Music)');
        };
        cmds.link = function(a){
            var arg = a.message.split(' '), sp = arg[1].substr(1);
            var b = API.getMedia();
            if(sp === null || sp === undefined || isNaN(sp)){
                API.sendChat('/em [' + a.from + '] [!link] Link to current song: http://youtu.be/' + b.cid);
            }
            if(sp !== null || sp !== undefined || !isNaN(sp)){
                API.sendChat('/em [' + a.from + '] [!link] Link to current song: https://www.youtube.com/watch?v=' + b.cid + '&t=' + API.getTimeElapsed());
            }
        };
        cmds.staff = function(a){
            var b = API.getStaff();
            var c = [];
            for(var i in b){
                c.push(b[i].username);
            }
            API.sendChat('/em [' + a.from + '] [!staff] Current staff that\'s online: ' + c.join(', ') + '.');
            c = [];
        };
        cmds.ad = function(a){
            API.sendChat('/em [' + a.from + '] [!ad] ADBlock is highly recommended for using plug.dj. https://getadblock.com');
        };
        cmds.emoji = function(a){
            API.sendChat('/em [' + a.from + '] [!emoji] plug.dj emoji list: http://emoji-cheat-sheet.com');
        };
        cmds.ba = function(a){
            API.sendChat('/em [' + a.from + '] [!ba] Brand Ambassadors (BA\'s) are plug.dj\'s "global moderators". Read more here: http://blog.plug.dj/brand-ambassadors/');
        };
        cmds.eta = function(a){
            var msg = a.message.split(' '), user = msg[1].substr(1);
            if(user === null || undefined) API.sendChat('/em [' + a.from + '] [!eta] User not found.');
            for(var i in u){
                if(u[i].username === null || undefined){
                    API.sendChat('/em [' + a.from + '] [!eta] User not found.');
                }
                if(u[i].username === user){
                    var b = API.getWaitListPosition(u[i].id);
                    if(b === -1){
                        API.sendChat('/em [' + a.from + '] [!eta] It seems as if that user is not in the waitlist!');
                    }
                    var c = Date.now();
                    if(b <= 50 && b >= 2){ 
                        var d = util.getMath(((25/6) * b * 60 * 1000) + API.getTimeRemaining() * 1000);
                        API.sendChat('/em [' + a.from + '] [!eta] ETA for ' + u[i].username + ' is ' + d);
                    }
                }
            }
        };
        cmds.ping = function(a){
            if(API.getUser(a.fid).permission >= 2) API.sendChat('/em [' + a.from + '] [!ping] Pong!');
        };
        cmds.status = function(a){
            if(API.getUser(a.fid).permission >= 2){

            }
        };
        cmds.ban = function(a){
            if(API.getUser(a.fid).permission >= 2){
                var str = a.message.split(' '), user = str[1].substr(1), time = str[2].substr(1), y;
                if(user === null) API.sendChat('/em [' + a.from + '] [!ban] User input invalid.');
                if(time === null) API.sendChat('/em [' + a.from + '] [!ban] Time input invalid.');
                for(var i in u){
                    if(u[i].username === null || undefined) API.sendChat('/em [' + a.from + '] [!ban] User not found.');
                    else if(u[i].username === user && time !== null || undefined){
                        var z = parseInt(time);
                        if(time >= 3){
                            y = API.BAN.PERMA;
                            API.sendChat('/em [' + a.from + ' used ban]');
                            API.moderateBanUser(u[i].id, 1, y);
                        }else{
                            if(time === 2){
                                y = API.BAN.DAY;
                                API.sendChat('/em [' + a.from + ' used ban]');
                                API.moderateBanUser(u[i].id, 1, y);
                            }else{
                                if(time <= 1){
                                    y = API.BAN.HOUR;
                                    API.sendChat('/em [' + a.from + ' used ban]');
                                    API.moderateBanUser(u[i].id, 1, y);
                                }else{
                                    y = null;
                                    API.sendChat('/em [' + a.from + '] [!ban] Time inputs are: 1, 2, 3');
                                }
                            }
                        }
                    }   
                }
            }
        };
        cmds.pong = function(a){
            API.sendChat('/em Pomg!');
        };
        cmds.queue = function(a){
            if(API.getUser(a.fid).permission >= 2){
                var msg = '';
                queue.length === 0 ? msg += 'No users being added!' : msg += 'Users being added: ' + queue.join(', ');
                API.sendChat('/em [' + a.from + '] [!queuelist] ' + msg);
            }
            msg = '';
        };
        cmds.afk = function(a){
            var msg = '';
            var raw = a.message.split(' '),
            arg = raw[1].substr(1);
            arg === null || arg === undefined ? msg += 'I\'m away right now. Message me later!' : msg += arg;
            data[a.fid].afk = true;
            data[a.fid].afkMsg = msg;
            msg = '';
        };
        cmds.afkdisable = function(a){
            if(API.getUser(a.fid).permission >= 2){
                var user = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === user){
                        data[u[i].id].afk = false;
                        data[u[i].id].afkMsg = '';
                        API.sendChat('/em [' + a.from + '] [!afkdisable] Disabled AFK message for: ' + user + '.');
                    }
                    if(u[i].username !== user){
                        API.sendChat('/em [' + a.from + '] [!afkdisable] I can\'t find that user in the room!');
                    }
                }
            }
        };
        cmds.kick = function(a){
            if(API.getUser(a.fid).permission >= 2){
                var user = a.message.split(' ')[1].substr(1),
                arg = a.message.split(' ')[2].substr(1).toLowerCase(),
                e = '';
                var time = ['hour','1','day','2'];
                for(var i = 0; i < time.length; i++){
                    if(arg !== time[i]){
                        API.sendChat('/em [' + a.from + '][!kick] You did not specify a time!');
                    }
                    if(arg === time[i]){
                        for(var c in u){
                            if(u[c].username === user){
                                if(time[i].length > 1){
                                    switch(time[i]){
                                        case 'minute': e += '1';
                                        case 'hour': e += '2';
                                        case 'day': e += '3';
                                    }
                                }else{
                                    if(time[i].length === 1){
                                        e += time[i];
                                    }
                                }
                                e = parseInt(e);
                                API.sendChat('/em [' + a.from + ' used kick]');
                                //**
                                API.moderateBanUser(u[c].id, 1, e);
                                //**
                                if(e === 1){
                                    setTimeout(function(){
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                    }, 60000);
                                }
                                if(e === 3){
                                    setTimeout(function(){
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                    }, 86400000);
                                }
                                if(e === 2){
                                    setTimeout(function(){
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                        API.moderateUnBanUser(u[c].id);
                                    }, 3600000);
                                }
                            }
                        }
                    }
                }
            }
        };
        cmds.lolomgwtfbbq = function(a){
            if(API.getUser(a.fid).permission >= 3){
                API.sendChat('[' + a.from + '] [!lolomgwtfbbq] Oh god. What have you done.');
                var array =[];
                setTimeout(function(){
                    API.sendChat('[' + a.from + '] [!lolomgwtfbbq] Something very bad is about to happen... HIDE YO KIDS');
                }, 1000);
                setTimeout(function(){
                    var z = API.getWaitList();
                    for(var i = 0; i < z.length; i++){
                        array.push(z[i].id);
                        for(var c = 0; c < array.length; c++){
                            var y = API.getWaitListPosition(array[i]);
                            API.moderateMoveDJ(array[i], y);
                            array = [];
                            API.sendChat('That was fun.');
                            var f;
                            f = setInterval(function(){
                                API.sendChat('lolololol');
                            }, 10);
                            setTimeout(function(){clearInterval(f)},1000);
                        }
                    }
                }, 1500);
            }else{
                API.sendChat('@' + a.from + ' why do you want to do this? Please.');
                API.sendChat('@' + a.from + ' please don\'t make me do this.');
                data[a.fid].lolomgwtfbbqc = true;
            }
        };
        cmds.apocalypse = function(a){
            if(API.getUser(a.fid).permission >= 3){
                API.sendChat('/em [' + a.from + '] [!apocalypse] BRING FORTH THE APOCALYPSE!!!');
                var z = API.getUsers();
                for(var i = 0; i < z.length; i++){
                    API.moderateBanUser(z[i].id,0,-1);
                    API.moderateUnBanUser(z[i].id,0,-1);
                }
            }
        };
        
        function eventFilterChat(a){
            if(settings.filter){
                var msg = $('#chat-messages').children().last().text();
                for(var i = 0; i < chatFilter.length; i++){
                    if(msg.indexOf(chatFilter[i]) && API.getUser(a.fid).permission <= 1){
                        API.moderateDeleteChat(a.cid);
                        API.sendChat('@' + a.from + ' please do not ask for fans!');
                    }
                }
            }
            var b = a.message.match(/[A-Z]/g);
            if(a.message.length > 100 && b && b.length > 50 && !API.getUser(a.fid).permission){
                API.moderateDeleteChat(a.cid);
                API.sendChat('@' + a.from + ' please do not spam!');
            }
        }

        function saveSettings(){localStorage.setItem('SoundbotSave', JSON.stringify(settings));}
        
        if(typeof API === 'undefined') shutdown();
        else init();
