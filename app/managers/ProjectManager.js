const Beatport_TrackSource = require('./adapters/Beatport.TrackSource.class.js');


class ProjectManager {

    constructor(){
        this._assets_path = Utils.File.pathJoin(Utils.File.getAbsPath(),'assets');

        // from config
        this._init(ConfigMgr.cfg_path('CurrentProject'));
    }

    _init(project_path){
        if(!_.isString(project_path) || project_path.length<2) return;
        this._current_project_data = null;
        this.project_name = Utils.File.pathBasename(project_path);
        this.project_path = project_path;
        this.path_utilsdata = Utils.File.pathJoin(this.project_path,'utils_data');
        this.path_utilsdata_rawdata = Utils.File.pathJoin(this.path_utilsdata,'raw_data.json');
        this.path_utilsdata_finaldata = Utils.File.pathJoin(this.path_utilsdata,'final_data.json');
        this.path_utilsdata_searchutility = Utils.File.pathJoin(this.path_utilsdata,'search_utility.html');
    }


    newProject(project_path){
        let export_project_path = ConfigMgr.cfg_path('ExportDirectory');
        if(export_project_path===null){
            clUI.error('No export path configured; set ExportDirectory');
            return null;
        }
        Utils.File.ensureDirSync(export_project_path);
        if(!_.isString(project_path)){
            project_path = Utils.File.pathJoin(export_project_path,'bh_proj_'+Utils.dateToYYYYMMDDhhiiss());
        }
        this._init(project_path);
        ConfigMgr.set('CurrentProject',this.project_path);
        return this.project_path;
    }


    resumeProject(){
        let current_project_path = ConfigMgr.cfg_path('CurrentProject');
        if(current_project_path===null){
            clUI.error('No current project path configured; set CurrentProject');
            return null;
        }
        if(!Utils.File.directoryExistsSync(current_project_path)){
            clUI.error('The configured current project path does not exist',current_project_path);
            return null;
        }
        return this.newProject(current_project_path);
    }


    newProjectStructure(){
        if(Utils.File.directoryExistsSync(this.project_path) && !Utils.File.removeDirSync(this.project_path)){
            clUI.error('Error while removing directory:',this.project_path);
            return false;
        }

        let utilsdata_path = Utils.File.pathJoin(this._assets_path,'utils_data');
        let _cpresult = Utils.File.copyDirectorySync(utilsdata_path,this.path_utilsdata,{ overwrite:true });
        if(_cpresult.err!==null){
            clUI.error('Error while copying directory:',_cpresult.path_from,' > ',_cpresult.path_to);
            return false;
        }


        return true;
    }


    checkRawDataExists(){
        if(!this.path_utilsdata_rawdata) return false;
        return Utils.File.fileExistsSync(this.path_utilsdata_rawdata);
    }

    checkFinalDataExists(){
        if(!this.path_utilsdata_finaldata) return false;
        return Utils.File.fileExistsSync(this.path_utilsdata_finaldata);
    }


    cleanFinalData(){
        Utils.File.removeFileSync(this.path_utilsdata_finaldata);
        Utils.File.removeFileSync(this.path_utilsdata_searchutility);
    }


    setFromRawData(){
        let raw_data_json = Utils.File.readJsonFileSync(this.path_utilsdata_rawdata);
        if(!_.isObject(raw_data_json)) return null;

        let TrackSource_class = null;
        if(raw_data_json.datasource === 'beatport_cart'){
            TrackSource_class = Beatport_TrackSource;
        }else{
            d$('Unknown datasource in the raw data object:',raw_data_json.datasource);
            return null;
        }

        let fdObj = {};
        let processed_data_json = [];
        let raw_data_error = [];
        raw_data_json.collection.forEach((v,i,a)=>{
            let tsObj = new TrackSource_class();
            if(tsObj.fromRawData(v)===false){
                raw_data_error.push(v);
                return;
            }
            processed_data_json.push(tsObj);
        });

        fdObj.raw_data_error = raw_data_error;
        fdObj.data = processed_data_json;
        this._current_project_data = processed_data_json;

        return fdObj;
    }


    _mergeSocialMediaData(){
        for(let i=0; i<this._current_project_data.length; i++){
            let tsObj = this._current_project_data[i];
            tsObj.addArtistInstagramTags(SMDB_Artists.getInstagramTags(tsObj.artist));
            tsObj.addLabelInstagramTags(SMDB_Labels.getInstagramTags(tsObj.artist));
        }
        return true;
    }


    _generateSearchUtility(final_data_json){
        let templates_path = Utils.File.pathJoin(this._assets_path,'templates','searchutility_template1.html');
        let psutility_path = Utils.File.pathJoin(this.project_path,'utils_data','search_utility.html');
        let searchutility_template1 = Utils.File.readTextFileSync(templates_path);
        let final_output = Mustache.render(searchutility_template1, { tracks_content: final_data_json });
        if(!_.isString(final_output) || Utils.File.writeTextFileSync(psutility_path,final_output)!==true){
            //cliWarning
            return false;
        }
        return true;
    }


    generateDataCollection(){
        if(!_.isObject(this._current_project_data)){
            //cliWarning
            return false;
        }

        // Randomize array
        this._current_project_data = Utils.shuffleArray(this._current_project_data);

        if(!this._mergeSocialMediaData()){
            d$('ProjectMgr.mergeSocialMediaData returned an error');
        }

        let final_data = this.toJSON();
        if(!_.isArray(final_data.json) || final_data.json.length===0){
            //cliWarning
            return false;
        }

        if(Utils.File.writeJsonFileSync(this.path_utilsdata_finaldata,final_data.minimal_json)!==true){
            //cliWarning
            return false;
        }

        if(this._generateSearchUtility(final_data.json)===false){
            return false;
        }

        return true;
    }


    toJSON(){
        let jobj = {
            json:[],
            minimal_json:[]
        };
        this._current_project_data.forEach((tsObj)=>{
            jobj.json.push(tsObj.toJSON());
            jobj.minimal_json.push(tsObj.toEditableJSON());
        });
        return jobj;
    }

}

module.exports = new ProjectManager();
