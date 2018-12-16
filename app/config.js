//ConfigMgr

(function(){

    ConfigMgr.addField('ExportDirectory', {
        description:'',
        datatype: 'absdirpath',
        defaultValue: ''
    });

    //ConfigMgr.addFlag('new_scan_needed_sampledir','New scan needed after changing the samples directory');
    //ConfigMgr.addFlag('new_scan_needed_exts','New scan needed after changing the configuration on file extensions');

    ConfigMgr.setUserdataDirectory('userdata');
    ConfigMgr.setConfigFile('config.json');

    ConfigMgr.init();

})();
