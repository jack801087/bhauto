let cmd_name = 'initp';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Initialize the project."+"\n");

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let p1 = (cliReference,cliNextCb,cliData)=>{
        ProjectMgr.cleanFinalData();

        let fdObj = ProjectMgr.setFromRawData();
        if(!_.isObject(fdObj)){
            d$('ProjectMgr.setFromRawData returned an error');
            return cliNextCb(cliData.error_code);
        }

        if(fdObj.data_error.length>0){
            cliData.ui.warning(fdObj.data_error);
            cliData.ui.warning('Some errors occurred while reading the raw data showed above.');
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
        p2(cliReference,cliNextCb,cliData);
    };

    let p2 = (cliReference,cliNextCb,cliData)=>{
        // if(!ProjectMgr.mergeSocialMediaData()){
        //     d$('ProjectMgr.mergeSocialMediaData returned an error');
        //     return cliNextCb(cliData.error_code);
        // }
        p3(cliReference,cliNextCb,cliData);
    };

    let p3 = (cliReference,cliNextCb,cliData)=>{

        if(!ProjectMgr.generateEditableDataCollection()){
            d$('ProjectMgr.generateEditableDataCollection returned an error');
            return cliNextCb(cliData.error_code);
        }

        return cliNextCb(cliData.success_code);
    };


    /*  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  */

    if(!ProjectMgr.checkRawDataExists()){
        cliData.ui.error('Raw data file does not exits!');
        return cliNextCb(cliData.error_code);
    }

    if(ProjectMgr.checkFinalDataExists()){
        cliData.ui.warning('Project already initialized and final data ready.');
        cliReference.prompt({
            type: 'input',
            name: 'answer',
            message: 'Processed files will be deleted. Do you want to proceed? [y/n] '
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
