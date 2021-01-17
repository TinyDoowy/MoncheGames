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
var bot = new Discord.Client();
bot.login(auth.token);
bot.on('ready', async function () {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

const prefixStart = "roll";
const prefixSoluce = "soluce";
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
var reponse = true;

const tabType = ["Acier","Combat","Dragon","Eau","Électrique",
"Fée","Feu","Glace","Insecte","Normal","Plante","Poison",
"Psy","Roche","Sol","Spectre","Ténèbres","Vol"];

const tabPokemon = [["Bulbizarre",001,1,1,"Plante Poison"],
    ["Herbizarre",002,1,2,"Plante Poison"],
    ["Florizarre",003,1,3,"Plante Poison"],
    ["Salamèche",004,1,1,"Feu"],
    ["Reptincel",005,1,2,"Feu"],
    ["Dracaufeu",006,1,3,"Feu Vol"],
    ["Carapuce",007,1,1,"Eau"],
    ["Carabaffe",008,1,2,"Eau"],
    ["Tortank",009,1,3,"Eau"],
    ["Chenipan",010,1,1,"Insecte"],
    ["Chrysacier",011,1,2,"Insecte"],
    ["Papilusion",012,1,3,"Insecte Vol"],
    ["Aspicot",013,1,1,"Insecte Poison"],
    ["Coconfort",014,1,2,"Insecte Poison"],
    ["Dardargnan",015,1,3,"Insecte Poison"],
    ["Roucool",016,1,1,"Normal Vol"],
    ["Roucoups",017,1,2,"Normal Vol"],
    ["Roucarnage",018,1,3,"Normal Vol"],
    ["Rattata",019,1,1,"Normal"],
    ["Rattata d'Alola",019,7,1,"Ténèbres Normal"],
    ["Rattatac",020,1,2,"Normal"],
    ["Rattatac d'Alola",020,7,2,"Ténèbres Normal"],
    ["Piafabec",021,1,1,"Normal Vol"],
    ["Rapasdepic",022,1,2,"Normal Vol"],
    ["Abo",023,1,1,"Poison"],
    ["Arbok",024,1,2,"Poison"],
    ["Pikachu",025,1,2,"Électrique"],
    ["Raichu",026,1,3,"Électrique"],
    ["Raichu d'Alola",026,7,3,"Électrique Psy"],
    ["Sabelette",027,1,1,"Sol"],
    ["Sabelette d'Alola",027,7,1,"Glace Acier"],
    ["Sablaireau",028,1,2,"Sol"],
    ["Sablaireau d'Alola",028,7,2,"Glace Acier"],
    ["Nidoran",029,1,1,"Poison"],
    ["Nidorina",030,1,2,"Poison"],
    ["Nidoqueen",031,1,3,"Poison Sol"],
    ["Nidorino",033,1,2,"Poison"],
    ["Nidoking",034,1,3,"Poison Sol"],
    ["Mélofée",035,1,2,"Fée"],
    ["Mélodelfe",036,1,3,"Fée"],
    ["Goupix",037,1,1,"Feu"],
    ["Goupix d'Alola",037,7,1,"Glace"],
    ["Feunard",038,1,2,"Feu"],
    ["Feunard d'Alola",038,7,2,"Glace Fée"],
    ["Rondoudou",039,1,2,"Normal Fée"],
    ["Grodoudou",040,1,3,"Normal Fée"],
    ["Nosferapti",041,1,1,"Poison Vol"],
    ["Nosferalto",042,1,2,"Poison Vol"],
    ["Mystherbe",043,1,1,"Plante Poison"],
    ["Ortide",044,1,2,"Plante Poison"],
    ["Rafflesia",045,1,3,"Plante Poison"],
    ["Paras",046,1,1,"Insecte Plante"],
    ["Parasect",047,1,2,"Insecte Plante"],
    ["Mimitoss",048,1,1,"Insecte Poison"],
    ["Aéromite",049,1,2,"Insecte Poison"],
    ["Taupiqueur",050,1,1,"Sol"],
    ["Taupiqueur d'Alola",050,7,1,"Sol Acier"],
    ["Triopikeur",051,1,2,"Sol"],
    ["Triopikeur d'Alola",051,7,2,"Sol Acier"],
    ["Miaouss",052,1,1,"Normal"],
    ["Miaouss d'Alola",052,7,1,"Ténèbres"],
    ["Miaouss de Galar",052,8,1,"Acier"],
    ["Persian",053,1,2,"Normal"],
    ["Persian d'Alola",053,7,2,"Ténèbres"],
    ["Psykokwak",054,1,1,"Eau"],
    ["Akwakwak",055,1,1,"Eau"],
    ["Férosinge",056,1,1,"Combat"],
    ["Colossinge",057,1,2,"Combat"],
    ["Caninos",058,1,1,"Feu"],
    ["Arcanin",059,1,2,"Feu"],
    ["Ptitard",060,1,1,"Eau"],
    ["Têtarte",061,1,2,"Eau"],
    ["Tartard",062,1,3,"Eau Combat"],
    ["Abra",063,1,1,"Psy"],
    ["Kadabra",064,1,2,"Psy"],
    ["Alakazam",065,1,3,"Psy"],
    ["Machoc",066,1,1,"Combat"],
    ["Machopeur",067,1,2,"Combat"],
    ["Mackogneur",068,1,3,"Combat"],
    ["Chétiflor",069,1,1,"Plante Poison"],
    ["Boustiflor",070,1,2,"Plante Poison"],
    ["Empiflor",071,1,3,"Plante Poison"],
    ["Tentacool",072,1,1,"Eau Poison"],
    ["Tentacruel",073,1,2,"Eau Poison"],
    ["Racaillou",074,1,1,"Roche Sol"],
    ["Racaillou d'Alola",074,7,1,"Roche Électrique"],
    ["Gravalanch",075,1,2,"Roche Sol"],
    ["Gravalanch d'Alola",075,7,2,"Roche Électrique"],
    ["Grolem",076,1,3,"Roche Sol"],
    ["Grolem d'Alola",076,7,3,"Roche Électrique"],
    ["Ponyta",077,1,1,"Feu"],
    ["Ponyta de Galar",077,8,1,"Psy"],
    ["Galopa",078,1,2,"Feu"],
    ["Galopa de Galar",078,8,2,"Psy Fée"],
    ["Ramoloss",079,1,1,"Eau Psy"],
    ["Ramoloss de Galar",079,8,1,"Psy"],
    ["Flagadoss",080,1,2,"Eau Psy"],
    ["Flagadoss de Galar",080,8,2,"Poison Psy"],
    ["Magnéti",081,1,1,"Électrique Acier"],
    ["Magnéton",082,1,2,"Électrique Acier"],
    ["Canarticho",083,1,1,"Normal Vol"],
    ["Canarticho de Galar",083,8,1,"Combat"],
    ["Doduo",084,1,1,"Normal Vol"],
    ["Dodrio",085,1,2,"Normal Vol"],
    ["Otaria",086,1,1,"Eau"],
    ["Lamantine",087,1,2,"Eau Glace"],
    ["Tadmorv",088,1,1,"Poison"],
    ["Tadmorv d'Alola",088,7,1,"Poison Ténèbres"],
    ["Grotadmorv",089,1,2,"Poison"],
    ["Grotadmorv d'Alola",089,7,2,"Poison Ténèbres"],
    ["Kokiyas",090,1,1,"Eau"],
    ["Crustabri",091,1,2,"Eau Glace"],
    ["Fantominus",092,1,1,"Spectre Poison"],
    ["Spectrum",093,1,2,"Spectre Poison"],
    ["Ectoplasma",094,1,3,"Spectre Poison"],
    ["Onix",095,1,1,"Roche Sol"],
    ["Soporifik",096,1,1,"Psy"],
    ["Hypnomade",097,1,2,"Psy"],
    ["Krabby",098,1,1,"Eau"],
    ["Krabboss",099,1,2,"Eau"],
    ["Voltorbe",100,1,1,"Électrique"],
    ["Électrode",101,1,2,"Électrique"],
    ["Noeunoeuf",102,1,1,"Plante Psy"],
    ["Noadkoko",103,1,2,"Plante Psy"],
    ["Noadkoko d'Alola",103,7,2,"Plante Dragon"],
    ["Osselait",104,1,1,"Sol"],
    ["Ossatueur",105,1,2,"Sol"],
    ["Ossatueur d'Alola",105,7,2,"Feu Spectre"],
    ["Kicklee",106,1,2,"Combat"],
    ["Tygnon",107,1,2,"Combat"],
    ["Excelangue",108,1,1,"Normal"],
    ["Smogo",109,1,1,"Poison"],
    ["Smogogo",110,1,2,"Poison"],
    ["Smogogo de Galar",110,8,2,"Poison Fée"],
    ["Rhinocorne",111,1,1,"Sol Roche"],
    ["Rhinoféros",112,1,2,"Sol Roche"],
    ["Leveinard",113,1,2,"Normal"],
    ["Saquedeneu",114,1,1,"Plante"],
    ["Kangourex",115,1,1,"Normal"],
    ["Hypotrempe",116,1,1,"Eau"],
    ["Hypocéan",117,1,2,"Eau"],
    ["Poissirène",118,1,1,"Eau"],
    ["Poissoroy",119,1,2,"Eau"],
    ["Stari",120,1,1,"Eau"],
    ["Staross",121,1,2,"Eau Psy"],
    ["M. Mime",122,1,2,"Psy Fée"],
    ["M. Mime de Galar",122,8,2,"Glace Psy"],
    ["Insécateur",123,1,1,"Insecte Vol"],
    ["Lippoutou",124,1,2,"Glace Psy"],
    ["Élektek",125,1,2,"Électrique"],
    ["Magmar",126,1,2,"Feu"],
    ["Scarabrute",127,1,1,"Insecte"],
    ["Tauros",128,1,1,"Normal"],
    ["Magicarpe",129,1,1,"Eau"],
    ["Léviator",130,1,2,"Eau Vol"],
    ["Lokhlass",131,1,1,"Eau Glace"],
    ["Métamorph",132,1,1,"Normal"],
    ["Évoli",133,1,1,"Normal"],
    ["Aquali",134,1,2,"Eau"],
    ["Voltali",135,1,2,"Électrique"],
    ["Pyroli",136,1,2,"Feu"],
    ["Porygon",137,1,1,"Normal"],
    ["Amonita",138,1,1,"Roche Eau"],
    ["Amonistar",139,1,2,"Roche Eau"],
    ["Kabuto",140,1,1,"Roche Eau"],
    ["Kabutops",141,1,2,"Roche Eau"],
    ["Ptéra",142,1,1,"Roche Vol"],
    ["Ronflex",143,1,2,"Normal"],
    ["Artikodin",144,1,1,"Glace Vol"],
    ["Artikodin de Galar",144,8,1,"Psy Vol"],
    ["Électhor",145,1,1,"Électrique Vol"],
    ["Électhor de Galar",145,8,1,"Combat Vol"],
    ["Sulfura",146,1,1,"Feu Vol"],
    ["Sulfura de Galar",146,8,1,"Ténèbres Vol"],
    ["Minidraco",147,1,1,"Dragon"],
    ["Draco",148,1,2,"Dragon"],
    ["Dracolosse",149,1,3,"Dragon Vol"],
    ["Mewtwo",150,1,1,"Psy"],
    ["Mew",151,1,1,"Psy"],
    ["Germignon",152,2,1,"Plante"],
    ["Macronium",153,2,2,"Plante"],
    ["Méganium",154,2,3,"Plante"],
    ["Héricendre",155,2,1,"Feu"],
    ["Feurisson",156,2,2,"Feu"],
    ["Typhlosion",157,2,3,"Feu"],
    ["Kaiminus",158,2,1,"Eau"],
    ["Crocrodil",159,2,2,"Eau"],
    ["Aligatueur",160,2,3,"Eau"],
    ["Fouinette",161,2,1,"Normal"],
    ["Fouinar",162,2,2,"Normal"],
    ["Hoothoot",163,2,1,"Normal Vol"],
    ["Noarfang",164,2,2,"Normal Vol"],
    ["Coxy",165,2,1,"Insecte Vol"],
    ["Coxyclaque",166,2,2,"Insecte Vol"],
    ["Mimigal",167,2,1,"Insecte Poison"],
    ["Migalos",168,2,2,"Insecte Poison"],
    ["Nostenfer",169,2,3,"Poison Vol"],
    ["Loupio",170,2,1,"Eau Électrique"],
    ["Lanturn",171,2,2,"Eau Électrique"],
    ["Pichu",172,2,1,"Électrique"],
    ["Mélo",173,2,1,"Fée"],
    ["Toudoudou",174,2,1,"Normal Fée"],
    ["Togepi",175,2,1,"Fée"],
    ["Togetic",176,2,2,"Fée Vol"],
    ["Natu",177,2,1,"Psy Vol"],
    ["Xatu",178,2,2,"Psy Vol"],
    ["Wattouat",179,2,1,"Électrique"],
    ["Lainergie",180,2,2,"Électrique"],
    ["Pharamp",181,2,3,"Électrique"],
    ["Joliflor",182,2,3,"Plante"],
    ["Marill",183,2,2,"Eau Fée"],
    ["Azumarill",184,2,3,"Eau Fée"],
    ["Simularbre",185,2,2,"Roche"],
    ["Tarpaud",186,2,3,"Eau"],
    ["Granivol",187,2,1,"Plante Vol"],
    ["Floravol",188,2,2,"Plante Vol"],
    ["Cotovol",189,2,3,"Plante Vol"],
    ["Capumain",190,2,1,"Normal"],
    ["Tournegrin",191,2,1,"Plante"],
    ["Héliatronc",192,2,2,"Plante"],
    ["Yanma",193,2,1,"Insecte Vol"],
    ["Axoloto",194,2,1,"Eau Sol"],
    ["Maraiste",195,2,2,"Eau Sol"],
    ["Mentali",196,2,2,"Psy"],
    ["Noctali",197,2,2,"Ténèbres"],
    ["Cornèbre",198,2,1,"Ténèbres Vol"],
    ["Roigada",199,2,2,"Eau Psy"],
    ["Roigada de Galar",199,8,2,"Poison Psy"],
    ["Feuforêve",200,2,1,"Spectre"],
    ["Zarbi",201,2,1,"Psy"],
    ["Qulbutoké",202,2,2,"Psy"],
    ["Girafarig",203,2,1,"Normal Psy"],
    ["Pomdepik",204,2,1,"Insecte"],
    ["Foretress",205,2,2,"Insecte Acier"],
    ["Insolourdo",206,2,1,"Normal"],
    ["Scorplane",207,2,1,"Sol Vol"],
    ["Steelix",208,2,2,"Acier Sol"],
    ["Snubbull",209,2,1,"Fée"],
    ["Granbull",210,2,2,"Fée"],
    ["Qwilfish",211,2,1,"Eau Poison"],
    ["Cizayox",212,2,2,"Insecte Acier"],
    ["Caratroc",213,2,1,"Insecte Roche"],
    ["Scarhino",214,2,1,"Insecte Combat"],
    ["Farfuret",215,2,1,"Ténèbres Glace"],
    ["Teddiursa",216,2,1,"Normal"],
    ["Ursaring",217,2,2,"Normal"],
    ["Limagma",218,2,1,"Feu"],
    ["Volcaropod",219,2,2,"Feu Roche"],
    ["Marcacrin",220,2,1,"Glace Sol"],
    ["Cochignon",221,2,2,"Glace Sol"],
    ["Corayon",222,2,1,"Eau Roche"],
    ["Corayon de Galar",222,8,1,"Spectre"],
    ["Rémoraid",223,2,1,"Eau"],
    ["Octillery",224,2,2,"Eau"],
    ["Cadoizo",225,2,1,"Glace Vol"],
    ["Démanta",226,2,2,"Eau Vol"],
    ["Airmure",227,2,1,"Acier Vol"],
    ["Malosse",228,2,1,"Ténèbres Feu"],
    ["Démolosse",229,2,2,"Ténèbres Feu"],
    ["Hyporoi",230,2,3,"Eau Dragon"],
    ["Phanpy",231,2,1,"Sol"],
    ["Donphan",232,2,2,"Sol"],
    ["Porygon2",233,2,2,"Normal"],
    ["Cerfrousse",234,2,1,"Normal"],
    ["Queulorior",235,2,1,"Normal"],
    ["Debugant",236,2,1,"Combat"],
    ["Kapoera",237,2,2,"Combat"],
    ["Lippouti",238,2,1,"Glace Psy"],
    ["Élekid",239,2,1,"Électrique"],
    ["Magby",240,2,1,"Feu"],
    ["Écrémeuh",241,2,1,"Normal"],
    ["Leuphorie",242,2,3,"Normal"],
    ["Raikou",243,2,1,"Électrique"],
    ["Entei",244,2,1,"Feu"],
    ["Suicune",245,2,1,"Eau"],
    ["Embrylex",246,2,1,"Roche Sol"],
    ["Ymphect",247,2,2,"Roche Sol"],
    ["Tyranocif",248,2,3,"Roche Ténèbres"],
    ["Lugia",249,2,1,"Psy Vol"],
    ["Ho-Oh",250,2,1,"Feu Vol"],
    ["Celebi",251,2,1,"Psy Plante"],
    ["Arcko",252,3,1,"Plante"],
    ["Massko",253,3,2,"Plante"],
    ["Jungko",254,3,3,"Plante"],
    ["Poussifeu",255,3,1,"Feu"],
    ["Galifeu",256,3,2,"Feu Combat"],
    ["Braségali",257,3,3,"Feu Combat"],
    ["Gobou",258,3,1,"Eau"],
    ["Flobio",259,3,2,"Eau Sol"],
    ["Laggron",260,3,3,"Eau Sol"],
    ["Medhyèna",261,3,1,"Ténèbres"],
    ["Grahyèna",262,3,2,"Ténèbres"],
    ["Zigzaton",263,3,1,"Normal"],
    ["Zigzaton de Galar",263,8,1,"Ténèbres Normal"],
    ["Linéon",264,3,2,"Normal"],
    ["Linéon de Galar",264,8,2,"Ténèbres Normal"],
    ["Chenipotte",265,3,1,"Insecte"],
    ["Armulys",266,3,2,"Insecte"],
    ["Charmillon",267,3,3,"Insecte Vol"],
    ["Blindalys",268,3,2,"Insecte"],
    ["Papinox",269,3,3,"Insecte Poison"],
    ["Nénupiot",270,3,1,"Eau Plante"],
    ["Lombre",271,3,2,"Eau Plante"],
    ["Ludicolo",272,3,3,"Eau Plante"],
    ["Grainipiot",273,3,1,"Plante"],
    ["Pifeuil",274,3,2,"Plante Ténèbres"],
    ["Tengalice",275,3,3,"Plante Ténèbres"],
    ["Nirondelle",276,3,1,"Normal Vol"],
    ["Hélédelle",277,3,2,"Normal Vol"],
    ["Goélise",278,3,1,"Eau Vol"],
    ["Bekipan",279,3,2,"Eau Vol"],
    ["Tarsal",280,3,1,"Psy Fée"],
    ["Kirlia",281,3,2,"Psy Fée"],
    ["Gardevoir",282,3,3,"Psy Fée"],
    ["Arakdo",283,3,1,"Insecte Eau"],
    ["Maskadra",284,3,2,"Insecte Vol"],
    ["Balignon",285,3,1,"Plante"],
    ["Chapignon",286,3,2,"Plante Combat"],
    ["Parecool",287,3,1,"Normal"],
    ["Vigoroth",288,3,2,"Normal"],
    ["Monaflèmit",289,3,3,"Normal"],
    ["Ningale",290,3,1,"Insecte Sol"],
    ["Ninjask",291,3,2,"Insecte Vol"],
    ["Munja",292,3,2,"Insecte Spectre"],
    ["Chuchmur",293,3,1,"Normal"],
    ["Ramboum",294,3,2,"Normal"],
    ["Brouhabam",295,3,3,"Normal"],
    ["Makuhita",296,3,1,"Combat"],
    ["Hariyama",297,3,2,"Combat"],
    ["Azurill",298,3,1,"Normal Fée"],
    ["Tarinor",299,3,1,"Roche"],
    ["Skitty",300,3,1,"Normal"],
    ["Delcatty",301,3,2,"Normal"],
    ["Ténéfix",302,3,1,"Ténèbres Spectre"],
    ["Mysdibule",303,3,1,"Acier Fée"],
    ["Galekid",304,3,1,"Acier Roche"],
    ["Galegon",305,3,2,"Acier Roche"],
    ["Galeking",306,3,3,"Acier Roche"],
    ["Méditikka",307,3,1,"Combat Psy"],
    ["Charmina",308,3,2,"Combat Psy"],
    ["Dynavolt",309,3,1,"Électrique"],
    ["Élecsprint",310,3,2,"Électrique"],
    ["Posipi",311,3,1,"Électrique"],
    ["Négapi",312,3,1,"Électrique"],
    ["Muciole",313,3,1,"Insecte"],
    ["Lumivole",314,3,2,"Insecte"],
    ["Rosélia",315,3,2,"Plante Poison"],
    ["Gloupti",316,3,1,"Poison"],
    ["Avaltout",317,3,2,"Poison"],
    ["Carvanha",318,3,1,"Eau Ténèbres"],
    ["Sharpedo",319,3,2,"Eau Ténèbres"],
    ["Wailmer",320,3,1,"Eau"],
    ["Wailord",321,3,2,"Eau"],
    ["Chamallot",322,3,1,"Feu Sol"],
    ["Camérupt",323,3,2,"Feu Sol"],
    ["Chartor",324,3,1,"Feu"],
    ["Spoink",325,3,1,"Psy"],
    ["Groret",326,3,2,"Psy"],
    ["Spinda",327,3,1,"Normal"],
    ["Kraknoix",328,3,1,"Sol"],
    ["Vibraninf",329,3,2,"Sol Dragon"],
    ["Libégon",330,3,3,"Sol Dragon"],
    ["Cacnea",331,3,1,"Plante"],
    ["Cacturne",332,3,2,"Plante Ténèbres"],
    ["Tylton",333,3,1,"Normal Vol"],
    ["Altaria",334,3,2,"Dragon Vol"],
    ["Mangriff",335,3,1,"Normal"],
    ["Séviper",336,3,1,"Poison"],
    ["Séléroc",337,3,1,"Roche Psy"],
    ["Solaroc",338,3,1,"Roche Psy"],
    ["Barloche",339,3,1,"Eau Sol"],
    ["Barbicha",340,3,2,"Eau Sol"],
    ["Écrapince",341,3,1,"Eau"],
    ["Colhomard",342,3,2,"Eau Ténèbres"],
    ["Balbuto",343,3,1,"Sol Psy"],
    ["Kaorine",344,3,2,"Sol Psy"],
    ["Lilia",345,3,1,"Roche Plante"],
    ["Vacilys",346,3,2,"Roche Plante"],
    ["Anorith",347,3,1,"Roche Insecte"],
    ["Armaldo",348,3,2,"Roche Insecte"],
    ["Barpau",349,3,1,"Eau"],
    ["Milobellus",350,3,2,"Eau"],
    ["Morphéo",351,3,1,"Normal Feu Eau Glace"],
    ["Kecleon",352,3,1,"Normal"],
    ["Polichombr",353,3,1,"Spectre"],
    ["Branette",354,3,2,"Spectre"],
    ["Skelénox",355,3,1,"Spectre"],
    ["Téraclope",356,3,2,"Spectre"],
    ["Tropius",357,3,1,"Plante Vol"],
    ["Éoko",358,3,1,"Psy"],
    ["Absol",359,3,1,"Ténèbres"],
    ["Okéoké",360,3,1,"Psy"],
    ["Stalgamin",361,3,1,"Glace"],
    ["Oniglali",362,3,2,"Glace"],
    ["Obalie",363,3,1,"Glace Eau"],
    ["Phogleur",364,3,2,"Glace Eau"],
    ["Kaimorse",365,3,3,"Glace Eau"],
    ["Coquiperl",366,3,1,"Eau"],
    ["Serpang",367,3,2,"Eau"],
    ["Rosabyss",368,3,2,"Eau"],
    ["Relicanth",369,3,1,"Eau Roche"],
    ["Lovdisc",370,3,1,"Eau"],
    ["Draby",371,3,1,"Dragon"],
    ["Drackhaus",372,3,2,"Dragon"],
    ["Drattak",373,3,3,"Dragon Vol"],
    ["Terhal",374,3,1,"Acier Psy"],
    ["Métang",375,3,2,"Acier Psy"],
    ["Métalosse",376,3,3,"Acier Psy"],
    ["Regirock",377,3,1,"Roche"],
    ["Regice",378,3,1,"Glace"],
    ["Registeel",379,3,1,"Acier"],
    ["Latias",380,3,1,"Dragon Psy"],
    ["Latios",381,3,1,"Dragon Psy"],
    ["Kyogre",382,3,1,"Eau"],
    ["Groudon",383,3,1,"Sol"],
    ["Rayquaza",384,3,1,"Dragon Vol"],
    ["Jirachi",385,3,1,"Acier Psy"],
    ["Deoxys",386,3,1,"Psy"],
    ["Tortipouss",387,4,1,"Plante"],
    ["Boskara",388,4,2,"Plante"],
    ["Torterra",389,4,3,"Plante Sol"],
    ["Ouisticram",390,4,1,"Feu"],
    ["Chimpenfeu",391,4,2,"Feu Combat"],
    ["Simiabraz",392,4,3,"Feu Combat"],
    ["Tiplouf",393,4,1,"Eau"],
    ["Prinplouf",394,4,2,"Eau"],
    ["Pingoléon",395,4,3,"Eau Acier"],
    ["Étourmi",396,4,1,"Normal Vol"],
    ["Étourvol",397,4,2,"Normal Vol"],
    ["Étouraptor",398,4,3,"Normal Vol"],
    ["Keunotor",399,4,1,"Normal"],
    ["Castorno",400,4,2,"Normal Eau"],
    ["Crikzik",401,4,1,"Insecte"],
    ["Mélokrik",402,4,2,"Insecte"],
    ["Lixy",403,4,1,"Électrique"],
    ["Luxio",404,4,2,"Électrique"],
    ["Luxray",405,4,3,"Électrique"],
    ["Rozbouton",406,4,1,"Plante Poison"],
    ["Roserade",407,4,3,"Plante Poison"],
    ["Kranidos",408,4,1,"Roche"],
    ["Charkos",409,4,2,"Roche"],
    ["Dinoclier",410,4,1,"Roche Acier"],
    ["Bastiodon",411,4,2,"Roche Acier"],
    ["Cheniti",412,4,1,"Insecte"],
    ["Cheniselle",413,4,2,"Insecte Plante"],
    ["Papilord",414,4,3,"Insecte Vol"],
    ["Apitrini",415,4,1,"Insecte Vol"],
    ["Apireine",416,4,2,"Insecte Vol"],
    ["Pachirisu",417,4,1,"Électrique"],
    ["Mustébouée",418,4,1,"Eau"],
    ["Mustéflott",419,4,2,"Eau"],
    ["Ceribou",420,4,1,"Plante"],
    ["Ceriflor",421,4,2,"Plante"],
    ["Sancoki",422,4,1,"Eau"],
    ["Tritosor",423,4,2,"Eau Sol"],
    ["Capidextre",424,4,2,"Normal"],
    ["Baudrive",425,4,1,"Spectre Vol"],
    ["Grodrive",426,4,2,"Spectre Vol"],
    ["Laporeille",427,4,1,"Normal"],
    ["Lockpin",428,4,2,"Normal"],
    ["Magirêve",429,4,2,"Spectre"],
    ["Corboss",430,4,2,"Ténèbres Vol"],
    ["Chaglam",431,4,1,"Normal"],
    ["Chaffreux",432,4,2,"Normal"],
    ["Korillon",433,4,1,"Psy"],
    ["Moufouette",434,4,1,"Poison Ténèbres"],
    ["Moufflair",435,4,2,"Poison Ténèbres"],
    ["Archéomire",436,4,1,"Acier Psy"],
    ["Archéodong",437,4,2,"Acier Psy"],
    ["Manzaï",438,4,1,"Roche"],
    ["Mime Jr.",439,4,1,"Psy Fée"],
    ["Ptiravi",440,4,1,"Normal"],
    ["Pijako",441,4,1,"Normal Vol"],
    ["Spiritomb",442,4,1,"Spectre Ténèbres"],
    ["Griknot",443,4,1,"Dragon Sol"],
    ["Carmache",444,4,2,"Dragon Sol"],
    ["Carchacrok",445,4,3,"Dragon Sol"],
    ["Goinfrex",446,4,1,"Normal"],
    ["Riolu",447,4,1,"Combat"],
    ["Lucario",448,4,2,"Combat Acier"],
    ["Hippopotas",449,4,1,"Sol"],
    ["Hippodocus",450,4,2,"Sol"],
    ["Rapion",451,4,1,"Poison Insecte"],
    ["Drascore",452,4,2,"Poison Ténèbres"],
    ["Cradopaud",453,4,1,"Poison Combat"],
    ["Coatox",454,4,2,"Poison Combat"],
    ["Vortente",455,4,1,"Plante"],
    ["Écayon",456,4,1,"Eau"],
    ["Luminéon",457,4,2,"Eau"],
    ["Babimanta",458,4,1,"Eau Vol"],
    ["Blizzi",459,4,1,"Plante Glace"],
    ["Blizzaroi",460,4,2,"Plante Glace"],
    ["Dimoret",461,4,2,"Ténèbres Glace"],
    ["Magnézone",462,4,3,"Électrique Acier"],
    ["Coudlangue",463,4,2,"Normal"],
    ["Rhinastoc",464,4,3,"Sol Roche"],
    ["Bouldeneu",465,4,2,"Plante"],
    ["Élekable",466,4,3,"Électrique"],
    ["Maganon",467,4,3,"Feu"],
    ["Togekiss",468,4,3,"Fée Vol"],
    ["Yanmega",469,4,2,"Insecte Vol"],
    ["Phyllali",470,4,2,"Plante"],
    ["Givrali",471,4,2,"Glace"],
    ["Scorvol",472,4,2,"Sol Vol"],
    ["Mammochon",473,4,3,"Glace Sol"],
    ["Porygon-Z",474,4,2,"Normal"],
    ["Gallame",475,4,3,"Psy Combat"],
    ["Tarinorme",476,4,2,"Roche Acier"],
    ["Noctunoir",477,4,3,"Spectre"],
    ["Momartik",478,4,2,"Glace Spectre"],
    ["Motisma",479,4,1,"Électrique Spectre Feu Eau Glace Vol Plante"],
    ["Créhelf",480,4,1,"Psy"],
    ["Créfollet",481,4,1,"Psy"],
    ["Créfadet",482,4,1,"Psy"],
    ["Dialga",483,4,1,"Acier Dragon"],
    ["Palkia",484,4,1,"Eau Dragon"],
    ["Heatran",485,4,1,"Feu Acier"],
    ["Regigigas",486,4,1,"Normal"],
    ["Giratina",487,4,1,"Spectre Dragon"],
    ["Cresselia",488,4,1,"Psy"],
    ["Phione",489,4,1,"Eau"],
    ["Manaphy",490,4,1,"Eau"],
    ["Darkrai",491,4,1,"Ténèbres"],
    ["Shaymin",492,4,1,"Plante Vol"],
    ["Arceus",493,4,1,"Normal"],
    ["Victini",494,5,1,"Psy Feu"],
    ["Vipélierre",495,5,1,"Plante"],
    ["Lianaja",496,5,2,"Plante"],
    ["Majaspic",497,5,3,"Plante"],
    ["Gruikui",498,5,1,"Feu"],
    ["Grotichon",499,5,2,"Feu Combat"],
    ["Roitiflam",500,5,3,"Feu Combat"],
    ["Moustillon",501,5,1,"Eau"],
    ["Mateloutre",502,5,2,"Eau"],
    ["Clamiral",503,5,3,"Eau"],
    ["Ratentif",504,5,1,"Normal"],
    ["Miradar",505,5,2,"Normal"],
    ["Ponchiot",506,5,1,"Normal"],
    ["Ponchien",507,5,2,"Normal"],
    ["Mastouffe",508,5,3,"Normal"],
    ["Chacripan",509,5,1,"Ténèbres"],
    ["Léopardus",510,5,2,"Ténèbres"],
    ["Feuillajou",511,5,1,"Plante"],
    ["Feuiloutan",512,5,2,"Plante"],
    ["Flamajou",513,5,1,"Feu"],
    ["Flamoutan",514,5,2,"Feu"],
    ["Flotajou",515,5,1,"Eau"],
    ["Flotoutan",516,5,2,"Eau"],
    ["Munna",517,5,1,"Psy"],
    ["Mushana",518,5,2,"Psy"],
    ["Poichigeon",519,5,1,"Normal Vol"],
    ["Colombeau",520,5,2,"Normal Vol"],
    ["Déflaisan",521,5,3,"Normal Vol"],
    ["Zébibron",522,5,1,"Électrique"],
    ["Zéblitz",523,5,2,"Électrique"],
    ["Nodulithe",524,5,1,"Roche"],
    ["Géolithe",525,5,2,"Roche"],
    ["Gigalithe",526,5,3,"Roche"],
    ["Chovsourir",527,5,1,"Psy Vol"],
    ["Rhinolove",528,5,2,"Psy Vol"],
    ["Rototaupe",529,5,1,"Sol"],
    ["Minotaupe",530,5,2,"Sol Acier"],
    ["Nanméouïe",531,5,1,"Normal"],
    ["Charpenti",532,5,1,"Combat"],
    ["Ouvrifier",533,5,2,"Combat"],
    ["Bétochef",534,5,3,"Combat"],
    ["Tritonde",535,5,1,"Eau"],
    ["Batracné",536,5,2,"Eau Sol"],
    ["Crapustule",537,5,3,"Eau Sol"],
    ["Judokrak",538,5,1,"Combat"],
    ["Karaclée",539,5,1,"Combat"],
    ["Larveyette",540,5,1,"Insecte Plante"],
    ["Couverdure",541,5,2,"Insecte Plante"],
    ["Manternel",542,5,3,"Insecte Plante"],
    ["Venipatte",543,5,1,"Insecte Poison"],
    ["Scobolide",544,5,2,"Insecte Poison"],
    ["Brutapode",545,5,3,"Insecte Poison"],
    ["Doudouvet",546,5,1,"Plante Fée"],
    ["Farfaduvet",547,5,2,"Plante Fée"],
    ["Chlorobule",548,5,1,"Plante"],
    ["Fragilady",549,5,2,"Plante"],
    ["Bargantua",550,5,1,"Eau"],
    ["Mascaïman",551,5,1,"Sol Ténèbres"],
    ["Escroco",552,5,2,"Sol Ténèbres"],
    ["Crocorible",553,5,3,"Sol Ténèbres"],
    ["Darumarond",554,5,1,"Feu"],
    ["Darumarond de Galar",554,8,1,"Glace"],
    ["Darumacho",555,5,2,"Feu Psy"],
    ["Darumacho de Galar",555,8,2,"Glace Feu"],
    ["Maracachi",556,5,1,"Plante"],
    ["Crabicoque",557,5,1,"Insecte Roche"],
    ["Crabaraque",558,5,2,"Insecte Roche"],
    ["Baggiguane",559,5,1,"Ténèbres Combat"],
    ["Baggaïd",560,5,2,"Ténèbres Combat"],
    ["Cryptéro",561,5,1,"Psy Vol"],
    ["Tutafeh",562,5,1,"Spectre"],
    ["Tutafeh de Galar",562,8,1,"Sol Spectre"],
    ["Tutankafer",563,5,2,"Spectre"],
    ["Carapagos",564,5,1,"Eau Roche"],
    ["Mégapagos",565,5,2,"Eau Roche"],
    ["Arkéapti",566,5,1,"Roche Vol"],
    ["Aéroptéryx",567,5,2,"Roche Vol"],
    ["Miamiasme",568,5,1,"Poison"],
    ["Miasmax",569,5,2,"Poison"],
    ["Zorua",570,5,1,"Ténèbres"],
    ["Zoroark",571,5,2,"Ténèbres"],
    ["Chinchidou",572,5,1,"Normal"],
    ["Pashmilla",573,5,2,"Normal"],
    ["Scrutella",574,5,1,"Psy"],
    ["Mesmérella",575,5,2,"Psy"],
    ["Sidérella",576,5,3,"Psy"],
    ["Nucléos",577,5,1,"Psy"],
    ["Méios",578,5,2,"Psy"],
    ["Symbios",579,5,3,"Psy"],
    ["Couaneton",580,5,1,"Eau Vol"],
    ["Lakmécygne",581,5,2,"Eau Vol"],
    ["Sorbébé",582,5,1,"Glace"],
    ["Sorboul",583,5,2,"Glace"],
    ["Sorbouboul",584,5,3,"Glace"],
    ["Vivaldaim",585,5,1,"Normal Plante"],
    ["Haydaim",586,5,2,"Normal Plante"],
    ["Emolga",587,5,1,"Électrique Vol"],
    ["Carabing",588,5,1,"Insecte"],
    ["Lançargot",589,5,2,"Insecte Acier"],
    ["Trompignon",590,5,1,"Plante Poison"],
    ["Gaulet",591,5,2,"Plante Poison"],
    ["Viskuse",592,5,1,"Eau Spectre"],
    ["Moyade",593,5,2,"Eau Spectre"],
    ["Mamanbo",594,5,1,"Eau"],
    ["Statitik",595,5,1,"Insecte Électrique"],
    ["Mygavolt",596,5,2,"Insecte Électrique"],
    ["Grindur",597,5,1,"Plante Acier"],
    ["Noacier",598,5,2,"Plante Acier"],
    ["Tic",599,5,1,"Acier"],
    ["Clic",600,5,2,"Acier"],
    ["Cliticlic",601,5,3,"Acier"],
    ["Anchwatt",602,5,1,"Électrique"],
    ["Lampéroie",603,5,2,"Électrique"],
    ["Ohmassacre",604,5,3,"Électrique"],
    ["Lewsor",605,5,1,"Psy"],
    ["Neitram",606,5,2,"Psy"],
    ["Funécire",607,5,1,"Spectre Feu"],
    ["Mélancolux",608,5,2,"Spectre Feu"],
    ["Lugulabre",609,5,3,"Spectre Feu"],
    ["Coupenotte",610,5,1,"Dragon"],
    ["Incisache",611,5,2,"Dragon"],
    ["Tranchodon",612,5,3,"Dragon"],
    ["Polarhume",613,5,1,"Glace"],
    ["Polagriffe",614,5,2,"Glace"],
    ["Hexagel",615,5,1,"Glace"],
    ["Escargaume",616,5,1,"Insecte"],
    ["Limaspeed",617,5,2,"Insecte"],
    ["Limonde",618,5,1,"Sol Électrique"],
    ["Limonde de Galar",618,8,1,"Sol Acier"],
    ["Kungfouine",619,5,1,"Combat"],
    ["Shaofouine",620,5,2,"Combat"],
    ["Drakkarmin",621,5,1,"Dragon"],
    ["Gringolem",622,5,1,"Sol Spectre"],
    ["Golemastoc",623,5,2,"Sol Spectre"],
    ["Scalpion",624,5,1,"Ténèbres Acier"],
    ["Scalproie",625,5,2,"Ténèbres Acier"],
    ["Frison",626,5,1,"Normal"],
    ["Furaiglon",627,5,1,"Normal Vol"],
    ["Gueriaigle",628,5,2,"Normal Vol"],
    ["Vostourno",629,5,1,"Ténèbres Vol"],
    ["Vaututrice",630,5,2,"Ténèbres Vol"],
    ["Aflamanoir",631,5,1,"Feu"],
    ["Fermite",632,5,1,"Insecte Acier"],
    ["Solochi",633,5,1,"Ténèbres Dragon"],
    ["Diamat",634,5,2,"Ténèbres Dragon"],
    ["Trioxhydre",635,5,3,"Ténèbres Dragon"],
    ["Pyronille",636,5,1,"Insecte Feu"],
    ["Pyrax",637,5,2,"Insecte Feu"],
    ["Cobaltium",638,5,1,"Acier Combat"],
    ["Terrakium",639,5,1,"Roche Combat"],
    ["Viridium",640,5,1,"Plante Combat"],
    ["Boréas",641,5,1,"Vol"],
    ["Fulguris",642,5,1,"Électrique Vol"],
    ["Reshiram",643,5,1,"Dragon Feu"],
    ["Zekrom",644,5,1,"Dragon Électrique"],
    ["Démétéros",645,5,1,"Sol Vol"],
    ["Kyurem",646,5,1,"Dragon Glace"],
    ["Keldeo",647,5,1,"Eau Combat"],
    ["Meloetta",648,5,1,"Normal Psy"],
    ["Genesect",649,5,1,"Insecte Acier"],
    ["Marisson",650,6,1,"Plante"],
    ["Boguérisse",651,6,2,"Plante"],
    ["Blindépique",652,6,3,"Plante Combat"],
    ["Feunnec",653,6,1,"Feu"],
    ["Roussil",654,6,2,"Feu"],
    ["Goupelin",655,6,3,"Feu Psy"],
    ["Grenousse",656,6,1,"Eau"],
    ["Croâporal",657,6,2,"Eau"],
    ["Amphinobi",658,6,3,"Eau Ténèbres"],
    ["Sapereau",659,6,1,"Normal"],
    ["Excavarenne",660,6,2,"Normal Sol"],
    ["Passerouge",661,6,1,"Normal Vol"],
    ["Braisillon",662,6,2,"Feu Vol"],
    ["Flambusard",663,6,3,"Feu Vol"],
    ["Lépidonille",664,6,1,"Insecte"],
    ["Pérégrain",665,6,2,"Insecte"],
    ["Prismillon",666,6,3,"Insecte Vol"],
    ["Hélionceau",667,6,1,"Feu Normal"],
    ["Némélios",668,6,2,"Feu Normal"],
    ["Flabébé",669,6,1,"Fée"],
    ["Floette",670,6,2,"Fée"],
    ["Florges",671,6,3,"Fée"],
    ["Cabriolaine",672,6,1,"Plante"],
    ["Chevroum",673,6,2,"Plante"],
    ["Pandespiègle",674,6,1,"Combat"],
    ["Pandarbare",675,6,2,"Combat Ténèbres"],
    ["Couafarel",676,6,1,"Normal"],
    ["Psystigri",677,6,1,"Psy"],
    ["Mistigrix",678,6,2,"Psy"],
    ["Monorpale",679,6,1,"Acier Spectre"],
    ["Dimoclès",680,6,2,"Acier Spectre"],
    ["Exagide",681,6,3,"Acier Spectre"],
    ["Fluvetin",682,6,1,"Fée"],
    ["Cocotine",683,6,2,"Fée"],
    ["Sucroquin",684,6,1,"Fée"],
    ["Cupcanaille",685,6,2,"Fée"],
    ["Sepiatop",686,6,1,"Ténèbres Psy"],
    ["Sepiatroce",687,6,2,"Ténèbres Psy"],
    ["Opermine",688,6,1,"Roche Eau"],
    ["Golgopathe",689,6,2,"Roche Eau"],
    ["Venalgue",690,6,1,"Poison Eau"],
    ["Kravarech",691,6,2,"Poison Dragon"],
    ["Flingouste",692,6,1,"Eau"],
    ["Gamblast",693,6,2,"Eau"],
    ["Galvaran",694,6,1,"Électrique Normal"],
    ["Iguolta",695,6,2,"Électrique Normal"],
    ["Ptyranidur",696,6,1,"Roche Dragon"],
    ["Rexillius",697,6,2,"Roche Dragon"],
    ["Amagara",698,6,1,"Roche Glace"],
    ["Dragmara",699,6,2,"Roche Glace"],
    ["Nymphali",700,6,2,"Fée"],
    ["Brutalibré",701,6,1,"Combat Vol"],
    ["Dedenne",702,6,1,"Électrique Fée"],
    ["Strassie",703,6,1,"Roche Fée"],
    ["Mucuscule",704,6,1,"Dragon"],
    ["Colimucus",705,6,2,"Dragon"],
    ["Muplodocus",706,6,3,"Dragon"],
    ["Trousselin",707,6,1,"Acier Fée"],
    ["Brocélôme",708,6,1,"Spectre Plante"],
    ["Desséliande",709,6,2,"Spectre Plante"],
    ["Pitrouille",710,6,1,"Spectre Plante"],
    ["Banshitrouye",711,6,2,"Spectre Plante"],
    ["Grelaçon",712,6,1,"Glace"],
    ["Séracrawl",713,6,2,"Glace"],
    ["Sonistrelle",714,6,1,"Vol Dragon"],
    ["Bruyverne",715,6,2,"Vol Dragon"],
    ["Xerneas",716,6,1,"Fée"],
    ["Yveltal",717,6,1,"Ténèbres Vol"],
    ["Zygarde",718,6,1,"Dragon Sol"],
    ["Diancie",719,6,1,"Roche Fée"],
    ["Hoopa",720,6,1,"Psy Spectre Ténèbres"],
    ["Volcanion",721,6,1,"Feu Eau"],
    ["Brindibou",722,7,1,"Plante Vol"],
    ["Efflèche",723,7,2,"Plante Vol"],
    ["Archéduc",724,7,3,"Plante Spectre"],
    ["Flamiaou",725,7,1,"Feu"],
    ["Matoufeu",726,7,2,"Feu"],
    ["Félinferno",727,7,3,"Feu Ténèbres"],
    ["Otaquin",728,7,1,"Eau"],
    ["Otarlette",729,7,2,"Eau"],
    ["Oratoria",730,7,3,"Eau Fée"],
    ["Picassaut",731,7,1,"Normal Vol"],
    ["Piclairon",732,7,2,"Normal Vol"],
    ["Bazoucan",733,7,3,"Normal Vol"],
    ["Manglouton",734,7,1,"Normal"],
    ["Argouste",735,7,2,"Normal"],
    ["Larvibule",736,7,1,"Insecte"],
    ["Chrysapile",737,7,2,"Insecte Électrique"],
    ["Lucanon",738,7,3,"Insecte Électrique"],
    ["Crabagarre",739,7,1,"Combat"],
    ["Crabominable",740,7,2,"Combat Glace"],
    ["Plumeline",741,7,1,"Feu Vol Électrique Psy Spectre"],
    ["Bombydou",742,7,1,"Insecte Fée"],
    ["Rubombelle",743,7,2,"Insecte Fée"],
    ["Rocabot",744,7,1,"Roche"],
    ["Lougaroc",745,7,2,"Roche"],
    ["Froussardine",746,7,1,"Eau"],
    ["Vorastérie",747,7,1,"Poison Eau"],
    ["Prédastérie",748,7,2,"Poison Eau"],
    ["Tiboudet",749,7,1,"Sol"],
    ["Bourrinos",750,7,2,"Sol"],
    ["Araqua",751,7,1,"Eau Insecte"],
    ["Tarenbulle",752,7,2,"Eau Insecte"],
    ["Mimantis",753,7,1,"Plante"],
    ["Floramantis",754,7,2,"Plante"],
    ["Spododo",755,7,1,"Plante Fée"],
    ["Lampignon",756,7,2,"Plante Fée"],
    ["Tritox",757,7,1,"Poison Feu"],
    ["Malamandre",758,7,2,"Poison Feu"],
    ["Nounourson",759,7,1,"Normal Combat"],
    ["Chelours",760,7,2,"Normal Combat"],
    ["Croquine",761,7,1,"Plante"],
    ["Candine",762,7,2,"Plante"],
    ["Sucreine",763,7,3,"Plante"],
    ["Guérilande",764,7,1,"Fée"],
    ["Gouroutan",765,7,1,"Normal Psy"],
    ["Quartermac",766,7,1,"Combat"],
    ["Sovkipou",767,7,1,"Insecte Eau"],
    ["Sarmuraï",768,7,2,"Insecte Eau"],
    ["Bacabouh",769,7,1,"Spectre Sol"],
    ["Trépassable",770,7,2,"Spectre Sol"],
    ["Concombaffe",771,7,1,"Eau"],
    ["Type:0",772,7,1,"Normal"],
    ["Silvallié",773,7,2,"Normal"],
    ["Météno",774,7,1,"Roche Vol"],
    ["Dodoala",775,7,1,"Normal"],
    ["Boumata",776,7,1,"Feu Dragon"],
    ["Togedemaru",777,7,1,"Électrique Acier"],
    ["Mimiqui",778,7,1,"Spectre Fée"],
    ["Denticrisse",779,7,1,"Eau Psy"],
    ["Draïeul",780,7,1,"Normal Dragon"],
    ["Sinistrail",781,7,1,"Spectre Plante"],
    ["Bébécaille",782,7,1,"Dragon"],
    ["Écaïd",783,7,2,"Dragon Combat"],
    ["Ékaïser",784,7,3,"Dragon Combat"],
    ["Tokorico",785,7,1,"Électrique Fée"],
    ["Tokopiyon",786,7,1,"Psy Fée"],
    ["Tokotoro",787,7,1,"Plante Fée"],
    ["Tokopisco",788,7,1,"Eau Fée"],
    ["Cosmog",789,7,1,"Psy"],
    ["Cosmovum",790,7,2,"Psy"],
    ["Solgaleo",791,7,3,"Psy Acier"],
    ["Lunala",792,7,3,"Psy Spectre"],
    ["Zéroïd",793,7,1,"Roche Poison"],
    ["Mouscoto",794,7,1,"Insecte Combat"],
    ["Cancrelove",795,7,1,"Insecte Combat"],
    ["Câblifère",796,7,1,"Électrique"],
    ["Bamboiselle",797,7,1,"Acier Vol"],
    ["Katagami",798,7,1,"Plante Acier"],
    ["Engloutyran",799,7,1,"Ténèbres Dragon"],
    ["Necrozma",800,7,1,"Psy"],
    ["Magearna",801,7,1,"Acier Fée"],
    ["Marshadow",802,7,1,"Combat Spectre"],
    ["Vémini",803,7,1,"Poison"],
    ["Mandrillon",804,7,2,"Poison Dragon"],
    ["Ama-Ama",805,7,1,"Roche Acier"],
    ["Pierroteknik",806,7,1,"Feu Spectre"],
    ["Zeraora",807,7,1,"Électrique"],
    ["Meltan",808,8,1,"Acier"],
    ["Melmetal",809,8,2,"Acier"],
    ["Ouistempo",810,8,1,"Plante"],
    ["Badabouin",811,8,2,"Plante"],
    ["Gorythmic",812,8,3,"Plante"],
    ["Flambino",813,8,1,"Feu"],
    ["Lapyro",814,8,2,"Feu"],
    ["Pyrobut",815,8,3,"Feu"],
    ["Larméléon",816,8,1,"Eau"],
    ["Arrozard",817,8,2,"Eau"],
    ["Lézargus",818,8,3,"Eau"],
    ["Rongourmand",819,8,1,"Normal"],
    ["Rongrigou",820,8,2,"Normal"],
    ["Minisange",821,8,1,"Vol"],
    ["Bleuseille",822,8,2,"Vol"],
    ["Corvaillus",823,8,3,"Vol Acier"],
    ["Larvadar",824,8,1,"Insecte"],
    ["Coléodôme",825,8,2,"Insecte Psy"],
    ["Astronelle",826,8,3,"Insecte Psy"],
    ["Goupilou",827,8,1,"Ténèbres"],
    ["Roublenard",828,8,2,"Ténèbres"],
    ["Tournicoton",829,8,1,"Plante"],
    ["Blancoton",830,8,2,"Plante"],
    ["Moumouton",831,8,1,"Normal"],
    ["Moumouflon",832,8,2,"Normal"],
    ["Khélocrok",833,8,1,"Eau"],
    ["Torgamord",834,8,2,"Eau Roche"],
    ["Voltoutou",835,8,1,"Électrique"],
    ["Fulgudog",836,8,2,"Électrique"],
    ["Charbi",837,8,1,"Roche"],
    ["Wagomine",838,8,2,"Roche Feu"],
    ["Monthracite",839,8,3,"Roche Feu"],
    ["Verpom",840,8,1,"Plante Dragon"],
    ["Pomdrapi",841,8,2,"Plante Dragon"],
    ["Dratatin",842,8,2,"Plante Dragon"],
    ["Dunaja",843,8,1,"Sol"],
    ["Dunaconda",844,8,2,"Sol"],
    ["Nigosier",845,8,1,"Vol Eau"],
    ["Embrochet",846,8,1,"Eau"],
    ["Hastacuda",847,8,2,"Eau"],
    ["Toxizap",848,8,1,"Électrique Poison"],
    ["Salarsen",849,8,2,"Électrique Poison"],
    ["Grillepattes",850,8,1,"Feu Insecte"],
    ["Scolocendre",851,8,2,"Feu Insecte"],
    ["Poulpaf",852,8,1,"Combat"],
    ["Krakos",853,8,2,"Combat"],
    ["Théffroi",854,8,1,"Spectre"],
    ["Polthégeist",855,8,2,"Spectre"],
    ["Bibichut",856,8,1,"Psy"],
    ["Chapotus",857,8,2,"Psy"],
    ["Sorcilence",858,8,3,"Psy Fée"],
    ["Grimalin",859,8,1,"Ténèbres Fée"],
    ["Fourbelin",860,8,2,"Ténèbres Fée"],
    ["Angoliath",861,8,3,"Ténèbres Fée"],
    ["Ixon",862,8,3,"Ténèbres Normal"],
    ["Berserkatt",863,8,2,"Acier"],
    ["Corayôme",864,8,2,"Spectre"],
    ["Palarticho",865,8,2,"Combat"],
    ["M. Glaquette",866,8,3,"Glace Psy"],
    ["Tutétékri",867,8,2,"Sol Spectre"],
    ["Crèmy",868,8,1,"Fée"],
    ["Charmilly",869,8,2,"Fée"],
    ["Hexadron",870,8,1,"Combat"],
    ["Wattapik",871,8,1,"Électrique"],
    ["Frissonille",872,8,1,"Glace Insecte"],
    ["Beldeneige",873,8,2,"Glace Insecte"],
    ["Dolman",874,8,1,"Roche"],
    ["Bekaglaçon",875,8,1,"Glace"],
    ["Wimessir",876,8,1,"Psy Normal"],
    ["Morpeko",877,8,1,"Électrique Ténèbres"],
    ["Charibari",878,8,1,"Acier"],
    ["Pachyradjah",879,8,2,"Acier"],
    ["Galvagon",880,8,1,"Électrique Dragon"],
    ["Galvagla",881,8,1,"Électrique Glace"],
    ["Hydragon",882,8,1,"Eau Dragon"],
    ["Hydragla",883,8,1,"Eau Glace"],
    ["Duralugon",884,8,1,"Acier Dragon"],
    ["Fantyrm",885,8,1,"Dragon Spectre"],
    ["Dispareptil",886,8,2,"Dragon Spectre"],
    ["Lanssorien",887,8,3,"Dragon Spectre"],
    ["Zacian",888,8,1,"Fée Acier"],
    ["Zamazenta",889,8,1,"Combat Acier"],
    ["Éthernatos",890,8,1,"Poison Dragon"],
    ["Wushours",891,8,1,"Combat"],
    ["Shifours",892,8,2,"Combat Ténèbres Eau"],
    ["Zarude",893,8,1,"Ténèbres Plante"],
    ["Regieleki",894,8,1,"Électrique"],
    ["Regidrago",895,8,1,"Dragon"],
    ["Blizzeval",896,8,1,"Glace"],
    ["Spectreval",897,8,1,"Spectre"],
    ["Sylveroy",898,8,1,"Psy Plante Glace Spectre"]];
//Fin tableau liste des Pokémon


const taillePokedex = tabPokemon.length;
const nombreGen = 8;
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
    if (message.channel.id!=auth.server.salon.monche) return;

if(!message.member.roles.cache.has(auth.server.role.mute)){

    if (petitMessage.startsWith(prefixStart)&&(message.member.roles.cache.has(auth.server.role.staff)||message.member.roles.cache.has(auth.server.role.animateur))&&rollOn==false&&reponse==true){

        reponse =false;
        rollOn = true;
        paramJeu = petitMessage.split(' ');
        message.delete();
        typePicked = "";
        gen = 0;
        stade = 0;
        randroll = 0;

        if(paramJeu[1]==="random"){randroll = Rand(4);}

        console.log("/"+paramJeu[1]+"/")
        if(!paramJeu[1]||randroll==1){
            await message.channel.send("Prêt·e·s ? (lettres pures)");
            await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
            var quelEstCePokemon = Rand(taillePokedex)-1;
            //console.log(quelEstCePokemon);
            //console.log("quelEstCePokemon ? "+tabPokemon[quelEstCePokemon]);
            console.log("Nom : "+tabPokemon[quelEstCePokemon][0]);
            //console.log("N° : "+tabPokemon[quelEstCePokemon][1]);
            //console.log("Gen : "+tabPokemon[quelEstCePokemon][2]);
            //console.log("Stade : "+tabPokemon[quelEstCePokemon][3]);
            //console.log("Type 1 : "+tabPokemon[quelEstCePokemon][4]);
            //console.log("Type 2 : "+tabPokemon[quelEstCePokemon][5]);


            nomPokemon = tabPokemon[quelEstCePokemon][0];
            lettre1 = nomPokemon.charAt(0).toUpperCase();
            console.log("lettre1 : "+lettre1);
            lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();

            while(lettre2==" "||lettre2=="'"||lettre2=="-"||lettre2=="."||lettre2==":"||lettre2=="0"||lettre2=="1"||lettre2=="2"||lettre2=="3"||lettre2=="4"||lettre2=="5"||lettre2=="6"||lettre2=="7"||lettre2=="8"||lettre2=="9"){
                console.log("boucle sans fin"); 
                lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();  
            }

            console.log("lettre2 : "+lettre2);
            typePicked = "";
            gen = 0;
            stade = 0;
            setTimeout(async function(){await message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2));rollOn = false;},4500);
            gameOn = true;
            return;

        }else if(paramJeu[1] === "type"||randroll==2){
            await message.channel.send("Prêt·e·s ? (+type)");
            await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
            var quelEstCePokemon = Rand(taillePokedex)-1;
            console.log("Nom : "+tabPokemon[quelEstCePokemon][0]);
            console.log("Types : "+tabPokemon[quelEstCePokemon][4]);

            nomPokemon = tabPokemon[quelEstCePokemon][0];
            lettre1 = nomPokemon.charAt(0).toUpperCase();
            console.log("lettre1 : "+lettre1);
            lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();
            console.log("lettre2 : "+lettre2);

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

            setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et avec au moins un type : **__"+typePicked+"__** "+EmoteType(typePicked));rollOn = false;},4500);
            gameOn = true;
            return;

        }else if(paramJeu[1] === "gen"||randroll==3){
            await message.channel.send("Prêt·e·s ? (+génération)");
            await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
            var quelEstCePokemon = Rand(taillePokedex)-1;
            console.log("Nom : "+tabPokemon[quelEstCePokemon][0]);
            console.log("Gen : "+tabPokemon[quelEstCePokemon][2]);

            nomPokemon = tabPokemon[quelEstCePokemon][0];
            lettre1 = nomPokemon.charAt(0).toUpperCase();
            console.log("lettre1 : "+lettre1);
            lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();
            console.log("lettre2 : "+lettre2);

            gen = Number(tabPokemon[quelEstCePokemon][2]);

            setTimeout(async function(){message.channel.send("Les lettres : "+EmoteLettre(lettre1)+" "+EmoteLettre(lettre2)+", et issu de la "+EmoteGen(gen)+".\r(*Première apparition dans la branche principale*)");rollOn = false;},4500);
            gameOn = true;
            return;

        }else if(paramJeu[1] === "stade"||randroll==4){
            await message.channel.send("Prêt·e·s ? (+stade d'évolution)");
            await setTimeout(async function(){await message.channel.send("3...");await setTimeout(async function(){await message.channel.send("2...");await setTimeout(async function(){await message.channel.send("1...");},1000)},1000)},1000)
            var quelEstCePokemon = Rand(taillePokedex)-1;
            console.log("Nom : "+tabPokemon[quelEstCePokemon][0]);
            console.log("Stade : "+tabPokemon[quelEstCePokemon][3]);

            nomPokemon = tabPokemon[quelEstCePokemon][0];
            lettre1 = nomPokemon.charAt(0).toUpperCase();
            console.log("lettre1 : "+lettre1);
            lettre2 = nomPokemon.charAt(Rand(nomPokemon.length-1)).toUpperCase();
            console.log("lettre2 : "+lettre2);

            stade = Number(tabPokemon[quelEstCePokemon][3]);

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


    if (petitMessage.startsWith(prefixSoluce)&&(message.member.roles.cache.has(auth.server.role.staff)||message.member.roles.cache.has(auth.server.role.animateur))){
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



    if (petitMessage.startsWith(prefixSoluce)&&!message.member.roles.cache.has(auth.server.role.staff)&&!message.member.roles.cache.has(auth.server.role.animateur)){
            await message.channel.send("https://tenor.com/view/cependant-jdg-albus-humblebundledor-harry-potter-gif-17560359");
            await message.reply(" ... Pour avoir tenter de gratter une réponse dans le dos des animateurs, je te retire 1.000.000 de points !!! :scream:");
            return;
    }

}


    if(message.member.roles.cache.has(auth.server.role.everyone)&&gameOn==true)
    {
        console.log(lettre1+""+lettre2);
        if(petitMessage.startsWith(lettre1.toLowerCase())&&petitMessage.includes(lettre2.toLowerCase()))
        {
            for(k=0;k<taillePokedex;k++){
                if(petitMessage == tabPokemon[k][0].toLowerCase())
                    {
                        if (typePicked==""&&gen==0&&stade==0){
                            message.reply(" tu as gagné 1 point ! :partying_face:");
                            rollOn = false;
                            gameOn = false;
                            reponse = true;
                            return;
                        }else if (gen==0&&stade==0){
                            if(tabPokemon[k][4].includes(typePicked)){
                                message.reply(" tu as gagné 1 point ! :partying_face:");
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
            message.reply(" ce Pokémon n'existe pas (ou est mal orthographié) ! :anger:");
            return;
        }

        message.reply(" y'a même pas les bonnes lettres ! Essaye au moins :rofl:");//\rOn rappelle que "+EmoteLettre(lettre1)+" doit être la première lettre du nom du Pokémon.\rEt que "+EmoteLettre(lettr2)+" doit être contenu dans le nom du Pokémon.");
        return;

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

async function CoolDown(message,number){

    for(k=number;k>0;k--){
        await setTimeout(async function(){await message.channel.send(k+"...");},1000);
    }
}

function Rand(valeur){
    return Math.floor(Math.random() * valeur +1);
}
