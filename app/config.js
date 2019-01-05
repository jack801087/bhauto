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

    ConfigMgr.addField('WeeksSplit', {
        description:'',
        datatype: 'integer',
        defaultValue: -1
    });

    //ConfigMgr.addFlag('new_scan_needed_sampledir','New scan needed after changing the samples directory');
    //ConfigMgr.addFlag('new_scan_needed_exts','New scan needed after changing the configuration on file extensions');

    ConfigMgr.setUserdataDirectory('userdata');
    ConfigMgr.setConfigFile('config.json');

    ConfigMgr.setSharedDirectory('bh_shared');
    ConfigMgr.addSharedFile('artists_db','artists.json');
    ConfigMgr.addSharedFile('labels_db','labels.json');

    ConfigMgr.init();

})();
