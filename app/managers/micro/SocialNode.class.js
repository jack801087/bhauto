
class SocialNode {

    constructor(){
        this.collection = [];
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

    toArray(editCb){
        let _newObjFn = (o)=>{
            return {
                name:o.name,
                instagram_tags:o.instagram_tags
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


    fromString(string,sep){
        return this.fromArray(string.split(sep));
    }

    toString(){
        let names = [];
        this.collection.forEach((cobj)=>{
            names.push(cobj.name);
        });
        return names.join(', ');
    }

}

module.exports = SocialNode;
