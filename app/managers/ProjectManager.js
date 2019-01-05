
class ProjectManager {

    constructor(){
        this._cfg_data = null;
        this._assets_path = Utils.File.pathJoin(Utils.File.getAbsPath(),'assets');

        this._cache_single_track_hashtags = null;
        this._cache_tracks_week_hashtags = null;

        // from config
        this._init();
    }


    _init(){
        let project_path = ConfigMgr.cfg_path('CurrentProject');
        let ready_tracks_path = ConfigMgr.cfg_path('ReadyTracksDirectory');
        let weekly_sets_path = ConfigMgr.cfg_path('WeeklySetsDirectory');
        if(!_.isString(project_path) || project_path.length<2){
            d$('ProjectManager.init > No CurrentProject path');
            return;
        }
        if(!_.isString(ready_tracks_path) || ready_tracks_path.length<2){
            d$('ProjectManager.init > No ReadyTracksDirectory path');
            return;
        }
        if(!_.isString(weekly_sets_path) || weekly_sets_path.length<2){
            d$('ProjectManager.init > No WeeklySetsDirectory path');
            return;
        }

        this._current_project_data = null;
        this.project_name = Utils.File.pathBasename(project_path);
        this.project_path = project_path;
        this.path_ready_tracks = ready_tracks_path;
        this.path_weekly_sets = weekly_sets_path;

        this.path_utilsdata = Utils.File.pathJoin(this.project_path,'utils_data');
        this.path_utilsdata_rawdata = Utils.File.pathJoin(this.path_utilsdata,'raw_data.json');
        this.path_utilsdata_finaldata = Utils.File.pathJoin(this.path_utilsdata,'final_data.json');
        this.path_utilsdata_configdata = Utils.File.pathJoin(this.path_utilsdata,'config_data.json');
        this.path_utilsdata_searchutility = Utils.File.pathJoin(this.path_utilsdata,'search_utility.html');

        this.project_date = this.project_name.split('_');
        this.project_date = this.project_date[this.project_date.length-1];

        this.path_tracks_list = Utils.File.pathJoin(this.project_path,'tracks_list');
    }


    _get_config_param(label){
        if(_.isObject(this._cfg_data)) return this._cfg_data[label];
        let _cfg_data = Utils.File.readJsonFileSync(this.path_utilsdata_configdata);
        if(!_.isObject(_cfg_data)) return null;
        this._cfg_data = _cfg_data;
        return this._cfg_data[label];
    }

    _set_config_param(label,value){
        if(!_.isObject(this._cfg_data)){
            let _cfg_data = Utils.File.readJsonFileSync(this.path_utilsdata_configdata);
            if(!_.isObject(_cfg_data)) _cfg_data={};
            this._cfg_data = _cfg_data;
        }
        this._cfg_data[label]=value;
        Utils.File.writeJsonFileSync(this.path_utilsdata_configdata,this._cfg_data);
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
        artist = Utils.onlyLettersNumbers(artist).substring(0,18);
        title = Utils.onlyLettersNumbers(title).substring(0,18);
        let suffix = 'T'+day_index+'_'+artist+'_'+title+'_'+project_date;
        dailyp.path_day = Utils.File.pathJoin(path_week,suffix);
        dailyp.path_day_jsoninfo = Utils.File.pathJoin(dailyp.path_day,'track_info_'+suffix+'.json');
        dailyp.path_day_artwork = Utils.File.pathJoin(dailyp.path_day,'artwork_'+suffix); /*ext added after*/
        dailyp.path_day_instagram_txt = Utils.File.pathJoin(dailyp.path_day,'instagram_txt_'+suffix+'.txt');
        return dailyp;
    }


