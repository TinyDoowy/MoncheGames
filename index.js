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
var bot = new Discord.Client({ partials: ['USER', 'MESSAGE', 'CHANNEL', 'REACTION'],
                                intents: [
                                    32768, // GatewayIntentBits.MessageContent
                                ] });
bot.login(auth.token);
bot.on('ready', async function () {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

//variable dans 1%
var roll1p = 100;
const prefix1p = "gamble";


//variable tournoi staff
var tournoiOn = false;

const idCathal = "219742701489225728";
const idBescherelle = "<@&794691502822653953>";

//prefix utuliser pour les roll
const prefixStart = "roll";
const prefixBot = "bot";
const prefixSoluce = "soluce";
const prefixTournoiOn = "start";
const prefixTournoiOff = "stop";
const prefixJeJoue = "je joue";
const maximumRoll = 1387; // variable max dans laquelle aller chercher les images (pour éviter les monstres et les métamorph)
const maximumDex = 1010;

//variable roll original
var nomPokemon = "";
var paramJeu = "";
var enAttente = "";
var nomPokemonEN = "";
var paramJeuEN = "";
var enAttenteEN = "";
//variable pour aider le bot à mieux guess le num de dex :)
var minDex = 0;
var maxDex = maximumDex;

var lettre1;
var lettre2;
var gen;
var stade;
var typePicked;
var allTypes;
var randroll;

var lettre1EN;
var lettre2EN;
var genEN;
var stadeEN;
var typePickedEN;
var allTypesEN;
var randrollEN;


//variable ru roll médicamonche
var display;
var LangueMessage;
var idToCheck;


//Variable des roll snap
var tabTypePickedSnap;
var tabPetitMessage;
//var typePickedSnap;
var genSnap;
var stadeSnap;
var randrollSnap;
var genderSnap;
var paramTypeSnap;
var numExplain;


//Variable de suivi des roll anti-cheat anti double roll etc...
var gameOn = false;
var rollOn = false;
var medicOn = false;
var reponse = true;
var gameOnEN = false;
var rollOnEN = false;
var reponseEN = true;
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
const nombreGen = 9;

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
"Roche","Sol","Spectre","Ténèbres","Vol","Psy","Cristal","Bird"];





var test = '18 21 13 1 *';

///////////////////////
// Début de la Quête //
///////////////////////

/*
//cron.schedule(test, async () => {
cron.schedule('0 18 1 4 *', async () => {
    const guild = bot.guilds.cache.get(auth.server.guild);
    const channel = bot.channels.cache.get(auth.server.salon.affichage);

                      await channel.send("<@&"+auth.server.role.ping+">, des nouveaux joueurs entrent dans l'arène !\rC'est l'occasion rêvée de lancer un nouveau mini-jeu.\rRendez-vous dans la Catégorie Monche Universe\rCe **__Jeudi 1er Avril à 21h__** pour fêtez l'arrivée de ***\"Plus-ou-Monche\"*** :partying_face: !!\r\r__Si vous ne souhaitez pas être spammé de notification, pensez à rendre la catégorie muette.__");
                      await channel.send("https://tenor.com/view/hikari-dawn-plusle-minun-pikari-gif-4663353");
});


//cron.schedule(test, async () => {
cron.schedule('0 21 8 1 *', async () => {
    const guild = bot.guilds.cache.get(auth.server.guild);
    const channel = bot.channels.cache.get(auth.server.salon.monche);

                      await channel.send("<@&"+auth.server.role.ping+">, joyeux anniversaire à <@204016690604933120> :partying_face: !!\rMerci de lire les règles et de poser vos questions en cas de doute :smile:\r*Oui ! il y aura un tour pour du beurre*\r(ce message est sponsorisé par les kouignoù-amann du Gers)");
                      await channel.send("https://tenor.com/view/reading-read-read-up-checking-taking-note-gif-15388141");
});
*/

bot.on('message', async function (message, user) {


    petitMessage = message.content.toLowerCase();

    // arrête la lecture du message si l'auteur est le bot.
    if (message.author.bot) return;

////////////////////////////////////////////////////////
//Tirage 1% Avant d'aller dans la catégorie Monche /////
////////////////////////////////////////////////////////
	
    if (message.channel.id==auth.UnPourCent.Salon1p) {
        if(petitMessage.startsWith(prefix1p)){
            if(message.member.roles.cache.has(auth.UnPourCent.Role1p)){
                message.reply("Désolé, tu as déjà tenté ta chance sur cette animation ! :stuck_out_tongue_closed_eyes:")
            }else{

                roll1p = Rand(100);
                message.member.roles.add(auth.UnPourCent.Role1p);

                if(roll1p<=10){
                    message.reply("Tu as gagné les trois Pokémon 1% ! :partying_face:");
                }else if (roll1p<=50){
                    message.reply("Tu as gagné deux Pokémon 1% au choix ! :smile:");
                }else {
                    message.reply("Tu as gagné un seul Pokémon 1% au choix ! :blush:");
                }
            }
        }
    }
	
////////////////////////////////////////////////////////	
////////////////////////////////////////////////////////


	
    
    //limité à la catégorie de la forêt
    if (message.channel.parent!=auth.server.categorie.monche) {console.log("hors catégorie"); return;}

//test de lecture de fichier audio (monche-cri)
/*
    if(petitMessage==="test"){

        var voiceChannel = auth.server.salon.soundeffect;
        voiceChannel.join().then(connection => {

            const dispatcher = connection.play('./pokesound/001 - Bulbasaur.mp3');
            dispatcher.on("end", end => {voiceChannel.leave();});

        }).catch(err => console.log(err));
    }
*/

	console.log("Coucou tout va bien jusqu'ici");
	console.log(message.channel.id);
	console.log(auth.server.salon.staffmonche);

    //commande Staff pour tournoi (salon staff monche)
    if(message.member.roles.cache.has(auth.server.role.staff)&&message.channel.id==auth.server.salon.staffmonche){
	    console.log("bon role bon channel");
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

        //commande "roll" dans Plus-ou-Monche
        if (petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.monchedex&&rollOnDex==false&&reponseDex==true){
			reponseDex = false;
			rollOnDex = true;
            var quelEstCeDex = Rand(maximumRoll);
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
                                .setFooter("Plus ou Monche : Dex Édition");

            await message.channel.send("Prêt·e·s ?");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                setTimeout(async function(){await message.channel.send({embed : messagePokemonDex});rollOnDex = false;},4500);
                
                gameOnDex = true;  
        }

        //commande "roll" dans monche Snap
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

                while(nomSnap.toLowerCase().includes("forme")||nomSnap.toLowerCase().includes("casquette")||nomSnap.toLowerCase().includes("plumage")||nomSnap.toLowerCase().includes("famille")||nomSnap.toLowerCase().includes("méga")||nomSnap.toLowerCase().includes("primo")||nomSnap.toLowerCase().includes("ultra")||nomSnap.toLowerCase().includes("taille")||nomSnap.toLowerCase().includes("coupe")||nomSnap.toLowerCase().includes("fleur")||nomSnap.toLowerCase().includes("motif")){
                    console.log("Boucle forme : "+nomSnap);
                    quelEstCeSnap = Rand(tailleSnap)-1;
                    nomSnap = tabPokeSnap[quelEstCeSnap][1];
                }
		numExplain = quelEstCeSnap;

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
                //var quelEstCeSnap = Rand(2)+1278;
                numExplain = quelEstCeSnap;

                nomSnap = tabPokeSnap[quelEstCeSnap][1];
                typeSnap = tabPokeSnap[quelEstCeSnap][5];
                genSnap = tabPokeSnap[quelEstCeSnap][3];

                //dans le cas d'un zarbi numéroté
                if(numExplain>=1280&&numExplain<=1289){
                    typeSnap = "Psy "+tabType[Rand(17)-1];
                }

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
		numExplain = quelEstCeSnap;


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
                numExplain = quelEstCeSnap;


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

                if(numExplain>=1280&&numExplain<=1289){
                    typePickedSnap = typeSnap.toLowerCase();
                }
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

                                    if(user==auth.server.malus.nolimite||user==auth.server.malus.eloan||user==auth.server.malus.urei){
                                        message.channel.send(`${user} gagne 1/2 point !`);
                                    }else{
                                        message.channel.send(`${user} gagne 1 point !`);
                                    }
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

        //commande "roll" dans monche? (l'anglais)
        if (petitMessage.startsWith(prefixStart)&&message.channel.id==auth.server.salon.moncheEN&&rollOnEN==false&&reponseEN==true){

            reponseEN =false;
            rollOnEN = true;
            paramJeuEN = petitMessage.split(' ');
            message.delete();
            typePickedEN = "";
            genEN = 0;
            stadeEN = 0;
            randrollEN = 0;


            //récupération des Lettres (dénominateur commun)
                var quelEstCePokemonEN = Rand(taillePokedex)-1;
                nomPokemonEN = tabPokemon[quelEstCePokemonEN][5];
                console.log("Nom : "+nomPokemonEN);
                lettre1EN = nomPokemonEN.charAt(0).toUpperCase();
                lettre2EN = nomPokemonEN.charAt(Rand(nomPokemonEN.length-1)).toUpperCase();
                while(lettre2EN==lettre1EN||lettre2EN==" "||lettre2EN=="'"||lettre2EN=="-"||lettre2EN=="."||lettre2EN==":"||lettre2EN=="0"||lettre2EN=="1"||lettre2EN=="2"||lettre2EN=="3"||lettre2EN=="4"||lettre2EN=="5"||lettre2EN=="6"||lettre2EN=="7"||lettre2EN=="8"||lettre2EN=="9"){
                    console.log("boucle sans fin"); 
                    lettre2EN = nomPokemonEN.charAt(Rand(nomPokemonEN.length-1)).toUpperCase();  
                }
                console.log("lettre1EN : "+lettre1EN+" et lettre2EN : "+lettre2EN);


            if(paramJeuEN[1]==="random"){randrollEN = Rand(4);}

            if(!paramJeuEN[1]||randrollEN==1){
                await message.channel.send("Prêt·e·s ? (lettres pures)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                
                typePickedEN = "";
                genEN = 0;
                stadeEN = 0;
                setTimeout(async function(){await message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN));rollOnEN = false;},4500);
                gameOnEN = true;
                return;

            }else if(paramJeuEN[1] === "type"||randrollEN==2){
                await message.channel.send("Prêt·e·s ? (+type)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)

                allTypesEN = tabPokemon[quelEstCePokemonEN][4].split(' ');
                if(allTypesEN[9]!=undefined){
                    typePickedEN = allTypesEN[Rand(10)-1];
                }else if(allTypesEN[8]!=undefined){
                    typePickedEN = allTypesEN[Rand(9)-1];
                }else if(allTypesEN[7]!=undefined){
                    typePickedEN = allTypesEN[Rand(8)-1];
                }else if(allTypesEN[6]!=undefined){
                    typePickedEN = allTypesEN[Rand(7)-1];
                }else if(allTypesEN[5]!=undefined){
                    typePickedEN = allTypesEN[Rand(6)-1];
                }else if(allTypesEN[4]!=undefined){
                    typePickedEN = allTypesEN[Rand(5)-1];
                }else if(allTypesEN[3]!=undefined){
                    typePickedEN = allTypesEN[Rand(4)-1];
                }else if(allTypesEN[2]!=undefined){
                    typePickedEN = allTypesEN[Rand(3)-1];
                }else if(allTypesEN[1]!=undefined){
                    typePickedEN = allTypesEN[Rand(2)-1];
                }else{
                    typePickedEN = allTypesEN[0];
                }

                console.log("/"+paramJeuEN[1]+"/ : "+typePickedEN);

                setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN)+", et avec au moins un type : **__"+typePickedEN+"__** "+EmoteType(typePickedEN.toLowerCase()));rollOnEN = false;},4500);
                gameOnEN = true;
                return;

            }else if(paramJeuEN[1] === "gen"||randrollEN==3){
                await message.channel.send("Prêt·e·s ? (+génération)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                

                genEN = Number(tabPokemon[quelEstCePokemonEN][2]);
                console.log("/"+paramJeuEN[1]+"/ : "+genEN);

                setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN)+", et issu de la "+EmoteGen(genEN)+".\r(*Première apparition dans la branche principale*)");rollOnEN = false;},4500);
                gameOnEN = true;
                return;

            }else if(paramJeuEN[1] === "stade"||randrollEN==4){
                await message.channel.send("Prêt·e·s ? (+stade d'évolution)");
                await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
                

                stadeEN = Number(tabPokemon[quelEstCePokemonEN][3]);
                console.log("/"+paramJeuEN[1]+"/ : "+stadeEN);

                if(stadeEN==1){
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN)+", et qui est un __***Pokémon de Base***__ 🥇\r(*Pokémon non évolué ou bébé*)");rollOnEN = false;},4500);
                }else if (stadeEN==2){
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN)+", et qui est une __***première évolution***__ 🥈\r(*Pokémon ayant évolué 1 fois, ou ayant un bébé*)");rollOnEN = false;},4500);
                }else{
                    setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1EN)+" "+EmoteLettre(lettre2EN)+", et qui est une __***deuxième évolution***__ 🥉\r(*Pokémon ayant évolué 2 fois*)");rollOnEN = false;},4500);
                }
                gameOnEN = true;
                return;

            }else{
                message.reply(" ... si même le staff ne sait plus taper les commandes, on va ouvrir les recrutements auprès des gens qui savent copier/coller :stuck_out_tongue_closed_eyes:");
                reponseEN = true;
                rollOnEN = false;
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

        //commande "soluce" dans salon Monche? anglais
        if (petitMessage.startsWith(prefixSoluce)&&message.channel.id==auth.server.salon.moncheEN){
            if(reponseEN==false){
                if(rollOnEN==false){
                    if(gameOnEN==true){
                        gameOnEN = false;
                        rollOnEN = false;
                        reponseEN = true;
                        message.channel.send("Une des solutions possible était : __**"+nomPokemonEN+"**__.\r*Better Luck Next Time !* :fingers_crossed:");return;
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
                            message.channel.send("La solution était : ||__**"+nomSnap+"**__|| est "+phraseStade+"\r*Better Luck Next Time !* :fingers_crossed:");
                            await ExplicationMonstre(message,numExplain);
                            return;
                        }else if(paramJeuSnap[1]==="gen"||randrollSnap==3){
                            message.channel.send("La solution était : ||__**"+nomSnap+"**__|| issu de la "+EmoteGen(genSnap)+" .\r*Better Luck Next Time !* :fingers_crossed:");
                            await ExplicationMonstre(message,numExplain);
                            return;
                        }else if(paramJeuSnap[1]==="type"||randrollSnap==2){
                            var splitType = typePickedSnap.split(' ');
                            if(!splitType[1]){
                                message.channel.send("La solution était : ||__**"+nomSnap+"**__|| de type "+EmoteType(typePickedSnap.toLowerCase())+" pur.\r*Better Luck Next Time !* :fingers_crossed:");
                                await ExplicationMonstre(message,numExplain);
                                return;
                            }else{
                                message.channel.send("La solution était : ||__**"+nomSnap+"**__|| de type "+EmoteType(splitType[0].toLowerCase())+" et "+EmoteType(splitType[1].toLowerCase())+".\r*Better Luck Next Time !* :fingers_crossed:");
                                await ExplicationMonstre(message,numExplain);
                                return;
                            }
                        }else{
                            message.channel.send("La solution était : __**"+nomSnap+"**__.\r*Better Luck Next Time !* :fingers_crossed:");
                            await ExplicationMonstre(message,numExplain);
                            return;
                        }
                    }else{
                        message.channel.send("Le dernier Pokémon a déjà été trouvé/dévoilé.");return;
                    }
                }else{message.channel.send("Cher <@"+message.author.id+">, veuillez laisser au moins 10 secondes aux joueurs avant de dévoiler la solution. Cordialement, Bisouxx :kissing_heart:");return;}
            }else{return;}
        }

        //commande "soluce" dans salon Plus-ou-Monche
        if (petitMessage.startsWith(prefixSoluce)&&message.channel.id==auth.server.salon.monchedex){
            if(reponseDex==false){
                if(rollOnDex==false){
                    if(gameOnDex==true){
	                    minDex = 0;
						maxDex = maximumDex;
                        gameOnDex = false;
                        rollOnDex = false;
                        reponseDex = true;
	                    enAttente = "";
                            message.channel.send("La solution était : __**n°"+numDex+"**__.\r*Better Luck Next Time !* :fingers_crossed:");
                            return;
                    }else{
                        message.channel.send("Le dernier Numéro de Dex a déjà été trouvé/dévoilé.");return;
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

        //récupération des réponses dans Monche? Snap
        if(message.channel.id==auth.server.salon.monchesnap&&gameOnSnap==true)
        {
            //tant que le roll n'est pas fini
            if(rollOnSnap==false){

                if(!paramJeuSnap[1]||randrollSnap==1){
                    if(petitMessage == nomSnap.toLowerCase()){
                        if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                            message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomSnap+"|| s'appelle bien "+nomSnap+" !");
                        }else{
                            message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| s'appelle bien "+nomSnap+" !");
                        }

                        await ExplicationMonstre(message,numExplain);

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
                    //création de variables de types en tableau
                    // tableau des types de la bdd
                    var tabTypePickedSnap = typePickedSnap.split(' ');
                    // tableau des types du message joueur
                    var tabPetitMessage = petitMessage.split(' ');
                        // gestion des espaces dans le message du joueur
                        var tabPetitMessageFiltreEspace = "";
                        var j = 0;
                        while (tabPetitMessage[j]!=undefined){
                            //console.log("paramTypeSnap["+j+"] : "+tabPetitMessage[j])
                            if(tabPetitMessage[j]!=""){
                                if(j==0){
                                    tabPetitMessageFiltreEspace = tabPetitMessage[j];
                                }else{
                                    tabPetitMessageFiltreEspace = tabPetitMessageFiltreEspace+" "+tabPetitMessage[j];
                                }
                            }
                            j++;
                        }
                        //redécoupe des types des réponses du joueurs
                        var newTabPetitMessage = tabPetitMessageFiltreEspace.split(' ');

                    if(newTabPetitMessage[2]!=undefined){
                        //j'ai répondu avec plus que deux mots, donc je compte le nombre de bons types.
                        var r = 0;
                        var typeCorrect = 0;
                        var typeCorrectCorrect = 0;
                        while(newTabPetitMessage[r]!=undefined){
                            for (m=0;m<tabType.length;m++){
                                if(tabType[m].toLowerCase()===newTabPetitMessage[r].toLowerCase()){
                                    typeCorrect++;
                                    //je compte le nombre de mots qui sont des types
                                }
                            }
                            for (n=0;n<tabTypePickedSnap.length;n++){
                                if(tabTypePickedSnap[n].toLowerCase()===newTabPetitMessage[r].toLowerCase()){
                                    typeCorrectCorrect++;
                                }
                            }
                            r++;
                        }
                        if(r==typeCorrect){
                            message.reply(" tu as clairement mis trop de types dans ta réponse !\rLa réponse doit contenir __uniquement__ **TOUS** les types de la forme présentée ! :anger:")
                            return;
                        }else{
                            message.reply(" tu as clairement mis trop d'infos dans ta réponse !\rTa réponse contient "+typeCorrectCorrect+" type·s correct·s.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                            return;
                        }
                    }else if(newTabPetitMessage[1]!=undefined){
                        // j'ai répondu avec exactement 2 mots
                        //console.log("j'ai répondu avec exactement 2 mots");
                        var s = 0;
                        var typeCorrect = 0;
                        var typeCorrectCorrect = 0;
                        while(newTabPetitMessage[s]!=undefined){
                            for (m=0;m<tabType.length;m++){
                                if(tabType[m].toLowerCase()===newTabPetitMessage[s].toLowerCase()){
                                    typeCorrect++;
                                    //je compte le nombre de mots qui sont des types
                                }
                            }
                            //console.log("typeCorrect : "+typeCorrect);
                            for (n=0;n<tabTypePickedSnap.length;n++){
                                //console.log("n : "+n);
                                if(tabTypePickedSnap[n].toLowerCase()===newTabPetitMessage[s].toLowerCase()){
                                    typeCorrectCorrect++;
                                }
                                //console.log(tabTypePickedSnap[n]+"/"+newTabPetitMessage[s]+"/"+typeCorrectCorrect);

                            }

                            s++;
                        }

                        if(!tabTypePickedSnap[1]){
                            //je n'ai qu'un type à trouver
                            if(s==typeCorrect){
                                message.reply(" ce Pokémon n'a pas de double type !\rTa réponse contient "+typeCorrectCorrect+" type correct.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                return;
                            }else{
                                message.reply(" tu as clairement mis trop d'infos dans ta réponse !\rTa réponse contient "+typeCorrectCorrect+" type correct.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                return;
                            }
                        }else{
                            //j'ai deux type à trouver
                            if(typeCorrect==2){
                                //j'ai tapé deux mots qui sont des types
                                if(typeCorrectCorrect==0){
                                    //je n'ai aucun bon type
                                    message.reply(" mais pas du tout !\rAucun de ces types n'est correct.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                    return;
                                }else if(typeCorrectCorrect==1){
                                    //j'ai un seul bon type
                                    message.reply(" presque presque !\r Un seul de ces types est correct.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                    return;
                                }else if(typeCorrectCorrect==2){
                                    //j'ai les deux bons types
                                    if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                        message.reply(" tu as gagné 1/2 point ! :zany_face:\r||"+nomSnap+"|| cumule en effet les types "+EmoteType(tabTypePickedSnap[0].toLowerCase())+" et "+EmoteType(tabTypePickedSnap[1].toLowerCase())+" !");
                                    }else{
                                        message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| cumule en effet les types "+EmoteType(tabTypePickedSnap[0].toLowerCase())+" et "+EmoteType(tabTypePickedSnap[1].toLowerCase())+" !");
                                    }

                                    await ExplicationMonstre(message,numExplain);
                            
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Double Type !`);
                                    }
                                    reponseSnap = true;
                                    gameOnSnap = false;
                                    rollOnSnap = false;
                                    return;
                                }
                            }else if(typeCorrect==1){
                                //sur mes deux mots un seul est un vrai type
                                if(typeCorrectCorrect==0){
                                    //je n'ai aucun bon type
                                    message.reply(" mais pas du tout !\rAucun de ces types n'est correct, sans parler de la faute d'orthographe (**au mieux**).\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                    return;
                                }else if(typeCorrectCorrect==1){
                                    //j'ai un seul bon type
                                    message.reply(" presque presque !\r Un seul de ces types est correct, l'autre est une faute d'orthographe (**au mieux**).\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                    return;
                                }
                            }else{
                                message.reply(" bon bon bon (*enfin je veux pas dire que c'est la bonne réponse*) !\rJe vais partir du principe que tu cherchais pas à répondre, vu que rien ne ressemble à un type.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                return; 
                            }
                        }
                    } else if(!newTabPetitMessage[1]){
                        //je n'ai répondu qu'avec un seul mot
                        for (l=0;l<tabType.length;l++){
                            if(tabType[l].toLowerCase()===newTabPetitMessage[0].toLowerCase()){
                                typeCorrect++;
                                //je compte le nombre de mots qui sont des types
                            }
                        }
                        if(typeCorrect==0){
                            message.reply(" faut se concentrer, ce mot n'est pas un type du tout !\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                            return;
                        }else{
                            if(typePickedSnap===newTabPetitMessage[0]){
                                if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                    message.reply(" tu as gagné 1/2 point ! :zany_face:\r||"+nomSnap+"|| est tout à fait de type "+EmoteType(typePickedSnap.toLowerCase())+" pur !");
                                }else{
                                    message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est tout à fait de type "+EmoteType(typePickedSnap.toLowerCase())+" pur !");
                                }

                                console.log("numExplain : "+numExplain);
                                await ExplicationMonstre(message,numExplain);
                            
                                if(tournoiOn==true){
                                    const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                    compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Snap +Type Unique !`);
                                }
                                reponseSnap = true;
                                gameOnSnap = false;
                                rollOnSnap = false;
                                return;
                            }else{
                                message.reply(" mais pas du tout !\rCe type n'est absolument pas correct.\rLa réponse doit contenir **TOUS** les types de la forme présentée ! :anger:");
                                return;
                            }
                        }
                    }
                }else if((paramJeuSnap[1]==="gen"||randrollSnap==3)){

                        if(genSnap===Number(petitMessage)){

                            if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomSnap+"|| appartient à la "+EmoteGen(genSnap)+" naturellement !");
                            }else{
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| appartient à la "+EmoteGen(genSnap)+" naturellement !");
                            }

                            await ExplicationMonstre(message,numExplain);
                            

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
                                if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                    message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomSnap+"|| est un pokémon de base 🥇 !");
                                }else{
                                    message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| est un pokémon de base 🥇 !");
                                }
                            }else if (stade==2){
                                if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                    message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomSnap+"|| est une première évolution 🥈 !");
                                }else{
                                    message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| une première évolution 🥈 !");
                                }
                            }else{
                                if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                    message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomSnap+"|| est une seconde évolution 🥉 !");
                                }else{
                                    message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomSnap+"|| une seconde évolution 🥉 !");
                                }
                            }

                            await ExplicationMonstre(message,numExplain);
                            

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
                            if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomGender+"|| est effectivement mâle ♂️ !");
                            }else{
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomGender+"|| est effectivement mâle ♂️ !");
                            }
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
                            if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                message.reply(" tu as gagné 1/2 point ! :partying_face:\r||"+nomGender+"|| est effectivement femelle ♀️ !");
                            }else{
                                message.reply(" tu as gagné 1 point ! :partying_face:\r||"+nomGender+"|| est effectivement femelle ♀️ !");
                            }
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
                                    if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                        message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                    }else{
                                        message.reply(" tu as gagné 1 point ! :partying_face:");
                                    }
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
                                        if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                            message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                        }else{
                                            message.reply(" tu as gagné 1 point ! :partying_face:");
                                        }
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
                                            if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                                message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                            }else{
                                                message.reply(" tu as gagné 1 point ! :partying_face:");
                                            }
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
                                    if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                        message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                    }else{
                                        message.reply(" tu as gagné 1 point ! :partying_face:");
                                    }
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

        
        //récupération des réponses dans Monche? anglais
        if(message.channel.id==auth.server.salon.moncheEN&&gameOnEN==true)
        {
            if(rollOnEN==false){
                //console.log(lettre1+""+lettre2);
                if(petitMessage.startsWith(lettre1EN.toLowerCase())&&petitMessage.includes(lettre2EN.toLowerCase()))
                {
                    for(k=0;k<taillePokedex;k++){
                        if(petitMessage == tabPokemon[k][5].toLowerCase())
                            {
                                if (typePickedEN==""&&genEN==0&&stadeEN==0){
                                    if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                        message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                    }else{
                                        message.reply(" tu as gagné 1 point ! :partying_face:");
                                    }
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres pures !`);
                                    }
                                    rollOnEN = false;
                                    gameOnEN = false;
                                    reponseEN = true;
                                    return;
                                }else if (genEN==0&&stadeEN==0){
                                    if(tabPokemon[k][4].includes(typePickedEN)){
                                        if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                            message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                        }else{
                                            message.reply(" tu as gagné 1 point ! :partying_face:");
                                        }
                                        if(tournoiOn==true){
                                            const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                            compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +type !`);
                                        }
                                        rollOnEN = false;
                                        gameOnEN = false;
                                        reponseEN = true;
                                        return;
                                    }else{
                                        message.reply(" bonnes lettres mais mauvais type !\rOn demande le type : "+typePickedEN+" "+EmoteType(typePickedEN.toLowerCase()));
                                        return;
                                    }
                                }else if (stadeEN==0){
                                    if(genEN == tabPokemon[k][2]){
                                            if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                                message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                            }else{
                                                message.reply(" tu as gagné 1 point ! :partying_face:");
                                            }
                                            if(tournoiOn==true){
                                                const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                                compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +gen !`);
                                            }
                                            rollOnEN = false;
                                            gameOnEN = false;
                                            reponseEN = true;
                                            return;
                                    }else {
                                        message.reply(" bonnes lettres mais mauvaise génération !\rOn demande la génération : "+EmoteGen(genEN));
                                        return;
                                    }
                                }else if (stadeEN== tabPokemon[k][3]){
                                    if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                                        message.reply(" tu as gagné 1/2 point ! :partying_face:");
                                    }else{
                                        message.reply(" tu as gagné 1 point ! :partying_face:");
                                    }
                                    if(tournoiOn==true){
                                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
                                        compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll Lettres +stade !`);
                                    }
                                    rollOnEN = false;
                                    gameOnEN = false;
                                    reponseEN = true;
                                    return;
                                }else{
                                    if(stadeEN==1){
                                        message.reply(" bonnes lettres mais mauvais niveau d'évolution !\rOn demande un __***Pokémon de Base***__ 🥇");
                                        return;
                                    }else if (stadeEN==2){
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


        //récupération des réponses dans Plus-ou-Monche
        if(message.channel.id==auth.server.salon.monchedex&&gameOnDex==true)
        {
            if(rollOnDex==false){

            	if(petitMessage==prefixBot){

            		var botGuess = Rand(parseInt(maxDex)-parseInt(minDex)-parseInt(1))+parseInt(minDex);
            		console.log(parseInt(maxDex)-parseInt(minDex)-parseInt(1)+parseInt(minDex));
            		await message.channel.send(botGuess);

            		if(botGuess==numDex){
            			await message.channel.send("<@798884444580085780> a gagné 1 point ! :partying_face:");
	                    if(tournoiOn==true){
	                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
	                        compteurScore.send(`**<@798884444580085780>** a gagné 1 point sur un roll ±Dex !`);
	                    }
	                    	minDex = 0;
							maxDex = maximumDex;
							rollOnDex = false;
	                    	gameOnDex = false;
	                    	reponseDex = true;

            		}else if(botGuess<numDex){
            			minDex = botGuess;
            			await message.channel.send("<@798884444580085780> a visé trop bas ! Le **n° de Dex** est :arrow_upper_right: **__PLUS GRAND__** !\rEntre "+(parseInt(minDex)+parseInt(1))+" et "+(parseInt(maxDex)-parseInt(1))+" (inclus).");

            		}else{
            			maxDex = botGuess;
            			await message.channel.send("<@798884444580085780> a visé trop haut ! Le **n° de Dex** est :arrow_lower_right: **__PLUS PETIT__** !\rEntre "+(parseInt(minDex)+parseInt(1))+" et "+(parseInt(maxDex)-parseInt(1))+" (inclus).");

            		}

            		enAttente = "";
            		return;


            	}

                //console.log(lettre1+""+lettre2);
                if(isNaN(petitMessage)){
                    message.reply(" ce Nombre n'existe pas (ou est mal orthographié) ! :anger:");
                }else if(message.author.id==enAttente){
        			message.reply(" non petit Chacripan ! Tu ne peux pas proposer deux réponses à la suite.\rAttends qu'un autre joueur fasse une proposition.");
        			return;
                }else{

                	if(petitMessage==numDex){
                        if(message.author.id==auth.server.malus.nolimite||message.author.id==auth.server.malus.eloan||message.author.id==auth.server.malus.urei){
                            message.reply(" tu as gagné 1/2 point ! :partying_face:");
                        }else{
                            message.reply(" tu as gagné 1 point ! :partying_face:");
                        }

	                    if(tournoiOn==true){
	                        const compteurScore = bot.channels.cache.get(auth.server.salon.staffmonche);
	                        compteurScore.send(`**<@${message.author.id}>** a gagné 1 point sur un roll ±Dex !`);
	                    }

	                    rollOnDex = false;
	                    gameOnDex = false;
	                    reponseDex = true;

							minDex = 0;
							maxDex = maximumDex;

	                    enAttente = "";
	                    return;
                    //Il a tapé en dessous.
                	}else if(petitMessage<numDex){
                		    if (petitMessage>minDex){
								minDex = petitMessage;
                			}
                			await message.reply(" tu as visé trop bas ! Le **n° de Dex** est :arrow_upper_right: **__PLUS GRAND__** !\rEntre "+(parseInt(minDex)+parseInt(1))+" et "+(parseInt(maxDex)-parseInt(1))+" (inclus).");

                			enAttente=message.author.id;
                			return;
                	}else {
                			if (petitMessage<maxDex){
	                			maxDex = petitMessage;
	                		}
                			await message.reply(" tu as visé trop haut ! Le **n° de Dex** est :arrow_lower_right: **__PLUS PETIT__** !\rEntre "+(parseInt(minDex)+parseInt(1))+" et "+(parseInt(maxDex)-parseInt(1))+" (inclus).");

                			enAttente=message.author.id;
                			return;

                	}
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
        case "insecte" : return '🐛'; break;
        case "normal" : return '⚪'; break;
        case "plante" : return '🌿'; break;
        case "poison" : return '☠️'; break;
        case "psy" : return '🧠'; break;
        case "roche" : return '⛰️'; break;
        case "sol" : return '🌍'; break;
        case "spectre" : return '👻'; break;
        case "ténèbres" : return '🌚'; break;
        case "vol" : return '🌪️'; break;
        case "bird" : return '🐦'; break;
        case "cristal" : return '💎'; break;
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


async function ExplicationMonstre(message,valeur){
    console.log("valeur : "+valeur);
    switch (valeur){
        //MissingNo.
        case 1388 : var leLink = "**MissingNo.** est le plus connu des Pokémon Bug : <https://www.pokepedia.fr/MissingNo.>\rSi vous voulez plus de détails, cliquez sur le lien !"; break;
        //Crokiyas
        case 1389 : var leLink = "**Crokiyas** est un des Pokémon perdu. Son nom est purement inventé ici.\rIl s'agit tout simplement du Kokiyas qui aurait raté sa morsure sur la queue d'un Ramoloss et qui aurait évolué malgré tout."; break;
        //Onix de Cristal
        case 1390 : var leLink = "**Onix de Cristal** est apparu dans l'épisode 82 de la série animée Pokémon.\rSa particularité est qu'il résiste aux attaques Eau :sweat_drops: et est faible aux attaques Feu :fire: .\r\"*Plus*\" de détail ici : <https://www.pokepedia.fr/Onix_de_Cristal>"; break;
        //M. Mime tout nu
        case 1391 : var leLink = "**M. Mime** *tout nu* est issu d'un meme trouvé sur internet x)\rQue serait un bon jeu Monche sans un trigger qui fait peur à <@"+auth.server.staff.papi+"> ?!"; break;
        //Ronflex de Glace
        case 1392 : var leLink = "**Ronflex de Glace** :ice_cube:  est apparu dans l'épisode spécial *Pokémon Chronicles 3* nommé : Ronflex le Bonhomme de Neige\rPlus de détails dans le lien suivant : <https://www.pokepedia.fr/Ronflex_le_bonhomme_de_neige>"; break;
        //Mew morphing Métamorph
        case 1393 : var leLink = "**Mew utilisant Morphing sur Métamorph** est issu de l'esprit dérangé de <@"+auth.server.staff.urei+">.\r L'idée est de reprendre le concept du Métamorph conservant ses yeux en utilisant Morphing.\rMais dans le cas où Mew l'utiliserait sur *el famoso* Métamorph.\r*Ce Pokémon a été créé par des professionels, ne reproduisez pas ça chez vous !*"; break;
        //Pichu Troizépi
        case 1394 : var leLink = "**Pichu Troizépi** est obtenable dans les Jeux HeartGold et SoulSilver.\rUne procédure suivant une autre distribution en 2009/2010.\rCe Pokémon n'a malheureusement pas eu la chance de pouvoir suivre la Banque et le Home\rPlus d'infos en suivant ce lien : <https://www.pokepedia.fr/Pichu_Troiz%C3%A9pi>"; break;
        //Morphéo Tempête de Sable
        case 1395 : var leLink = "**Morphéo forme Tempête de Sable** est le Pokémon oublié de la météo.\rSachant que Morphéo change de forme sous le soleil, la pluie ou la grêle, il aurait été normal de le voir apparaître sur sa forme *Tempête de Sable*.\rIl est donc bien évidemment de type Sol :earth_africa: ."; break;
        //Régigigigigigigigigigigigigas
        case 1396 : var leLink = "**Regigigigigigigigigigigigigas** est l'idée farfelue qu'avec l'apparition des nouveaux Régi (Dragon :dragon_face: et Électrique :zap: ), un nouveau Gigigas apparaîtrait.\rIl contient donc toutes les gemmes de chaque type et est par conséquent extrêmement long.\rPrions pour que de nouveaux types n'apparaissent pas de si tôt"; break;
        //Forme casquette de pikachu
        case 1397 : var leLink = "**Pikachu Casquette d'Alola** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région d'Alola (saison 20 à 22).\rC'est son trésor le plus précieux!"; break;
        case 1398 : var leLink = "**Pikachu Casquette de Hoenn** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région d'Hoenn (saison 6 à 9).\rC'est son trésor le plus précieux!"; break;
        case 1399 : var leLink = "**Pikachu Casquette de Kalos** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région de Kalos (saison 17 à 19).\rC'est son trésor le plus précieux!"; break;
        case 1400 : var leLink = "**Pikachu Casquette Monde** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans l'ensemble des régions connues à ce jour, en partant de Galar (saison 23 et +).\rC'est son trésor le plus précieux!"; break;
        case 1401 : var leLink = "**Pikachu Casquette Originale** (*akka de Kanto/Johto*) est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région de Kanto, les Îles Oranges et Johto (saison 1 à 5).\rC'est son trésor le plus précieux!"; break;
        case 1402 : var leLink = "**Pikachu Casquette Partenaire** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage durant le 20ème film \"Je te choisis !\" sortie en 2017.\rC'est son trésor le plus précieux!"; break;
        case 1403 : var leLink = "**Pikachu Casquette Sinnoh** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région de Sinnoh (saison 10 à 13).\rC'est son trésor le plus précieux!"; break;
        case 1404 : var leLink = "**Pikachu Casquette d'Unys** est l'une des trop nombreuses formes alternatives de pikachu\rIl porte la casquette de son Dresseur Sacha Ketchup pendant son voyage dans la région d'Unys (saison 14 à 16).\rC'est son trésor le plus précieux!"; break;
        case 1405 : var leLink = "**Pikachu Cosplayeuse \"Catcheur\"** a tellement apprécié les concours de robustesse d'Hoenn qu'elle s'est faite faire un costume de catcheur sur mesure. Sa forme est la même que tous les Pikachu femelle, à un détail près, qui est une tâche noire en forme de cœur au bout de la queue."; break;
        //Zarbi
        case 1406 : var leLink = "**Zarbi 0 (zéro)** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1407 : var leLink = "**Zarbi 1** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1408 : var leLink = "**Zarbi 2** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1409 : var leLink = "**Zarbi 3** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1410 : var leLink = "**Zarbi 4** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1411 : var leLink = "**Zarbi 5** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1412 : var leLink = "**Zarbi 6** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1413 : var leLink = "**Zarbi 7** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1414 : var leLink = "**Zarbi 8** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1415 : var leLink = "**Zarbi 9** est un des chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        case 1416 : var leLink = "**Zarbi ∞** est l'utime chainons manquants au développement complet d'une société moderne\rToujours de type psy :brain:, la puissance cachée des 7 premières générations, s'est transformée en un second type aléatoire (lié à ses IVs)."; break;
        //Bébé Kangourex
        case 1417 : var leLink = "**Bébé Kangourex** a plus ou moins toujours existé\rSon existence ayant été reconnue à partir de la Sixième Génération :six: :regional_indicator_g:, il a pourtant fait couler beaucoup d'encre.\rLa théorie voudrait que le Bébé Kangourex soit en réalité un Osselait avant de porter le crâne de sa défunte maman."; break;
        //Hendron (Hexa cardinal grec pour 6, Hen pour 1)
        case 1418 : var leLink = "**Hendron** est un soldat d'un groupe de Hexadron perdu au milieu de la Pampa.\rSon nom vient des Cardinaux Grecs, Hexa utilisé pour 6, Hen utilisé pour 1.\rIl est incapable de se mettre en formation attaque ou défense, ses Stats de base sont divisées par 6 par rapport à un Hexadron."; break;
        //Lougaroc Forme Aurore
        case 1419 : var leLink = "**Lougaroc Forme Aurore** est le jumeau diabolique du Lougaroc Forme Crépusculaire.\rGladio dans l'épisode caché (Lougaroc Lunaire) obtient un Rocabot (talent Pieds Confus) qui est l'antagoniste de celui de Sacha, son évolution doit en être de même.\rToute cette histoire est complètement fausse, mais regardez-moi ce fluff !"; break;
        //Lippoutou a la peau noir
        case 1420 : var leLink = "**Lippoutou** a initialement été designé avec une peau noire.\rIl a ensuite été coloré en violet afin d'éviter toute interprétation raciste.\rLe dernier Lippoutou de couleur noire que l'on verra dans l'animé sera celui de Sirena lors de l'épisode 99."; break;
        //Lippoutou a la peau noir
        case 1421 : var leLink = "**Zygarde 1% (ou Cœur)** sont des petits êtres verts permettant de créer des Zygarde (10%, 50% ou Forme Parfaite) dans les Jeux Soleil et Lune.\rIls sont représentés dans l'aventure sous forme de petites paillettes vertes (Cellules) ou rouges (Cœur).\rIl y en a 100 au total."; break;
        //God Bidoof
        case 1422 : var leLink = "**Dieu Keunotor** est né d'un post reddit, ironisant sur le fait que Keunotor avec le talent Lunatique était banni des hauts Tiers Smogon.\rLa blague continua dans \"Pokemon Rusty Version\", une web série sur Youtube imaginant le monde de Rouge Feu sans \"moralité\".\rEn anglais et relativement sanglant, à voir à vos risques et profits !"; break;
        //Cehniti et Cheniselle forme neige
        case 1423 : var leLink = "**Cheniti Cape de Neige** est un Pokémon oublié.\rLa cape de feuille pour les terrains herbus, cape de sable pour les terrains rocheux/terreux et cape de déchets pour les terrains bétonnés.\rQue se passe-t-il si le terrain est enneigé, aux Pôle ou moins loin en haut des montagnes ?\rUne cape de Neige... pour se tenir...~~chaud~~ froid !"; break;
        case 1424 : var leLink = "**Cheniselle Cape de Neige**  est l'évolution d'un Pokémon oublié.\rLa cape de feuille pour les terrains herbus, cape de sable pour les terrains rocheux/terreux et cape de déchets pour les terrains bétonnés.\rQue se passe-t-il si le terrain est enneigé, aux Pôle ou moins loin en haut des montagnes ?\rUne cape de Neige... pour se tenir...~~chaud~~ froid !"; break;
        //default  le film "Je te choisis !"
        default : return true; break;
    };
    await message.channel.send(leLink);
}



