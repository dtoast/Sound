/*

Soundbot Revamp

This might not work with the new plug update but w/e

Copyright (c) 2014 FourBit

Please refer to the Readme.md for license stuff

*/
//(function(){
    var motdMsg = ["Welcome to the FourBit plug.dj room!"],
    joinTime = Date.now(),
    blacklist = ['#SELFIE (Official Music Video)', 'Troll Song'],
    cmds = {},
    rcon = false,
    topkek = null,
    motdInt,
    _noUpdate = false,
    afkChk,
    socket,
    util = {
        getMath: function(a){
            a=~~(a/6000);
            var b=(a-~~(a/60)*60),
            c=(a-b)/60,
            e='';
            e+=c+'h';
            e+=b<10?'0':'';
            e+=b;
            return e;
        }
    },
    settings = {
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
        cooldown: false,
        queuelist: [],
        lockdown: false,
        checkUpdates: true,
        hasPendingUpdate: false,
        version: '1.1'
    };

    function checkUpdate(){
        $.ajax({
            url: 'http://astroshock.bl.ee/_/update.json?callback=_msg',
            success: function(data){
                var text = '';
                for(var i = 0; i < data.length; i++){
                    var _return = data[i];
                    text+=_return.version;
                    if(parseInt(text)>parseInt(settings.version)){
                        if(!_noUpdate){
                            shutdown();
                            API.sendChat('/em Updating...');
                            setTimeout(function(){
                                $.getScript('https://raw.githubusercontent.com/Pr0Code/Sound/master/bot.js');
                            }, 1000);
                        }else{
                            settings.hasPendingUpdate = true;
                            API.sendChat('/em An update is available for Soundbot. Please type !update to get it!');
                        }
                    }
                    text='';
                }
            },
            error: function(){
                API.sendChat('/em Failed to get the update json.');
            }
        });
    }

    function loadSettings(){
        //max 3 obj
        var a = JSON.parse(localStorage.getItem('SoundbotSave'));
        if(typeof a === 'undefined') return;
        var b = Object.keys(settings);
        if(a){
            for(var i = 0; i < b.length; i++){
                if(a[b[i]]!==null&&settings[b[i]]!==null){
                    settings[b[i]] = a[b[i]];
                }else{
                    if(typeof settings[b[i]] === 'object'&&a[b[i]]!==null){
                        var c = Object.keys(settings[b[i]]);
                        for(var x = 0; x < c.length; x++){
                            if(a[b[i]][c[x]]!==null&&settings[b[i]][c[x]]!==null){
                               settings[b[i]][c[x]] = a[b[i]][c[x]];
                            }
                        }
                    }else{
                        if(typeof settings[b[i]][c[x]] === 'object'&&a[b[i]][c[x]]!==null){
                            var e = Object.keys(settings[b[i]][c[x]]);
                            for(var n = 0; n < e.length; n++){
                                if(a[b[i]][c[x]][e[n]]!==null&&settings[b[i]][c[x]][e[n]]!==null){
                                    settings[b[i]][c[x]][e[n]] = a[b[i]][c[x]][e[n]];
                                }
                            }
                        }
                    }
                }
            }
        }else{
            saveSettings();
        }
    }

    function init(){
        if(location.pathname !== '/astroparty')return API.sendChat('/em Soundbot can\'t be started because you can only use it in http://plug.dj/astroparty. Please visit http://github.com/FourBitus/Sound for more info.');
        API.on({
            'chat':eventDataChat,
            'chat':eventCommandChat,
            'chat':eventFilterChat,
            'userJoin':eventJoin,
            'userLeave':eventLeave,
            'advance':eventDjAdvance
        });
        loadSettings();
        API.setVolume(0);
        if (settings.woot) $('#woot').click();
        motd();
        AntiAFK();
        API.sendChat('/em now sprinting!');
        checkUpdate();
        afkChk = setInterval(AntiAFK,60000);
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
        if(settings.antiAfk.enabled) clearInterval(antiAfk);
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
            roulSelect: false,
            roulChat: false,
            exeChat: false,
            exeWarn: false,
            afk: false,
            afkMsg: 'I\'m away right now. Message me later!',
            lolomgwtfbbqc: false
        };
    }

    function eventJoin(a) {
        data[a.id] = {
            username: a.username,
            afktime: Date.now(),
            warning: false,
            removed: false,
            roulSelect: false,
            roulChat: false,
            exeChat: false,
            exeWarn: false,
            afk: false,
            afkMsg: 'I\'m away right now. Message me later!',
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
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.moderateBanUser(a.fid, 0, -1);
                API.moderateUnbanUser(a.fid,0,-1);
                API.sendChat('>:D');
                API.sendChat('But the user can login now ;D');
                data[a.fid].lolomgwtfbbqc = false;
            }, 2000);
        }
    }

    function AntiAFK(){
        if (settings.antiAfk.enabled){
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

    function motd() {
        if (settings.motd.enabled) {
            motdInt = function(){
                setInterval(function(){
                    API.sendChat('/em ' + motdMsg[Math.floor(Math.random() * motdMsg.length)]);
                }, settings.motd.interval);
            };
            motdInt();
        }
    }
    
    function eventDjAdvance(obj) {
        checkUpdate();
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
                        API.moderateMoveDJ(c[1], 5);
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
            if(typeof z === 'undefined') return;
            var y = z.score.positive;
            var x = z.score.curates;
            var w = z.score.negative;
            API.sendChat('/em ' + z.media.author + ' - ' +  z.media.title + ' received ' + y + ' woots, ' + x + ' grabs, and ' + w + ' mehs!');
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

        var chatFilter = ['friend', 'givemevibe', 'friendme'];
            
        function eventCommandChat(a){
            if(a.message.indexOf('fan me') || a.message.indexOf('fanme') || a.message.indexOf('fan')){
                API.sendChat('@'+a.from+' where have you been. There are no more fans.');
                data[a.fid].lolomgwtfbbqc = true;
                API.sendChat('but if you type "!lolomgwtfbbq" it will do something awesome!');
            }
            if(a.message.substr(0,1)=='!'){
                if(API.getUser(a.fid).role === 0 && settings.userCmds){
                    try{
                        var str = a.message.split(' ')[0].substr(1).toLowerCase();
                        var cdata = {
                            message:a.message,
                            fid:a.fid,
                            from:a.from,
                            cid:a.cid
                        };
                        //API.moderateDeleteChat(a.cid);
                        switch(str){
                            case 'help':           cmds.help(cdata);        break;
                            case 'cmdlist':        cmds.cmdlist(cdata);     break;
                            case 'theme':          cmds.theme(cdata);       break;
                            case 'link':           cmds.link(cdata);        break;
                            case 'staff':          cmds.staff(cdata);       break;
                            case 'ad':             cmds.ad(cdata);          break;
                            case 'emoji':          cmds.emoji(cdata);       break;
                            case 'ba':             cmds.ba(cdata);          break;
                            case 'eta':            cmds.eta(cdata);         break;
                        }
                    }catch(e){
                        API.sendChat('/em [' + a.from + '] Aww! Such Fail :frowning: (Internal Command Error).');
                        shutdown();
                    }
                }
            }else if(API.getUser(a.fid).role >= 1){
                var str = a.trim().substr(1).split(' ')[0].toLowerCase();
                var cdata = {
                    message: a.message,
                    fid: a.fid,
                    from: a.from,
                    cid: a.cid
                };
                //API.moderateDeleteChat(a.cid);
                switch(str){
                    case 'help':           cmds.help(cdata);        break;
                    case 'cmdlist':        cmds.cmdlist(cdata);     break;
                    case 'theme':          cmds.theme(cdata);       break;
                    case 'link':           cmds.link(cdata);        break;
                    case 'staff':          cmds.staff(cdata);       break;
                    case 'ad':             cmds.ad(cdata);          break;
                    case 'emoji':          cmds.emoji(cdata);       break;
                    case 'ba':             cmds.ba(cdata);          break;
                    case 'eta':            cmds.eta(cdata);         break;
                    case 'ping':           cmds.ping(cdata);        break;
                    case 'status':         cmds.status(cdata);      break;
                    case 'ban':            cmds.ban(cdata);         break;
                    case 'pong':           cmds.pong(cdata);        break;
                    case 'queue':          cmds.queue(cdata);       break;
                    case 'afk':            cmds.afk(cdata);         break;
                    case 'afkdisable':     cmds.afkdisable(cdata);  break;
                    case 'kick':           cmds.kick(cdata);        break;
                    case 'lolomgwtfbbq':   cmds.lolomgwtfbbq(cdata);break;
                    case 'apocalypse':     cmds.apocalypse(cdata);  break;
                    case 'banall':         cmds.kickall(cdata);     break;
                    case 'reg':            cmds.reg(cdata);         break;
                    case 'rdj':            cmds.rdj(cdata);         break;
                    case 'bouncer':        cmds.bouncer(cdata);     break;
                    case 'cmdsettings':    cmds.cmdsettings(cdata); break;
                    case 'clear':          cmds.clear(cdata);       break;
                    case 'add':            cmds.add(cdata);         break;
                    case 'remove':         cmds.remove(cdata);      break;
                    case 'move':           cmds.move(cdata);        break;
                    case 'mute':           cmds.mute(cdata);        break;
                    case 'unmute':         cmds.unmute(cdata);      break;
                    case 'say':            cmds.say(cdata);         break;
                    case 'skip':           cmds.skip(cdata);        break;
                    case 'settings':       cmds.settings(cdata);    break;
                    case 'sayhellotoadmin':cmds.sayhellotoa(cdata); break;
                    case 'kill':           cmds.kill(cdata);        break;
                    case 'lockskip':       cmds.lockskip(cdata);    break;
                    case 'lockdown':       cmds.lockdown(cdata);    break;
                    case 'wayzrgwashere':  cmds.wayzrg(cdata);      break;
                    case 'ghost':          cmds.ghost(cdata);        break;
                    default: return API.sendChat('/em [' + a.from + '] [!' + cmd + '] Uknown command.');
                }
                checkUpdate();
                if(settings.hasPendingUpdate){
                    if(a.message.substr(1).toLowerCase()==='update'&&API.getUser(a.fid).role>=2){
                        shutdown();
                        API.sendChat('/em ['+a.from+'] [!update] Updating...');
                        setTimeout(function(){
                            $.getScript('http://raw.githubusercontent.com/Pr0Code/Sound/blob/master/bot.js');
                        }, 1000);
                    }
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
            if(API.getUser(a.fid).role >= 2) API.sendChat('/em [' + a.from + '] [!ping] Pong!');
        };
        cmds.status = function(a){
            if(API.getUser(a.fid).role >= 2){

            }
        };
        cmds.ban = function(a){
            if(API.getUser(a.fid).role >= 2){
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
            if(API.getUser(a.fid).role >= 2){
                var msg = '';
                settings.queuelist.length === 0 ? msg += 'No users being added!' : msg += 'Users being added: ' + settings.queuelist.join(', ');
                API.sendChat('/em [' + a.from + '] [!queuelist] ' + msg);
              msg = '';
            }
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
            if(API.getUser(a.fid).role >= 2){
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
            if(API.getUser(a.fid).role >= 2){
                var user = a.message.split(' ')[1].substr(1),
                arg = a.message.split(' ')[2].substr(1).toLowerCase();
                for(var i in u){
                    if(u[i].username === user&&u[i].role<API.getUser(a.fid).role){
                        var b = ~~(parseInt(arg)*1000);
                        API.sendChat('/em ['+a.from+' used kick]');
                        API.moderateBanUser(u[i].id, -1, 0);
                        setTimeout(function(){
                            API.moderateUnbanUser(u[i].id);
                            API.moderateUnbanUser(u[i].id);
                            API.moderateUnbanUser(u[i].id);
                            API.sendChat('/em ['+a.from+'] [!kick] Kicked user can login now!');
                        }, b);
                    }
                }
            }
        };
        cmds.lolomgwtfbbq = function(a){
            if(API.getUser(a.fid).role >= 3){
                API.sendChat('[' + a.from + '] [!lolomgwtfbbq] Oh god. What have you done.');
                var array =[];
                setTimeout(function(){
                    API.sendChat('[' + a.from + '] [!lolomgwtfbbq] Something very bad is about to happen... HIDE YO KIDS');
                }, 1000);
                if(API.getWaitList().length === 0)return API.sendChat('/em ['+a.from+'] No users in waitlist.');
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
                            setTimeout(function(){clearInterval(f);},1000);
                        }
                    }
                }, 1500);
            }else{
                API.sendChat('@' + a.from + ' why do you want to do this? Please.');
                API.sendChat('@' + a.from + ' please don\'t make me do this.');
                API.sendChat('@'+a.from+' don\'t say do it again...');
                data[a.fid].lolomgwtfbbqc = true;
            }
        };
        cmds.apocalypse = function(a){
            if(API.getUser(a.fid).role >= 3){
                API.sendChat('/em [' + a.from + '] [!apocalypse] BRING FORTH THE APOCALYPSE!!!');
                var z = API.getUsers();
                for(var i = 0; i < z.length; i++){
                    API.moderateBanUser(z[i].id,0,-1);
                    API.moderateUnbanUser(z[i].id,0,-1);
                }
            }
        };
        cmds.banall = function(a){
            if(API.getUser(a.fid).role >= 5){
                API.sendChat('/em [' + a.from + '] [!kickall] Kicking all users...');
                for(var i = 0; i < u.length; i++){
                    for(var c = 0; c < u.length; c++){
                        if(u[i].role < 1 || u[c].role < 1){
                            API.moderateBanUser(u[i].id, 0, -1);
                            API.moderateBanUser(u[c].id, 0, -1);
                        }
                    }
                }
            }
        };
        cmds.reg = function(a){
            if(API.getUser(a.fid).role >= 3){
                var opt = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === opt && (u[i].role > 0 || API.getUser(a.fid).role > 2) && API.getUser(a.fid).username !== u[i].username){
                        API.sendChat('/em [' + a.from + '] [!reg] Giving ' + u[i].username + ' no permissions...');
                        API.moderateSetRole(u[i].id, API.ROLE.NONE);
                    }
                }
            }
        };
        cmds.rdj = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === opt && (u[i].role < 1 || API.getUser(a.fid).role > 2) && API.getUser(a.fid).username !== u[i].username){
                        API.sendChat('/em [' + a.from + '] [!rdj] Setting ' + u[i].username + ' as a Resident DJ...');
                        API.moderateSetRole(u[i].id, API.ROLE.RESIDENTDJ);
                    }
                }
            }
        };
        cmds.bouncer = function(a){
            if(API.getUser(a.fid).role >= 3){
                var opt = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === opt && (u[i].role < 2 || API.getUser(a.fid).role > 3) && API.getUser(a.fid).username !== u[i].username){
                        API.sendChat('/em [' + a.from + '] [!bouncer] Setting ' + u[i].username + ' as a bouncer...');
                        API.moderateSetRole(u[i].id, API.ROLE.BOUNCER);
                    }
                }
            }
        };
        cmds.cmdsettings = function(a){
            if(API.getUser(a.fid).role >= 3){
                var opt = a.message.split(' ')[1].substr(1),
                arg = a.message.split(' ')[2].substr(1),
                e = '';
                if(opt === 'users'){
                    if(!settings.userCmds){
                        if(arg === 'on' || arg === 'enable'){
                            settings.userCmds = true;
                            settings.userCmds?e+='enabled':e+='disabled';
                            API.sendChat('/em [' + a.from + '] [!cmdsettings] User commands now ' + e);
                        }
                    }else{
                        if(settings.userCmds){
                            if(arg === 'off' || arg === 'disable'){
                                settings.userCmds = false;
                                settings.userCmds?e+='enabled':e+='disabled';
                                API.sendChat('/em [' + a.from + '] [!cmdsettings] User commands now ' + e);
                            }
                        }
                    }
                }
                e = '';
            }
        };
        cmds.clear = function(a){
            if(API.getUser(a.fid).role >= 3){
                var b = $('#chat-messages').children();
                for(var i = 0; i < b.length; i++){
                    for(var c = 0; c < b[i].classList.length; c++){
                        if(b[i].classList[c].indexOf('cid-') === 0){
                            API.moderateDeleteChat(b[i].classList[c].substr(4));
                            API.sendChat('/em [' + a.from + '] [!clear] Cleared all chat I can see');
                        }
                    }
                }
            }
        };
        cmds.add = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1),
                arg = a.message.split(' ')[2].substr(1),
                e = '';
                for(var i in u){
                    if(u[i].username === opt){
                        var z = parseInt(arg);
                        if(z > 50)return;
                        else{
                            API.sendChat('/em [' + a.from + '] [!add] Adding ' + u[i].username + ' to position ' + z.toString());
                            API.moderateLockWaitList(true, false);
                            if(API.getWaitList().length >= 50){
                                settings.queuelist.push(u[i].id);
                                settings.queuelist.length>1?e+='users':e+='user';
                                API.sendChat('/em Queue: ' + settings.queuelist.length + e + ' being added.');
                                do{
                                    API.moderateAddDJ(u[i].id);
                                    API.moderateMoveDJ(u[i].id, z);
                                    settings.queuelist.pop(u[i].id);
                                    e='';
                                }while(queue());
                            }else{
                                API.moderateLockWaitList(true, false);
                                API.moderateAddDJ(u[i].id, z);
                                e='';
                            }
                        }
                        if(z>=0&&z<=50){
                            API.sendChat('/em [' + a.from + '] [!add] Adding ' + u[i].username + ' to the last position');
                            API.moderateLockWaitList(true, false);
                            if(API.getWaitList().length >= 50){
                                settings.queuelist.push(u[i].id);
                                settings.queuelist.length>1?e+='users':'user';
                                API.sendChat('/em Queue: ' + settings.queuelist.length + e + ' being added.');
                                do{
                                    API.moderateAddDJ(u[i].id);
                                    settings.queuelist.pop(u[i].id);
                                    e='';
                                }while(queue());
                            }else{
                                API.moderateAddDJ(u[i].id);
                            }
                        }
                    }
                }
                e = '';
            }
        };
        cmds.remove = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === opt){
                        API.sendChat('/em [' + a.from + '] [!remove] Removing ' + u[i].username + ' from position ' + API.getWaitListPosition(u[i].id) + '...');
                        API.moderateRemoveDJ(u[i].id);
                    }
                }
            }
        };
        cmds.move = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1),
                arg = a.message.split(' ')[2].substr(1),
                e = '';
                var z = parseInt(arg);
                if(arg === null) return;
                if(opt === null) return;
                for(var i in u){
                    if(u[i].username === opt){
                        if(API.getWaitListPosition(u[i].id) === -1 && API.getDJ().username !== u[i].username){
                            API.sendChat('/em [' + a.from + '] [!move] Adding and moving ' + u[i].username + ' to position ' + arg);
                            API.moderateLockWaitList(true, false);
                            if(API.getWaitList().length >= 50){
                                settings.queuelist.push(u[i].id);
                                settings.queuelist.length>1?e+='users':'user';
                                API.sendChat('/em Queue: ' + settings.queuelist.length + e + ' being added.');
                                var b = parseInt(arg);
                                if(b <= 50 && b >= 1){
                                    do{
                                        API.moderateAddDJ(u[i].id);
                                        API.moderateMoveDJ(u[i].id, b);
                                        e='';
                                    }while(queue());
                                }
                            }else{
                                API.sendChat('/em [' + a.from + '] [!move] Addind and moving ' + u[i].username + ' to position ' + arg);
                                API.moderateLockWaitList(true, false);
                                API.moderateAddDJ(u[i].id);
                                API.moderateMoveDJ(u[i].id, z);
                            }
                        }
                        if(API.getWaitListPosition(u[i].id) <= 50 && API.getWaitListPosition(u[i].id) >= 1 && z <= 50 && z >= 1){
                            API.sendChat('/em [' + a.from + '] [!move] Moving ' + u[i].username + ' to position ' + arg);
                            API.moderateMoveDJ(u[i].id, z);
                        }
                    }
                }
            }
        };
        cmds.mute = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1);
                var arg = a.message.split(' ')[2].substr(1);
                var str;
                if(arg === 'short'){
                    str = API.MUTE.SHORT;
                }else if(arg === 'med'||arg === 'medium'){
                    str = API.MUTE.MEDIUM;
                }else if(arg === 'long'){
                    str = API.MUTE.LONG;
                }else if(arg===undefined||arg===null){
                    str = API.MUTE.LONG;
                }
                for(var i in u){
                    if(u[i].username === opt){
                        API.sendChat('/em [' + a.from + '] [!mute] Muted ' + u[i].username);
                        API.moderateMuteUser(u[i].id, 1, str);
                    }
                }
            }
        };
        cmds.unmute = function(a){
            if(API.getUser(a.fid).role >= 2){
                var opt = a.message.split(' ')[1].substr(1);
                for(var i in u){
                    if(u[i].username === opt && API.getUser(a.fid) !== u[i].id){
                        API.sendChat('/em [' + a.from + '] [!unmute] Unmuted ' + u[i].username);
                        API.moderateUnmuteUser(u[i].id);
                    }
                }
            }
        };
        cmds.say = function(a){
            if(API.getUser(a.fid).role >= 2){
                var arg = a.message.split(' ')[1].substr(1);
                API.sendChat('/em [' + a.from + '] [!say] ' + arg);
            }
        };
        cmds.skip = function(a){
            if(API.getUser(a.fid).role >= 2){
                API.sendChat('/em [' + a.from + '] [!skip] Skipping current song...');
                API.moderateForceSkip();
            }
        };
        cmds.settings = function(a){
            if(API.getUser(a.fid).role >= 3){
                API.sendChat('/em [' + a.from + '] [!settings] ' + Object.keys(settings).join(', '));
            }
        };
        cmds.sayhellotoa = function(a){
            var arg = a.message.split(' ')[1].substr(1);
            var b = arg.lastIndexOf('.')+2;
            var test;
            if(a.message.substr(b)==undefined||null){
                b=arg.lastIndexOf('.')-1;
                if(a.message.substr(b,1).match(/[A-Z]/g))test+='.';else test+='';
            }else test+='';
            arg==undefined||null?arg='':arg+=test;
            var admins = API.getAdmins();
            for(var i = 0; i < admins.length; i++){
                API.sendChat('/em [' + a.from + '] [!sayhellottoadmin] Hi @'+admins[i].username+'! '+arg+test);
            }
        };
        cmds.kill = function(a){
            if(API.getUser(a.fid).role >= 3){
                shutdown();
            }
        };
        cmds.lockskip = function(a){
            if(API.getUser(a.fid).role >= 2){
                var arg = a.message.split(' ')[1].substr(1);
                if(arg === 'op'){
                    API.moderateLockWaitList(true, false);
                    if($('.cycle-toggle').hasClass('enabled')){
                        $(this).click();
                    }
                    API.sendChat('/em @' + API.getDJ().username + ' that song is overplayed. Please pick another.');
                    var b = [];
                    b.push(API.getDJ().id);
                    API.moderateForceSkip();
                    API.moderateMoveDJ(b[1], 3);
                    API.moderateLockWaitList(false);
                    $('.cycle-toggle').click();
                    b = [];
                }else{
                    if(arg !== 'op' || !arg || isNaN(arg) || arg === null || arg === undefined || typeof arg === boolean){
                        API.moderateLockWaitList(true, false);
                        if($('.cycle-toggle').hasClass('enabled')){
                            $(this).click();
                        }
                        var c = [];
                        c.push(API.getDJ().id);
                        API.moderateForceSkip();
                        API.moderateMoveDJ(c[1], 3);
                        API.moderateLockWaitList(false);
                        $('.cycle-toggle').click();
                        c = [];
                    }
                }
            }
        };
        cmds.lockdown = function(a){
            if(API.getUser(a.fid).role >= 3){
                var arg = a.message.split(' ')[1].substr(1);
                if(arg === 'enable' || arg === 'on' && !settings.lockdown){
                    settings.lockdown = true;
                    saveSettings();
                    API.on(API.CHAT, lel);
                    function lel(z){
                        if(settings.lockdown && API.getUser(z.fid).role === 0) API.moderateDeleteChat(z.cid);
                        API.sendChat('/em [' + a.from + '] [!lockdown] Lockdown enabled.');
                    }
                }
                if(arg === 'disable' || arg === 'off' && settings.lockdown){
                    settings.lockdown = false;
                    saveSettings();
                    API.off(API.CHAT, lel);
                    API.sendChat('/em [' + a.from + '] [!lockdown] Lockdown disabled.');
                }
            }
        };
        cmds.wayzrg = function(a){
            if(API.getUser(a.fid).role >= 4 && API.getUser(a.fid).role <= 5){
                var b = ["http://i.imgur.com/FDQHwvw.jpg", "http://i.imgur.com/qMtYJYr.jpg", "http://i.imgur.com/11NRhYU.jpg", "http://i.imgur.com/Qe74iKH.jpg", "http://i.imgur.com/PQjlyw5.jpg", "http://i.imgur.com/UCc1xo1.jpg", "http://i.imgur.com/dSSsQFQ.jpg"];
                var c = Math.floor(Math.random() * b.length);
                API.sendChat('/em [' + a.from + '] [!wayzrgwashere] ' + b[c]);
            }
        };
        cmds.ghost = function(a){
            if(API.getUser(a.fid).role >= 2){
                API.sendChat('/em ['+a.from+'] [!ghost] Checking for ghost users and removing them...');
                API.moderateLockWaitList(true, false);
                API.moderateLockWaitList(false);
            }
        };

        function queue(){
            API.once(API.WAIT_LIST_UPDATE,banana);
            function banana(){
                if(API.getWaitList().length < 50){
                    API.ofF(API.WAIT_LIST_UPDATE,this);
                    topkek = true;
                    setTimeout(function(){
                        topkek = null;
                    }, 100);
                }else{
                    API.off(API.WAIT_LIST_UPDATE,this);
                    topkek = false;
                    setTimeout(function(){
                        topkek = null;
                    }, 100);
                }
            }
        }
        
        function eventFilterChat(a){
            if(settings.filter){
                var msg = $('#chat-messages').children().last().text();
                for(var i = 0; i < chatFilter.length; i++){
                    if(msg.indexOf(chatFilter[i]) && API.getUser(a.fid).role <= 1){
                        API.moderateDeleteChat(a.cid);
                        API.sendChat('@' + a.from + ' please do not ask for fans!');
                    }
                }
            }
            var b = a.message.match(/[A-Z]/g);
            if(a.message.length > 100 && b && b.length > 50 && !API.getUser(a.fid).role){
                API.moderateDeleteChat(a.cid);
                API.sendChat('@' + a.from + ' please do not spam!');
            }
        }

        function saveSettings(){
            localStorage.setItem('SoundbotSave', JSON.stringify(settings));
        }
        
        if(typeof API === 'undefined') shutdown();
        else init();
//}());
