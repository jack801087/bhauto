
class SocialNode {

    constructor(){
        this.collection = [];
    }


    addSocialMediaDataToDB(dbObject){
        this.collection.forEach((v,i)=>{
            dbObject.setInstagramTags(v.name,v.instagram_tags);
        });
    }


    mergeSocialMediaDataFromDB(dbObject){
        this.collection.forEach((v,i)=>{
            let it_array = dbObject.getInstagramTags(v.name);
            v.instagram_tags = _.union(v.instagram_tags,it_array);
        });
    }


    fromArray(a){
        this.collection = [];
        a.forEach((v)=>{
            v=_.trim(v);
            this.collection.push({
                name:v,
                instagram_tags:[]
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
            this.collection.push({
                name:v.name,
                instagram_tags:instagram_tags
            });
        });
    }


    toArray(editCb){
        let _newObjFn = (o)=>{
            return {
                name:o.name,
                instagram_tags:_.union(o.instagram_tags,[])
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
            b.instagram_tags.push("");
            return b;
        });
    }


    toPlainArray(){
        let final = [];
        this.collection.forEach((cobj)=>{
            final.push({
                name:cobj.name,
                instagram_tags:cobj.instagram_tags,
                q_name:Utils.String.html_query_string(cobj.name)
            });
        });
        return final;
    }


    fromString(string,sep){
        return this.fromArray(string.split(sep));
    }

    toString(join_str){
        let names = [];
        this.collection.forEach((cobj)=>{
            names.push(cobj.name);
        });
        if(!_.isString(join_str)) join_str=', ';
        return names.join(join_str);
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

}

module.exports = SocialNode;
