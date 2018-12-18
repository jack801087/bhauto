
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
        this.project_utilsdata_path = Utils.File.pathJoin(this.project_path,'utils_data');
        let _cpresult = Utils.File.copyDirectorySync(utilsdata_path,this.project_utilsdata_path,{ overwrite:true });
        if(_cpresult.err!==null){
            clUI.error('Error while copying directory:',_cpresult.path_from,' > ',_cpresult.path_to);
            return false;
        }
        return true;
    }


    processRawData(){
        /*
        ArtistMgr
        LabelMgr

        db = {
            prop1:""
            _09:{
                array:[
                    {
                        name:"abc",
                        hash:"a3h2hk5g32kh5g2kbc",
                        inst_tags:[],
                        fb_tags:[]
                    }
                ]
            }
        }

        project_path/raw_data.json
        if datatype beatport new Beatport.adapter

        Beatport.adapter.processRawData - arrange data, split artists, split labels

        db - trim string, get hash

        final json ready for finaldata.json

        search_utility.html resume of finaldata.json


         */
    }

}

module.exports = new ProjectManager();
