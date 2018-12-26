
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

        this.project_date = this.project_name.split('_');
        this.project_date = this.project_date[this.project_date.length-1];

        this.path_ready_tracks = Utils.File.pathJoin(this.project_path,'ready_tracks');
    }


    _get_weekly_paths(week_index, project_date){
        /*
        - ready/w8_201809110838/
        - ready/w8_201809110838/w8_tracksweek/
        - ready/w8_201809110838/w8_tracksweek/instagram_txt_w8_20180911
        - ready/w8_201809110838/w8_tracksweek/ps_artists_txt_w8_20180911
        - ready/w8_201809110838/w8_tracksweek/ps_titles_txt_w8_20180911
         */
        let weeklyp = {};
        week_index = 'W'+week_index;
        weeklyp.path_week = Utils.File.pathJoin(this.path_ready_tracks,week_index+'_'+project_date);
        weeklyp.path_tracksweek = Utils.File.pathJoin(weeklyp.path_week,week_index+'_tracksweek');
        weeklyp.path_tracksweek_instagram_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'instagram_txt_'+week_index+'_'+project_date+'.txt');
        weeklyp.path_tracksweek_ps_artiststitles_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'ps_artiststitles_'+week_index+'_'+project_date+'.txt');
        weeklyp.path_tracksweek_ps_labels_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'ps_labels_'+week_index+'_'+project_date+'.txt');
        return weeklyp;
    }


    _get_daily_paths(project_date, path_week, day_index, artist, title){
        /*
        (path_week) ready/w8_201809110838/

        - ready/w8_201809110838/T1_artist_title_20180911
        - ready/w8_201809110838/T1_artist_title_20180911/artwork_T1_artist_title_20180911
        - ready/w8_201809110838/T1_artist_title_20180911/instagram_txt_T1_artist_title_20180911
         */
        let dailyp = {};
        artist = Utils.onlyLettersNumbers(artist).substring(0,12);
        title = Utils.onlyLettersNumbers(title).substring(0,12);
        let suffix = 'T'+day_index+'_'+artist+'_'+title+'_'+project_date;
        dailyp.path_day = Utils.File.pathJoin(path_week,suffix);
        dailyp.path_day_artwork = Utils.File.pathJoin(dailyp.path_day,'artwork_'+suffix); /*ext added after*/
        dailyp.path_day_instagram_txt = Utils.File.pathJoin(dailyp.path_day,'instagram_txt_'+suffix+'.txt');
        return dailyp;
    }



    _renderTemplate(template_path, output_path, template_data, escapeFn){
        let MustacheEscape = appLibs.Mustache.escape;
        if(escapeFn===false){
            appLibs.Mustache.escape = function(x){ return x; };
        }else if (_.isFunction(escapeFn)) {
            appLibs.Mustache.escape = escapeFn;
        }

        let tpl_content = Utils.File.readTextFileSync(template_path);
        let final_output = appLibs.Mustache.render(tpl_content, template_data);
        appLibs.Mustache.escape = MustacheEscape;

        if(!_.isString(final_output) || Utils.File.writeTextFileSync(output_path,final_output)!==true){
            //cliWarning
            return false;
        }
        return true;
    }


    _generateReadyTrack(track_info,dailyp){
        // download dailyp.path_day_artwork
        // template dailyp.path_day_instagram_txt

        Utils.Network.downloadImage(track_info.artworklink,dailyp.path_day_artwork);

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info.txt'),
            dailyp.path_day_instagram_txt,
            track_info,
            false /*no escape*/
        );

        return true;
    }


    _generateReadyTracksWeek(tracks_info,weeklyp){
        // template dailyp.path_tracksweek_instagram_txt
        // template dailyp.path_tracksweek_ps_artists_txt
        // template dailyp.path_tracksweek_ps_titles_txt

        let twi_tpl_path = Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info.txt');
        let twi_tpl_content = Utils.File.readTextFileSync(twi_tpl_path);
        let twi_tpl_output = appLibs.Mustache.render(twi_tpl_content, { tracks_info: tracks_info });
        if(!_.isString(twi_tpl_output) || Utils.File.writeTextFileSync(weeklyp.path_tracksweek_instagram_txt,twi_tpl_output)!==true){
            //cliWarning
            return false;
        }

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info.txt'),
            weeklyp.path_tracksweek_instagram_txt,
            { tracks_info: tracks_info },
            false /*no escape*/
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_ps_artiststitles.txt'),
            weeklyp.path_tracksweek_ps_artiststitles_txt,
            { tracks_info: tracks_info },
            false /*no escape*/
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_ps_labels.txt'),
            weeklyp.path_tracksweek_ps_labels_txt,
            { tracks_info: tracks_info },
            false /*no escape*/
        );

        return true;
    }


    generateReadyDirectory(){

        //this.path_ready_tracks = Utils.File.checkAndSetDuplicatedDirectoryNameSync(this.path_ready_tracks);
        Utils.File.ensureDirSync(this.path_ready_tracks);

        let WeeksSplit = ConfigMgr.get('WeeksSplit');
        let WeeksCounter = ConfigMgr.get('WeeksCounter');
        let DayCounter = 0;
        let DataLastIndex = this._current_project_data.length-1;
        let project_date = Utils.dateToYYYYMMDD();

        let weeklyp, dailyp;
        let tracks_array;

        this._current_project_data.forEach((v,i)=>{

            let _tmod = (i)%WeeksSplit===0;
            let _nxmod = (i+1)%WeeksSplit===0;

            if(_tmod || (!_nxmod && i===DataLastIndex)){
                tracks_array = [];

                weeklyp = this._get_weekly_paths(WeeksCounter, project_date);
                Utils.File.ensureDirSync(weeklyp.path_week);
                Utils.File.ensureDirSync(weeklyp.path_tracksweek);

                WeeksCounter++;
            }

            dailyp = this._get_daily_paths(project_date, weeklyp.path_week, (i+1), v.artists.toString(), v.title);
            Utils.File.ensureDirSync(dailyp.path_day);

            let this_track = v.toPrintableJSON();
            this_track.id=i+1;
            //d$(this_track);
            tracks_array.push(this_track);

            // Daily
            this._generateReadyTrack(this_track,dailyp);

            // Weekly
            if(_nxmod || i===DataLastIndex){
                this._generateReadyTracksWeek(tracks_array,weeklyp);
            }
        });


        this._addSocialMediaData();

        return true;
    }


    hasData(){
        return (_.isArray(this._current_project_data) && this._current_project_data.length>0);
    }


    checkWeeks(){
        if(ConfigMgr.get('WeeksSplit')<1) return true;
        return ((this._current_project_data.length % ConfigMgr.get('WeeksSplit'))===0);
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

    checkReadyDataExists(){
        if(!this.path_ready_tracks) return false;
        return Utils.File.fileExistsSync(this.path_ready_tracks);
    }


    cleanFinalData(){
        Utils.File.removeFileSync(this.path_utilsdata_finaldata);
        Utils.File.removeFileSync(this.path_utilsdata_searchutility);
    }


    cleanReadyData(){
        return Utils.File.removeDirSync(this.path_ready_tracks);
    }


    setFromRawData(){
        let raw_data_json = Utils.File.readJsonFileSync(this.path_utilsdata_rawdata);
        if(!_.isObject(raw_data_json)) return null;

        let TrackSource_class = TrackSource.getClass(raw_data_json.datasource);
        if(!TrackSource_class){
            d$('Unknown datasource in the raw data object:',raw_data_json.datasource);
            return null;
        }

        let fdObj = {};
        let processed_data_json = [];
        let raw_data_error = [];
        raw_data_json.collection.forEach((v,i,a)=>{
            let tsObj = new TrackSource_class(raw_data_json.datasource);
            if(tsObj.fromRawData(v)===false){
                raw_data_error.push(v);
                return;
            }
            processed_data_json.push(tsObj);
        });

        fdObj.data_error = raw_data_error;
        fdObj.data = processed_data_json;
        this._current_project_data = processed_data_json;

        return fdObj;
    }


    setFromFinalData(){
        let final_data_json = Utils.File.readJsonFileSync(this.path_utilsdata_finaldata);
        if(!_.isObject(final_data_json)) return null;

        let fdObj = {};
        let processed_data_json = [];
        let final_data_error = [];
        final_data_json.forEach((v,i,a)=>{
            let TrackSource_class = TrackSource.getClass(v.datasource);
            if(!TrackSource_class){
                d$('Unknown datasource in the final data object:',v.datasource);
                final_data_error.push(v);
                return;
            }

            let tsObj = new TrackSource_class(v.datasource);
            if(tsObj.fromEditableJSON(v)===false){
                final_data_error.push(v);
                return;
            }
            processed_data_json.push(tsObj);
        });

        fdObj.data_error = final_data_error;
        fdObj.data = processed_data_json;
        this._current_project_data = processed_data_json;

        d$('setFromFinalData','data errors',final_data_error.length);
        d$('setFromFinalData','final collection',processed_data_json.length);

        return fdObj;
    }


    _addSocialMediaData(){
        for(let i=0; i<this._current_project_data.length; i++){
            let tsObj = this._current_project_data[i];
            tsObj.artists.addSocialMediaDataToDB(SMDB_Artists);
            tsObj.labels.addSocialMediaDataToDB(SMDB_Labels);
        }
        SMDB_Artists.save();
        SMDB_Labels.save();
        return true;
    }


    _mergeSocialMediaData(){
        for(let i=0; i<this._current_project_data.length; i++){
            let tsObj = this._current_project_data[i];
            tsObj.artists.mergeSocialMediaDataFromDB(SMDB_Artists);
            tsObj.labels.mergeSocialMediaDataFromDB(SMDB_Labels);
        }
        return true;
    }


    _generateSearchUtility(final_data_json){
        let templates_path = Utils.File.pathJoin(this._assets_path,'templates','searchutility_template1.html');
        let psutility_path = Utils.File.pathJoin(this.project_path,'utils_data','search_utility.html');
        let searchutility_template1 = Utils.File.readTextFileSync(templates_path);
        let final_output = appLibs.Mustache.render(searchutility_template1, { tracks_content: final_data_json });
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

        if(Utils.File.writeJsonFileSync(this.path_utilsdata_finaldata,final_data.editable_json)!==true){
            //cliWarning
            return false;
        }

        if(this._generateSearchUtility(final_data.json)===false){
            return false;
        }

        return true;
    }



    prepareReadyProject(){
        if(!_.isObject(this._current_project_data)){
            //cliWarning
            return false;
        }
    }



    toJSON(){
        let jobj = {
            json:[],
            editable_json:[]
        };
        this._current_project_data.forEach((tsObj,i)=>{
            let _toJson = tsObj.toJSON();
            _toJson.id = i+1;
            jobj.json.push(_toJson);
            jobj.editable_json.push(tsObj.toEditableJSON());
        });
        return jobj;
    }

}

module.exports = new ProjectManager();
