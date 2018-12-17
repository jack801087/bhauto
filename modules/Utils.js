const _ = require('lodash');

class Utils {

    constructor(){
        this.File = require('./extensions/Utils.File');
        this.SystemInfo = require('./extensions/Utils.SystemInfo');
    }

    EXIT(message,data){
        if(message) console.log("\n"+message);
        if(data) console.log(data);
        console.log("Process terminated.\n");
        process.exit(0);
    }


    sortFilesArray(array){
        array.sort(function(a,b){
            let a_name = _.toLower(a);
            let b_name = _.toLower(b);
            if(a_name<b_name) return -1;
            if(a_name>b_name) return 1;
            return 0;
        });
        return array;
    }


    sortParallelArrays(array, compare_fn, swap_fn){
        if(!compare_fn) compare_fn=function(){};
        if(!swap_fn) swap_fn=function(){};
        for(let i=0,j=0,tmp=null; i<array.length-1; i++){
            for(j=i+1; j<array.length; j++){
                if(compare_fn(array[i],array[j])>0){
                    tmp = array[i];
                    array[i] = array[j];
                    array[j] = tmp;
                    swap_fn(i /*old index*/, j /*new index*/, array[i], array[j]);
                }
            }
        }
        return array;
    }

    sortParallelFileArrays(array, swap_fn){
        this.sortParallelArrays(array,function(a,b){
            let a_name = _.toLower(a);
            let b_name = _.toLower(b);
            if(a_name<b_name) return -1;
            if(a_name>b_name) return 1;
            return 0;
        },swap_fn);
        return array;
    }

    sortObjectByValue(obj){
        return _(obj).toPairs().sortBy(1).fromPairs().value();
    }

    sortObjectByKey(obj){
        return _(obj).toPairs().sortBy(0).fromPairs().value();
    }

    replaceAll(str, str1, str2, ignore){
        return str.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
    }

    newFunction(){
        try{
            function F(args) { return Function.apply(this, args); }
            F.prototype = Function.prototype;
            return new F(arguments);
        }catch(e){
            d$(e);
            return null;
        }
        return null;
    }

    onlyLettersNumbers(s){
        return s.replace(/[^a-zA-Z0-9]/g,'');
    }

    onlyValidPathName(s){
        return s.replace(/[^a-zA-Z0-9\_\-\.]/g,'');
    }

    printArrayOrderedList(array,prefix,processFn){
        let padding = (""+array.length+"").length+1;
        if(!processFn) processFn=function(n){ return n; };
        if(!prefix) prefix='';
        array.forEach(function(v,i,a){
            console.log(prefix+_.padStart((i+1)+')', padding)+" "+processFn(v));
        });
    }

    strToInteger(s){
        if(!_.isString(s)) return null;
        s = _.trim(s);
        if(s.length<=0) return null;
        let n = parseInt(s);
        if(_.isNil(n) || _.isNaN(n) || ""+n+""!=s) return null;
        return n;
    }

    strToFloat(s){
        if(!_.isString(s)) return null;
        s = _.trim(s);
        if(s.length<=0) return null;
        let n = parseFloat(s);
        if(_.isNil(n) || _.isNaN(n) || ""+n+""!=s) return null;
        return n;
    }

    strToBoolean(s){
        s = _.trim(s);
        if(s.length<=0) return null;
        s = _.toLower(s);
        let n = null;
        if(s==="true"  || s==="1" || s==="y") n=true;
        if(s==="false" || s==="0" || s==="n") n=false;
        return n;
    }

    strToString(s){
        if(!_.isString(s)) return null;
        s = _.trim(s);
        if(s.length<=0) return null;
        return s;
    }

    searchInObjectArray(array,key,value){
        for(let i=0; i<array.length; i++){
            if(array[i][key]==value) return true;
        }
        return false;
    }

    dateToStrObj(date){
        if(_.isNil(date)) date=Date.now();
        let dtobj = {};
        let d = new Date(date);

        dtobj.mm = '' + (d.getMonth() + 1);
        if (dtobj.mm.length < 2) dtobj.mm = '0' + dtobj.mm;

        dtobj.dd = '' + d.getDate();
        if (dtobj.dd.length < 2) dtobj.dd = '0' + dtobj.dd;

        dtobj.yyyy = d.getFullYear();

        dtobj.hh = '' + d.getHours();
        if (dtobj.hh.length < 2) dtobj.hh = '0' + dtobj.hh;

        dtobj.ii = '' + d.getMinutes();
        if (dtobj.ii.length < 2) dtobj.ii = '0' + dtobj.ii;

        dtobj.ss = '' + d.getSeconds();
        if (dtobj.ss.length < 2) dtobj.ss = '0' + dtobj.ss;

        return dtobj;
    }

    dateToYYYYMMDD(date) {
        let dtobj = this.dateToStrObj(date);
        return [dtobj.yyyy, dtobj.mm, dtobj.dd].join('');
    }

    dateToYYYYMMDDhhiiss(date) {
        let dtobj = this.dateToStrObj(date);
        return [dtobj.yyyy, dtobj.mm, dtobj.dd, dtobj.hh, dtobj.ii, dtobj.ss].join('');
    }
}

module.exports = new Utils();
