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


//variable tournoi staff
var tournoiOn = false;

const idCathal = "219742701489225728";
const idBescherelle = "<@&794691502822653953>";

//prefix utuliser pour les roll
const prefixStart = "roll";
const prefixSoluce = "soluce";
const prefixTournoiOn = "start";
const prefixTournoiOff = "stop";
const prefixJeJoue = "je joue";

//variable roll original
var nomPokemon = "";
var paramJeu = "";
var lettre1;
var lettre2;
var gen;
var stade;
var typePicked;
var allTypes;
var randroll;


//variable ru roll médicamonche
var display;
var LangueMessage;
var idToCheck;


//Variable des roll snap
var typePickedSnap;
var genSnap;
var stadeSnap;
var randrollSnap;
var genderSnap;
var paramTypeSnap;


//Variable de suivi des roll anti-cheat anti double roll etc...
var gameOn = false;
var rollOn = false;
var medicOn = false;
var reponse = true;
var gameOnSnap = false;
var rollOnSnap = false;
var reponseSnap = true;
var gameOnDex = false;
var rollOnDex = false;
var reponseDex = true;


// Connection à la BDD Monche Officiel 
const bddMoncheOfficiel = require('./bddMoncheOfficiel.json');
const tabPokemon = bddMoncheOfficiel.pokemonAll;
const taillePokedex = tabPokemon.length;
const nombreGen = 8;

// Connection à la BDD Médicamonche
const bddMedicamonche = require('./bddMedicamonche.json');
const tabPokeLangue = bddMedicamonche.pokemonsAllLang;
const tabMedicamonche = bddMedicamonche.medicaments;
    //Mandarin, Cantonais, Japonais, Allemand, Russe, Thaï, Coréen, Anglais, Français
var nbrLangue = 8;
var NbrGen = 8;
const taillePokedexLangue = tabPokeLangue.length;
const tailleMedicamonche = tabMedicamonche.length;



// Connection à la BDD MoncheSnap
const bddMoncheSnap = require('./bddMoncheSnap.json');
const tabPokeSnap = bddMoncheSnap.pokemonSnap;
const tailleSnap = tabPokeSnap.length;

const tabPokeGender = bddMoncheSnap.pokemonGender;
const tailleGender = tabPokeGender.length;


const tabType = ["Acier","Combat","Dragon","Eau","Électrique",
"Fée","Feu","Glace","Insecte","Normal","Plante","Poison",
"Psy","Roche","Sol","Spectre","Ténèbres","Vol"];





var test = '18 21 13 1 *';

///////////////////////
// Début de la Quête //
///////////////////////

//cron.schedule(test, async () => {
cron.schedule('0 16 8 2 *', async () => {
    const guild = bot.guilds.cache.get(auth.server.guild);
    const channel = bot.channels.cache.get(auth.server.salon.affichage);

                      await channel.send("<@&"+auth.server.role.ping+">, le Monche Universe grandi toujours plus !\rL'annonce de \"New Pokemon Snap\" vous titille !\rRendez-vous dans la Catégorie Monche Universe\rce **__Lundi 8 Février à 21h__** pour fêtez l'arrivée de ***\"New-Monche-Snap\"*** :partying_face: !!\r*c'est exactement ce à quoi vous pensez*\r__Si vous ne souhaitez pas être spammé de notification, pensez à rendre la catégorie muette.__");
                      await channel.send("https://tenor.com/view/oh-snap-parks-and-rec-parks-and-recreation-chris-pratt-gif-5468594");
});


