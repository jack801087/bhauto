
class SocialMediaDB {

    constructor(db_path,db_backup_path){
        this._db_path = db_path;
        this._dblabel = Utils.File.pathBasename(db_path);
        this._collection = {};
        this._lastkey = {};

        DataMgr.setHolder({
            label:this._dblabel,
            filePath:this._db_path,
            cloneFrom:db_backup_path,
            backupTo:db_backup_path,
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

    get db_path(){ return this._db_path; }

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
                FacebookTags:[],
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

    getFacebookTags(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)) return [];
        return _.union(elmt.FacebookTags,[]);
    }


    getHashtags(key){
        let elmt = this._get(key);
        if(_.isNil(elmt)) return [];
        return _.union(elmt.Hashtags,[]);
    }


    setInstagramTags(hash,values,reset){
        let elmt = this._collection[hash];
        if(_.isNil(elmt)){
            d$('setInstagramTags - No DB occurrence with ',hash);
            return;
        }
        if(reset===true){
            elmt.InstagramTags = [];
        }
        elmt.InstagramTags = _.union(elmt.InstagramTags,values);
        return true;
    }


    setFacebookTags(hash,values,reset){
        let elmt = this._collection[hash];
        if(_.isNil(elmt)){
            d$('setFacebookTags - No DB occurrence with ',hash);
            return;
        }
        elmt.FacebookTags = _.union(elmt.FacebookTags,values);
        return true;
    }

    setHashtags(hash,values,reset){
        let elmt = this._collection[hash];
        if(_.isNil(elmt)){
            d$('setHashtags - No DB occurrence with ',hash);
            return;
        }
        elmt.Hashtags = _.union(elmt.Hashtags,values);
        return true;
    }


    getSMInfoByHash(hash){
        return this._collection[hash];
    }
    getSMInfoByKey(key,create){
        if(create===true) return this._cget(key);
        return this._get(key);
    }

    forEach(cb){
        let khArray = Object.keys(this._collection);
        let _self = this;
        khArray.forEach(function(k,i){
            cb(i,k,_self._collection[k]);
        });
    }
}

module.exports = SocialMediaDB;
