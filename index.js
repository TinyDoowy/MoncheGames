var Discord = require('discord.js');
var logger = require('winston');
var auth = require('./auth.json');
var cron = require('node-cron');

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/Theffroi',{ useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useFindAndModify', false);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({ partials: ['USER', 'MESSAGE', 'CHANNEL', 'REACTION'] });
bot.login(auth.token);
bot.on('ready', async function () {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});


const idCathal = "219742701489225728";
const idBescherelle = "<@&794691502822653953>";

const prefixStart = "roll";
const prefixSoluce = "soluce";
const prefixTournoiOn = "start";
const prefixTournoiOff = "stop";
const prefixJeJoue = "je joue";
var nomPokemon = "";
var paramJeu = "";
var lettre1;
var lettre2;
var gen;
var stade;
var typePicked;
var allTypes;
var randroll;
var gameOn = false;
var rollOn = false;
var medicOn = false;
var reponse = true;
var display;
var LangueMessage;
var idToCheck;
var tournoiOn = false;


// Connection à la BDD Monche Officiel 
const bddMoncheOfficiel = require('./bddMoncheOfficiel.json');
const tabPokemon = bddMoncheOfficiel.pokemonAll;
// Connection à la BDD Médicamonche
const bddMedicamonche = require('./bddMedicamonche.json');
const tabPokeLangue = bddMedicamonche.pokemonsAllLang;
const tabMedicamonche = bddMedicamonche.medicaments;


const tabType = ["Acier","Combat","Dragon","Eau","Électrique",
"Fée","Feu","Glace","Insecte","Normal","Plante","Poison",
"Psy","Roche","Sol","Spectre","Ténèbres","Vol"];

const taillePokedex = tabPokemon.length;
const nombreGen = 8;

//Mandarin, Cantonais, Japonais, Allemand, Russe, Thaï, Coréen, Anglais, Français
var nbrLangue = 8;

const taillePokedexLangue = tabPokeLangue.length;
const tailleMedicamonche = tabMedicamonche.length;



var test = '18 21 13 1 *';

///////////////////////
// Début de la Quête //
///////////////////////

//cron.schedule(test, async () => {
cron.schedule('0 18 15 1 *', async () => {
    const guild = bot.guilds.cache.get(auth.server.guild);
    const channel = bot.channels.cache.get(auth.server.salon.affichage);

                      await channel.send("<@&"+auth.server.role.ping+">, le Monche Universe ouvre ses portes !\rVous l'attendiez (*ou pas*), le voici :rofl:\rRendez-vous dans la Catégorie Monche Universe\rce **__Dimanche 17 Janvier à 15h__** pour fêtez l'anniversaire de <@204016690604933120> :partying_face:\r__Si vous ne souhaitez pas être spammé de notification, pensez à rendre la catégorie muette.__");
                      await channel.send("https://tenor.com/view/kaamelott-perceval-anniversaire-cest-lanniversaire-dans-tous-les-recoins-gif-17182618");
});


//cron.schedule(test, async () => {
cron.schedule('55 14 17 1 *', async () => {
    const guild = bot.guilds.cache.get(auth.server.guild);
    const channel = bot.channels.cache.get(auth.server.salon.monche);

                      await channel.send("<@&"+auth.server.role.ping+">, joyeux anniversaire à <@204016690604933120> :partying_face: !!\rMerci de lire les règles et de poser vos questions en cas de doute :smile:\r*Oui ! il y aura un tour pour du beurre*\r(ce message est sponsorisé par les kouignoù-amann du Gers)");
                      await channel.send("https://tenor.com/view/reading-read-read-up-checking-taking-note-gif-15388141");
});


