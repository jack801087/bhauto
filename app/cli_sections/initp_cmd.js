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

    let p2_standard = (cliReference,cliNextCb,cliData)=>{
        if(!ProjectMgr.mergeSocialMediaData()){
            d$('ProjectMgr.mergeSocialMediaData returned an error');
            return cliNextCb(cliData.error_code);
        }
        p3(cliReference,cliNextCb,cliData);
    };

    let __p2_interactive_socialdata = (cliReference,cliNextCb,cliData,snArray, snItem, snIndex)=>{

    };

    let p2_interactive = (cliReference,cliNextCb,cliData,trackIndex)=>{

        if(_.isNil(trackIndex)) trackIndex=0;
        let trackItem = ProjectMgr.getProjectDataItem(trackIndex);
        if(_.isNil(trackItem)) {
            p3(cliReference,cliNextCb,cliData);
            return;
        }

        __p2_interactive_socialdata(cliReference,cliNextCb,cliData,[
            trackItem.artists,
            trackItem.remixers,
            trackItem.labels
        ]);

        let tracks_count = ProjectMgr.projectDataLength();
        let track_item = null;
        for(let i=0; i<tracks_count; i++){
            track_item = ProjectMgr.getProjectDataItem(i);

            // for each artist selection process
            track_item.artistsforEach()

            // for each remixer selection process

            // for each label selection process
        }

        // loop on this._current_project_data

            // find occurrence(s) in some way
            // ask for choice (multiple options) [f#2]

            // if yes...merge data and set unique id (hash) [f#1]
            // if no...shows all choices [f#2]

                // if some id...merge data and set unique id (hash) [f#1]
                // if no, end loop branch

        p3(cliReference,cliNextCb,cliData);
    };


    let p2 = p2_standard;

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
