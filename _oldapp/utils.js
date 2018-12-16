const imagedownloader = require('image-downloader')
const iconv = require('iconv-lite');

let abc = {

    downloadimage: function(imageurl,destpathname){
        const options = {
          url: imageurl,
          dest: ''                  // Save to /path/to/dest/image.jpg
        };
        extension = path.extname(options.url);
        options.dest = destpathname + extension;

        imagedownloader.image(options)
          .then(({ filename, image }) => {
            //console.log('File saved to', filename)
          })
          .catch((err) => {
            console.error(err)
        });
    },

    formatDate: function(date,hh) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hour = '' + d.getHours(),
            minute = '' + d.getMinutes();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
        let a = [year, month, day];

        if(hh===true){
            if (hour.length < 2) hour = '0' + hour;
            hour='_'+hour;
            if (minute.length < 2) minute = '0' + minute;
            a.push(hour);
            a.push(minute);
        }
        return a.join('');
    },

    fileContentSync: function(fpath){
        let fcont = fs.readFileSync(fpath,{encoding:"binary"}).toString();
        return iconv.decode(fcont, 'iso88591'); // decodedFile = decode(fcont, 'macintosh');
    },

    writefileContentSync: function(fpath,content){
        let fcont = iconv.decode(content, 'iso88591');
        return fs.writeFileSync(fpath,content,{encoding:"binary"});
    },

    ftxt_read: function(ftxt_path){
        let array = this.fileContentSync(ftxt_path).split("\r\n");
        let obj = [];
        array.forEach((v,i)=>{
            if(v.length<=0) return;
            let sp_regex = /[^A-Za-z0-9\- \'\(\)\[\]\,\;]/ig;
            let sp = '';
            //sp = v.replace(sp_regex,'');
            sp = v.split('-');
            sp[0] = _.trim(sp[0]);
            sp[1] = _.trim(sp[1]);
            //d$(sp);
            let newobj = {
                info:{
                    artist:sp[1],
                    title:sp[0],
                },
                _:{
                    n_artist:_.toLower(sp[1]),
                    n_title:_.toLower(sp[0])
                }
            };

            newobj._.nc_artist = newobj._.n_artist.split(' ');
            newobj._.nc_title = newobj._.n_title.split(' ');
            newobj._.nc_artist = newobj._.nc_artist.splice(0,2).join('+');
            newobj._.nc_title = newobj._.nc_title.splice(0,2).join('+');

            newobj.info.q_artist = newobj._.nc_artist;//.replace(/[ ]/ig,'+');
            newobj.info.q_title = newobj._.nc_title;//.replace(/[ ]/ig,'+');
            newobj.info.q_general = newobj.info.q_artist+'+'+newobj.info.q_title;
            obj.push(newobj);
        });
        return obj;
    },

    pathValidName: function(path_string){
        return _.toLower(path_string).replace(/[^A-Za-z0-9\- \'\(\)\[\]\,\;\_]/ig,'');
    }

};

module.exports = abc;
