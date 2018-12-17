
class ProjectManager {

    constructor(){


        // from config
    }

    _init(){
        this.project_name = null;
        this.project_path = null;
        this.project_utilsdata_path = null;
    }


    newProject(project_path){
        this._init();
        let export_project_path = ConfigMgr.cfg_paths('ExportDirectory');
        if(export_project_path===null){
            clUI.error('No export path configured');
            return null;
        }
        if(project_path===null){
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
            clUI.error('No current project path configured');
            return null;
        }
        if(!Utils.File.directoryExistsSync(current_project_path)){
            clUI.error('The configured current project path does not exist',current_project_path);
            return null;
        }
        return this.newProject(current_project_path);
    }


    newProjectStructure(){
        if(!Utils.File.removeDirSync(this.project_path)){
            clUI.error('Error while removing directory:',this.project_path);
            return false;
        }

        let utilsdata_path = Utils.File.join(Utils.File.getAbsPath(),'assets','utils_data');
        this.project_utilsdata_path = Utils.File.join(this.project_path,'utils_data');
        let _cpresult = Utils.File.copyDirectorySync(utilsdata_path,this.project_utilsdata_path);
        if(_cpresult.err!==null){
            clUI.error('Error while copying directory:',utilsdata_path,' > ');
            return false;
        }
        return true;
    }

}

module.exports = new ProjectManager();
