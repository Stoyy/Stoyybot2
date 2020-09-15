const Discord = require('discord.js');
const bot = new Discord.Client();
require('dotenv').config();
const ms = require('ms');
let ticket = new Map()
const moment = require('moment');
const covid = require('novelcovid');
const ytdl = require('ytdl-core');
var botversion = '2.0.5';
const {
    Canvas
} = require("canvas-constructor");
const userCreatedPolls = new Map();
const fetch = require("node-fetch");
const canvas = require('canvacord');
const PREFIX = '.';
const r = 'RANDOM';

// READY
bot.on('ready', () => {
    console.log(`${bot.user.username} is Active!`)
    bot.user.setActivity('.help | Discord.io/Stoyy', {
        type: "PLAYING"
    });
});

bot.on('guildMemberAdd', member => {
    member.send(`Hello ${member}. Welcome to ${member.guild.name}. If you need any type of support, you can go to **#┌✍fast-support** or you can go to #├📧ticket-support!`)
});

bot.login(process.env.TOKEN);

bot.on('message', async message => {
    if (message.author.bot) return
    if (!message.content.startsWith(PREFIX)) return

    const args = message.content.substring(PREFIX.length).split(" ")

    if (message.content.startsWith(`${PREFIX}play`)) {
        const voiceChannel = message.member.voice.channel
        if (!voiceChannel) return message.channel.send(`@${message.author.tag}, you need to be in a voice channel to use this command!`)
        const permissions = voiceChannel.permissionsFor(message.client.user)
        if (!permissions.has('CONNECT')) return message.channel.send('I don\'t have permission to join the voice channel!')
        if (!permissions.has('SPEAK')) return message.channel.send('I don\'t have permission to speak in this channel!')

        try {
            var connection = await voiceChannel.join()
        } catch(error) {
            console.log(`There was a error connecting to mthe voice channel: ${error}`)
            return message.channel.send(`There was a error connecting to the voice channel: ${error}`)
        }

        const dispatcher = connection.play(ytdl(args[1]))
        .on('finish', () => {
            voiceChannel.leave()
        })
        .on('error', error => {
            console.log(error)
        })
        dispatcher.setVolumeLogarithmic(5 / 5)
    } else if (message.content.startsWith(`${PREFIX}stop`)) {
        if (!message.member.voice.channel) return message.channel.send("You need to be in a voice channel to stop music!")
        message.member.voice.channel.leave()
        return undefined
    }
});

