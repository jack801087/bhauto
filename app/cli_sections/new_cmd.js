let cmd_name = 'newp';

CliMgr.addCommand(cmd_name+' <action>');

CliMgr.addCommandHeader(cmd_name)
    .description("Create a new project."+"\n");

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let project_path = ProjectMgr.newProject();
    if(project_path === null) return;

    ConfigMgr.save();

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
