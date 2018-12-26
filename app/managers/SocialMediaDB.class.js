
class SocialMediaDB {

    constructor(dbpath){
        this._dbpath = dbpath;
        this._collection = {};
        this._lastkey = {};
        return;

        DataMgr.setHolder({
            label:'config_filedsdsddsddsdasdasdasd',
            filePath:this._dbpath,
            fileType:'json',
            dataType:'object',
            preLoad:true,
            logErrorsFn:d$,
            loadFn:(fileData)=>{
                if(!_.isObject(fileData)) return { emptydata:true };
                this._collection = fileData;
                return fileData;
            },
            saveFn:()=>{
                return this._collection;
            }
        });
    }

    get dbpath(){ return this._dbpath; }


    _getID(key){
        if(!_.isString(key) || key.length===0) return null;
        key = _.trim(key);
        if(key === this._lastkey.key){
            return this._lastkey.hash;
        }
        this._lastkey = { key:key, hash:appLibs.SHA1(key) };
        return this._lastkey.hash;
    }


    _get(key){
        let _id = this._getID(key);
        if(_id===null) return null;
        return this._collection[key];
    }

    _cget(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)){
            elmt={
                key:this._lastkey.key,
                hash:this._lastkey.hash
            };
            this._collection[elmt.hash] = elmt;
        }
        return elmt;
    }


    getInstagramTags(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)) return [];
        return _.union(elmt.InstagramTags,[]);
    }


    setInstagramTags(key,values,reset){
        let elmt = this._cget(key);
        if(reset===true){
            elmt.InstagramTags = [];
        }
        elmt.InstagramTags = _.union(elmt.InstagramTags,values);
        return true;
    }

}

module.exports = SocialMediaDB;