// commands
bot.on('message', message => {

    if (message.author.bot || message.channel.type === 'dm') return;
    if (!message.content.startsWith(PREFIX)) return

    let args = message.content.slice(PREFIX.length).split(" ");

    // misc
    switch (args[0]) {
        case 'serverinfo':
            const guild = message.guild;
            const embed = new Discord.MessageEmbed()

                .setAuthor(guild.name, guild.iconURL({
                    dynamic: false
                }))
                .setTitle("Server Info")

                //SERVER ADMINISTRATION 
                .addField("VERIFICTION", guild.verificationLevel, true)
                .addField("OWNER", `${guild.owner.user.tag}`, true)
                .addField("NOTIFICATION", guild.defaultMessageNotifications, true)
                .addField('\u200B', '\u200B')

                //SERVER INFORMATION
                .addField("REGION", guild.region, true)
                .addField("MEMBERS", guild.memberCount, true)
                .addField("SHARD", guild.shard.ping, true)
                .addField('\u200B', '\u200B')

                //CHANNEL, ROLES, EMOTES SIZES
                .addField("CHANNELS", guild.channels.cache.size, true)
                .addField("EMOTES", guild.emojis.cache.size, true)
                .addField("ROLES", guild.roles.cache.size, true)
                .addField('\u200B', '\u200B')

                // BOOSTS & TIERS
                .addField("TIER <:boostTIER:729369365203517470>", guild.premiumTier, true)
                .addField("BOOSTING <a:boostingtop:717512929695498301>", guild.premiumSubscriptionCount, true)
                .addField('\u200B', '\u200B')

                // SERVER STATUS
                .addField("VERIFIED <:verified:729369366197567608>", guild.verified, true)
                .addField("PARTNERED <:partnered:729369359885271102>", guild.partnered, true)

                .setColor('RANDOM')
                .setFooter(`SERVER CREATION ON || ` + guild.createdAt)
                .setImage(guild.bannerURL({
                    format: 'png',
                    size: 1024
                }) || guild.splashURL({
                    format: 'png',
                    size: 1024
                }))
                .setThumbnail(guild.iconURL({
                    dynamic: true,
                    size: 1024
                }))

            message.channel.send(embed)

            break;
        case 'help':
            let cmdEmbed = new Discord.MessageEmbed()
                .setTitle('Commands')
                .setAuthor(`${message.author.username}`)
                .setColor(r)
                .addField('Fun Commads', '`.fun`', true)
                .addField('Moderator Commads', '`.mod`', true)
                .addField('Misc Commands', '`.misc`', true)
                .setThumbnail(message.author.displayAvatarURL())
                .setFooter(`Your ID: ${message.author.id}`)
            message.channel.send(cmdEmbed)
            break;
        case 'misc':
            const misc = new Discord.MessageEmbed()
                .setAuthor(message.author.tag)
                .setTitle('Misc commands')
                .setColor(r)
                .addField('report', '`.report`-Report Someone or a but with the bot', true)
                .addField('server', '`.server`-Category command')
                .addField('suggeustion', '`.suggeustion`-suggeust something')
                .addField('ping', '`.ping`-Shows the ping of the bot', true)
                .addField('stoyy', '`.stoyy`-Category command.')
                .addField('me', '`.me`-Shows your Discord information.', true)
                .addField('whois', '`.whois`-Show someone elses Discord information.', true)
                .addField('avatar', '`.avatar`-Shows your avatar or someone you mentioned.', true)
                .addField('noah', '`.noah`-Gives you noah\'s special command.')
                .setThumbnail(message.author.displayAvatarURL())
                .addField('help', '`help`-helps you', true)
                .addField('serverinfo', '`.serverinfo`-Shows information about the server', true)
            message.channel.send(misc)
            break;
        case 'server':
            if (!args[1]) return message.channel.send('What serverinfo do you want? `.server members` or `.server joinedat`')
            if (args[1] === 'members') {
                const guildMemberCountEmbed = new Discord.MessageEmbed()
                    .setTitle(`${message.guild.name} has ${message.guild.memberCount} members!`)
                message.channel.send(guildMemberCountEmbed)
            }
            if (args[1] === 'joinedat') {
                const joinEmbed = new Discord.MessageEmbed()
                    .setTitle(`You joined ${message.guild.name} at ${message.member.joinedAt}!`)
                message.channel.send(joinEmbed)
            }
            break;
        case 'ping':
            const stare = Date.now()
            message.channel.send("Pinging...").then(message => {

                const end = Date.now()
                message.edit(`:ping_pong: **Pong! Took ${(end - stare)}ms!**`)
                if (end - stare > 500)
                message.react('🅱️').then(message.react('🅰️')).then(message.react('🇩'))
                if (end - stare < 500)
                message.react('🇬').then(message.react('🇴')).then(message.react('⭕')).then(message.react('🇩'))
            })
            break;
        case 'me':
            const uEmbed = new Discord.MessageEmbed()
                .setColor(r)
                .setTitle("Your Information")
                .setThumbnail(message.author.displayAvatarURL())
                .setAuthor(`${message.author.username}'s Info`, message.author.displayAvatarURL)
                .addField("Username:", `${message.author.username}`)
                .addField("Discriminator:", `${message.author.discriminator}`)
                .addField("ID:", `${message.author.id}`)
                .addField("Status:", `${message.author.presence.status}`)
                .addField("Created At:", `${message.author.createdAt}`)
            message.channel.send(uEmbed)
            break;
        case 'whois':
            var MEMBER = message.mentions.users.first() || message.author;
            let whoEmbed = new Discord.MessageEmbed()
                .setColor(r)
                .setAuthor(`${MEMBER}'s Info`, message.author.displayAvatarURL())
                .setTitle('User Information')
                .addField('Status', MEMBER.presence.status)
                .addField('Discriminator', MEMBER.discriminator)
                .addField('ID', MEMBER.id)
                .addField('Account Created at ', MEMBER.createdAt)
                .setThumbnail(MEMBER.displayAvatarURL())
            message.channel.send(whoEmbed)
            break;
        case 'noah':
            const noah = new Discord.MessageEmbed()
                .setTitle('Click Me!')
                .setColor(r)
                .setDescription('NOAH IS A HOTTIE AND AWESOME GUY AND YOU SHOULD DEFINITELY GIVE HIM NITRO. 😏🥵')
                .setFooter('DO IT DO IT DO IT DO IT DO IT')
                .setAuthor(`${message.author.tag}`)
                .setURL('https://sourceb.in/6d85db0455')
            message.channel.send(noah)
            message.channel.send('Get noah nitro!')
            break;
        case 'stoyy':
            if (!args[1]) message.channel.send('What do you want from the stoyy catagory? `.stoyy links`, `.stoyy menu` or `.sotyy invite`')
            if (args[1] === 'menu') message.channel.send('Stoyy meny is not out yet!')
            if (args[1] === 'links') message.channel.send('**Youtube Link** https://www.youtube.com/channel/UC8hyQRTcFoes8IBR3XRGeJQ\n**Discord Link**https://discord.gg/FgV8Gjf')
            if (args[1] === '') message.channel.send('https://discord.gg/tYNCjdq')
            break;
        case 'suggestion':
            if (!args[1]) {
                const suggeustionError = new Discord.MessageEmbed()
                    .setColor(r)
                    .setTitle('404')
                    .setDescription(':x: **You are missing some arguments. Please state your suggestion.** :x:')
                message.channel.send(suggeustionError)
            } else {
                const suggeustionArgs = args.slice(1).join(" ");
                const suggeustionReports = bot.channels.cache.get('739114927112978563')
                if (!suggeustionReports) {
                    return message.channel.send('There is no suggestion channel!')
                }

                const suggeustionData = new Discord.MessageEmbed()
                    .setColor(r)
                    .setTitle(message.author.username + '\'s suggestion:')
                    .setDescription(suggeustionArgs)
                    message.delete()
                suggeustionReports.send(suggeustionData).then(m => {
                    m.react('✅')
                    m.react('❌')
        
                })
            }
            break;
        case 'boton?':
            message.reply('the bot is working!')
            break;
        case 'avatar':
            const mentionedUser = message.mentions.users.first()
            if (!mentionedUser) return message.channel.send(message.author.displayAvatarURL())
            else message.channel.send(mentionedUser.displayAvatarURL())
            break;
    }
    // fun
    switch (args[0]) {
        case 'coinflip':

            var choices = [
                "heads",
                "tails"
            ];

            var output = choices[Math.floor(Math.random() * choices.length)];

            message.channel.send(`You got **${output}!**`)

            break;
        case 'minesweeper':
            const Minesweeper = require('discord.js-minesweeper');

            const minesweeper = new Minesweeper({
                returnType: 'emoji'
            });
            message.channel.send('**===Minesweeper Rules===**\nRule #1: After you hit a :boom: you have to start another round\n\nRule #2: **NO CHEATING**\n\nRule #3: Only land on the numbers and try not to land on the :boom:')
            var mines = minesweeper.start()
            message.channel.send(mines)
            message.channel.send('I hope you don\'t blow up!')
            break;
        case 'dice':
            const rollDie = [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10'
            ]
            message.reply('rolled a ' + rollDie[Math.floor(Math.random() * rollDie.length)]);
            break;
        case 'embed':
            if (!args[1]) return message.channel.send('What should I turn into a embed?')
            let text = args.slice(1).join(" ")
            let custom = new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setDescription(text)
                .setFooter(`Requested By || ${message.author.tag}`)
                message.delete()
            message.channel.send(custom);
            break;
        case 'meme':
            const randomPuppy = require('random-puppy');
            let reddit = [
                "meme",
                "animemes",
                "AnimeFunny",
                "dankmemes",
                "dankmeme",
                "wholesomememes",
                "MemeEconomy",
                "meirl",
                "me_irl",
                "2meirl4meirl",
                "AdviceAnimals"
            ]

            let subreddit = reddit[Math.floor(Math.random() * reddit.length)];

            message.channel.startTyping();

            randomPuppy(subreddit).then(async url => {
                message.channel.send({
                    files: [{
                        attachment: url,
                        name: 'meme.png'
                    }]
                }).then(() => message.channel.stopTyping());
            }).catch(err => console.error(err));
            break;
        case 'guessmyage':
            if (!args[1]) return message.channel.send('**Enter your birth year!**')
            else if ((args[1] === 'a') && (args[2] === 'NUMBER')) message.channel.send('**Thats not how you use the command!**')
            else if ((args[1] === 'a') && (args[2] === 'number')) message.channel.send('**Thats not how you use the command!**')
            else if (isNaN(args[1])) return message.channel.send('**Enter a NUMBER!**')
            else message.channel.send(`**You are approximately ${2020 - args[1]} years old!**`)
            break;
        case 'guessmybirthyear':
            if (!args[1]) return message.channel.send('**Enter your age!**')
            else if ((args[1] === 'a') && (args[2] === 'NUMBER')) message.channel.send('**Thats not how you use the command!**')
            else if ((args[1] === 'a') && (args[2] === 'number')) message.channel.send('**Thats not how you use the command!**')
            else if (isNaN(args[1])) return message.channel.send('**Enter a NUMBER!**')
            else message.channel.send(`**You were born in ${2020 - args[1]}!**`)
            break;
        case 'fun':
            const fun = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}, These are fun commands!`)
                .setTitle('Fun Commands!')
                .setColor(r)
                .addField('embed', '`.embed`-Get a custom embed from the bot!', true)
                .addField('meme', '`.meme`-Gives you a meme', true)
                .addField('funfact', '`funfact`-Get a funfact from the bot!', true)
                .addField('dice', '`dice`-Roll the dice to get a number!', true)
                .addField('coinflip', '`coinflip` -flip a coin!', true)
                .addField('ping', '`ping`-Check the ping of the bot!', true)
                .addField('minesweeper', '`minesweeper`-Play minesweeper!', true)
                .addField('guessmyage', '`guessmyage`-let the bot guess your age! `.guessmyage <your birthyear>', true)
                .addField('guessmybirthyear', '`guessmybirthyear`-let the bot guess your birth year! `.guessmybirthyear <your age>`', true)
                .addField('love', '`love`-Shows how much compatiabillity there is bwteen 2 people. `.love <you> <sum 1 else>', true)
                .setThumbnail(message.author.displayAvatarURL())
            message.channel.send(fun)
            break;
        case 'funfact':
            const facts = [
                'U.S. nuclear-powered submarines can go faster than 25 knots (nautical miles per hour) underwater, which is approximately 29 miles per hour or 46 kilometers per hour.',
                'Homer was born on May 12, 1955. He was raised on a farm by his parents, Mona and Abraham Simpson. In the mid-1960s, while Homer was between nine and twelve years old, Mona went into hiding following a run-in with the law. Homer attended Springfield High School and fell in love with Marge Bouvier in 1974.',
                'Otters are known to hold hands in groups - called a raft - while they eat, sleep and rest, to prevent families losing each other. The furry animals, the largest member of the weasel family, are even known to wrap sea plants around them to secure the bond.',
                'Chalk /ˈtʃɔːk/ is a soft, white, porous sedimentary rock, a form of limestone composed of the mineral calcite. Calcite is calcium carbonate or CaCO3.',
                'In 1998, Mark McGwire of the St. Louis Cardinals and Sammy Sosa of the Chicago Cubs both broke Maris\' home-run record. Sosa finished the season with 66 and McGwire finished with 70. Barry Bonds now holds the record with 73.',
                'The NYSE is open for trading Monday through Friday from 9:30 am – 4:00 pm ET, with the exception of holidays declared by the Exchange in advance. The NYSE trades in a continuous auction format, where traders can execute stock transactions on behalf of investors.',
                'Paper cuts can be surprisingly painful as they can stimulate a large number of skin surface nociceptors (pain receptors) in a very small area of the skin. Because the shallow cut does not bleed very much, the pain receptors are left open to the air, ensuring continued pain.',
                'While he completed only one opera, Beethoven wrote vocal music throughout his life, including two Mass settings, other works for chorus and orchestra (in addition to the Ninth Symphony), arias, duets, art songs (lieder), and true song cycles.',
                'Early history[edit] The earliest recorded evidence of the production of soap-like materials dates back to around 2800 BC in ancient Babylon. A formula for soap consisting of water, alkali, and cassia oil was written on a Babylonian clay tablet around 2200 BC.',
                'The film relates the story of three student filmmakers (Heather Donahue, Michael C. Williams, and Joshua Leonard) who disappeared while hiking in the Black Hills near Burkittsville, Maryland in 1994 to film a documentary about a local legend known as the Blair Witch.',
                'The Grand Canyon is indeed a very big hole in the ground. It is 277 miles (446 km) long, up to 18 miles (29 km) wide and more than a mile (6,000 feet / 1,800 meters) deep. It is the result of constant erosion by the Colorado River over millions of years.',
                'The Gobi is a large desert region in northern China and southern Mongolia. The desert basins of the Gobi are bounded by the Altai mountains and the grasslands and steppes of Mongolia on the north, by the Tibetan Plateau to the southwest, and by the North China Plain to the southwest.',
                'In the early 19th century, Jean-Baptiste Lamarck proposed his theory of the transmutation of species, the first fully formed theory of evolution. In 1858, Charles Darwin and Alfred Russel Wallace published a new evolutionary theory that was explained in detail in Darwin\'s On the Origin of Species (1859).'
            ]
            message.channel.send(facts[Math.floor(Math.random() * facts.length)]);
            break;
        case 'random':
            if (!args[1]) message.channel.send('Please enter a max number. (**The max is 100**)');
            else if ((args[1] === 'max') && (args[2] === 'number')) message.channel.send('**bruh really** thats not how you use this command its like `.random <any number>`')
            message.channel.send([Math.floor(Math.random() * (args[1]))])
            break;
        case 'random':
            if (!args[1]) message.channel.send('Please enter a max number. (**The max is 100**)');
            else if ((args[1] === 'max') && (args[2] === 'number')) message.channel.send('**bruh really** thats not how you use this command its like `.random <any number>`')
            message.channel.send([Math.floor(Math.random() * (args[1]))])
            break;
        case 'love':
            if (!args[1]) return message.channel.send('**Enter your Discord or your first name.**')
            if (!args[2]) return message.channel.send('**Enter someone elses Discord or real name.**')
            message.channel.send('**They are** ' + [Math.floor(Math.random() * 100)] + '**% compatible.**')
            break;
        case '8ball':
            const ball = [
                'Im not sure..',
                'Maybe',
                'Yes!',
                'Ask again later',
                'No',
                'IDK',
                'Why not?',
                'Absolutely!'
            ]
            var message1 = message.content.split(' ').slice(1).join(' ')
            const server = message.guild
            const eightball = new Discord.MessageEmbed()
                .setAuthor(message.author.username, server.iconURL({
                    dynamic: false
                }))
                .setColor(r)
                .setTitle('8ball')
                .addField('Question', message1)
                .addField('Awnser', ball[Math.floor(Math.random() * ball.length)])
                .setFooter(`Sent by || ${message.author.tag}`)
                .setThumbnail(message.author.displayAvatarURL())
            message.channel.send(eightball)
            break;
        case 'rateme':
            let rating = Math.floor(Math.random() * 101)
            if (!args[1]) {
                message.channel.send('I would rate you a ' + rating + '/100')
            } else {
                let rateuser = message.mentions.users.first()
                if (!rateuser) {
                    return message.channel.send('Please mention who you want me to rate!')
                }
                return message.channel.send('I would rate ' + rateuser.username + ' a ' + rating + '/100')
            }
            break;

    }
    // mod
    switch (args[0]) {
        case 'say':
            if (!message.member.permissions.has("MANAGE_MESSAGES")) return message.channel.send('**You do not have the correect permissions to use this command!** :x:')
            var text = message.content.split(' ').slice(1).join(' ')
            if (!text) return message.reply('Please give me some text to say! :)')
            message.channel.send(text)
            message.delete()
            break;
        case 'slowmode':
            if (!message.member.permissions.has("MANAGE_CHANNELS")) return message.channel.send("**You can\'t use this command because you don\'t have the correct permissions.**")
            var time = message.content.split(' ').slice(1).join(' ')
            if (!time) return message.reply('Please enter a time in seconds!')
            message.channel.setRateLimitPerUser(time)
            message.channel.send(`Set the slowmode to **${time}**`)
            message.delete()
            break;
        case 'clear':
            const args = message.content.split(" ").slice(1);
            var DeleteCount = parseInt(args[0], 10);
            if (message.member.hasPermission(["MANAGE_MESSAGES"])) {
                if (!DeleteCount) {
                    message.channel.send('**Enter a valid number of messages to delete!**')
                    message.delete();
                } else {
                    message.channel.bulkDelete(DeleteCount + 1);
                    message.channel.send(`**I have deleted ${DeleteCount} messages!**`)
                }
            };
            break;
        case 'mod':
            let mod = new Discord.MessageEmbed()
                .setAuthor(message.author.tag)
                .setColor('RANDOM')
                .addField('clear', '`.clear`-Clear a certian ammount of messages.', true)
                .addField('say', '`.say`-Get the bot to say exactly what you typed.')
                .addField('slowmode', '`.slowmode`-Set the slowmode of a channel.', true)
            message.channel.send(mod)
            break;
    }

    // math
});

