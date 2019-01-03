//ConfigMgr

(function(){

    ConfigMgr.addField('ExportDirectory', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    ConfigMgr.addField('CurrentProject', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
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
