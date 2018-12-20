
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

    toArray(){
        let final = [];
        this.collection.forEach((cobj)=>{
            final.push({
                name:cobj.name,
                instagram_tags:cobj.instagram_tags
            });
        });
        return final;
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
