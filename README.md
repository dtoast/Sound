Soundbot <> plug.dj
======

###Rationale

Soundbot is written in Javascript to take advantage of [plug.dj's](http://plug.dj) API.
There are bugs and if you would like to help squash them, please make an issue if you encounter, and try to include the following:

1. Short, detailed description
2. Console error (Press F12 -> console tab, it should say on the right [bot.js]. On the left is the error.)
3. Line number (this may not be always available)
4. 

If you are new to Javascript, and would like to contribute, [here is a link to a pretty good website that helps with the basics.](http://codecademy.com). 

For more advanced stuff and syntax highlighting, [go here to look at some documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference).

###__*This was designed to be run on FireFox*__
__If you can help with some compatibilty with chrome, that'd be great.__

####Uniform

This is meant for a guideline on how the code is easier to read and evaluate.

----------

###Edit: 
> Soundbot is now __open source__ meaning you can edit and just include the link to the repo.
I decided that to help people, there can't be restrictions.

### Soundbot has been updated!
#### Version 1.0 is here and includes the following:
1. Complete recode
2. New commands (see below)
3. Command imporvments
4. Tons of new features
5. Check update (see below)
6. and much more!

#### A full commands list is below so you can refer to it while I update the **[regular page](http://astroshock.bl.ee/soundbot)**

###### Also here's a link to [plug.dj's API](http://support.plug.dj/hc/en-us/sections/200353347-Front-End-API)

> See you in plug.dj!
  FourBit

Command List
======

##### Users
```
!help - links the commands page
!dc - DCLookup (puts you abck in your spot if you disconnected)
!theme - Sends the room's theme
!emoji - Sends a link to the emoji page
!adblock - Sends a link to AdBlock
!support - Links to the plug.dj support
!tech - Links to the plug.dj tech page
!blog - Links to the plug.dj blog
!song - Gives the full song title
!pic - Sends the thumbnail or album (artwork) cover
!link - Sends the song link
!cookie [@user] - Sends a cookie to the user
!acronym [amount: 1-10] - Sends letters that you can make words with
!rdj - Sends info on how to get resident dj
!community - Sends info on how to create a community
!web - Links my website
!pastebin - Links my pastebin
!afk [optional (message)] - Sets an AFK message for you
!ask - Makes the bot send a random question
```

##### Staff
```
!unlock - Unlocks the waitlist
!lock - Locks the waitlist
!lockskip [optional (position] - Lockskips the current song
!skip - Skips the current song
!queue - Lists all the users in the queue
!status - Displays some info
!lockdown - Deletes all chat that is from users - only staff can chat
!stats - *See below
!add @user [optional (pos)] - Adds the user to the waitlist or specified pos.
!ban @user [optional (dur)] - Bans the user for the duration
!kick @user dur - Kicks the user for the duration
!remove @user - Removes the user from the waitlsit
!ping - Pong!
!move @user pos - Moves the user to the specified pos.
```

##### Manager
```
!save - Saves all settings
!cycle - Toggles the dj cycle
!reload - Reloads Soundbot
!kill - Shutdown Soundbot
!motd - *See below
!roulette - *See below
!commands - *See below
!antiafk - *See below
!cmdsettings - *See below
!lolomgwtfbbq - ?
```
--------

```
* !stats 
    [Alone]: Shows if it's enabled
    ■ on/off: enables / disables
    
* !motd
    [Alone]: Displays info on the Motd
    ■ on/off: enables / disables
    ■ int [seconds]: Sets the interval to how many seconds you specified

* !commands
    [Alone]: Shows all user commands
    ■ staff: shows staff commands
    ■ manager: shows manager commands
    ■ host: shows host commands

* !antiafk
    [Alone]: Displays info
    ■ on/off: enables / disables
    ■ int [seconds]: changes the limit to what you specified

* !cmdsettings
    [Alone]: Displays info
    ■ cd 
      [Alone]: Displays info
      • on/off: enables/disables
      • int [seconds]: sets the cooldown to how many seconds you specified
    ■ users
      [Alone]: Shows arguments
      • on/off: enables/disables
```

======

> Check out my **[other repositories](https://github.com/Pr0Code?tab=repositories)**

======

> Thanks to **[this wiki for providing me some syntax for Markdown](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)**
