let cmd_name = 'newp';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Create a new project."+"\n");

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let p1 = (cliReference,cliNextCb,cliData)=>{
        ConfigMgr.save();
        ProjectMgr.newProjectStructure();
        return cliNextCb(cliData.success_code);
    };

    /*  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  */

    let project_path = ProjectMgr.newProject();
    if(project_path === null) return cliNextCb(cliData.success_code);

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
        });
        return;
    }

    p1(cliReference,cliNextCb,cliData);
});
