
class SocialNode {

    constructor(){
        this.collection = [];
    }


    addSocialMediaDataToDB(dbObject){
        this.collection.forEach((v,i)=>{
            dbObject.setInstagramTags(v.name,v.instagram_tags);
            dbObject.setFacebookTags(v.name,v.facebook_tags);
            dbObject.setHashtags(v.name,v.hashtags);
        });
    }


    mergeSocialMediaDataFromDB(dbObject){
        this.collection.forEach((v,i)=>{
            let it_array = dbObject.getInstagramTags(v.name);
            v.instagram_tags = _.union(v.instagram_tags,dbObject.getInstagramTags(v.name));
            v.facebook_tags = _.union(v.facebook_tags,dbObject.getFacebookTags(v.name));
            v.hashtags = _.union(v.hashtags,dbObject.getHashtags(v.name));
        });
    }


    fromArray(a){
        this.collection = [];
        a.forEach((v)=>{
            v=_.trim(v);
            if(v.length<2) return;
            this.collection.push({
                name:v,
                instagram_tags:[],
                facebook_tags:[],
                hashtags:[]
            });
        });
        return this;
    }

    fromArrayEditable(dt){
        this.collection = [];
        dt.forEach((v)=>{

            let instagram_tags = [];
            v.instagram_tags.forEach((it)=>{
                it = _.trim(it);
                if(it.length<2) return;
                instagram_tags.push(it);
            });

            let facebook_tags = [];
            v.facebook_tags.forEach((ft)=>{
                ft = _.trim(ft);
                if(ft.length<2) return;
                facebook_tags.push(ft);
            });

            let hashtags = [];
            v.hashtags.forEach((it)=>{
                it = _.trim(it);
                if(it.length<2) return;
                hashtags.push(it);
            });

            this.collection.push({
                name:v.name,
                instagram_tags:instagram_tags,
                facebook_tags:facebook_tags,
                hashtags:hashtags
            });
        });
    }


    toArray(editCb){
        let _newObjFn = (o)=>{
            return {
                name:o.name,
                instagram_tags:_.union(o.instagram_tags,[]),
                facebook_tags:_.union(o.facebook_tags,[]),
                hashtags:_.union(o.hashtags,[])
            };
        };
        let newObjFn = _newObjFn;
        if(_.isFunction(editCb)){
            newObjFn = (o)=>{
                return editCb(_newObjFn(o));
            };
        }
        let final = [];
        this.collection.forEach((cobj)=>{
            final.push(newObjFn(cobj));
        });
        return final;
    }


    toArrayEditable(){
        return this.toArray((b)=>{
            b.instagram_tags.push("");
            b.facebook_tags.push("");
            //b.instagram_tags.push("");
            b.hashtags.push("");
            b.hashtags.push("");
            return b;
        });
    }


    toPlainArray(){
        let final = [];
        this.collection.forEach((cobj)=>{
            final.push({
                name:cobj.name,
                instagram_tags:cobj.instagram_tags,
                facebook_tags:cobj.facebook_tags,
                hashtags:cobj.hashtags,
                q_name_plus:Utils.String.html_query_string(cobj.name,'+'),
                q_name_space:Utils.String.html_query_string(cobj.name,' ')
            });
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
        let names = [];
        this.collection.forEach((cobj)=>{
            cobj.instagram_tags.forEach((v)=>{
                names.push(v);
            });
        });
        return names;
    }

    facebookTagsToArray(){
        let names = [];
        this.collection.forEach((cobj)=>{
            cobj.facebook_tags.forEach((v)=>{
                names.push(v);
            });
        });
        return names;
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