    _get_single_tracklist_paths(project_date, tracklp_path, tcounter, prefix, artist, title){
        /*
        (path_week) ready/w8_201809110838/

        - tracks_list/BTP_51_artist_title_20180911
        - ready/BTP_51_artist_title_20180911/artwork_BTP_51_artist_title_20180911
        - ready/BTP_51_artist_title_20180911/instagram_txt_BTP_51_artist_title_20180911
         */
        let tracklp = {};
        artist = Utils.onlyLettersNumbers(artist).substring(0,18);
        title = Utils.onlyLettersNumbers(title).substring(0,18);
        let suffix = prefix+'_'+tcounter+'_'+artist+'_'+title+'_'+project_date;
        tracklp.path_day = Utils.File.pathJoin(tracklp_path,suffix);
        tracklp.path_day_jsoninfo = Utils.File.pathJoin(tracklp.path_day,'track_info_'+suffix+'.json');
        tracklp.path_day_artwork = Utils.File.pathJoin(tracklp.path_day,'artwork_'+suffix); /*ext added after*/
        tracklp.path_day_instagram_txt = Utils.File.pathJoin(tracklp.path_day,'instagram_txt_'+suffix+'.txt');
        return tracklp;
    }



    _renderTemplate(template_path, output_path, template_data, options){
        options = _.merge({
            maxLenght:-1,
            escapeFn:null /*use default function*/
        },options);
        let MustacheEscape = appLibs.Mustache.escape;
        if(options.escapeFn===false){
            appLibs.Mustache.escape = function(x){ return x; };
        }else if (_.isFunction(options.escapeFn)) {
            appLibs.Mustache.escape = options.escapeFn;
        }

        let tpl_content = Utils.File.readTextFileSync(template_path);
        let final_output = appLibs.Mustache.render(tpl_content, template_data);
        appLibs.Mustache.escape = MustacheEscape;

        if(options.maxLenght>0){
            final_output = Utils.String.cutByPreservingWords(final_output,options.maxLenght);
        }

        if(!_.isString(final_output) || Utils.File.writeTextFileSync(output_path,final_output)!==true){
            //cliWarning
            return false;
        }
        return true;
    }


    _mergeSingleTrackHashtags(track_info, max_count){
        let htarray = [];

        if(!_.isArray(this._cache_single_track_hashtags)){
            let _csth_temp = Utils.File.readJsonFileSync(Utils.File.pathJoin(this._assets_path,'data','single_track_hashtags.json'));
            if(!_.isArray(_csth_temp)){
                d$('_mergeSingleTrackHashtags','no data from single_track_hashtags.json');
                return false;
            }
            this._cache_single_track_hashtags = _csth_temp;
        }
        htarray = _.union(this._cache_single_track_hashtags,[]);

        if(htarray.length>max_count){
            htarray = htarray.slice(0,max_count-1);
        }

        if(htarray.length<max_count){
            htarray = _.union(track_info.hash_tags_array.slice(0,max_count-htarray.length),htarray);
        }

        track_info.hash_tags_list = '';
        htarray.forEach((v)=>{ track_info.hash_tags_list+='#'+v+' '; });
        return true;
    }


    _mergeTracksWeekHashtags(track_info, max_count){

        this._cache_tracks_week_hashtags = null;
    }


    _generateReadyTrack(track_info,dailyp){
        // download dailyp.path_day_artwork
        // template dailyp.path_day_instagram_txt

        Utils.Network.downloadImage(track_info.artworklink,dailyp.path_day_artwork);

        Utils.File.writeJsonFileSync(dailyp.path_day_jsoninfo,track_info); /*save trackinfo before further changes*/

        this._mergeSingleTrackHashtags(track_info, 30 /*max on instagram and facebook */);

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info.txt'),
            dailyp.path_day_instagram_txt,
            track_info,
            {
                escapeFn: false /*no escape*/
            }
        );

