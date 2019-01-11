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
            weekInterval:function(v){
                let intStr = '';
                let dt = new Date(v);
                intStr+=dt.getDate();

                dt.setDate(dt.getDate() + 6);
                intStr+='-'+dt.getDate();

                intStr+=' '+Utils.Date.monthToName(dt.getMonth())+' '+dt.getFullYear();
                return intStr;
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

    ConfigMgr.setUserdataDirectory('userdata');
    ConfigMgr.setConfigFile('config.json');

    ConfigMgr.setSharedDirectory('bh_shared');
    ConfigMgr.addSharedFile('artists_db','artists.json');
    ConfigMgr.addSharedFile('labels_db','labels.json');

    ConfigMgr.loadReadOnlyData('app_data',Utils.File.pathJoin(Utils.File.getAbsPath(),'assets','data','app_data.json'));

    ConfigMgr.init();

})();
