let cmd_name = 'new';

CliMgr.addCommand(cmd_name+' <action>');

CliMgr.addCommandHeader(cmd_name)
    .description("Create a new project."+"\n");

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
