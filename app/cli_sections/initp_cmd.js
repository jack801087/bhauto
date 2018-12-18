let cmd_name = 'initp';

CliMgr.addCommand(cmd_name+' <action>');

CliMgr.addCommandHeader(cmd_name)
    .description("Initialize the project."+"\n");

/*
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

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    ProjectMgr.processRawData();

    ProjectMgr.generateSearchUtility();
    ProjectMgr.generateDataCollection(); //solo json stringify

    // holder artists
    // holder labels

});
