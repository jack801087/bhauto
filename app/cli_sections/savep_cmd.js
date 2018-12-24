let cmd_name = 'savep';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Save the project."+"\n");

/*
- store social tags
- shows preview (tracks, weeks, etc.)

Manually...
- ready/w8_201809110838/w8_tracksweek/              <-- instagram_image
- ready/w8_201809110838/T1_artist_title_20180911    <-- instagram_video

*/

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    /*
    leggi finaldata se _current_project_data null
        projectMgr from JSON
        > tracksource fromEditableJSON
        add social tags to db

    check directory ready
        ask confirm delete rimraf
    impostare dir ready name con utils no duplicated per sicurezza

    leggi config weeks
        leggi lenght di _current_project_data
        divisione non %5 chiedi conferma perche weeks non uniformi

    _current_project_data.forEach
        ogni x cambiare ddati weekly
        dati daily
            for interno creare dir daily
        for esterno accumulare dati per dati finali week

     */

    let project_path = ProjectMgr.newProject();
    if(project_path === null) return;

    let p1 = (cliReference,cliNextCb,cliData)=>{
        ProjectMgr.newProjectStructure();
    };

    if(Utils.File.directoryExistsSync(project_path)){
        clUI.print('The project directory already exists:',project_path);

        cliReference.prompt({
            type: 'input',
            name: 'answer',
            message: 'It will be deleted. Do you want to proceed? [y/n] '
        }, function (result) {
            if(result.answer !== 'y'){
                return cliNextCb(cliData.success_code);
            }
            p1(cliReference,cliNextCb,cliData);
            return cliNextCb(cliData.success_code);
        });
        return;
    }

    p1(cliReference,cliNextCb,cliData);
    return cliNextCb(cliData.success_code);
});
