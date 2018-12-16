const exit = function(){ process.exit(1); };
global.d$ = console.log;
global._ = require('lodash');
global.path = require('path');
global.fs = require('fs');
global.fs_extra = require('fs-extra');
global.rimraf = require('rimraf');
global.Mustache = require('mustache');
global.utils = require('./utils.js');

let args = process.argv.slice(1);
let global_path = args[0];

let path_ftxt = args[1];
if(!fs.existsSync(path_ftxt)){
    d$(path_ftxt,'does not exist');
    exit();
}

let ftxt_list = utils.ftxt_read(path_ftxt);
ftxt_list.forEach((v,i)=>{
    d$('track: #'+(i+1));
    d$('artist:',v.info.artist);
    d$('title:',v.info.title);
    d$('');
});

let datestring = utils.formatDate(Date.now());
let datestring_hm = utils.formatDate(Date.now());//,true);
let dest_path = path.join( path.dirname(path_ftxt) , 'bh_'+datestring_hm );
let prelist_file = path.join( dest_path , 'prelist.json' );

/*

s1 = (NO richiesto login! curl pagina/uso jquery su node) - jquery generare pre-json

s2 = generare html utility per cercare instagram tags
 - modificare oggetto artist e labels in array di oggetti con name, instagram tags, fb tags, ecc.
 - cercare tags e aggiungere
 - generare pre-json

s3 = processare pre-json
- memorizzare tags artisti / se non esiste
- memorizzare tags labels / se non esiste
- generare dir, singoli txt instagram, txt per ae, txt per photoshop

*/


if(args[2]==='-s1'){
    d$(dest_path);
    const newjsonitem = function(example){
        if(example===true){
            return {
                "title":"",
                "artist":"",
                "label":"",
                "release":"yyyy-mm-dd",
                "tags":"do not use @ !",
                "link":"",
                "link_label":"Buy",
                "artworkurl":""
            };
        }
        return {
            "title":"",
            "artist":"",
            "label":"",
            "release":"",
            "tags":"",
            "link":"",
            "link_label":"Buy",
            "artworkurl":""
        };
    };

    rimraf(dest_path,()=>{
        fs_extra.ensureDirSync(dest_path);

        let jsonfinal = [ newjsonitem(true) ];
        ftxt_list.forEach((v)=>{
            let jsoob = newjsonitem();
            jsoob.title = v.info.title;
            jsoob.artist = v.info.artist;
            jsonfinal.push(jsoob);
        });
        utils.writefileContentSync(prelist_file,JSON.stringify(jsonfinal, null, "\r\n  "));

        (()=>{
            let template_single = utils.fileContentSync('./templates/single.html');

            let final_content = '';
            ftxt_list.forEach((v,i)=>{
                v.info.id = i+1;
                let single_row = Mustache.render(template_single, v.info);
                final_content += single_row;
            });
            let template_all = utils.fileContentSync('./templates/template1.html');
            Mustache.escape = function(x){ return x; };
            let final_output = Mustache.render(template_all, { content: final_content });

            let dest_file = path.join( dest_path , 'hello.html' );
            utils.writefileContentSync(dest_file,final_output);
        })();
    });
}


if(args[2]==='-s2'){

    if(!fs.existsSync(dest_path)){
        d$(dest_path,'does not exist');
        exit();
    }

    if(!fs.existsSync(prelist_file)){
        d$(prelist_file,'does not exist');
        exit();
    }

    let prelist_content = utils.fileContentSync(prelist_file);
    let prelist = JSON.parse(prelist_content);
    prelist = prelist.slice(1);


    (()=>{

        let template_infotxt = utils.fileContentSync('./templates/txtinfo.txt');

        prelist.forEach((v,i)=>{
            let varttitle = utils.pathValidName(v.artist+'__'+v.title);
            let dfpth =  path.join( dest_path , datestring+'_T'+(i+1)+' '+varttitle );
            fs_extra.ensureDirSync(dfpth);

            if( v.artworkurl.length > 10 )
            utils.downloadimage(v.artworkurl, path.join( dfpth, 'artwork_' + varttitle ));

            let tags = v.tags.split(' ')
            tags.forEach(function(v,i,a){
                a[i] = _.trim(a[i]);
                if(a[i].length<2) { a[i]=''; return; }
                a[i] = '@'+_.toLower(a[i]);
            });
            v.tags = tags.join(' ');
            if(v.tags.length>5) v.tags+="\r\n";

            Mustache.escape = function(x){ return x; };
            let final_output = Mustache.render(template_infotxt, v);
            utils.writefileContentSync(path.join(dfpth,'INFO '+varttitle+'.txt'),final_output);
        });
    })();
}




if(args[2]==='-s3'){
    // abs path1 bh_yyyymmdd
    // path1 traverse directoriesr, collect in array right position
    // check tracks directory
    // traverse directory
    // expect files bh_tracks(.){1}([^0-9])*
    // store in array right position
    // move file to bh_yyyymmdd_T#
}



if(args[2]==='-s4'){
    // abs path1 bh_yyyymmdd + abs path2 AE exports
    // path1 traverse directoriesr, collect in array right position
    // path2 traverse dir, collect files in array right position
    // create new directory with filetxt
    // copy ae export to this new dir
}
