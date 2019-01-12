
class ProjectManager {

    constructor(){
        this._cfg_data = null;
        this._assets_path = Utils.File.pathJoin(Utils.File.getAbsPath(),'assets');

        this._cache_single_track_hashtags = null;
        this._cache_tracks_week_hashtags = null;

        // from config
        this._init();
    }


    _init(project_path){
        if(!_.isString(project_path)){
            project_path = ConfigMgr.cfg_path('CurrentProject');
        }
        let list_tracks_path = ConfigMgr.cfg_path('TracksListDirectory');
        let ready_tracks_path = ConfigMgr.cfg_path('ReadyTracksDirectory');
        let weekly_sets_path = ConfigMgr.cfg_path('WeeklySetsDirectory');
        if(!_.isString(project_path) || project_path.length<2){
            clUI.warning('ProjectManager.init > No CurrentProject path');
            return;
        }
        if(!_.isString(list_tracks_path) || list_tracks_path.length<2){
            clUI.warning('ProjectManager.init > No TracksListDirectory path');
            return;
        }
        if(!_.isString(ready_tracks_path) || ready_tracks_path.length<2){
            clUI.warning('ProjectManager.init > No ReadyTracksDirectory path');
            return;
        }
        if(!_.isString(weekly_sets_path) || weekly_sets_path.length<2){
            clUI.warning('ProjectManager.init > No WeeklySetsDirectory path');
            return;
        }

        this._current_project_data = null;
        this.project_name = Utils.File.pathBasename(project_path);
        this.project_path = project_path;
        this.path_list_tracks = list_tracks_path;
        this.path_ready_tracks = ready_tracks_path;
        this.path_weekly_sets = weekly_sets_path;

        this.path_utilsdata = Utils.File.pathJoin(this.project_path,'utils_data');
        this.path_utilsdata_rawdata = Utils.File.pathJoin(this.path_utilsdata,'raw_data.json');
        this.path_utilsdata_finaldata = Utils.File.pathJoin(this.path_utilsdata,'final_data.json');
        this.path_utilsdata_configdata = Utils.File.pathJoin(this.path_utilsdata,'config_data.json');
        this.path_utilsdata_searchutility = Utils.File.pathJoin(this.path_utilsdata,'search_utility.html');

        this.project_date = this.project_name.split('_');
        this.project_date = this.project_date[this.project_date.length-1];

        this.path_list_tracks = Utils.File.pathJoin(this.project_path,'tracks_list');
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


    _get_single_tracklist_paths(project_date, tracklp_path, tcounter, prefix, artist, title){
        /*
        (path_week) ready/w8_201809110838/

        - tracks_list/BTP_51_artist_title_20180911
        - ready/BTP_51_artist_title_20180911/artwork_BTP_51_artist_title_20180911
        - ready/BTP_51_artist_title_20180911/instagram_txt_BTP_51_artist_title_20180911
         */
        let tracklp = {};
        artist = _.toLower(Utils.onlyLettersNumbers(artist).substring(0,18));
        title = _.toLower(Utils.onlyLettersNumbers(title).substring(0,18));
        let suffix = prefix+'_'+tcounter+'_'+artist+'_'+title+'_'+project_date;
        tracklp.path_day = Utils.File.pathJoin(tracklp_path,suffix);
        tracklp.path_day_jsoninfo = Utils.File.pathJoin(tracklp.path_day,'track_info_'+suffix+'.json');
        tracklp.path_day_artwork = Utils.File.pathJoin(tracklp.path_day,'artwork_'+suffix); /*ext added after*/
        tracklp.path_day_instagram_txt = Utils.File.pathJoin(tracklp.path_day,'instagram_txt_'+suffix+'.txt');
        tracklp.path_day_facebook_txt = Utils.File.pathJoin(tracklp.path_day,'facebook_txt_'+suffix+'.txt');
        tracklp.path_day_facebook_txt = Utils.File.pathJoin(tracklp.path_day,'facebook_txt_'+suffix+'.txt');
        tracklp.path_day_youtube_txt = Utils.File.pathJoin(tracklp.path_day,'youtube_txt_'+suffix+'.txt');
        tracklp.path_day_wordpress_txt = Utils.File.pathJoin(tracklp.path_day,'wordpress_txt_'+suffix+'.txt');
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

        if(!_.isString(final_output) || Utils.File.writeTextFileSync(output_path,_.trim(final_output))!==true){
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
        track_info.hash_tags_list_commas = htarray.join(', ');
        track_info.hash_tags_list_spaces = htarray.join(' ');
        htarray.forEach((v)=>{ track_info.hash_tags_list+='#'+v+' '; });
        return true;
    }


    _mergeTracksWeekHashtags(track_info, max_count){
        let htarray = [];

        if(!_.isArray(this._cache_tracks_week_hashtags)){
            let _csth_temp = Utils.File.readJsonFileSync(Utils.File.pathJoin(this._assets_path,'data','tracks_week_hashtags.json'));
            if(!_.isArray(_csth_temp)){
                d$('_mergeTracksWeekHashtags','no data from single_track_hashtags.json');
                return false;
            }
            this._cache_tracks_week_hashtags = _csth_temp;
        }
        htarray = _.union(this._cache_tracks_week_hashtags,[]);
        track_info.hash_tags_array = htarray;

        if(htarray.length>max_count){
            htarray = htarray.slice(0,max_count-1);
        }

        track_info.hash_tags_list = '';
        track_info.hash_tags_list_commas = htarray.join(', ');
        track_info.hash_tags_list_spaces = htarray.join(' ');
        htarray.forEach((v)=>{ track_info.hash_tags_list+='#'+v+' '; });
        return true;
    }


    _generateReadyTrack(track_info,dailyp){

        Utils.Network.downloadImage(track_info.artworklink,dailyp.path_day_artwork);

        Utils.File.writeJsonFileSync(dailyp.path_day_jsoninfo,track_info); /*save trackinfo before further changes*/

        this._mergeSingleTrackHashtags(track_info, 30 /*max on instagram and facebook */);

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info_instagram.txt'),
            dailyp.path_day_instagram_txt,
            track_info,
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info_facebook.txt'),
            dailyp.path_day_facebook_txt,
            track_info,
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info_youtube.txt'),
            dailyp.path_day_youtube_txt,
            track_info,
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','single_track_info_wordpress.html'),
            dailyp.path_day_wordpress_txt,
            track_info,
            {
                escapeFn: null /* escape with default function*/
            }
        );

        return true;
    }


    _generateReadyTracksWeek(tracks_data,weeklyp){

        let app_data_rod = ConfigMgr.readOnlyData('app_data');

        tracks_data.bh_info = app_data_rod.bh_info;

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info_instagram.txt'),
            weeklyp.path_tracksweek_instagram_txt,
            { tracks_data: tracks_data },
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info_facebook.txt'),
            weeklyp.path_tracksweek_facebook_txt,
            { tracks_data: tracks_data },
            {
                escapeFn: false /*no escape*/
            }
        );

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info_youtube.txt'),
            weeklyp.path_tracksweek_youtube_txt,
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

        this._renderTemplate(
            Utils.File.pathJoin(this._assets_path,'templates','tracks_week_info_wordpress.html'),
            weeklyp.path_tracksweek_wordpress_txt,
            { tracks_data: tracks_data },
            {
                escapeFn: null /*no escape*/
            }
        );

        return true;
    }


