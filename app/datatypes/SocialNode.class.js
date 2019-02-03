class _SocialNodeInfo{
    constructor(name){
        this.hash=null;
        this.name = name;
        this.instagram_tags = [];
        this.facebook_tags = [];
        this.hashtags = [];
    }

    mergeSocialMediaData(smInfoDB){
        if(!_.isObject(smInfoDB)) return;
        this.hash=smInfoDB.hash;
        this.instagram_tags = _.union(this.instagram_tags,smInfoDB.InstagramTags);
        this.facebook_tags = _.union(this.facebook_tags,smInfoDB.FacebookTags);
    }

    fromJson(v){
        this.hash = v.hash;
        if(this.hash.length<2) this.hash=null;

        if(_.isArray(v.instagram_tags)){
            v.instagram_tags.forEach((it)=>{
                it = _.trim(it);
                if(it.length<2) return;
                this.instagram_tags.push(it);
            });
        }

        if(_.isArray(v.facebook_tags)){
            v.facebook_tags.forEach((ft)=>{
                ft = _.trim(ft);
                if(ft.length<2) return;
                this.facebook_tags.push(ft);
            });
        }

        if(_.isArray(v.hashtags)){
            v.hashtags.forEach((it)=>{
                it = _.trim(it);
                if(it.length<2) return;
                this.hashtags.push(it);
            });
        }
    }

    toJson(){
        let jsonObj = {};
        jsonObj.hash = (!this.hash?'':this.hash);
        jsonObj.name = this.name;
        jsonObj.instagram_tags = _.union(this.instagram_tags,[]);
        jsonObj.facebook_tags = _.union(this.facebook_tags,[]);
        jsonObj.hashtags = _.union(this.hashtags,[]);
        return jsonObj;
    }
}



class SocialNode {

    constructor(){
        this.collection = [];
    }


    addSocialMediaDataToDB(dbObject){
        this.collection.forEach((v,i)=>{
            dbObject.setInstagramTags(v.hash,v.instagram_tags);
            dbObject.setFacebookTags(v.hash,v.facebook_tags);
            dbObject.setHashtags(v.hash,v.hashtags);
        });
    }


    // mergeSocialMediaDataFromDB(dbObject){
    //     this.collection.forEach((v)=>{
    //         v.instagram_tags = _.union(v.instagram_tags,dbObject.getInstagramTags(v.name));
    //         v.facebook_tags = _.union(v.facebook_tags,dbObject.getFacebookTags(v.name));
    //         v.hashtags = _.union(v.hashtags,dbObject.getHashtags(v.name));
    //     });
    // }


    fromArray(a){
        this.collection = [];
        a.forEach((v)=>{
            v=_.trim(v);
            if(v.length<2) return;
            this.collection.push(new _SocialNodeInfo(v));
        });
        return this;
    }

    fromArrayEditable(dt){
        this.collection = [];
        dt.forEach((v)=>{
            let _snObj = new _SocialNodeInfo(v.name);
            _snObj.fromJson(v);
            this.collection.push(_snObj);
        });
    }


    toArray(){
        let final = [];
        this.collection.forEach((snObj)=>{
            final.push(snObj.toJson());
        });
        return final;
    }


    toArrayEditable(){
        let final = [];
        this.collection.forEach((snObj)=>{
            let _snObj = snObj.toJson();
            _snObj.instagram_tags.push("");
            _snObj.facebook_tags.push("");
            _snObj.hashtags.push("");

            final.push(_snObj);
        });
        return final;
    }


    toPlainArray(){
        let final = [];
        this.collection.forEach((snObj)=>{
            let _snObj = snObj.toJson();
            // _snObj.instagram_tags.push("");
            // _snObj.facebook_tags.push("");
            _snObj.q_name_plus = Utils.String.html_query_string(_snObj.name,'+');
            _snObj.q_name_space = Utils.String.html_query_string(_snObj.name,' ');

            final.push(_snObj);
        });
        return final;
    }


    fromString(string,sep){
        return this.fromArray(string.split(sep));
    }

    toSimpleArray(){
        let names = [];
        this.collection.forEach((cobj)=>{
            names.push(cobj.name);
        });
        return names;
    }

    toString(join_str){
        let names = [];
        this.collection.forEach((cobj)=>{
            names.push(cobj.name);
        });
        if(!_.isString(join_str)) join_str=', ';
        return names.join(join_str);
    }


    instagramTagsToArray(){
        let array = [];
        this.collection.forEach((cobj)=>{
            cobj.instagram_tags.forEach((v)=>{
                array.push({
                    name:cobj.name,
                    tag:v
                });
            });
        });
        return array;
    }

    facebookTagsToArray(){
        let array = [];
        this.collection.forEach((cobj)=>{
            cobj.facebook_tags.forEach((v)=>{
                array.push({
                    name:cobj.name,
                    tag:v
                });
            });
        });
        return array;
    }

    hashtagsToArray(){
        let names = [];
        this.collection.forEach((cobj)=>{
            cobj.hashtags.forEach((v)=>{
                names.push(v);
            });
        });
        return names;
    }


    instagramTagsToString(join_str){
        let names = [];
        if(!_.isString(join_str)) join_str=', ';
        this.collection.forEach((cobj)=>{
            cobj.instagram_tags.forEach((v)=>{
                names.push('@'+v);
            });
        });
        return names.join(join_str);
    }


    facebookTagsToString(join_str){
        let names = [];
        if(!_.isString(join_str)) join_str=', ';
        this.collection.forEach((cobj)=>{
            cobj.facebook_tags.forEach((v)=>{
                names.push('@'+v);
            });
        });
        return names.join(join_str);
    }

    hashtagsToString(join_str){
        let names = [];
        if(!_.isString(join_str)) join_str=', ';
        this.collection.forEach((cobj)=>{
            cobj.hashtags.forEach((v)=>{
                names.push('#'+v);
            });
        });
        return names.join(join_str);
    }

}

module.exports = SocialNode;