// COVID
bot.on('message', async message => {
    if (message.content.startsWith(`${PREFIX}covid`)) {
        const covidStats = await covid.all()

        return message.channel.send(new Discord.MessageEmbed()
            .setTitle('Covid-19 Stats')
            .setColor(r)
            .addFields({
                name: `Cases`,
                value: covidStats.cases.toLocaleString(),
                inline: true
            }, {
                name: `Cases Today`,
                value: covidStats.todayCases.toLocaleString(),
                inline: true
            }, {
                name: `Deaths`,
                value: covidStats.deaths.toLocaleString(),
                inline: true
            }, {
                name: `Deaths Today`,
                value: covidStats.todayDeaths.toLocaleString(),
                inline: true
            }, {
                name: `Recovered`,
                value: covidStats.recovered.toLocaleString(),
                inline: true
            }, {
                name: `Recovered Today`,
                value: covidStats.todayRecovered.toLocaleString(),
                inline: true
            }, {
                name: `Infected Right Now`,
                value: covidStats.active.toLocaleString(),
                inline: true
            }, {
                name: `Critical Condition`,
                value: covidStats.critical.toLocaleString(),
                inline: true
            }, {
                name: `Tested`,
                value: covidStats.tests.toLocaleString(),
                inline: true
            }, ))
    }
});

