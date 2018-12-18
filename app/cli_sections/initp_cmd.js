let cmd_name = 'initp';

CliMgr.addCommand(cmd_name);

CliMgr.addCommandHeader(cmd_name)
    .description("Initialize the project."+"\n");

/*
s1 = pre set directories [init]
- se presente directory 'beatport', chiedere conferma reset > eliminare [do-later]
- chiamare adapter beatport - randomizzare array
- generare /utils_data/search_utility.html
- generare /utils_data/data_collection.json
-   preparare array di oggetti con tutte le keys e stringa vuota se dati non presenti
-   unire dati memorizzati
-   modificare oggetto artist e labels in array di oggetti con name, instagram tags, fb tags, ecc.

*/

CliMgr.addCommandBody(cmd_name,function(cliReference,cliNextCb,cliData){

    let p1 = (cliReference,cliNextCb,cliData)=>{
        let fdObj = ProjectMgr.setFromRawData();
        if(!_.isObject(fdObj)){
            d$('ProjectMgr.setFromRawData returned an error');
            return cliNextCb(cliData.error_code);
        }

        if(fdObj.raw_data_error.length>0){
            cliData.ui.warning(fdObj.raw_data_error);
            cliData.ui.warning('Some errors occurred while reading the raw data showed above.');
            cliReference.prompt({
                type: 'input',
                name: 'answer',
                message: 'Do you want to continue? [y/n] '
            }, function (result) {
                if(result.answer !== 'y'){
                    return cliNextCb(cliData.success_code);
                }
                p2(cliReference,cliNextCb,cliData,fdObj);
            });
            return;
        }
        p2(cliReference,cliNextCb,cliData,fdObj);
    };


    let p2 = (cliReference,cliNextCb,cliData, fdObj)=>{
        if(!ProjectMgr.generateSearchUtility()){
            d$('ProjectMgr.generateSearchUtility returned an error');
            return cliNextCb(cliData.error_code);
        }

        if(!ProjectMgr.generateDataCollection()){
            d$('ProjectMgr.generateDataCollection returned an error');
            return cliNextCb(cliData.error_code);
        }
        return cliNextCb(cliData.success_code);
    };

    /*  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  */

    if(!ProjectMgr.checkRawDataExists()){
        cliData.ui.error('Raw data file does not exits!');
        return cliNextCb(cliData.error_code);
    }

    if(ProjectMgr.checkFinalDataExists()){
        cliData.ui.warning('Final data already exists.');
        cliReference.prompt({
            type: 'input',
            name: 'answer',
            message: 'It will be deleted. Do you want to proceed? [y/n] '
        }, function (result) {
            if(result.answer !== 'y'){
                return cliNextCb(cliData.success_code);
            }
            p1(cliReference,cliNextCb,cliData);
        });
        return;
    }
    p1(cliReference,cliNextCb,cliData);

});
