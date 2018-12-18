
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

        this.path_utilsdata_rawdata = Utils.File.pathJoin(path_utilsdata,'raw_data.json');
        this.path_utilsdata_finaldata = Utils.File.pathJoin(path_utilsdata,'final_data.json');
        this.path_utilsdata_searchutility = Utils.File.pathJoin(path_utilsdata,'search_utility.html');
        return true;
    }


    checkRawDataExists(){
        return Utils.File.fileExistsSync(this.path_utilsdata_rawdata);
        //clUI.error('Raw data file does not exits!' ,"\n", this.path_utilsdata_rawdata);
    }

    checkFinalDataExists(){
        return Utils.File.fileExistsSync(this.path_utilsdata_finaldata);
        //clUI.error('Raw data file does not exits!' ,"\n", this.path_utilsdata_rawdata);
    }


    setFromRawData(){
        // read file txt, iconv-lite, string-to-json / try-catch

        // call adapter and process
        // Beatport.adapter.processRawData - arrange data, split artists, split labels

        // for each
            // set inst tags label
            // set inst tags artist
            // future other socials

        // store final-json in the object
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