// OTHER LOGS
bot.on('message', message => {

    const logChannel1 = message.guild.channels.cache.find(ch => ch.name === "╠n-word-logs")
    if (!logChannel1) return;

    if (message.content.toLocaleLowerCase().includes('nigga')) {
        message.delete()
        message.channel.send('**DON\'T SAY THAT!** :x:')
        logChannel1.send(`${message.author.tag} has said the N word.`)

        if (message.content.toLocaleLowerCase().includes('nigger')) {
            message.delete()
            message.channel.send('**DON\'T SAY THAT!** :x:')
            logChannel1.send(`${message.author.tag} has said the N word.`)

            if (message.content.toUpperCase().includes('Nigger')) {
                message.delete()
                message.channel.send('**DON\'T SAY THAT!** :x:')
                logChannel1.send(`${message.author.tag} has said the N word.`)
            }
        }
    }
});

// 11profile
bot.on("message", async message => {
    if (message.content === "!!profile") {
        const avatar = await fetch(message.author.avatarURL({
            format: 'jpg'
        }))



        let mage = new Canvas(500, 250)
            .setColor("#FFC0CB")
            .addRect(0, 0, 500, 250)
            .setColor("#FFC0CB")
            .addRect(0, 0, 500, 80)
            .setColor("#000000")
            .setTextFont('40px Impact')
            .addText("WELCOME", 110, 55)
            .setColor("#000000")
            .setTextFont('20px Impact')
            .addText(`ID - ${message.author.id}`, 30, 140)
            .addText(`TAG - ${message.author.tag}`, 30, 170)
            .addText(`GUILD NAME - ${message.guild.name}`, 30, 200)
            .setColor("#000000")
            .addCircle(60, 40, 33)
            .addCircularImage(await avatar.buffer(), 60, 40, 30)
            .toBuffer();

        message.channel.send({
            files: [mage]
        })

    }
});

