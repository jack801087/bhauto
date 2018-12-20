let cmd_name = 'savep';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Save the project."+"\n");

/*
- store social tags
- shows preview (tracks, weeks, etc.)

- ready directory
- ask confirm if present, to delete
- group by # weeks (set counter weeks)
- ready/w8_201809110838/
- ready/w8_201809110838/w8_tracksweek/
- ready/w8_201809110838/w8_tracksweek/instagram_txt_w8_20180911
- ready/w8_201809110838/w8_tracksweek/ps_artists_txt_w8_20180911
- ready/w8_201809110838/w8_tracksweek/ps_titles_txt_w8_20180911
- ready/w8_201809110838/T1_artist_title_20180911
- ready/w8_201809110838/T1_artist_title_20180911/artwork_T1_artist_title_20180911
- ready/w8_201809110838/T1_artist_title_20180911/instagram_txt_T1_artist_title_20180911

Manually...
- ready/w8_201809110838/w8_tracksweek/              <-- instagram_image
- ready/w8_201809110838/T1_artist_title_20180911    <-- instagram_video

*/

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

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