//cron.schedule(test, async () => {
cron.schedule('0 21 8 1 *', async () => {
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

//test de lecture de fichier audio (monche-cri)
/*
    if(petitMessage==="test"){

        var voiceChannel = auth.server.salon.soundeffect;
        voiceChannel.join().then(connection => {

            const dispatcher = connection.play('./Cri-1G/001 - Bulbasaur.wav');
            dispatcher.on("end", end => {voiceChannel.leave();});

        }).catch(err => console.log(err));


    }
*/
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

        //commande "roll" dans monche? (l'original)
        if (petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.monchedex&&rollOnDex==false&&reponseDex==true){

            var quelEstCeDex = Rand(tailleSnap)-1;
            nomDex = tabPokeSnap[quelEstCeDex][1];
            numDex = tabPokeSnap[quelEstCeDex][2];

            //récupération d'une image
            if(tabPokeSnap[quelEstCeDex][0][1]==="xxx"){
                var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeDex][0][0]);
                var lienImage = "Sprite"+tabPokeSnap[quelEstCeDex][0][0].split('Sprite')[1];
                console.log(lienImage);
            }else{
                if(Math.random()>tabPokeSnap[quelEstCeDex][0][2]){
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeDex][0][0]);
                    var lienImage = "Sprite"+tabPokeSnap[quelEstCeDex][0][0].split('Sprite')[1];
                    console.log(lienImage);
                }else{
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeDex][0][1]);
                    var lienImage = "Sprite"+tabPokeSnap[quelEstCeDex][0][1].split('Sprite')[1];
                    console.log(lienImage);
                }
            }
                        const messagePokemonDex = new Discord.MessageEmbed()
                                .setColor('#BD1513')
                                .setTitle("__**"+nomDex+"**__")
                                .setDescription("Vous devez donc retrouvez le numéro de pokédex de : ***"+nomDex+"***")
                                .attachFiles(attachment)
                                .setImage('attachment://'+lienImage)
                                .setThumbnail(bot.user.displayAvatarURL())
                                .setFooter("Plus ou Moinche : Dex Édition");

            await message.channel.send("Prêt·e·s ?");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                setTimeout(async function(){await message.channel.send({embed : messagePokemonDex});rollOnDex = false;},4500);
                
                gameOnDex = true;
                
        }


        //commande "roll" dans monche? (l'original)
        if (petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.monchesnap&&rollOnSnap==false&&reponseSnap==true){

            /*
            // Connection à la BDD MoncheSnap
            const bddMoncheSnap = require('./bddMoncheSnap.json');
            const tabPokeSnap = bddMoncheSnap.pokemonSnap;
            const tailleSnap = tabPokeSnap.length;
            */

            //La réponse n'a pas été trouvée et le roll est toujours actifs :)
            reponseSnap = false;
            rollOnSnap = true;

            paramJeuSnap = petitMessage.split(' ');
            message.delete();

            //variable pour le type du Snap, la Gen du Snap, le stade du Snap, Et le random roll du Snap
            typePickedSnap = "";
            genSnap = 0;
            stadeSnap = 0;
            randrollSnap = 10;
            //variable pour le genre du snap
            genderSnap = "";

            //différent roll : nom, type, gen, stade, genre

            if(paramJeuSnap[1]==="random"){randrollSnap = Rand(5);}

            console.log("paramètre : "+paramJeuSnap[1]);
            if(!paramJeuSnap[1]||randrollSnap==1){
            //tirage de nom pur, donc boucle pour éviter de contenir forme
                var quelEstCeSnap = Rand(tailleSnap)-1;
                nomSnap = tabPokeSnap[quelEstCeSnap][1];

                while(nomSnap.toLowerCase().includes("forme")||nomSnap.toLowerCase().includes("méga")||nomSnap.toLowerCase().includes("primo")||nomSnap.toLowerCase().includes("ultra")||nomSnap.toLowerCase().includes("taille")||nomSnap.toLowerCase().includes("coupe")||nomSnap.toLowerCase().includes("fleur")||nomSnap.toLowerCase().includes("motif")){
                    console.log("Boucle forme : "+nomSnap);
                    quelEstCeSnap = Rand(tailleSnap)-1;
                    nomSnap = tabPokeSnap[quelEstCeSnap][1];
                }

                typeSnap = tabPokeSnap[quelEstCeSnap][5];
                genSnap = tabPokeSnap[quelEstCeSnap][3];
                console.log("Nom : "+nomSnap);
                console.log("Type : "+typeSnap);
                console.log("Gen : "+genSnap);
                if(tabPokeSnap[quelEstCeSnap][0][1]==="xxx"){
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                }else{
                    if(Math.random()>tabPokeSnap[quelEstCeSnap][0][2]){
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                    }else{
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][1]);
                    }
                }
                //await message.channel.send({files:[attachment]})
            }else if(paramJeuSnap[1]==="type"||randrollSnap==2){
            //récupération des Lettres (dénominateur commun)
                var quelEstCeSnap = Rand(tailleSnap)-1;
                nomSnap = tabPokeSnap[quelEstCeSnap][1];
                typeSnap = tabPokeSnap[quelEstCeSnap][5];
                genSnap = tabPokeSnap[quelEstCeSnap][3];
                console.log("Nom : "+nomSnap);
                console.log("Type : "+typeSnap);
                console.log("Gen : "+genSnap);
                if(tabPokeSnap[quelEstCeSnap][0][1]==="xxx"){
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                }else{
                    if(Math.random()>tabPokeSnap[quelEstCeSnap][0][2]){
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                    }else{
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][1]);
                    }
                }
                //await message.channel.send({files:[attachment]})
            }else  if(paramJeuSnap[1]==="gen"||randrollSnap==3){
            //récupération des Lettres (dénominateur commun)
                var genMaking = Rand(NbrGen);
                console.log("gen : "+genMaking);
                var quelEstCeSnap = Rand(tailleSnap)-1;
                while(tabPokeSnap[quelEstCeSnap][3]!=genMaking){
                    console.log("boucle gen");
                    quelEstCeSnap = Rand(tailleSnap)-1;
                }

                nomSnap = tabPokeSnap[quelEstCeSnap][1];
                typeSnap = tabPokeSnap[quelEstCeSnap][5];
                genSnap = tabPokeSnap[quelEstCeSnap][3];
                console.log("Nom : "+nomSnap);
                console.log("Type : "+typeSnap);
                console.log("Gen : "+genSnap);
                if(tabPokeSnap[quelEstCeSnap][0][1]==="xxx"){
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                }else{
                    if(Math.random()>tabPokeSnap[quelEstCeSnap][0][2]){
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                    }else{
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][1]);
                    }
                }
                //await message.channel.send({files:[attachment]})
            }else if(paramJeuSnap[1]==="stade"||randrollSnap==4){
            //récupération des Lettres (dénominateur commun)
                var stadeMaking = Rand(3);
                console.log("stade : "+stadeMaking);
                var quelEstCeSnap = Rand(tailleSnap)-1;
                while(tabPokeSnap[quelEstCeSnap][4]!=stadeMaking){
                    console.log("boucle stade");
                    quelEstCeSnap = Rand(tailleSnap)-1;
                }


                nomSnap = tabPokeSnap[quelEstCeSnap][1];
                typeSnap = tabPokeSnap[quelEstCeSnap][5];
                genSnap = tabPokeSnap[quelEstCeSnap][3];
                console.log("Nom : "+nomSnap);
                console.log("Type : "+typeSnap);
                console.log("Gen : "+genSnap);
                if(tabPokeSnap[quelEstCeSnap][0][1]==="xxx"){
                    var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                }else{
                    if(Math.random()>tabPokeSnap[quelEstCeSnap][0][2]){
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][0]);
                    }else{
                        var attachment = new Discord.MessageAttachment(tabPokeSnap[quelEstCeSnap][0][1]);
                    }
                }
                //await message.channel.send({files:[attachment]})
            }else{

                var quelEstCeGender = Rand(tailleGender)-1;
                nomGender = tabPokeGender[quelEstCeGender][1];
                console.log("Nom : "+nomGender);

                if(Rand(2)>1){
                    gender = "mâle";
                    genderSnap=tabPokeGender[quelEstCeGender][0][0];
                    var attachment = new Discord.MessageAttachment(tabPokeGender[quelEstCeGender][0][0]);
                }else{
                    gender = "femelle";
                    genderSnap=tabPokeGender[quelEstCeGender][0][1];
                    var attachment = new Discord.MessageAttachment(tabPokeGender[quelEstCeGender][0][1]);
                }

            }

        
            if(!paramJeuSnap[1]||randrollSnap==1){
                await message.channel.send("Prêt·e·s ? (Nom pur)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedSnap = "";
                genSnap = 0;
                stadeSnap = 0;
                genderSnap = "";

                setTimeout(async function(){await message.channel.send({files:[attachment]});rollOnSnap = false;},4500);
                
                gameOnSnap = true;
                return;

            }else if(paramJeuSnap[1] ==="type"||randrollSnap==2){
                await message.channel.send("Prêt·e·s ? (Tous les types)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedSnap = tabPokeSnap[quelEstCeSnap][5].toLowerCase();
                genSnap = 0;
                stadeSnap = 0;
                genderSnap = "";

                setTimeout(async function(){await message.channel.send({files:[attachment]});rollOnSnap = false;},4500);
                
                gameOnSnap = true;
                return;
            }else if(paramJeuSnap[1] ==="gen"||randrollSnap==3){
                await message.channel.send("Prêt·e·s ? (La Génération)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedSnap = "";
                genSnap = tabPokeSnap[quelEstCeSnap][3];
                stadeSnap = 0;
                genderSnap = "";

                setTimeout(async function(){await message.channel.send({files:[attachment]});rollOnSnap = false;},4500);
                
                gameOnSnap = true;
                return;
            }else if(paramJeuSnap[1] ==="stade"||randrollSnap==4){
                await message.channel.send("Prêt·e·s ? (Le stade d'évolution)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedSnap = "";
                genSnap = 0;
                stadeSnap = tabPokeSnap[quelEstCeSnap][4];
                genderSnap = "";

                setTimeout(async function(){await message.channel.send({files:[attachment]});rollOnSnap = false;},4500);
                
                gameOnSnap = true;
                return;
            }else if(paramJeuSnap[1] ==="gender"||randrollSnap==5){
                await message.channel.send("Prêt·e·s ? (Le Genre)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedSnap = "";
                genSnap = 0;
                stadeSnap = 0;
                var k=0;

                setTimeout(async function(){await message.channel.send({files:[attachment]});rollOnSnap = false;},4500);
                
                gameOnSnap = true;
                return;
            }else{
                message.reply(" ... si même le staff ne sait plus taper les commandes, on va ouvrir les recrutements auprès des gens qui savent copier/coller :stuck_out_tongue_closed_eyes:");
                reponseSnap = true;
                rollOnSnap = false;
                return;
            }
        }
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
                    //msg.react('🇫🇷');
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
        
                    msg.awaitReactions(filter, { time: 11000 })
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
                            medicOn = false;
                        } else { 
                            if (reaction.emoji === undefined) {
                                message.channel.send(`Personne n'avait la bonne réponse !`);
                                message.channel.send(`:salt:\r`+auth.server.emote.sangoku);
                                medicOn = false;
                            } else {

                                console.log("drapeau : "+drapeau);
                                console.log("reaction : "+reaction);

                                const users = await reaction.users.cache.array();
                                
                                //console.log(users);

                                if(users.length<=1){
                                    message.channel.send(`Personne n'avait la bonne réponse !`);
                                    message.channel.send(`:salt:\r`+auth.server.emote.sangoku); 
                                    medicOn = false;
                                }

                                for (let i = 1; i < users.length; i++) {
                                    const user = users[i];
                                    message.channel.send(`${user} gagne 1 point !`);
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${user.id}>** a gagné 1 point sur un roll Médicamonche !`);
                                    }
                                };
                                medicOn = false;

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

                setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et avec au moins un type : **__"+typePicked+"__** "+EmoteType(typePicked.toLowerCase()));rollOn = false;},4500);
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

        //commande "soluce" dans salon Monche-Snap
        if (petitMessage.startsWith(prefixSoluce)&&message.channel.id==auth.server.salon.monchesnap){
            if(reponseSnap==false){
                if(rollOnSnap==false){
                    if(gameOnSnap==true){
                        gameOnSnap = false;
                        rollOnSnap = false;
                        reponseSnap = true;
                        if(paramJeuSnap[1]==="gender"||randrollSnap==5){
                            if(gender=="mâle"){
                                var symboleGender = '♂️';
                            }else{
                                var symboleGender = '♀️';
                            }
                            message.channel.send("La solution était : ||__**"+nomGender+"**__|| est évidemment "+gender+" "+symboleGender+".\r*Better Luck Next Time !* :fingers_crossed:");return;
                        }else if(paramJeuSnap[1]==="stade"||randrollSnap==4){
                            if(stadeSnap==1){
                                var phraseStade = "un pokémon de base 🥇 !";
                            }else if (stadeSnap==2){
                                var phraseStade = "une première évolution 🥈 !";
                            }else{
                                var phraseStade = "une seconde évolution 🥉 !";
                            }
                            message.channel.send("La solution était : ||__**"+nomSnap+"**__|| est "+phraseStade+"\r*Better Luck Next Time !* :fingers_crossed:");return;
                        }else if(paramJeuSnap[1]==="gen"||randrollSnap==3){
                            message.channel.send("La solution était : ||__**"+nomSnap+"**__|| issu de la "+EmoteGen(genSnap)+" .\r*Better Luck Next Time !* :fingers_crossed:");return;
                        }else if(paramJeuSnap[1]==="type"||randrollSnap==2){
                            var splitType = typePickedSnap.split(' ');
                            if(!splitType[1]){
                                message.channel.send("La solution était : ||__**"+nomSnap+"**__|| de type "+EmoteType(typePickedSnap.toLowerCase())+" pur.\r*Better Luck Next Time !* :fingers_crossed:");return;
                            }else{
                                message.channel.send("La solution était : ||__**"+nomSnap+"**__|| de type "+EmoteType(splitType[0].toLowerCase())+" et "+EmoteType(splitType[1].toLowerCase())+".\r*Better Luck Next Time !* :fingers_crossed:");return;
                            }
                        }else{
                            message.channel.send("La solution était : __**"+nomSnap+"**__.\r*Better Luck Next Time !* :fingers_crossed:");return;
                        }
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

    //commande pour everyone
    if(message.member.roles.cache.has(auth.server.role.everyone)){

        //récupération des réponses dans Monche?
        if(message.channel.id==auth.server.salon.monchesnap&&gameOnSnap==true)
        {
            //tant que le roll n'est pas fini
            if(rollOnSnap==false){

                if(!paramJeuSnap[1]||randrollSnap==1){
                    if(petitMessage == nomSnap.toLowerCase()){
                        message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| s'appelle bien "+nomSnap+" !");
                        if(tournoiOn==true){
                            const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                            compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap pur !`);
                        }
                        reponseSnap = true;
                        gameOnSnap = false;
                        rollOnSnap = false;
                        return;
                    }else{

                        for (k=0;k<tailleSnap;k++){
                            var Existing = tabPokeSnap[k][1];
                            var FirstExist = Existing.split(' ');
                            if(Existing.toLowerCase()==petitMessage||FirstExist[0].toLowerCase()==petitMessage){
                                message.reply(" ce Pokémon existe bien mais ne ressemble en rien à cette image ! :rofl:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                                return;
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
                }else if(paramJeuSnap[1]==="type"||randrollSnap==2){
                    //découpe du message joueur avec l'espace
                    var paramTypeToCheck = typePickedSnap.split(' ');
                    paramTypeSnap = petitMessage.split(' ');
                    //console.log("/"+paramTypeSnap[0]+"/"+paramTypeSnap[1]+"/");
                    //si pas de second paramètre alors on check que le premier
                    if(!paramTypeSnap[1]&&!paramTypeSnap[2]&&!paramTypeSnap[3]&&!paramTypeSnap[4]&&!paramTypeSnap[5]){
                        if(typePickedSnap===paramTypeSnap[0]){
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est tout à fait de type "+EmoteType(paramTypeSnap[0].toLowerCase())+" pur !");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Type Unique !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else{
                            message.reply(" ce Pokémon n'a pas ce type ! \rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }
                    //si un second alors on vérifie que les deux sont dans le type du pokémon
                    }else{
                        //console.log("1 : "+paramTypeSnap[0]+"/ 2 : "+paramTypeSnap[1]+"/ 3 : "+paramTypeSnap[2]+"/ 4 : "+paramTypeSnap[3]+"/ 5 : "+paramTypeSnap[4]+"/ 6 : "+paramTypeSnap[5])
                        var filtreEspace = "";
                        var j = 0;
                        while (paramTypeSnap[j]!=undefined){
                            console.log("paramTypeSnap["+j+"] : "+paramTypeSnap[j])
//                        for (j=0;j<6;j++){
                            //console.log("/"+paramTypeSnap[j]+"/");
                            if(paramTypeSnap[j]!=""){

                                filtreEspace = filtreEspace+" "+paramTypeSnap[j];
                                //console.log("/"+filtreEspace+"/");

                            }
                            j++;
                        }
                        var newParamTypeSnap = filtreEspace.split(' ');
                        var paramTypeToCheck = typePickedSnap.split(' ');
                        if((filtreEspace.includes(paramTypeToCheck[0])&&filtreEspace.includes(paramTypeToCheck[1])&&!paramTypeToCheck[2])&&(typePickedSnap.includes(newParamTypeSnap[1])&&typePickedSnap.includes(newParamTypeSnap[2])&&!newParamTypeSnap[3])){
                            console.log(petitMessage);
                            console.log("newParamTypeSnap[1] : "+newParamTypeSnap[1]);
                            console.log("newParamTypeSnap[2] : "+newParamTypeSnap[2]);
                            console.log("newParamTypeSnap[3] : "+newParamTypeSnap[3]);
                            console.log("paramTypeToCheck[0] : "+paramTypeToCheck[0]);
                            console.log("paramTypeToCheck[1] : "+paramTypeToCheck[1]);
                            console.log("paramTypeToCheck[2] : "+paramTypeToCheck[2]);

                            var typesoluce = typePickedSnap.split(' ');
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| cumule en effet les types "+EmoteType(typesoluce[0].toLowerCase())+" et "+EmoteType(typesoluce[1].toLowerCase())+" !");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Double Type !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else if(newParamTypeSnap[3]!=""){
                            console.log(filtreEspace);
                            console.log("newParamTypeSnap[1] : "+newParamTypeSnap[1]);
                            console.log("newParamTypeSnap[2] : "+newParamTypeSnap[2]);
                            console.log("newParamTypeSnap[3] : "+newParamTypeSnap[3]);
                            console.log("paramTypeToCheck[0] : "+paramTypeToCheck[0]);
                            console.log("paramTypeToCheck[1] : "+paramTypeToCheck[1]);
                            console.log("paramTypeToCheck[2] : "+paramTypeToCheck[2]);

                            message.reply(" ce Pokémon a peut-être cette combinaison de types !\rMais ta réponse contient un mot ou caractère parasite.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }else if((filtreEspace.includes(paramTypeToCheck[0])||filtreEspace.includes(paramTypeToCheck[1]))&&(typePickedSnap.includes(newParamTypeSnap[1])||typePickedSnap.includes(newParamTypeSnap[2]))){
                            console.log(filtreEspace);
                            console.log("newParamTypeSnap[1] : "+newParamTypeSnap[1]);
                            console.log("newParamTypeSnap[2] : "+newParamTypeSnap[2]);
                            console.log("newParamTypeSnap[3] : "+newParamTypeSnap[3]);
                            console.log("paramTypeToCheck[0] : "+paramTypeToCheck[0]);
                            console.log("paramTypeToCheck[1] : "+paramTypeToCheck[1]);
                            console.log("paramTypeToCheck[2] : "+paramTypeToCheck[2]);
                            message.reply(" ce Pokémon n'a pas cette combinaison de types ! \rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }else {
                            console.log(filtreEspace);
                            console.log("newParamTypeSnap[1] : "+newParamTypeSnap[1]);
                            console.log("newParamTypeSnap[2] : "+newParamTypeSnap[2]);
                            console.log("newParamTypeSnap[3] : "+newParamTypeSnap[3]);
                            console.log("paramTypeToCheck[0] : "+paramTypeToCheck[0]);
                            console.log("paramTypeToCheck[1] : "+paramTypeToCheck[1]);
                            console.log("paramTypeToCheck[2] : "+paramTypeToCheck[2]);
                            message.reply(" ce Pokémon n'a aucun de ces types ! \rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }
                    }
                }else if((paramJeuSnap[1]==="gen"||randrollSnap==3)){

                        if(genSnap===Number(petitMessage)){
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| appartient à la "+EmoteGen(genSnap)+" naturellement !");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Gen !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else{
                            message.reply(" ce Pokémon n'est pas de cette Génération ! \rLa Génération est la première apparition dans les jeux principaux de ce Pokémon ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }

                }else if((paramJeuSnap[1]==="stade"||randrollSnap==4)){

                        if(stadeSnap===Number(petitMessage)){

                            if(stadeSnap==1){
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est un pokémon de base 🥇 !");
                            }else if (stade==2){
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est une première évolution 🥈 !");
                            }else{
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est une seconde évolution 🥉 !");
                            }

                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Stade !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else{
                            message.reply(" ce Pokémon n'est pas de ce stade d'évolution ! \rLe Stade peut etre soit : **1** (pokémon de base), **2** pokémon ayant évolué une fois, ou **3** pokémon ayant évolué deux fois ! :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }
                }else if((paramJeuSnap[1]==="gender"||randrollSnap==5)){
                    if(gender==="mâle"){
                        if(petitMessage=="mâle"||petitMessage=="male"){
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomGender+"|| est effectivement mâle ♂️ !");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Gender (Mâle) !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else{
                            message.reply(" c'est **FAUX** ! *Did you just assume his Gender ?* :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        }
                    }else if(gender==="femelle"){
                        if(petitMessage=="femelle"){
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomGender+"|| est effectivement femelle ♀️ !");
                            if(tournoiOn==true){
                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Gender (Femelle) !`);
                            }
                            reponseSnap = true;
                            gameOnSnap = false;
                            rollOnSnap = false;
                            return;
                        }else{
                            message.reply(" c'est **FAUX** ! *Did you just assume her Gender ?* :anger:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
                            return;
                        } 
                    }
                }
            }
        }
        //récupération des réponses dans Monche?
        if(message.channel.id==auth.server.salon.monche&&gameOn==true)
        {
            if(rollOn==false){
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
                                        message.reply(" bonnes lettres mais mauvais type !\rOn demande le type : "+typePicked+" "+EmoteType(typePicked.toLowerCase()));
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
    switch (type.toLowerCase()){
        case "acier" : return '⚙️'; break;
        case "combat" : return '🥊'; break;
        case "dragon" : return '🐲'; break;
        case "eau" : return '💦'; break;
        case "électrique" : return '⚡'; break;
        case "fée" : return '🧚'; break;
        case "feu" : return '🔥'; break;
        case "glace" : return '🧊'; break;
        case "insecte" : return '🪲'; break;
        case "normal" : return '⚪'; break;
        case "plante" : return '🌿'; break;
        case "poison" : return '☠️'; break;
        case "psy" : return '🧠'; break;
        case "roche" : return '🪨'; break;
        case "sol" : return '🌍'; break;
        case "spectre" : return '👻'; break;
        case "ténèbres" : return '🌚'; break;
        case "vol" : return '🪶'; break;
        case "statut" : return '⁉️';break;
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




