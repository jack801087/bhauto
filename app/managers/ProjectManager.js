
class ProjectManager {

    constructor(){


        // from config
    }

    _init(){
        this.project_name = null;
        this.project_path = null;
        this.path_utilsdata = null;
        this.path_utilsdata_rawdata = null;
        this.path_utilsdata_finaldata = null;
        this.path_utilsdata_searchutility = null;
    }


    newProject(project_path){
        this._init();
        let export_project_path = ConfigMgr.cfg_paths('ExportDirectory');
        if(export_project_path===null){
            clUI.error('No export path configured; set ExportDirectory');
            return null;
        }
        Utils.File.ensureDirSync(export_project_path);
        if(!_.isString(project_path)){
            this.project_name = 'bh_proj_'+Utils.dateToYYYYMMDDhhiiss();
            this.project_path = Utils.File.pathJoin(export_project_path,this.project_name);
        }else{
            this.project_name = Utils.File.pathBasename(project_path);
            this.project_path = project_path;
        }
        ConfigMgr.set('CurrentProject',this.project_path);
        return this.project_path;
    }


    resumeProject(){
        let current_project_path = ConfigMgr.cfg_paths('CurrentProject');
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

        let utilsdata_path = Utils.File.pathJoin(Utils.File.getAbsPath(),'assets','utils_data');
        this.path_utilsdata = Utils.File.pathJoin(this.project_path,'utils_data');
        let _cpresult = Utils.File.copyDirectorySync(utilsdata_path,this.path_utilsdata,{ overwrite:true });
        if(_cpresult.err!==null){
            clUI.error('Error while copying directory:',_cpresult.path_from,' > ',_cpresult.path_to);
            return false;
        }

        this.path_utilsdata_rawdata = Utils.File.pathJoin(this.path_utilsdata,'raw_data.json');
        this.path_utilsdata_finaldata = Utils.File.pathJoin(this.path_utilsdata,'final_data.json');
        this.path_utilsdata_searchutility = Utils.File.pathJoin(this.path_utilsdata,'search_utility.html');
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


    setFromRawData(){
        let raw_data_json = Utils.File.readJsonFileSync(this.path_utilsdata_rawdata);
        if(!_.isObject(raw_data_json)) return null;

        let TrackSource_class = null;
        if(raw_data_json.datasource === 'beatport_cart'){
            TrackSource_class = BeatportTrackSource;
        }else{
            d$('Unknown datasource in the raw data object:',raw_data_json.datasource);
            return null;
        }

        let final_data_json = [];
        let raw_data_error = [];
        raw_data_json.collection.forEach((v,i,a)=>{
            let newv = new TrackSource_class();
            if(newv.fromRawData(v)===false){
                raw_data_error.push(v);
                return;
            }
            final_data_json.push(newv);
        });

        return {
            raw_data_error:raw_data_error,
            data:final_data_json
        };

        let prwdResult = BeatportAdapter.processRawData(raw_data_json.collection).forEach();

        Utils.File.writeJsonFileSync(this.path_utilsdata_finaldata,raw_data_json);

        // call adapter and process
        // Beatport.adapter.processRawData - arrange data, split artists, split labels

        // for each
            // set inst tags label
            // set inst tags artist
            // future other socials

        // store final-json in the object
        return true;
    }


    saveFinalData(final_data){
        let final_data_json = [];
        final_data.forEach((v)=>{
            final_data_json.push(v.toJSON());
        });
        return Utils.File.writeJsonFileSync(this.path_utilsdata_finaldata,final_data_json);
    }


    generateSearchUtility(){
        return true;
    }

    generateDataCollection(){
        //solo json stringify
        return true;
    }

}

module.exports = new ProjectManager();