    generateTracksListDirectory(){

        /* Read weeks counter from file */
        let TracksCounter_fromFile = this._get_config_param('TracksCounter');
        let TracksCounter_start = (_.isNil(TracksCounter_fromFile)?ConfigMgr.get('TracksCounter'):TracksCounter_fromFile);
        let TracksCounter = TracksCounter_start;

        /* Destination directory */
        Utils.File.ensureDirSync(this.path_list_tracks);
        Utils.File.ensureDirSync(this.path_ready_tracks);

        let project_date = Utils.Date.dateToYYYYMMDD();

        this._addSocialMediaData();

        this._current_project_data.forEach((v,i)=>{

            let tracklp = this._get_single_tracklist_paths(project_date, this.path_list_tracks, TracksCounter, v.SourceCode, v.artists.toString(), v.title);
            Utils.File.ensureDirSync(tracklp.path_day);

            let this_track = v.toPrintableJSON();

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


    newProject(project_path){
        let export_project_path = ConfigMgr.cfg_path('ProjectsDirectory');
        if(export_project_path===null){
            clUI.error('No export path configured; set ProjectsDirectory');
            return null;
        }
        Utils.File.ensureDirSync(export_project_path);
        if(!_.isString(project_path)){
            project_path = Utils.File.pathJoin(export_project_path,'bh_proj_'+Utils.Date.dateToYYYYMMDDhhiiss());
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
        if(!this.path_list_tracks) return false;
        return Utils.File.fileExistsSync(this.path_list_tracks);
    }

    cleanFinalData(){
        Utils.File.removeFileSync(this.path_utilsdata_finaldata);
        Utils.File.removeFileSync(this.path_utilsdata_searchutility);
    }


    cleanTracksListData(){
        return Utils.File.removeDirSync(this.path_list_tracks);
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


    generateEditableDataCollection(){
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



    toJSON(){
        let jobj = {
            json:[],
            editable_json:[]
        };
        this._current_project_data.forEach((tsObj,i)=>{
            let _toJson = tsObj.toJSON();
            jobj.json.push(_toJson);
            jobj.editable_json.push(tsObj.toEditableJSON());
        });
        return jobj;
    }


    _get_weeklyset_paths(week_index, week_date){
        /*
        - ready/w8_201809110838/
        - ready/w8_201809110838/w8_tracksweek/
        - ready/w8_201809110838/w8_tracksweek/instagram_txt_w8_20180911
        - ready/w8_201809110838/w8_tracksweek/ps_artists_txt_w8_20180911
        - ready/w8_201809110838/w8_tracksweek/ps_titles_txt_w8_20180911
         */
        let weeklyp = {};
        week_index = 'W'+week_index;
        let week_signature = week_index+'_'+week_date;

        weeklyp.path_week = Utils.File.pathJoin(this.path_weekly_sets,ConfigMgr.get('AppSignature')+'_'+week_signature);
        weeklyp.path_tracksweek = Utils.File.pathJoin(weeklyp.path_week,week_index+'_tracksweek');
        weeklyp.path_tracksweek_instagram_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'instagram_txt_'+week_signature+'.txt');
        weeklyp.path_tracksweek_facebook_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'facebook_txt_'+week_signature+'.txt');
        weeklyp.path_tracksweek_youtube_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'youtube_txt_'+week_signature+'.txt');
        weeklyp.path_tracksweek_wordpress_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'wordpress_txt_'+week_signature+'.txt');
        weeklyp.path_tracksweek_ps_artiststitles_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'ps_artiststitles_'+week_signature+'.txt');
        weeklyp.path_tracksweek_ps_labels_txt = Utils.File.pathJoin(weeklyp.path_tracksweek,'ps_labels_'+week_signature+'.txt');
        return weeklyp;
    }


    generateWeekSetDirectory(tlData){

        let WeeksCounter = ConfigMgr.get('WeeksCounter');
        let NextWeekDate = ConfigMgr.get('NextWeekDate');

        Utils.File.ensureDirSync(this.path_weekly_sets);
        let weeklyp = this._get_weeklyset_paths(WeeksCounter,Utils.onlyLettersNumbers(NextWeekDate));
        Utils.File.ensureDirSync(weeklyp.path_tracksweek);

        let tracks_data = { hash_tags_list:'' };
        tracks_data.date_interval = ConfigMgr.fieldFn('NextWeekDate','weekInterval');
        tracks_data.hash_tags_array = [];
        tracks_data.tracks_info = [];
        tracks_data.tracks_wp_html = [];

        let _error_flag = false;

        tlData._data.forEach((tlInfo)=>{
            clUI.error('Moving directory',tlInfo.parent_path,' ...');

            /* wordpress - read file single track wordpress */
            tracks_data.tracks_wp_html.push(_.trim(Utils.File.readTextFileSync(weeklyp.path_tracksweek_wordpress_txt)));

            let moveDData = Utils.File.moveDirectorySync(tlInfo.parent_path,weeklyp.path_week,{ overwrite:true, setDirName:true });
            if(moveDData.err!==null){
                _error_flag = true;
                clUI.error('> an error occurred',"\n",moveDData.err);
                return;
            }

            tracks_data.tracks_info.push(tlInfo.json);
        });

        this._mergeTracksWeekHashtags(tracks_data,30);
        this._generateReadyTracksWeek(tracks_data,weeklyp);

        if(_error_flag===true) return false;

        ConfigMgr.set('WeeksCounter',WeeksCounter+1);
        ConfigMgr.fieldFn('NextWeekDate','setNextweek',{ set:true });
        ConfigMgr.save();

        return true;
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
                name:v.json.artists_list+' - '+v.json.title
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


        let _tinfo_data = null;
        let _tinfo_list = null;
        DirectoryTree.walkDirectory(this.path_ready_tracks,{
            maxLevel:3,
            itemCb:function(p_info){
                if(p_info.item.isDirectory && p_info.item.level===2){
                    _tinfo_data = {
                        parent_path: p_info.item.path,
                        content_paths:[]
                    };
                    _tinfo_list = {};
                    tlData._data.push(_tinfo_data);
                    tlData.list.push(_tinfo_list);
                }
                else if(p_info.item.isFile && p_info.item.level===3){
                    _tinfo_data.content_paths.push(p_info.item.path);

                    if(p_info.item.checkExt('json')){
                        let tinfojson = Utils.File.readJsonFileSync(p_info.item.path);
                        _tinfo_data.json = tinfojson;
                        _tinfo_list.name = tinfojson.artists_list+' - '+tinfojson.title;
                    }
                }
            }
        });

        if(tlData._data.length===0) return null;
        return tlData;
    }


}

module.exports = new ProjectManager();
