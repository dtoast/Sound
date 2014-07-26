/*

Soundbot Revamp

This might not work with the new plug update but w/e

Copyright (c) 2014 FourBit (Pr0Code)

Please refer to the Readme.md for license stuff

*/
(function () {
    var motdMsg = ["Welcome to the FourBit plug.dj room!"];
    var joinTime = Date.getTime();
    var blacklist = ['#SELFIE (Official Music Video)', 'Troll Song'];
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
        songLength: {
            enabled: true,
            limit: 10
        },
        blacklist: true,
        stats: true,
        historySkip: true,
        party: false,
        roulette: false,
        userCmds: true
    };

    function loadSettings() {
        var a = JSON.parse(localStorage.getItem('SoundbotSave'));
        if (a) settings = a;
        else if (typeof a === undefined) saveSettings();
    }

    //Init() and shutdown()

    function init() {
        API.on(API.CHAT, eventDataChat);
        API.on(API.CHAT, eventCommandChat);
        API.on(API.CHAT, eventFilterChat);
        API.on(API.USER_JOIN, eventJoin);
        API.on(API.USER_LEAVE, eventLeave);
        API.on(API.DJ_ADVANCE, eventDjAdvance);
        API.setVolume(0);
        loadSettings();
        blacklist();
        executeCommand();
        var zux = setInterval(saveSettings, 300000);
        zux();
        if (settings.woot) $('#woot').click();
        API.sendChat('/em now sprinting!');
    }

    function shutdown() {
        API.off(API.CHAT, eventDataChat);
        API.off(API.CHAT, eventCommandChat);
        API.off(API.CHAT, eventFilterChat);
        API.off(API.USER_JOIN, eventJoin);
        API.off(API.USER_LEAVE, eventLeave);
        API.off(API.DJ_ADVANCE, eventDjAdvance);
        API.setVolume(15);
        saveSettnigs();
        clearInterval(zux);
        clearInterval(yis);
        if (settings.motd.enabled) clearInterval(motdInt);
        delete data;
        delete settings;
        delete userData;
        delete executeCommand();
        API.sendChat('Soundbot Shutdown.');
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
            exeWarn: false
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
            exeWarn: false
        };
    }

    function eventLeave(a) {
        delete data[a.id];
    }

    function eventDataChat(a) {
        data[a.fromID].afkTime = Date.now();
        data[a.fromID].warning = false;
        data[a.fromID].roulChat = false;
        if(data[a.fromID].exeWarn === true){
            data[a.fromID].exeChat = true;
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
                if (w > settings.antiAfk.limit && !data[a[i].id].warning) {
                    API.sendChat('@' + z[i].username + ' AFK Time: ' + v + ' minutes. Chat soon or I will remove you.');
                    data[a[i].id].warning = true;
                    setTimeout(function() {
                        z = API.getWaitList();
                        for (var c in z) {
                            if (data[z[e].id].warning) {
                                API.sendChat('@' + z[e].username + ' last warning (AFK).');
                                data[z[e].id].removed = true;
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
            var motdInt = setInterval(function () {
                API.sendChat('/em ' + motdMsg[Math.floor(Math.random() * motdMsg.length)]);
            }, settings.motd.interval);
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
                        var c = new Array();
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
                    var b = new Array();
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
        if(settings.stats){
            var a = obj.lastPlay;
            if(typeof a === 'undefined') return void (0);
            var b = a.score.postive;
            var c = a.score.curates;
            var d = a.score.negative;
            API.sendChat('/em ' + a.media._previousAttributes.author + ' - ' +  a.media._previousAttributes.title + ' received ' + b + ' woots, ' + c + ' grabs, and ' + d + ' mehs!');
        }
        if(settings.songLength.enabled && obj.media.duration > settings.songLength.limit * 60){
            API.sendChat('@' + API.getDJ().username + ' your song is greater than the song limit (10 minutes)!');
            var a = API.getDJ().id;
            var b = new Array();
            b.push(a);
            if($('.cycle-toggle').hasClass('disabled')){
                $(this).click();
            }
            API.moderateLockWaitList(true, false);
            API.moderateForceSkip();
            API.sendChat('/em Adding user...');
            API.moderateMoveDJ(b[1], 3);
            b = [];
        }
    }

    function listenFor(a, b){
        API.on(API.CHAT, function(z){
            a = a.trim();
            b = b.trim();
            for (var i = 0; i < u.length; i++) {
                if (u[i].id === a) {
                    if (b === false) {
                        if (z.fromID === a || z.fromID === u[i].id && b === false) {
                            return true;
                        } else {
                            if (z.fromID !== a || z.fromID !== u[i].id && b === false) {
                                return false;
                            }
                        }
                    }
                    if (b === true) {
                        if (z.fromID === a || z.fromID === u[i].id) {
                            return true;

                            } else {
                                if (z.fromID !== a || z.fromID !== u[i].id && b === true) {
                                    return false;
                                }
                            }
                            if (z.fromID === a || a.fromID === u[i].id && b === true){
                                return z.message;
                            }
                        }
                    }
                }
                if (z.message === '!pass' && data[z.fromID].roulSelect && data[z.fromID].roulChat) API.moderateDeleteChat(z.chatID);
                if(this === true || this === false || this === z.message){
                    API.off(API.CHAT, this);
                }
            });
        }

        function eventCommandChat(a){
            function pre(){
                if(a.message.substr(1) === '!'){
                    return true;
                }
            }
            if(pre){
                var str = a.message.substr(2).trim();
                var opt = str.split('@') + 1;
                var arg = str.lastIndexOf(' ') + 1;
                var noarg = str.split(' ')[1];
                var from = a.from;
                var fromid = a.fromID;
                var chatid = a.chatID;
                var check = function(){
                        if(API.getUser(a.fromID).permission >= 2 && settings.userCmds){
                            return true;
                        }
                        else if(API.getUser(a.fromID).permission >= 2 && !settings.userCmds){
                            return true;
                        }
                        else if(API.getUser(a.fromID).permission <= 0 && settings.userCmds){
                            return true;
                        }
                        else if(API.getUser(a.fromID).permission <= 0 && !settings.userCmds){
                            return false;
                        }
                    };
                if (a.message.substr(1) === '!') API.moderateDeleteChat(chatid);
                var roul = new Array();
                var tempRoul = new Array();
                var safeRoul = new Array();
                arg = arg.toLowerCase();
                noarg = noarg.toLowerCase();
                str = str.toLowerCase();
                switch (str) {
                case 'help': if(check()){ API.sendChat('/em [' + from + '] Soundbot was just recoded, so please wait for commands. Ask staff for questions.') }break;
                case 'web': if(check()){ API.sendChat('/em [' + from + '] FourBit website: Soon!') }break;
                case 'ping': if(check()){ API.sendChat('/em [' + from + '] Pong!') }break;
                case 'link':
                    if(check()){
                        if (API.getMedia().format === 1) {
                            API.sendChat('/em [' + from + '] Link to current song: http://youtu.be/' + API.getMedia().cid);
                        } else {
                            var z = API.getMedia().cid;
                            SC.get('/tracks', {
                                ids: id,
                            }, function (tracks) {
                                API.sendChat('/em [' + from + '] Link to current song: ' + tracks[0].permalink_url);
                            });
                        }
                    }
                    break;
                case 'ad':
                    API.sendChat('/em [' + from + '] ADBlock (the version that isn\'t bad): https://www.getadblock.com');
                    break;
                case 'pic':
                    if(check()){
                        function t(e, z) {
                            if (e === null) {
                                return "";
                            }
                            z = z === null ? "big" : z;
                            var n;
                            var r;
                            r = e.match("[\\?&]v=([^&#]*)");
                            n = r === null ? e : r[1];
                            if (z == "small") {
                                return "http://img.youtube.com/vi/" + n + "/2.jpg";
                            } else {
                                return "http://img.youtube.com/vi/" + n + "/0.jpg";
                            }
                        }
                        var n = API.getMedia();
                        if (n.format == 1) {
                            API.sendChat("/em [" + from + "][!pic] " + t(n.cid));
                        } else {
                            var r = SC.get("/tracks/" + n.cid, function (e) {
                                return e.permalink_url;
                            });
                            var i = SC.get(r, function (e) {
                                var t = e.artwork;
                                return t;
                            });
                            if (!i) {
                                API.sendChat("Um, I kinda couldn't get the Soundcloud album link...");
                            } else {
                                API.sendChat("/em [" + from + "][!pic] " + i);
                            }
                        }
                    }
                    break;

                    //For now, bouncer + commands. User cmds will be done later.
                    //Start roulette
                case 'roul':
                    if (check()) {
                        if (noarg === 'start' && !settings.roulette) {
                            API.sendChat('/em [' + from + '] Started roulette! Type "!join" to play.');
                            settings.roulette = true;
                        }
                        if (noarg === 'stop' && settings.roulette) {
                            clearInterval();
                            settings.roulette = false;
                            data.roulSelect = false;
                            data.roulChat = false;
                            API.sendChat('/em [' + from + '] Stopped roulette! :frowning:');
                        }
                    }
                    break;
                case 'join':
                    if(check()){
                        for (var i = 0; i < roul.length; i++) {
                            if (roul[i] !== from && roul.length < 10) {
                                API.sendChat('/em [' + from + '] Joined roulette!');
                                roul.push(from);
                            } else {
                                API.sendChat('/em [' + from + '] It seems that you already joined!');
                            }
                        }
                    }
                    break;
                case 'start':
                    if (check() && settings.roulette) {
                        API.sendChat('/em [' + from + '] Game started!');
                        var y = Math.floor(Math.random() * roul.length);
                        var z = setInterval(function () {
                            API.sendChat('@' + roul[y] + ' you have the gun! Type !pass to pass it!!!');
                            tempRoul.push(y);
                            if (tempRoul[1] === roul[y]) {
                                for (var i = 0; i < u.length; i++) {
                                    if (tempRoul === u[i].username) {
                                        if (data[u[i].id].roulSelect && !data[u[i].id].roulChat) {
                                            data[u[i].id].roulChat = true;
                                            if (listenFor(u[i].id, false) === true && listenFor(u[i].id, true) === '!pass') {
                                                API.sendChat('/em [' + from + '] Passed the gun!');
                                                data[u[i].id].roulSelect = false;
                                                data[u[i].id].roulChat = false;
                                                tempRoul.pop(u[i].username);
                                                safeRoul.push(u[i].username);
                                                roul.pop(u[i].username);
                                            }
                                        }
                                    } else {
                                        clearInterval(this);
                                        z();
                                    }
                                }
                            } else {
                                clearInterval(this);
                                z();
                            }
                        }, 2000);
                        z();
                    }
                    break;

                    //End Roulette
                case 'add':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + ' used add]');
                                API.moderateAddDJ(u[i].id);
                            } else API.sendChat('/em [' + from + '] User not found.');
                        }
                    }
                    break;

                case 'remove':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + ' used remove]');
                                API.moderateRemoveDJ(u[i].id);
                            } else API.sendChat('/em [' + from + '] User not found.');
                        }
                    }
                    break;

                case 'move':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                if (arg !== null || undefined) {
                                    API.sendChat('/em [' + from + ' used move]');
                                    var z = API.getWaitList();
                                    var y = parseInt(arg);
                                    for (var c = 0; c < z.length; c++) {
                                        if (z[c].username !== u[i].username) {
                                            API.moderateAddDJ(u[c].id);
                                            API.moderateMoveDJ(u[c].id, y);
                                        } else {
                                            if (z[c].username === u[i].username) {
                                                API.moderateMoveDJ(u[c].id, y);
                                            }
                                        }
                                    }
                                }
                            } else API.sendChat('/em [' + from + '] User not found.');
                        }
                    }
                    break;

                case 'skip':
                    if (check()) {
                        API.moderateForceSkip();
                    }
                    break;

                case 'lockskip':
                    if (check()) {
                        if (noarg === 'op') {
                            API.sendChat('/em [' + from + ' used lockskip]');
                            var b = new Array();
                            b.push(API.getDJ());
                            if ($('.cycle-toggle').hasClass('disabled')) $(this).click();
                            API.moderateLockWaitList(true, false);
                            API.moderateForceSkip();
                            API.sendChat('@' + b[1].username + ' please pick another song because that one is overplayed!');
                            setTimeout(function () {
                                API.moderateMoveDJ(b[1].id, 5);
                            }, 500);
                        }
                        if (noarg !== 'op' || noarg === null || noarg === undefined) {
                            API.sendChat('/em [' + from + ' used lockskip]');
                            var b = new Array();
                            b.push(API.getDJ().id);
                            if ($('.cycle-toggle').hasClass('disabled')) $(this).click();
                            API.moderateLockWaitList(true, false);
                            API.moderateForceSkip();
                            setTimeout(function () {
                                API.moderateMoveDJ(b[1], 5);
                            }, 500);
                        }
                    }
                    break;

                case 'ban':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                if (arg !== null || undefined) {
                                    var z = parseInt(arg);
                                    if (z === 1) {
                                        API.sendChat('/em [' + from + ' used ban]');
                                        API.moderateBanUser(u[i].username, 1, API.BAN.HOUR);
                                    }
                                    if (z === 2) {
                                        API.sendChat('/em [' + from + ' used ban]');
                                        API.moderateBanUser(u[i].username, 1, API.BAN.DAY);
                                    }
                                    if (z === 3) {
                                        API.sendChat('/em [' + from + ' used ban]');
                                        API.moderateBanUser(u[i].username, 1, API.BAN.PERMA);
                                    } else if (z >= 4) API.sendChat('/em [' + from + '] Valid inputs are 1, 2, 3.');
                                }
                            } else API.sendChat('/em [' + from + '] User not found.');
                        }
                    }
                    break;
                case 'party':
                    if (API.getUser(fromid).permission === 5) {
                        if (!settings.party && noarg === null || noarg === undefined || arg === null || arg === undefined || opt === null || opt === undefined) {
                            settings.party = true;
                            API.sendChat('/em [' + from + ' started a party]');
                            API.moderateLockWaitList(true, true);
                            var z = API.getUsers();
                            var y = new Array();
                            for (var i = 0; i < z.length; i++) {
                                if (z[i].permission === 1) {
                                    y.push(z[i].id);
                                }
                            }
                            var x = setInterval(function () {
                                if (y.length !== 0) {
                                    for (var c = 0; c < y.length; c++) {
                                        API.moderateAddDJ(y[c].id);
                                    }
                                } else clearInterval(x);
                            }, 6e3);
                            API.moderateForceSkip();
                            $.ajax({
                                type: 'POST',
                                url: 'http://plug.dj/_/gateway/moderate.update_name_1',
                                contentType: 'application/json',
                                data: '{"service":"moderate.update_name_1","body":["Join the party! | FourBit"]}'
                            });
                            if ($('.cycle-toggle').hasClass('disabled')) {
                                $(this).click();
                            }
                        } else {
                            API.sendChat('/em [' + from + '] It seems that a party is already in progress!');
                        }
                        if (settings.party && noarg === 'end' || settings.party && noarg === 'stop') {
                            API.sendChat('/em [' + from + ' stopped the current party]');
                            $.ajax({
                                type: 'POST',
                                url: 'http://plug.dj/_/gateway/moderate.update_name_1',
                                contentType: 'application/json',
                                data: '{"service":"moderate.update_name_1","body":["FourBitProductions | plug.dj"]}'
                            });
                            API.moderateLockWaitList(false);
                            if ($('.cycle-toggle').hasClass('enabled')) {
                                $(this).click();
                            }
                        }
                    }
                    break;
                case 'status':
                    if (check()) {
                        var z = Date().getTime();
                        var y = Math.floor(joinTime - z);
                        API.sendChat('/em [' + from + '] Uptime: ' + y + ' ~ Party: ' + settings.party + ' ~ Blacklist: ' + settings.blacklist);
                    }
                    break;
                case 'woot':
                    if (check()) {
                        $('#woot').click();
                    }
                    break;
                case 'grab':
                    if (check()) {
                        $($('.curate').children('.menu').children().children()[0]).mousedown();
                    }
                    break;
                case 'kill':
                    if (check()) {
                        shutdown();
                    }
                    break;
                case 'reload':
                    if(check()){
                        shutdown();
                        $.getScript('http://raw.githubusercontent.com/Pr0Code/Sound/blob/master/bot.js');
                    }
                    break;
                case 'vr':
                    if (check()) {
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
                    if (check()) {
                        var z = $('#chat-messages').children();
                        for (var i = 0; i < z.length; i++) {
                            for (var c = 0; c < z[i].classList.length; c++) {
                                if (z[i].classList[c].indexOf('cid-') === 0) {
                                    API.moderateDeleteChat(z[i].classList[c].substr(4));
                                }
                            }
                        }
                        API.sendChat('/em [' + from + ' used clear]');
                    }
                    break;
                case 'lock':
                    if (check()) {
                        API.sendChat('/em [' + from + ' used lock]');
                        API.moderateLockWaitList(true, false);
                    }
                    break;
                case 'cycle':
                    if (check()) {
                        API.sendChat('/em [' + from + ' used cycle]');
                    }
                    break;
                case 'mute':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                data[u[i].id].mute = true;
                                API.sendChat('/em [' + from + ' muted ' + u[i].username + ']');
                            }
                        }
                    }
                    break;
                case 'unmute':
                    if (check()) {
                        if (data[fromid].mute === true) {
                            API.sendChat('/em [' + from + '] Tried unmuting themselves, but can\'t! Muahahahaha!!!');
                        } else {
                            for (var i in u) {
                                if (u[i].username === opt) {
                                    data[u[i].id].mute = false;
                                }
                            }
                        }
                    }
                    break;
                case 'kick':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + ' used kick]');
                                API.moderateBanUser(u[i].id, 1, API.BAN.HOUR);
                                setTimeout(function () {
                                    API.moderateUnbanUser(u[i].id);
                                    API.moderateUnBanUser(u[i].id);
                                    API.sendChat('/em [' + from + '] Kicked user can login now.');
                                }, 15000);
                            }
                        }
                    }
                    break;
                case 'reg':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + '] Removed ' + u[i].username + ' from the staff!');
                                API.moderateSetRole(u[i].id, API.ROLE.NONE);
                            }
                        }
                    }
                    break;
                case 'rdj':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a Resident DJ!');
                                API.moderateSetRole(u[i].id, API.ROLE.RESIDENTDJ);
                            }
                        }
                    }
                    break;
                case 'bouncer':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a bouncer!');
                                API.moderateSetRole(u[i].id, API.ROLE.BOUNCER);
                            }
                        }
                    }
                    break;
                case 'manager':
                    if (check()) {
                        for (var i in u) {
                            if (u[i].username === opt) {
                                API.sendChat('/em [' + from + '] Set ' + u[i].username + ' as a manager!');
                                API.moderateSetRole(u[i].id, API.ROLE.MANAGER);
                            }
                        }
                    }
                    break;
                case 'mehs':
                    if(check()){
                        var z = new Array();
                        for(var i = 0; i < u.length; i++){
                            for(var c = 0; c < u.length; c++){
                                if(u[i].vote === -1){
                                    z.push(u[i].username);
                                }
                                if(u[c].vote === -1){
                                    z.push(u[c].username);
                                }
                                if(API.getRoomScore().negative.length === z.length){
                                    API.sendChat('/em [' + from + '] Users who meh\'d: ' + z[x].join(' ') + '.');
                                    z = [];
                                }else{
                                    API.sendChat('/em [' + from + '] Uh oh! I can\'t retrive mehs!');
                                    z = [];
                                }
                            }
                        }
                    }
                    break;
                case 'motd':
                        if(check()){
                            if(noarg === 'off' || noarg === 'disable'){
                                settings.motd.enabled = false;
                                clearInterval(motdInt);
                                API.sendChat('/em [' + from + '] Motd disabled.');
                            }
                            if(noarg === 'on' || noarg === 'enable'){
                                  settings.motd.enable = true;
                                  clearInterval(motdInt);
                                  motd();
                                  API.sendChat('/em [' + from + '] Motd enabled.');
                            }
                            if(noarg === null || noarg === undefined){
                                API.sendChat('/em [' + from + '] Current message: ' + motdMsg[Math.floor(Math.random() * motdMsg.length)]);
                            }
                            if(noarg !== null || noarg !== undefined || noarg !== 'on' || noarg !== 'off' || noarg !== 'enable' || noarg !== 'disable'){
                                motdMsg = [];
                                motdMsg = [noarg];
                                clearInterval(motdInt);
                                motd();
                            }
                        }
                        break;
                    case 'cmdsettings':
                        if(check()){
                            if(noarg !== null || noarg !== undefined || noarg === undefined || noarg === null){
                                API.sendChat('/em [' + from + '] Command Settings | Usercmds: ' + settings.userCmds);
                            }
                            if(noarg === 'users'){
                                API.sendChat('/em [' + from + '] Users: ' + settings.userCmds + ' | on/enable/off/disable');
                            }
                            if(noarg === 'users' && arg === 'on' || arg === 'enable'){
                                if(!settings.userCmds){
                                    settings.userCmds = true;
                                    API.sendChat('/em [' + from + '] Users can now use commands.');
                                }else{
                                    API.sendChat('/em [' + from + '] Users already have commands!');
                                }
                            }
                            if(noarg === 'users' && arg === 'off' || arg === 'disable'){
                                settings.userCmds = false;
                                API.sendChat('/em [' + from + '] Users no longer have commands.');
                            }else{
                                API.sendChat('/em [' + from + '] User commands are already disabled!');
                            }
                        }
                        break;
                    case 'set':
                        if(check()){
                            if(noarg !== null || noarg !== undefined || noarg === undefined || noarg === null){
                                API.sendChat('/em [' + from + '] Items that can be set: woot, motd, antiafk, songlength, blacklist, stats, historyskip');
                            }
                            if(noarg === 'woot'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.woot){
                                        settings.woot = true;
                                        saveSettings();
                                        $('#woot').click();
                                        API.sendChat('/em [' + from + '] Woot is now enabled.');
                                    }else{
                                        API.sendChat('/em [' + from + '] It seems as if autowoot for me is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.woot){
                                            settings.woot = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] Woot is now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] It seems as if autowoot for me is already disabled!');
                                        }
                                    }else{
                                        API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                    }
                                }
                            }
                            if(noarg === 'motd'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.motd.enabled){
                                        settings.motd.enabled = true;
                                        saveSettings();
                                        clearInterval(motdInt);
                                        motd();
                                        API.sendChat('/em [' + from + '] Motd is now enabled.');
                                    }else{
                                        API.sendChat('/em [' + from + '] Motd is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.motd.enabled){
                                            settings.motd.enabled = false;
                                            saveSettings();
                                            clearInterval(motdInt);
                                            API.sendChat('/em [' + from + '] Motd is now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] Motd is already disabled!');
                                        }
                                    }else{
                                        API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                    }
                                }
                            }
                            if(noarg === 'antiafk'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.antiafk.enabled){
                                        settings.antiafk.enabled = true;
                                        saveSettings();
                                        API.sendChat('/em [' + from + '] AntiAFK is now enabled.');
                                    }else{
                                        API.sendChat('/em [' + from + '] AntiAFK is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.antiafk.enabled){
                                            settings.antiafk.enabled = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] AntiAFK is now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] AntiAFK is already disabled!');
                                        }
                                    }
                                }else{
                                    API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                }
                            }
                            if(noarg === 'songlength'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.songLength.enabled){
                                        settings.songLength.enabled = true;
                                        saveSettings();
                                        API.sendChat('/em [' + from + '] Songlength-check now enabled.');
                                    }else{
                                        API.sendChat('/em [' + from + '] Songlength-check is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.songLength.enabled){
                                            settings.songLength.enabled = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] Songlength-check now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] Sondlength-check is already disabled!');
                                        }
                                    }
                                }else{
                                    API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                }
                            }
                            if(noarg === 'blacklist'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.blacklist){
                                        settings.blacklist = true;
                                        saveSettings();
                                        API.sendChat('/em [' + from + '] Blacklist now enabled (will resume on dj-advance).');
                                    }else{
                                        API.sendChat('/em [' + from + '] Blacklist is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.blacklist){
                                            settings.blacklist = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] Blacklist now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] Blacklist is already disabled!');
                                        }
                                    }
                                }else{
                                    API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                }
                            }
                            if(noarg === 'stats'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.stats){
                                        settings.stats = true;
                                        saveSettings();
                                        API.sendChat('/em [' + from + '] Stats now enabled.');
                                    }else{
                                        API.sendChat('/em [' + from + '] Stats are already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.stats){
                                            settings.stats = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] Stats now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from + '] Stats are already disabled!');
                                        }
                                    }
                                }else{
                                    API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                }
                            }
                            if(noarg === 'historyskip'){
                                if(arg === 'on' || arg === 'enable'){
                                    if(!settings.historySkip){
                                        settings.historySkip = true;
                                        saveSettings();
                                        API.sendChat('/em [' + from + '] HistorySkip now enabled (will resume on dj-advance).');
                                    }else{
                                        API.sendChat('/em [' + from + '] HistorySkip is already enabled!');
                                    }
                                }else{
                                    if(arg === 'off' || arg === 'disable'){
                                        if(settings.historySkip){
                                            settings.historySkip = false;
                                            saveSettings();
                                            API.sendChat('/em [' + from + '] HistorySkip now disabled.');
                                        }else{
                                            API.sendChat('/em [' + from  + '] HistorySkip is already disabled!');
                                        }
                                    }
                                }else{
                                    API.sendChat('/em [' + from + '] Valid inputs: on/enable off/disable');
                                }
                            }
                        }
                        break;
                    case 'exe':
                        if(check()){
                            var arr = new Array();
                            for(var i in u){
                                if(u[i].username === opt){
                                    API.sendChat('[' + from + '] @' + u[i].username + ' you are being executed for committing crimes against the community. Any last words?');
                                    arr.push(u[i].id);
                                    data[u[i].id].exeWarn = true;
                                    setInterval(function(){
                                        if(data[u[i].id].exeChat === true){
                                            clearInterval(this);
                                            continue;
                                            var z = API.getUsers();
                                            for(var c = 0; c < z.length; c++){
                                                if(arr[1] !== z[c].id){
                                                    API.sendChat('/em Wow. ' + u[i].username + ' left. GET BANNED ANYWAY!!!');
                                                    $.ajax({
                                                        type: 'POST',
                                                        url: 'http://plug.dj/_/gateway/moderate.ban_1',
                                                        contentType: 'application/json',
                                                        data: '{"service":"moderate.ban_1","body":["' + arr[1] + '"]}'
                                                    });
                                                    arr = [];
                                                }else{
                                                    API.sendChat('/em Goodbye.');
                                                    API.moderateBanUser(arr[1], 1, API.BAN.PERMA);
                                                    arr = [];
                                                }
                                            }
                                        }
                                    }, 1000);
                                    
                                }
                            }
                        }
                        break;
                }
            }
        }

        //Whitelist names have to be spelled EXacTlY as they actually are, else, it won't work.

        function antiRemove() {
            var a = $('#chat-messages').last().text();
            var whitelist = ["Ambassador1", "Admin1", "Admin2", "Ambassador2"];
            for (var i = 0; i < a.length; i++) {
                for (var c in u) {
                    for (var x = 0; x < whitelist.length; x++) {
                        var z = u[c].permission;
                        if (a[i].split(' ')[0] === u[c].username) {
                            if (u[c].permission >= 3 && u[c].permission <= 5) {
                                API.sendChat('@' + u[c].username + ' pls don\'t do that m8, you are not manager.');
                                var b = a[i].split(' ')[2];
                                API.moderateSetRole(a[i].id, z);
                            } else {
                                if (a[i].split(' ')[0] !== null) {
                                    if (u[c].username !== whitelist[x]) {
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
        
        function eventFilterChat(a){
            if(settings.filterChat){
                var from = a.from;
                var fromid = a.fromID;
                var chatid = a.chatID;
                var msg = a.message;
                switch(msg){
                    case 'shit': API.moderateDeleteChat(chatid) break;
                    case 'fuck': API.moderateDeleteChat(chatid) break;
                    case 'fak' : API.moderateDeleteChat(chatid) break;
                    case 'fuk' : API.moderateDeleteChat(chatid) break;
                    case 'shet': API.moderateDeleteChat(chatid) break;
                    case 'fan' : API.moderateDeleteChat(chatid) break;
                    case 'skip': API.moderateDeleteChat(chatid) break;
                }
                if(msg.indexOf('fan') !=-1){
                    API.moderateDeleteChat(chatid);
                }
                if(msg.indexOf('fan4fan') !=-1){
                    API.moderateDeleteChat(chatid);
                }
                if(msg.indexOf('friends please') !=-1){
                    API.moderateDeleteChat(chatid);
                }
                if(msg.indexOf('friend4friend') !=-1){
                    API.moderateDeleteChat(chatid);
                }
                if(msg.indexOf('please friend me') !=-1){
                    API.moderateDeleteChat(chatid);
                }
            }
        }

        function saveSettings(){localStorage.setItem('SoundbotSave', JSON.stringify(settings));}
        
        if(typeof API === 'object') shutdown();
        else init();

}).call(this);
