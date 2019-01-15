//ConfigMgr

(function(){

    ConfigMgr.addField('ProjectsDirectory', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    ConfigMgr.addField('ReadyTracksDirectory', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    ConfigMgr.addField('WeeklySetsDirectory', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    ConfigMgr.addField('CurrentProject', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    ConfigMgr.addField('AppSignature', {
        description:'',
        datatype: 'string',
        defaultValue: 'BH'
    });

    ConfigMgr.addField('TracksCounter', {
        description:'',
        datatype: 'integer',
        defaultValue: 100
    });

    ConfigMgr.addField('WeeksCounter', {
        description:'',
        datatype: 'integer',
        defaultValue: 10
    });

    ConfigMgr.addField('NextWeekDate', {
        description:'',
        datatype: 'string',
        defaultValue: '2018-02-03',
        customFn:{
            setNextweek:function(v){
                let dt = new Date(v);
                dt.setDate(dt.getDate() + 7);
                let dtobj = Utils.Date.dateToStrObj(dt);
                return [dtobj.yyyy, dtobj.mm, dtobj.dd].join('-');
            },
            dateobj:function(v){
                return new Date(v);
            },
            weekInterval:function(v, params){
                let dt1 = new Date(v);
                let dt2 = new Date(v);
                dt2.setDate(dt1.getDate() + 6);
                let type=1;
                if(params.extended===true) type=2;
                return Utils.Date.weekIntervalToString(dt1,dt2,type);
            }
        }
    });

    ConfigMgr.addField('WeeksSetMinSize', {
        description:'',
        datatype: 'integer',
        defaultValue: 5
    });

    //ConfigMgr.addFlag('new_scan_needed_sampledir','New scan needed after changing the samples directory');
    //ConfigMgr.addFlag('new_scan_needed_exts','New scan needed after changing the configuration on file extensions');

    /*
       - private path       ...  NOT READABLE - internally used in ConfigMgr only
       - user/shared path   ...  ConfigMgr.path()
       - configurable path  ...  ConfigMgr.cfg_path()
    */

    ConfigMgr.setUserdataDirectory('userdata');
    ConfigMgr.setConfigFile('config.json');

    ConfigMgr.setSharedDirectory('bh_shared');
    ConfigMgr.addSharedFile('artists_db','artists.json');
    ConfigMgr.addSharedFile('labels_db','labels.json');
    ConfigMgr.addUserFile('artists_db_backup','artists_backup.json');
    ConfigMgr.addUserFile('labels_db_backup','labels_backup.json');

    ConfigMgr.loadReadOnlyData('app_data',Utils.File.pathJoin(Utils.File.getAbsPath(),'assets','data','app_data.json'));

    ConfigMgr.init();


    /* set default values */
    (()=>{
        let _editFlag = false;
        let _cfg_ProjectsDirectory = ConfigMgr.cfg_path('ProjectsDirectory');
        if(_cfg_ProjectsDirectory){
            d$('ProjectsDirectory is not null','setting automatic values');
            let _cfg_ProjectsDirectory_dir = Utils.File.pathDirname(_cfg_ProjectsDirectory);

            if(!ConfigMgr.cfg_path('ReadyTracksDirectory')){
                _editFlag = true;
                ConfigMgr.set('ReadyTracksDirectory',Utils.File.pathJoin(_cfg_ProjectsDirectory_dir,'ReadyTracks'));
            }

            if(!ConfigMgr.cfg_path('WeeklySetsDirectory')){
                _editFlag = true;
                ConfigMgr.set('WeeklySetsDirectory',Utils.File.pathJoin(_cfg_ProjectsDirectory_dir,'WeeklySets'));
            }
        }
        if(_editFlag===true){
            ConfigMgr.save();
        }
    })();


    /* Show final config */
    ConfigMgr.printInternals();
    ConfigMgr.print();


})();
