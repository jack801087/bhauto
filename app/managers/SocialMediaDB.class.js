
class SocialMediaDB {

    constructor(dbpath){
        this._dbpath = dbpath;
        this._dblabel = Utils.File.pathBasename(dbpath);
        this._collection = {};
        this._lastkey = {};

        DataMgr.setHolder({
            label:this._dblabel,
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

    save(){
        DataMgr.save(this._dblabel);
    }

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
        return this._collection[_id];
    }

    _cget(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)){
            elmt={
                key:this._lastkey.key,
                hash:this._lastkey.hash,
                InstagramTags:[],
                Hashtags:[]
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


    getHashtags(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)) return [];
        return _.union(elmt.Hashtags,[]);
    }


    setInstagramTags(key,values,reset){
        let elmt = this._cget(key);
        if(reset===true){
            elmt.InstagramTags = [];
        }
        elmt.InstagramTags = _.union(elmt.InstagramTags,values);
        return true;
    }

    setHashtags(key,values,reset){
        let elmt = this._cget(key);
        if(reset===true){
            elmt.Hashtags = [];
        }
        elmt.Hashtags = _.union(elmt.Hashtags,values);
        return true;
    }

}

module.exports = SocialMediaDB;