// tickets
bot.on('message', async message => {
    if (message.author.bot) {
        return;
    }
    const ticketChannel = message.guild.channels.cache.find(c => c.name.toLowerCase() === `${message.author.username}-ticket`.toLowerCase())
    if (message.content.startsWith(`${PREFIX}createticket`)) {
        if (ticketChannel || ticket.get(message.author.id) === true) return message.channel.send('You allready have a ticket open!')
        const ticketCreated = await message.guild.channels.create(`${message.author.username}-ticket`, {
            type: 'text',
            permissionOverwrites: [{
                    allow: 'VIEW_CHANNEL',
                    id: message.author.id
                },
                {
                    deny: 'VIEW_CHANNEL',
                    id: message.guild.id
                }
            ]
        })
        ticket.set(message.author.id, true)
        ticketCreated.send('What do you need help with?')
        message.channel.send(`Your ticket has been created! Go to #${message.author.username}-ticket to see your open ticket!`)
    } else if (message.content.startsWith(`${PREFIX}closeticket`)) {
        if (!message.channel.name.includes('ticket')) return message.channel.send('You need to create a ticket first!')
        await message.channel.delete()
        ticket.set(message.author.id, false)
    }

});

// DELETE MSG LOGS
bot.on('messageDelete', async message => {
    const logChannel = message.guild.channels.cache.find(ch => ch.name === "╠deleted-msg-logs")
    if (!logChannel) return;

    const lembed = new Discord.MessageEmbed()
        .setTitle("Message Deleted |" + message.author.tag)
        .setColor('RANDOM')
        .addField('Deleted', message)
        .addField("Deleted in", message.channel)

    logChannel.send(lembed)
});

bot.login(process.env.TOKEN);