bot.on('message', async function (message, user) {


    petitMessage = message.content.toLowerCase();

    // arrête la lecture du message si l'auteur est le bot.
    if (message.author.bot) return;
    
    //limité à la catégorie de la forêt
    if (message.channel.parent.id!=auth.server.categorie.monche) return;


    //commande Staff pour tournoi (salon staff monche)
    if(message.member.roles.cache.has(auth.server.role.staff)&&message.channel.id==auth.server.salon.staffmonche){
        if(petitMessage.startsWith(prefixTournoiOn)){
            message.delete();
            tournoiOn = true;
            const messageCheck = new Discord.MessageEmbed()
                .setColor('#21BD13')
                .setTitle("La tournoi commence")
                .setDescription("À partir de maintenant, vous serez notifié dans ce salon pour chaque point gagné.\rPour stopper le tournoi, il suffit de taper **STOP**.")
                .setThumbnail("https://www.pokepedia.fr/images/thumb/f/ff/Carte_de_Ligue_Ball_Masqu%C3%A9_EB.png/333px-Carte_de_Ligue_Ball_Masqu%C3%A9_EB.png");
            
            console.log(message.channel.send(messageCheck));
            //message.reply(" le mode tournoi est activé, vous recevrez uniquement les points gagnés ici !");
        }
        if(petitMessage.startsWith(prefixTournoiOff)) {
            message.delete();
            tournoiOn = false;
            const messageCheck = new Discord.MessageEmbed()
                .setColor('#BD1318')
                .setTitle("La tournoi est fini")
                .setDescription("Vous pouvez compter les points.\rPour relancer un tournoi, il suffit de taper **START**.")
                .setThumbnail("https://www.pokepedia.fr/images/thumb/f/ff/Carte_de_Ligue_Ball_Masqu%C3%A9_EB.png/333px-Carte_de_Ligue_Ball_Masqu%C3%A9_EB.png");
            
            console.log(message.channel.send(messageCheck));
            //message.reply(" le mode tournoi est désactivé, plus de message dans ce salon jusqu'à nouvel ordre !");
        }
    }

    //commande je joue useless expérons
    if(petitMessage.startsWith(prefixJeJoue)&&message.channel.parent.id==auth.server.categorie.monche) {
        message.reply(" c'est noté !");
    }

    //commande animateur ou staff (sauf role mute monche)
    if(!message.member.roles.cache.has(auth.server.role.mute)&&(message.member.roles.cache.has(auth.server.role.staff)||message.member.roles.cache.has(auth.server.role.animateur))){

        //commande "roll" dans médicamonche
        if(petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.medicamonche&&medicOn==false){
            message.delete();
            medicOn = true;

                if(Rand(4)>1){
                    var display = "xxx";
                    while(display=="xxx"){
                        console.log("pokémon");
                        var quelEstCePokemon = Rand(taillePokedexLangue)-1;
                        var QuelPokeLangue = tabPokeLangue[quelEstCePokemon];
                        var PokemonFR = QuelPokeLangue[nbrLangue];
                        var Language = Rand(nbrLangue)-1;
                        switch(Language){
                            case 0 : 
                                LangueMessage = "Mandarin";
                                break;
                            case 1 : 
                                LangueMessage = "Cantonais";
                                break;
                            case 2 : 
                                LangueMessage = "Japonais";
                                break;
                            case 3 : 
                                LangueMessage = "Allemand";
                                break;
                            case 4 : 
                                LangueMessage = "Russe";
                                break;
                            case 5 : 
                                LangueMessage = "Thaï";
                                break;
                            case 6 : 
                                LangueMessage = "Coréen";
                                break;
                            case 7 : 
                                LangueMessage = "Anglais";
                                break;
                            case 10 : 
                                LangueMessage = "Médicamonche";
                                break;
                            default : 
                                LangueMessage = "Français";
                                break;
                        }
                        display = QuelPokeLangue[Language];
                    }
                }else{
                    console.log("médicament");
                    quelEstCePokemon = Rand(tailleMedicamonche)-1;
                    display = tabMedicamonche[quelEstCePokemon];
                    Language = 10;
                    LangueMessage = "Médicamonche";
                    PokemonFR = "";
                };
                console.log(PokemonFR+" = "+display);
        
        
                message.channel.send("Monche ou Médicamonche : **"+display+"** ?")
                .then( function (msg) {
                    //drapeau France
                    msg.react('🇫🇷');
                    //drapeau Royaume-Uni
                    msg.react('🇬🇧');
                    //drapeau Allemagne
                    msg.react('🇩🇪');
                    //drapeau Japon
                    msg.react('🇯🇵');
                    //drapeau Russie
                    msg.react('🇷🇺');
                    //drapeau Chine Mandarin
                    msg.react('🇨🇳');
                    //drapeau Thaïlande
                    msg.react('🇹🇭');
                    //drapeau Honk-Kong Cantonais
                    msg.react('🇭🇰');
                    //drapeau Corée du Sud
                    msg.react('🇰🇷');
                    //Médicamonche
                    msg.react('💊');

                    var drapeau = "";
                    var reactions = msg.reactions;
        
                    //Mandarin, Cantonais, Japonais, Allemand, Russe, Thaï, Coréen, Anglais
                    switch(Language){
                        case 0 : 
                            LangueMessage = "le Mandarin";drapeau='🇨🇳';break;
                        case 1 : 
                            LangueMessage = "le Cantonais";drapeau='🇭🇰';break;
                        case 2 : 
                            LangueMessage = "le Japonais";drapeau='🇯🇵';break;
                        case 3 : 
                            LangueMessage = "l'Allemand";drapeau='🇩🇪';break;
                        case 4 : 
                            LangueMessage = "le Russe";drapeau='🇷🇺';break;
                        case 5 : 
                            LangueMessage = "le Thaï";drapeau='🇹🇭';break;
                        case 6 : 
                            LangueMessage = "le Coréen";drapeau='🇰🇷';break;
                        case 7 : 
                            LangueMessage = "l'Anglais";drapeau='🇬🇧';break;
                        case 10 :
                            LangueMessage = "un Médicamonche";drapeau='💊';break;
                        default :
                            LangueMessage = "le Français";drapeau='🇫🇷';break;
                    }
        
                    console.log(LangueMessage);

                    const filter = (reaction, user) => {
                        return reaction.emoji.name === drapeau && user.id !== msg.author.id;
                    };
        
                    msg.awaitReactions(filter, { time: 12000 })
                    .then(async collected => {
                        //console.log(collected);

                        const reaction = await collected.first();

                        if(PokemonFR==""){
                            message.channel.send("La bonne réponse était __é-vi-dem-ment__ ***"+LangueMessage+"***   "+drapeau+"   !");
                        }else{
                            message.channel.send("La bonne réponse était __é-vi-dem-ment__ ***"+LangueMessage+"***   "+drapeau+"   de "+PokemonFR+" !");
                        };

                        if (reaction === undefined) {
                            message.channel.send(`Personne n'avait la bonne réponse !`);
                            message.channel.send(`:salt:\r`+auth.server.emote.sangoku);
                            medicOn = true;
                        } else { 
                            if (reaction.emoji === undefined) {
                                message.channel.send(`Personne n'avait la bonne réponse !`);
                                message.channel.send(`:salt:\r`+auth.server.emote.sangoku);
                                medicOn = true;
                            } else {

                                console.log("drapeau : "+drapeau);
                                console.log("reaction : "+reaction);

                                const users = await reaction.users.cache.array();
                                
                                //console.log(users);

                                if(users.length<=1){
                                    message.channel.send(`Personne n'avait la bonne réponse !`);
                                    message.channel.send(`:salt:\r`+auth.server.emote.sangoku); 
                                    medicOn = true;
                                }

                                for (let i = 1; i < users.length; i++) {
                                    const user = users[i];
                                    message.channel.send(`${user} gagne 1 point !`);
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${user.id}>** a gagné 1 point sur un roll Médicamonche !`);
                                    }
                                };
                                medicOn = true;

                            };
                        };    
                        console.log(`Collected ${collected.size} reactions`);
                    }).catch(console.error);      
                }).catch(console.error);
            return;
        }

        //commande "roll" dans monche? (l'original)
        if (petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.monche&&rollOn==false&&reponse==true){

            reponse =false;
            rollOn = true;
            paramJeu = petitMessage.split(' ');
            message.delete();
            typePicked = "";
            gen = 0;
            stade = 0;
            randroll = 0;


            //récupération des Lettres (dénominateur commun)
                var quelEstCePokemon = Rand(taillePokedex)-1;
                nomPokemon = tabPokemon[quelEstCePokemon][0];
                console.log("Nom : "+nomPokemon);
                lettre1 = nomPokemon.charAt(0).toUpperCase();
                lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();
                while(lettre2==lettre1||lettre2==" "||lettre2=="'"||lettre2=="-"||lettre2=="."||lettre2==":"||lettre2=="0"||lettre2=="1"||lettre2=="2"||lettre2=="3"||lettre2=="4"||lettre2=="5"||lettre2=="6"||lettre2=="7"||lettre2=="8"||lettre2=="9"){
                    console.log("boucle sans fin"); 
                    lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();  
                }
                console.log("lettre1 : "+lettre1+" et lettre2 : "+lettre2);


            if(paramJeu[1]==="random"){randroll = Rand(4);}

            if(!paramJeu[1]||randroll==1){
                await message.channel.send("Prêt·e·s ? (lettres pures)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePicked = "";
                gen = 0;
                stade = 0;
                setTimeout(async function(){await message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2));rollOn = false;},4500);
                gameOn = true;
                return;

            }else if(paramJeu[1] === "type"||randroll==2){
                await message.channel.send("Prêt·e·s ? (+type)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)

                allTypes = tabPokemon[quelEstCePokemon][4].split(' ');
                if(allTypes[9]!=undefined){
                    typePicked = allTypes[Rand(10)-1];
                }else if(allTypes[8]!=undefined){
                    typePicked = allTypes[Rand(9)-1];
                }else if(allTypes[7]!=undefined){
                    typePicked = allTypes[Rand(8)-1];
                }else if(allTypes[6]!=undefined){
                    typePicked = allTypes[Rand(7)-1];
                }else if(allTypes[5]!=undefined){
                    typePicked = allTypes[Rand(6)-1];
                }else if(allTypes[4]!=undefined){
                    typePicked = allTypes[Rand(5)-1];
                }else if(allTypes[3]!=undefined){
                    typePicked = allTypes[Rand(4)-1];
                }else if(allTypes[2]!=undefined){
                    typePicked = allTypes[Rand(3)-1];
                }else if(allTypes[1]!=undefined){
                    typePicked = allTypes[Rand(2)-1];
                }else{
                    typePicked = allTypes[0];
                }

                console.log("/"+paramJeu[1]+"/ : "+typePicked);

                setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et avec au moins un type : **__"+typePicked+"__** "+EmoteType(typePicked));rollOn = false;},4500);
                gameOn = true;
                return;

            }else if(paramJeu[1] === "gen"||randroll==3){
                await message.channel.send("Prêt·e·s ? (+génération)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                

                gen = Number(tabPokemon[quelEstCePokemon][2]);
                console.log("/"+paramJeu[1]+"/ : "+gen);

                setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et issu de la "+EmoteGen(gen)+".\r(*Première apparition dans la branche principale*)");rollOn = false;},4500);
                gameOn = true;
                return;

            }else if(paramJeu[1] === "stade"||randroll==4){
                await message.channel.send("Prêt·e·s ? (+stade d'évolution)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                

                stade = Number(tabPokemon[quelEstCePokemon][3]);
                console.log("/"+paramJeu[1]+"/ : "+stade);

                if(stade==1){
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et qui est un __***Pokémon de Base***__ 🥇\r(*Pokémon non évolué ou bébé*)");rollOn = false;},4500);
                }else if (stade==2){
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et qui est une __***première évolution***__ 🥈\r(*Pokémon ayant évolué 1 fois, ou ayant un bébé*)");rollOn = false;},4500);
                }else{
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et qui est une __***deuxième évolution***__ 🥉\r(*Pokémon ayant évolué 2 fois*)");rollOn = false;},4500);
                }
                gameOn = true;
                return;

            }else{
                message.reply(" ... si même le staff ne sait plus taper les commandes, on va ouvrir les recrutements auprès des gens qui savent copier/coller :stuck_out_tongue_closed_eyes:");
                reponse = true;
                rollOn = false;
                return;
            }
        }

        //commande "soluce" dans salon Monche?
        if (petitMessage.startsWith(prefixSoluce)&&message.channel.id==auth.server.salon.monche){
            if(reponse==false){
                if(rollOn==false){
                    if(gameOn==true){
                        gameOn = false;
                        rollOn = false;
                        reponse = true;
                        message.channel.send("Une des solutions possible était : __**"+nomPokemon+"**__.\r*Better Luck Next Time !* :fingers_crossed:");return;
                    }else{
                        message.channel.send("Le dernier Pokémon a déjà été trouvé/dévoilé.");return;
                    }
                }else{message.channel.send("Cher <@"+message.author.id+">, veuillez laisser au moins 10 secondes aux joueurs avant de dévoiler la solution. Cordialement, Bisouxx :kissing_heart:");return;}
            }else{return;}
        }

    }

    //commande "soluce" sans les rôles nécessaires :)
    if (petitMessage.startsWith(prefixSoluce)&&message.channel.id==auth.server.salon.monche&&!message.member.roles.cache.has(auth.server.role.staff)&&!message.member.roles.cache.has(auth.server.role.animateur)){
            await message.channel.send("https://tenor.com/view/cependant-jdg-albus-humblebundledor-harry-potter-gif-17560359");
            await message.reply(" ... Pour avoir tenter de gratter une réponse dans le dos des animateurs, je te retire 1.000.000 de points !!! :scream:");
            return;
    }

    //récupération des réponses dans Monche?
    if(message.member.roles.cache.has(auth.server.role.everyone)&&message.channel.id==auth.server.salon.monche&&gameOn==true)
    {
        //console.log(lettre1+""+lettre2);
        if(petitMessage.startsWith(lettre1.toLowerCase())&&petitMessage.includes(lettre2.toLowerCase()))
        {
            for(k=0;k<taillePokedex;k++){
                if(petitMessage == tabPokemon[k][0].toLowerCase())
                    {
                        if (typePicked==""&&gen==0&&stade==0){
                            message.reply(" tu as gagné 1 point ! :partying_face:");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres pures !`);
                            }
                            rollOn = false;
                            gameOn = false;
                            reponse = true;
                            return;
                        }else if (gen==0&&stade==0){
                            if(tabPokemon[k][4].includes(typePicked)){
                                message.reply(" tu as gagné 1 point ! :partying_face:");
                                if(tournoiOn==true){
                                    const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                    compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +type !`);
                                }
                                rollOn = false;
                                gameOn = false;
                                reponse = true;
                                return;
                            }else{
                                message.reply(" bonnes lettres mais mauvais type !\rOn demande le type : "+typePicked+" "+EmoteType(typePicked));
                                return;
                            }
                        }else if (stade==0){
                            if(gen == tabPokemon[k][2]){
                                    message.reply(" tu as gagné 1 point ! :partying_face:");
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +gen !`);
                                    }
                                    rollOn = false;
                                    gameOn = false;
                                    reponse = true;
                                    return;
                            }else {
                                message.reply(" bonnes lettres mais mauvaise génération !\rOn demande la génération : "+EmoteGen(gen));
                                return;
                            }
                        }else if (stade== tabPokemon[k][3]){
                            message.reply(" tu as gagné 1 point ! :partying_face:");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +stade !`);
                            }
                            rollOn = false;
                            gameOn = false;
                            reponse = true;
                            return;
                        }else{
                            if(stade==1){
                                message.reply(" bonnes lettres mais mauvais niveau d'évolution !\rOn demande un __***Pokémon de Base***__ 🥇");
                                return;
                            }else if (stade==2){
                                message.reply(" bonnes lettres mais mauvais niveau d'évolution !\rOn demande une __***première évolution***__ 🥈");
                                return;
                            }else{
                                message.reply(" bonnes lettres mais mauvais niveau d'évolution !\rOn demande une __***deuxième évolution***__ 🥉");
                                return;
                            } 
                        }
                    }
            }

            if(message.author.id==idCathal){
                message.channel.send(idBescherelle+" ce Pokémon n'existe pas (ou est mal orthographié) ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                return;
            }else{
                message.reply(" ce Pokémon n'existe pas (ou est mal orthographié) ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                return;
            }

        }

        if(message.author.id==idCathal){
            message.channel.send(idBescherelle+" y'a même pas les bonnes lettres ! Essaye au moins :rofl:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
            return;
        }else{
            message.reply(" y'a même pas les bonnes lettres ! Essaye au moins :rofl:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
            return;
        }

    }

});

function EmoteStade(stade){

    switch (stade){
        case 1 : return "🥇er stade d'évolution"; break;
        case 2 : return "🥈ème stade d'évolution"; break;
        case 3 : return "🥉ème stade d'évolution"; break;
        default : return '⛔'; break;
    }
}

function EmoteType(type){
    switch (type){
        case "Acier" : return '⚙️'; break;
        case "Combat" : return '🥊'; break;
        case "Dragon" : return '🐲'; break;
        case "Eau" : return '💦'; break;
        case "Électrique" : return '⚡'; break;
        case "Fée" : return '🧚'; break;
        case "Feu" : return '🔥'; break;
        case "Glace" : return '🧊'; break;
        case "Insecte" : return '🪲'; break;
        case "Normal" : return '⚪'; break;
        case "Plante" : return '🌿'; break;
        case "Poison" : return '☠️'; break;
        case "Psy" : return '🧠'; break;
        case "Roche" : return '🪨'; break;
        case "Sol" : return '🌍'; break;
        case "Spectre" : return '👻'; break;
        case "Ténèbres" : return '🌚'; break;
        case "Vol" : return '🪶'; break;
        case "Statut" : return '⁉️';break;
        default : return '⛔';break;
    };
}

function EmoteLettre(lettre){
    switch (lettre){
        case "A" : return '🇦'; break;
        case "B" : return '🇧'; break;
        case "C" : return '🇨'; break;
        case "D" : return '🇩'; break;
        case "E" : return '🇪'; break;
        case "F" : return '🇫'; break;
        case "G" : return '🇬'; break;
        case "H" : return '🇭'; break;
        case "I" : return '🇮'; break;
        case "J" : return '🇯'; break;
        case "K" : return '🇰'; break;
        case "L" : return '🇱'; break;
        case "M" : return '🇲'; break;
        case "N" : return '🇳'; break;
        case "O" : return '🇴'; break;
        case "P" : return '🇵'; break;
        case "Q" : return '🇶'; break;
        case "R" : return '🇷'; break;
        case "S" : return '🇸';break;
        case "T" : return '🇹'; break;
        case "U" : return '🇺'; break;
        case "V" : return '🇻'; break;
        case "W" : return '🇼'; break;
        case "X" : return '🇽'; break;
        case "Y" : return '🇾'; break;
        case "Z" : return '🇿';break;
        default : return "**"+lettre.toUpperCase()+"**";break;
    };
}

function EmoteGen(gen){
    switch (gen){
        case 1 : return ':one: 🇬'; break;
        case 2 : return ':two: 🇬'; break;
        case 3 : return ':three: 🇬'; break;
        case 4 : return ':four: 🇬'; break;
        case 5 : return ':five: 🇬'; break;
        case 6 : return ':six: 🇬'; break;
        case 7 : return ':seven: 🇬'; break;
        case 8 : return ':eight: 🇬'; break;
        case 9 : return ':nine: 🇬'; break;
        case 10 : return ':ten: 🇬'; break;
        default : return '⛔';break;
    };
}

function Rand(valeur){
    return Math.floor(Math.random() * valeur +1);
}




