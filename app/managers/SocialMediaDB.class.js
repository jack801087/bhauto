
class SocialMediaDB {

    constructor(dbpath){
        this._dbpath = dbpath;
        this._collection = {};
        this._lastkey = {};

        DataMgr.setHolder({
            label:'config_file',
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

        // set DataHolder
        /*
        db = {
            prop1:""
            _09:{
                array:[
                    {
                        name:"abc",
                        hash:"a3h2hk5g32kh5g2kbc",
                        inst_tags:[],
                        fb_tags:[]
                    }
                ]
            }
        }
        */
    }

    get dbpath(){ return this._dbpath; }

    //TODO: create,remove


    _getID(key){
        if(!_.isString(key) || key.length===0) return null;
        key = _.trim(key);
        if(key === this._lastkey.key){
            return this._lastkey.hash;
        }
        this._lastkey = { key:key, hash:SHA1(key) };
        return this._lastkey.hash;
    }


    _get(key){
        let _id = this._getID(key);
        if(_id===null) return null;
        return this._collection[key];
    }

    getInstagramTags(key){
        let elmt = this._get(key);
        if(elmt===null) return [];
        return _.union(elmt.InstagramTags,[]);
    }

    setInstagramTags(key,values,reset){
        let elmt = this._get(key);
        if(elmt===null) return [];
        if(reset===true){
            elmt.InstagramTags = [];
        }
        elmt.InstagramTags = _.union(elmt.InstagramTags,values);
        return true;
    }

}

module.exports = SocialMediaDB;
