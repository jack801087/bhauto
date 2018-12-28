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

        let p1 = (cliReference,cliNextCb,cliData)=>{
            ProjectMgr.cleanReadyData();

            //if(!ProjectMgr.hasData()){
            let fdObj = ProjectMgr.setFromFinalData();
            if(!_.isObject(fdObj)){
                d$('ProjectMgr.setFromFinalData returned an error');
                return cliNextCb(cliData.error_code);
            }

            if(fdObj.data_error.length>0){
                cliData.ui.warning(fdObj.data_error);
                cliData.ui.warning('Some errors occurred while reading the final data showed above.');
                cliReference.prompt({
                    type: 'input',
                    name: 'answer',
                    message: 'Do you want to continue? [y/n] '
                }, function (result) {
                    if(result.answer !== 'y'){
                        return cliNextCb(cliData.success_code);
                    }
                    p2(cliReference,cliNextCb,cliData);
                });
                return;
            }
            //}

            p2(cliReference,cliNextCb,cliData);

        };

        let p2 = (cliReference,cliNextCb,cliData)=>{
            if(!ProjectMgr.checkWeeks()){
                d$('ProjectMgr.checkWeeks returned an error');
                return cliNextCb(cliData.error_code);
            }
            if(!ProjectMgr.generateReadyDirectory()){
                d$('ProjectMgr.generateReadyDirectory returned an error');
                return cliNextCb(cliData.error_code);
            }
            return cliNextCb(cliData.success_code);
        };

    /*  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  */

    if(!ProjectMgr.checkFinalDataExists()){
        cliData.ui.error('Final data file does not exits!');
        return cliNextCb(cliData.error_code);
    }

    if(ProjectMgr.checkReadyDataExists()){
        cliData.ui.warning('Project already saved and directories generated.');
        cliReference.prompt({
            type: 'input',
            name: 'answer',
            message: 'Saved files will be deleted. Do you want to proceed? [y/n] '
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
