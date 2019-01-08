require('./config.js');

Utils.extend('Network',require('./utils/utils_network.js'));

global.appLibs = {};
global.appLibs.SHA1 = require('sha1');
global.appLibs.Mustache = require('mustache');

/* Project Modules */
global.TrackSource = require('./datatypes/TrackSource.class.js');
global.Beatport_TrackSource = require('./datatypes/micro/Beatport.TrackSource.class.js');
global.SocialNode = require('./datatypes/SocialNode.class.js');
const SocialMediaDB_class = require('./managers/SocialMediaDB.class.js');
global.SMDB_Artists = new SocialMediaDB_class(ConfigMgr.path('artists_db'));
global.SMDB_Labels = new SocialMediaDB_class(ConfigMgr.path('labels_db'));
global.ProjectMgr = require('./managers/ProjectManager.js');



/* CLI Sections */
require('./cli_sections/config_cmd.js');
require('./cli_sections/newp_cmd.js');
require('./cli_sections/initp_cmd.js');
require('./cli_sections/savep_cmd.js');
require('./cli_sections/weekp_cmd.js');


/* Last command: start CLI! */
CliMgr.show('bh');


/*

s0/s1 = project
s2 = export
s4 = manage reset

s2 = generare dati finali [save]
- se presenti, chiedere conferma reset > eliminare [do-later]
- stampare un output delle settimane, titoli, jumpdays, etc. e chiedere conferma
- memorizzare tags per autore/labels
- generare directory tracce divise per 5 / w#_yyyyMMdddd
- gestire 'jump days' (custom e fissi) - log segnalare skip
-   generare directory singola traccia yyyymmdd_t#_author_title
-       artwork / txt instagram
-   generare directory tracksweek w#_yyyyMMdddd
-       txt PS authors / txt PS titles / txt instagram


s4 = reset project
- cli parameter: -k1 -k2 -k3 (k1 dati finali, k2 data collection, k3 tutto)
- in ogni caso deve rilevare quante week diverse ci sono e decrementare il contatore






s0 = new project in export dir [new]
- errore se exportdir non settata
- new directory bh_proj_yymmddhhii
- se esiste gia chiedere se eliminare (rimraf - al momento creare nuova dir con id univoco)
- set config-current project
- in questa directory creare directory utils
- creare /utils_data/beatport_cart.jquery.js (con istruzioni commentate)
- creare /utils_data/beatport_cart.json vuoto



s1 = pre set directories [init]
- cli parameter: music platform -w (beatport default)
- se presente directory 'beatport', chiedere conferma reset > eliminare [do-later]
- chiamare adapter beatport - randomizzare array
- generare /utils_data/search_utility.html
- generare /utils_data/data_collection.json
-   preparare array di oggetti con tutte le keys e stringa vuota se dati non presenti
-   unire dati memorizzati
-   modificare oggetto artist e labels in array di oggetti con name, instagram tags, fb tags, ecc.



*/
