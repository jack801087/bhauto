
class SocialMediaDB {

    constructor(dbpath){
        this._dbpath = dbpath;
        this._collection = {};
        this._lastkey = {};
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


    _getID(key){
        if(!_.isString(key) || key.length===0) return null;
        key = _.trim(key);
        if(key === this._lastkey.key){
            return this._lastkey.hash;
        }
        this._lastkey = { key:key, hash:SHA1(key) };
        return this._lastkey.hash;
    }


    get(key){
        let _id = this._getID(key);
        if(_id===null) return null;
        return this._collection[key];
    }


    set(key, field, data, reset){
        let _id = this._getID(key);
        if(_id===null) return false;
        //reset=false default
        //tags object - merged with existent
        /*
        {
            instagram:['abc','ddd',hhh'],
            facebook:['abc','ddd',hhh']
        }
        */
        return true;
    }


    mergeArrayFields(qobj, field){
        let arrF = [];
        if(!_.isArray(qobj)) return [];
        qobj.forEach((v)=>{
            arrF = _.union(arrF,v[field]);
        });
        return arrF;
    }



}

module.exports = SocialMediaDB;
