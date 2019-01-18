let cmd_name = 'socialp';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Add social data to the project."+"\n");

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let p1 = (cliReference,cliNextCb,cliData)=>{

        let fdObj = ProjectMgr.setFromFinalData();
        if(!_.isObject(fdObj) || fdObj.data_error.length>0){
            d$(fdObj.data_error);
            d$('ProjectMgr.setFromFinalData returned an error');
            return cliNextCb(cliData.error_code);
        }

        p2(cliReference,cliNextCb,cliData);
    };

    let p2 = (cliReference,cliNextCb,cliData)=>{
        let _p2i_data = new _p2i_data_class();
        return p2i_entityData(cliReference,cliNextCb,cliData,_p2i_data);

        if(!ProjectMgr.generateEditableDataCollection()){
            d$('ProjectMgr.generateEditableDataCollection returned an error');
            return cliNextCb(cliData.error_code);
        }

        return cliNextCb(cliData.success_code);
    };

    /*  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  */

    if(!ProjectMgr.checkFinalDataExists()){
        cliData.ui.error('Final data file does not exits!');
        return cliNextCb(cliData.error_code);
    }
    p1(cliReference,cliNextCb,cliData);

});


const p2i_entityData = function(cliReference,cliNextCb,cliData,_p2i_data){
    // _p2i_data should be ready to work!

    // print trackInfo entityLabel - entityData - DB occurrence
    d$("\n\n");
    d$('Current track ',_p2i_data.getTrackObject().fulltitle);
    d$('> entityLabel',_p2i_data.getEntityLabel(),_p2i_data.getEntityData().name);
    //d$('> entity data',_p2i_data.getEntityData());
    _p2i_data.abc();

    // search DB for this entity (artist,remixer,label)
    let smInfo = _p2i_data.getSMInfoAlt1();
    if(!smInfo) return p2i_entityData_attempt2(cliReference,cliNextCb,cliData,_p2i_data);
    clUI.print(smInfo);

    cliReference.prompt({
        type: 'input',
        name: 'answer',
        message: '[enter to confirm, \'n\' to choose another, \'x\' to exit] '
    }, function (result) {
        if(result.answer === 'x'){
            return cliNextCb(cliData.success_code);
        }
        if(result.answer === 'n'){
            return p2i_entityData_attempt2(cliReference,cliNextCb,cliData,_p2i_data);
        }
        _p2i_data.setSocialMediaInfoToMerge(smInfo);
        return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
    });
    /*
    // ask confirm

    // set _p2i_data.socialMediaInfoToMerge
    // if yes call p2i_update

    // if not...shows all possibilities
    // choose one or nothing

    // set entityData.name with dbNode.key
    // set _p2i_data.socialMediaInfoToMerge or null
    // if yes call p2i_update
    */
};



const p2i_entityData_attempt2 = function(cliReference,cliNextCb,cliData,_p2i_data){

    // search DB for this entity (artist,remixer,label)
    let smInfoSet = _p2i_data.getSMInfoAlt2();
    if(smInfoSet.length===0) return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);

    smInfoSet.forEach(function(v,i){
        clUI.print(_.padStart(i+1,4,' ')+')',v.key);
        if(v.InstagramTags.length>0) clUI.print('     ','instagram: ',v.InstagramTags.join(', '));
        if(v.FacebookTags.length>0)  clUI.print('     ','facebook:  ',v.FacebookTags.join(', '));
        clUI.print(' ');
    });
    cliReference.prompt({
        type: 'input',
        name: 'id',
        message: '[enter to confirm, \'n\' to skip, \'x\' to exit] '
    }, function (result) {
        if(result.id === 'x'){
            return cliNextCb(cliData.success_code);
        }
        if(result.id === 'n'){
            return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
        }
        let _id = Utils.strToInteger(result.id);
        if(_.isInteger(_id) && _.isObject(smInfoSet[_id-1])){
            _p2i_data.setSocialMediaInfoToMerge(smInfoSet[_id-1]);
            return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
        }
        clUI.warning('[wrong id value or out-of-range: '+result.id+' ]');
        return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
    });
};


const p2i_update = function(cliReference,cliNextCb,cliData,_p2i_data){
    // call p2i_mergeSocialNode
    p2i_mergeSocialNode(_p2i_data);

    // if entityData+Label still working - increment/call p2i_entityData
    // if entityLabel still working - increment/call p2i_entityData
    // if trackData still working - increment/call p2i_entityData
    // finish

    if(_p2i_data.updateEntityData()===false){
        if(_p2i_data.updateEntityLabel()===false){
            if(_p2i_data.updateTrackArray()===false){

                // print final message
                // print social nodes with no media info

                return cliNextCb(cliData.success_code);
            }
        }
    }
    _p2i_data.setSocialMediaInfoToMerge(null);
    return p2i_entityData(cliReference,cliNextCb,cliData,_p2i_data);
};