        return true;
    }


    _generateReadyTracksWeek(tracks_data,weeklyp){
        // template dailyp.path_tracksweek_instagram_txt
        // template dailyp.path_tracksweek_ps_artists_txt
        // template dailyp.path_tracksweek_ps_titles_txt

        // let twi_tpl_path = Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info.txt');
        // let twi_tpl_content = Utils.File.readTextFileSync(twi_tpl_path);
        // let twi_tpl_output = appLibs.Mustache.render(twi_tpl_content, { tracks_data: tracks_data });
        // if(!_.isString(twi_tpl_output) || Utils.File.writeTextFileSync(weeklyp.path_tracksweek_instagram_txt,twi_tpl_output)!==true){
        //     //cliWarning
        //     return false;
        // }

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info.txt'),
            weeklyp.path_tracksweek_instagram_txt,
            { tracks_data: tracks_data },
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_ps_artiststitles.txt'),
            weeklyp.path_tracksweek_ps_artiststitles_txt,
            { tracks_info: tracks_data.tracks_info },
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_ps_labels.txt'),
            weeklyp.path_tracksweek_ps_labels_txt,
            { tracks_info: tracks_data.tracks_info },
            {
                escapeFn: false /*no escape*/
            }
        );

        return true;
    }


    generateReadyDirectory(){

        /* Read weeks counter from file */
        let WeeksCounter_fromFile = this._get_config_param('WeeksCounter');


        //this.path_ready_tracks = Utils.File.checkAndSetDuplicatedDirectoryNameSync(this.path_ready_tracks);
        Utils.File.ensureDirSync(this.path_ready_tracks);

        let WeeksSplit = ConfigMgr.get('WeeksSplit');
        let WeeksCounter_start = (_.isNil(WeeksCounter_fromFile)?ConfigMgr.get('WeeksCounter'):WeeksCounter_fromFile);
        let WeeksCounter = WeeksCounter_start;
        let DayCounter = 0;
        let DataLastIndex = this._current_project_data.length-1;
        let project_date = Utils.dateToYYYYMMDD();

        let weeklyp, dailyp;
        let tracks_data = { hash_tags_list:'' };

        this._addSocialMediaData();

        this._current_project_data.forEach((v,i)=>{

            let _tmod = (i)%WeeksSplit===0;
            let _nxmod = (i+1)%WeeksSplit===0;

            if(_tmod || (!_nxmod && i===DataLastIndex)){
                tracks_data.tracks_info = [];

                weeklyp = this._get_weekly_paths(WeeksCounter, project_date);
                Utils.File.ensureDirSync(weeklyp.path_week);
                Utils.File.ensureDirSync(weeklyp.path_tracksweek);

                WeeksCounter++;
            }

            dailyp = this._get_daily_paths(project_date, weeklyp.path_week, (i+1), v.artists.toString(), v.title);
            Utils.File.ensureDirSync(dailyp.path_day);

            let this_track = v.toPrintableJSON();
            this_track.id=i+1;
            tracks_data.tracks_info.push(this_track);
            tracks_data.hash_tags_list += this_track.hash_tags_list+' ';

            // Daily
            this._generateReadyTrack(this_track,dailyp);

            // Weekly
            if(_nxmod || i===DataLastIndex){
                this._generateReadyTracksWeek(tracks_data,weeklyp);
                tracks_data.hash_tags_list = '';
            }
        });

        if(WeeksCounter_fromFile===null){
            this._set_config_param('WeeksCounter',WeeksCounter_start);
            ConfigMgr.set('WeeksCounter',WeeksCounter);
            ConfigMgr.save();
        }



        return true;
    }


    generateTracksListDirectory(){

        /* Read weeks counter from file */
        let TracksCounter_fromFile = this._get_config_param('TracksCounter');
        let TracksCounter_start = (_.isNil(TracksCounter_fromFile)?ConfigMgr.get('TracksCounter'):TracksCounter_fromFile);
        let TracksCounter = TracksCounter_start;

        /* Destination directory */
        Utils.File.ensureDirSync(this.path_tracks_list);
        Utils.File.ensureDirSync(this.path_ready_tracks);

        let project_date = Utils.dateToYYYYMMDD();

        this._addSocialMediaData();

        this._current_project_data.forEach((v,i)=>{

            let tracklp = this._get_single_tracklist_paths(project_date, this.path_tracks_list, TracksCounter, v.SourceCode, v.artists.toString(), v.title);
            Utils.File.ensureDirSync(tracklp.path_day);

            let this_track = v.toPrintableJSON();
            this_track.id=i+1;

            this._generateReadyTrack(this_track,tracklp);

            TracksCounter++;
        });

        if(TracksCounter_fromFile===null){
            this._set_config_param('TracksCounter',TracksCounter_start);
            ConfigMgr.set('TracksCounter',TracksCounter);
            ConfigMgr.save();
        }

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
        let export_project_path = ConfigMgr.cfg_path('ProjectsDirectory');
        if(export_project_path===null){
            clUI.error('No export path configured; set ProjectsDirectory');
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

        clUI.print('New project path > ',this.project_path);

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


    checkTracksListExists(){
        if(!this.path_tracks_list) return false;
        return Utils.File.fileExistsSync(this.path_tracks_list);
    }

    cleanFinalData(){
        Utils.File.removeFileSync(this.path_utilsdata_finaldata);
        Utils.File.removeFileSync(this.path_utilsdata_searchutility);
    }


    cleanReadyData(){
        return Utils.File.removeDirSync(this.path_ready_tracks);
    }

    cleanTracksListData(){
        return Utils.File.removeDirSync(this.path_tracks_list);
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
            tsObj.remixers.addSocialMediaDataToDB(SMDB_Artists);
            tsObj.labels.addSocialMediaDataToDB(SMDB_Labels);
        }
        SMDB_Artists.save();
        SMDB_Labels.save();

        this._mergeSocialMediaData();

        return true;
    }


    _mergeSocialMediaData(){
        for(let i=0; i<this._current_project_data.length; i++){
            let tsObj = this._current_project_data[i];
            tsObj.artists.mergeSocialMediaDataFromDB(SMDB_Artists);
            tsObj.remixers.mergeSocialMediaDataFromDB(SMDB_Artists);
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



    selectReadyTracks(tlData, selectStr){
        let newTlData = {
            selection:'random',
            _data: [],
            list:[]
        };

        let _sArray = _.splitValues(selectStr,',');

        if(_.isString(selectStr) && selectStr.length>2){
            newTlData.selection='by IDs';
            if(_sArray.length<=0){
                clUI.print('Wrong choice for Ready Tracks');
                return null;
            }
            let _errorFlag = false;
            _sArray.forEach((v,i,a)=>{
                let vx=Utils.strToInteger(v);
                if(vx===null){
                    clUI.print('Invalid id for Ready Tracks',v,vx);
                    _errorFlag=true;
                }
                else if((tlData._data.length+1) < vx){
                    clUI.print('Id out of range for Ready Tracks',v,vx);
                    _errorFlag=true;
                }
                a[i] = vx-1;
                newTlData._data.push(tlData._data[a[i]]);
            });
            if(_errorFlag===true) return null;

        }else{
            newTlData._data = _.union(tlData._data,[]);
            newTlData._data = Utils.shuffleArray(newTlData._data);
            newTlData._data = newTlData._data.slice(0,ConfigMgr.get('WeeksSetMinSize'));
        }

        newTlData._data.forEach((v)=>{
            newTlData.list.push({
                name:v.name
            });
        });
        return newTlData;

    }


    getReadyTracksList(){
        if(!_.isString(this.path_ready_tracks)) return null;
        if(!Utils.File.directoryExistsSync(this.path_ready_tracks)) return null;
        let tlData = {
            _data: [],
            list:[]
        };
        DirectoryTree.walkDirectory(this.path_ready_tracks,{
            maxLevel:2,
            itemCb:function(p_info){
                if(p_info.item.isDirectory && p_info.item.level===2){
                    tlData._data.push(p_info.item);
                    tlData.list.push({
                        name:p_info.item.name
                    });
                }
            }
        });

        if(tlData._data.length===0) return null;
        return tlData;
    }


}

module.exports = new ProjectManager();
