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

    let C_options = {
        printFn: function(s){ cliData.ui.print(s); },
        force:   cliData.cli_params.hasOption('force') //force scan
    };

    if(!cliData.cli_params.hasOption('force')){
        if(SamplesMgr.sampleIndexFileExistsSync()){
            cliData.ui.print("the index file already exists. Use -f to force a rescan.");
            return cliNextCb(cliData.error_code);
        }
        C_options.force = true;
    }

    cliData.ui.print("indexing in progress...");
    let smp_obj = SamplesMgr.setSamplesIndex(C_options);
    if(!_.isObject(smp_obj) || smp_obj.empty()){
        cliData.ui.print("job failed");
        return cliNextCb(cliData.error_code);
    }
    cliData.ui.print(""+smp_obj.size()+" samples found");
    return cliNextCb(cliData.success_code);
});