const p2i_mergeSocialNode = function(_p2i_data){
    if(!_.isObject(_p2i_data.getSocialMediaInfoToMerge())){
        _p2i_data.setSocialMediaInfoNotFound();
        _p2i_data.setSocialMediaInfoToMerge(_p2i_data.createSMInfoEmpty());
    }
    _p2i_data.getCurrentSocialNodeInfo().mergeSocialMediaData(_p2i_data.getSocialMediaInfoToMerge());
};





class _p2i_data_class{
    constructor(){
        this.socialMediaInfoToMerge = null;
        this.socialMediaInfoNotFound = [];
        this.trackArrayIndex = 0;
        this.trackObject = null;
        this.entityLabelsIndex = 0;
        this.entityLabels = [];
        this.entityDataIndex = 0;
        this.entityData = {
            artists:[],
            remixers:[],
            labels:[]
        };
        this.entityRelatedDB = {
            artists:SMDB_Artists,
            remixers:SMDB_Artists,
            labels:SMDB_Labels
        };
        this._setTrackData();
    }

    _setTrackData(){
        this.trackObject = ProjectMgr.getProjectDataItem(this.trackArrayIndex);
        if(!this.trackObject) return false;
        this.entityLabels = [];
        this.entityData.artists = this.trackObject.artists.collection;
        if(_.isArray(this.entityData.artists) && this.entityData.artists.length>0) this.entityLabels.push('artists');
        this.entityData.remixers = this.trackObject.remixers.collection;
        if(_.isArray(this.entityData.remixers) && this.entityData.remixers.length>0) this.entityLabels.push('remixers');
        this.entityData.labels = this.trackObject.labels.collection;
        if(_.isArray(this.entityData.labels) && this.entityData.labels.length>0) this.entityLabels.push('labels');
        return true;
    }

    getSocialMediaInfoToMerge(){
        return this.socialMediaInfoToMerge;
    }
    setSocialMediaInfoToMerge(smInfo){
        this.socialMediaInfoToMerge = smInfo;
    }
    setSocialMediaInfoNotFound(){
        this.socialMediaInfoNotFound.push(this.getCurrentSocialNodeInfo());
    }

    getEntityRelatedDB(){
        return this.entityRelatedDB[ this.entityLabels[this.entityLabelsIndex] ];
    }
    getCurrentSocialNodeInfo(){
        return this.entityData[ this.entityLabels[this.entityLabelsIndex] ][ this.entityDataIndex ];
    }

    createSMInfoEmpty(){
        return this.getEntityRelatedDB().getSMInfoByKey(this.getEntityData().name);
    }

    getSMInfoAlt1(){
        let socialNodeInfo = this.getCurrentSocialNodeInfo();
        return this.getEntityRelatedDB().getSMInfoByKey(socialNodeInfo.name);
    }

    getSMInfoAlt2(){
        let socialNodeInfo = this.getCurrentSocialNodeInfo();
        let _firstStr = _.trim(_.toLower(socialNodeInfo.name)).substr(0,1);
        let _coll = [];
        this.getEntityRelatedDB().forEach(function(k,i,smObj){
            if(_.toLower(smObj.key).startsWith(_firstStr)===true){
                _coll.push(smObj);
            }
        });
        return _coll;
    }

    abc(){
        d$(
            'Tk',_.padStart(this.trackArrayIndex,2,'0'),'  |  ',
            'Li',this.entityLabelsIndex,'  |  ',
            'Ld',this.entityDataIndex,'  |  ',
            this.getEntityData().name
        );
        //d$(this.entityDataIndex);
        //d$(this.entityLabelsIndex);
        //d$(this.entityData[ this.entityLabels[this.entityLabelsIndex] ]);
        //d$(this.getEntityData().name);
    };
    getEntityData(){
        return( this.entityData[ this.entityLabels[this.entityLabelsIndex] ][this.entityDataIndex] );
    };
    checkEntityData(){
        return( (this.entityDataIndex+1) <  this.entityData[ this.entityLabels[this.entityLabelsIndex] ].length );
    };
    updateEntityData(){
        let _check = this.checkEntityData();
        if(_check===true) this.entityDataIndex++;
        else this.entityDataIndex=0;
        return _check;
    };

    getEntityLabel(){
        return this.entityLabels[this.entityLabelsIndex];
    }
    checkEntityLabel(){
        return( (this.entityLabelsIndex+1) <  this.entityLabels.length );
    };
    updateEntityLabel(){
        let _check = this.checkEntityLabel();
        if(_check===true) this.entityLabelsIndex++;
        else this.entityLabelsIndex=0;
        return _check;
    };

    getTrackObject(){
        return this.trackObject;
    }
    checkTrackArray(){
        return( (this.trackArrayIndex+1) <  ProjectMgr.projectDataLength() );
    };
    updateTrackArray(){
        let _check = this.checkTrackArray();
        this.trackArrayIndex++;
        this._setTrackData();
        //if(_check===true) this.trackArrayIndex++;
        //else this.entityLabelsIndex=0;
        return _check;
    };
}
