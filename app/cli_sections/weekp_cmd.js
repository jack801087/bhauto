let cmd_name = 'weekp';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Generate a new weekly track set."+"\n");

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let tlData = ProjectMgr.getReadyTracksList();
    if(!tlData){
        cliData.ui.print('No ready tracks!');
        return cliNextCb(cliData.success_code);
    }

    tlData.list.forEach((v,i)=>{
        clUI.print('',(i+1)+')',v.name);
    });
    cliReference.prompt({
        type: 'input',
        name: 'answer',
        message: "\nIDs (e.g. 12,34,23) or nothing (random choice) > "
    }, function (result) {

        let newTlData = ProjectMgr.selectReadyTracks(tlData,result.answer);
        if(!newTlData) return cliNextCb(cliData.error_code);
        clUI.print("\n");

        clUI.print('Selection mode:',newTlData.selection);
        newTlData.list.forEach((v,i)=>{
            clUI.print('',(i+1)+')',v.name);
        });

        if(newTlData.list.length < ConfigMgr.get('WeeksSetMinSize')){
            clUI.print("\nWARNING:",'Tracks count','('+newTlData.list.length+')','lower than WeeksSetMinSize','('+ConfigMgr.get('WeeksSetMinSize')+')');
        }

        cliReference.prompt({
            type: 'input',
            name: 'answer',
            message: "\nDo you want to proceed? [y/n] "
        }, function (result) {
            if(result.answer !== 'y'){
                return cliNextCb(cliData.success_code);
            }
            clUI.print("\n");

            ProjectMgr.generateWeekSetDirectory(newTlData);
            return cliNextCb(cliData.success_code);
            //p1(cliReference,cliNextCb,cliData);
        });
        return;
    });
    return;
});
