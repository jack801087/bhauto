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
    d$('> data for',_p2i_data.getEntityLabel());

    cliReference.prompt({
        type: 'input',
        name: 'answer',
        message: '>'
    }, function(){
        return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
    });
    return;

    // search DB for this entity (artist,remixer,label)
    let smInfo = _p2i_data.getSMInfoAlt1();
    if(smInfo===null) return p2i_entityData_attempt2();
    _p2i_data.setSocialMediaInfoToMerge(smInfo);

    clUI.print();
    cliReference.prompt({
        type: 'input',
        name: 'answer',
        message: 'Is it correct? [y/n] '
    }, function (result) {
        if(result.answer !== 'y'){
            return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
        }
        return p2i_entityData_attempt2();
    });
    return;

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
    if(smInfoSet===null) return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);

    clUI.print();
    cliReference.prompt({
        type: 'input',
        name: 'id',
        message: 'Choose one or nothing: '
    }, function (result) {
        result.id = Utils.strToInteger(result.id);
        if(result.id!==null){
            _p2i_data.setSocialMediaInfoToMerge(smInfoSet[result.id]);
            return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
        }
        return p2i_update(cliReference,cliNextCb,cliData,_p2i_data);
    });
    return;
};


const p2i_update = function(cliReference,cliNextCb,cliData,_p2i_data){
    // call p2i_mergeSocialNode
    //p2i_mergeSocialNode(_p2i_data);

    // if entityData+Label still working - increment/call p2i_entityData
    // if entityLabel still working - increment/call p2i_entityData
    // if trackData still working - increment/call p2i_entityData
    // finish

    if(_p2i_data.updateEntityData()===false){
        if(_p2i_data.updateEntityLabel()===false){
            if(_p2i_data.updateTrackArray()===false){
                return cliNextCb(cliData.success_code);
            }
        }
    }
    //_p2i_data.setSocialMediaInfoToMerge(null);
    return p2i_entityData(cliReference,cliNextCb,cliData,_p2i_data);
};


const p2i_mergeSocialNode = function(_p2i_data){
    if(!_.isObject(_p2i_data.getSocialMediaInfoToMerge())){
        // create one in DB
        // set hash
        return;
    }
    // merge socials

    // I have current _SocialNodeInfo
    // I have the founded DB_Object

    // if not founded DB_Object - create DB occurrence and get hash

    // merge everything
};





class _p2i_data_class{
    constructor(){
        this.socialMediaInfoToMerge = null;
        this.trackArrayIndex = 0;
        this.trackObject = null;
        this.entityLabelsIndex = 0;
        this.entityLabels = ['artists','remixers','labels'];
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
        this.entityData.artists = this.trackObject.artists.collection;
        this.entityData.remixers = this.trackObject.remixers.collection;
        this.entityData.labels = this.trackObject.labels.collection;
        return true;
    }

    getSocialMediaInfoToMerge(){
        return this.socialMediaInfoToMerge;
    }
    setSocialMediaInfoToMerge(smInfo){
        this.socialMediaInfoToMerge = smInfo;
    }

    getEntityRelatedDB(){
        return this.entityRelatedDB[ this.entityLabels[this.entityLabelsIndex] ];
    }
    getCurrentSocialNodeInfo(){
        return this.entityData[ this.entityLabels[this.entityLabelsIndex] ][ this.entityDataIndex ];
    }

    getSMInfoAlt1(){
        let socialNodeInfo = this.getCurrentSocialNodeInfo();
        return this.getEntityRelatedDB().getSMInfoByKey(socialNodeInfo.name);
    }

    getSMInfoAlt2(){
        let socialNodeInfo = this.getCurrentSocialNodeInfo();
        return this.getEntityRelatedDB().getSMInfoByKey(socialNodeInfo.name);
    }

    checkEntityData(){
        return( this.entityDataIndex <  this.entityData[ this.entityLabels[this.entityLabelsIndex] ].length );
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
        return( this.entityLabelsIndex <  this.entityLabels.length );
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
        return( this.trackArrayIndex <  this.trackArray.length );
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
