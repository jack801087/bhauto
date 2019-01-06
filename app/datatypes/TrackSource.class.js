
class TrackSource {

    constructor(datasource){
        this._datasource = datasource;
        this._title = "";
        this._artists = new SocialNode();
        this._remixers = new SocialNode();
        this._labels = new SocialNode();
        this._release = "";
        this._artworklink = "";
        this._buylinks = [];
        this._beatportlink = "";
        this._q_artists = "";
        this._q_title = "";
        this._q_labels = "";
    }


    static getClass(data_source){
        if(data_source === 'beatport_cart'){
            return Beatport_TrackSource;
        }else{
            //d$('Unknown datasource in the raw data object:',datasource);
            return null;
        }
    }


    get title(){ return this._title; }
    get artists(){ return this._artists; }
    get remixers(){ return this._remixers; }
    get labels(){ return this._labels; }
    get release(){ return this._release; }
    get artworklink(){ return this._artworklink; }
    get buylinks(){ return this._buylinks; }

    set title(v){ this._title=v; this.q_title=v; return true; }
    set artists(v){
        if(_.isArray(v)){
            this._artists.fromArray(v);
            this.q_artists=this._artists.toString();
            return true;
        }
        return false;
    }
    set remixers(v){
        if(_.isArray(v)){
            this._remixers.fromArray(v);
            this.q_remixers=this._remixers.toString();
            return true;
        }
        return false;
    }
    set labels(v){
        if(_.isArray(v)){
            this._labels.fromArray(v);
            this.q_labels=this._labels.toString();
            return true;
        }
        return false;
    }
    set release(v){ this._release=v; return true; }
    set artworklink(v){ this._artworklink=v;return true;  }
    set buylinks(v){
        if(v===null)  this._buylinks=[];
        else this._buylinks.push(v);
        return true;
    }


    fromRawData(spec_raw_json){
        //adapter
    }


    toJSON(){
        let fdjson = {};
        fdjson.datasource = this._datasource;
        fdjson.title = this.title;
        fdjson.artists = this._artists.toPlainArray();
        fdjson.remixers = this._remixers.toPlainArray();
        fdjson.labels = this._labels.toPlainArray();
        fdjson.release = this.release;
        fdjson.q_title = Utils.String.html_query_string(this.q_title);
        fdjson.artworklink = this.artworklink;
        fdjson.buylinks = this.buylinks;
        return fdjson;
    }


    toPrintableJSON(){
        let fdjson = {};
        fdjson.datasource = this._datasource;
        fdjson.title = this.title;
        fdjson.release = this.release;
        fdjson.artworklink = this.artworklink;
        fdjson.buylinks = "";
        this.buylinks.forEach((v)=>{
            fdjson.buylinks += v.label+' > '+v.url+"\r\n";
        });

        fdjson.artists_array = this._artists.toSimpleArray();
        fdjson.artists_list = fdjson.artists_array.join(', ');
        fdjson.remixers_array = this._remixers.toSimpleArray();
        fdjson.remixers_list = fdjson.remixers_array.join(', ');
        fdjson.labels_array = this._labels.toSimpleArray();
        fdjson.labels_list = fdjson.labels_array.join(', ');

        this._toPrintableJSON_instagramTags(fdjson);
        this._toPrintableJSON_facebookTags(fdjson);
        this._toPrintableJSON_hashTags(fdjson);

        return fdjson;
    }

    __toPrintableJSON_EnhanceHashtags(fdjson){

        const __addToArray = (arr,v)=>{
            v = Utils.onlyLettersNumbers(_.toLower(v));
            //arr.push(v); return;
            if(arr.indexOf(v)<0 && v.length<29) arr.push(v);
        };

        const __addToArrayCheck = (arr,v,ck,fin)=>{
            v = Utils.onlyLettersNumbers(_.toLower(v));
            fin = Utils.onlyLettersNumbers(_.toLower(fin));
            if(ck.length>4) ck=ck.substring(0,ck.length-1);
            if(Utils.String.php_stripos(v,ck)!==false) return;
            if(arr.indexOf(fin)<0 && fin.length<29) arr.push(fin);
        };

        // labels instagram_profiles to hashtags
        fdjson.ig_tags_labels_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_labels_array,v);
        });

        // labels facebook_profiles to hashtags
        fdjson.fb_tags_labels_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_labels_array,v);
        });

        // labels to hashtags
        fdjson.labels_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_labels_array,v);
            __addToArrayCheck(fdjson.hash_tags_labels_array,v,'recor',v+'records');
            //__addToArrayCheck(fdjson.hash_tags_labels_array,v,'recor',v+'recordings');
            //__addToArrayCheck(fdjson.hash_tags_labels_array,v,'label',v+'label');
        });

        // artists instagram_profiles to hashtags
        fdjson.ig_tags_artists_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_artists_array,v);
        });

        // artists facebook_profiles to hashtags
        fdjson.fb_tags_artists_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_artists_array,v);
        });

        // artists to hashtags
        fdjson.artists_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_artists_array,v);
            __addToArrayCheck(fdjson.hash_tags_artists_array,v,'musi',v+'music');
            //__addToArrayCheck(fdjson.hash_tags_artists_array,v,'dj',v+'dj');
        });

        // remixers instagram_profiles to hashtags
        fdjson.ig_tags_remixers_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_remixers_array,v);
        });

        // remixers facebook_profiles to hashtags
        fdjson.fb_tags_remixers_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_remixers_array,v);
        });

        // remixers to hashtags
        fdjson.remixers_array.forEach((v)=>{
            __addToArray(fdjson.hash_tags_remixers_array,v);
            __addToArrayCheck(fdjson.hash_tags_remixers_array,v,'musi',v+'music');
            //__addToArrayCheck(fdjson.hash_tags_remixers_array,v,'dj',v+'dj');
        });
    }

    _toPrintableJSON_instagramTags(fdjson){
        fdjson.ig_tags_artists_array = [];
        fdjson.ig_tags_remixers_array = [];
        fdjson.ig_tags_labels_array = [];

        fdjson.ig_tags_artists_array = this._artists.instagramTagsToArray();
        fdjson.ig_tags_remixers_array = this._remixers.instagramTagsToArray();
        fdjson.ig_tags_labels_array = this._labels.instagramTagsToArray();

        fdjson.ig_tags_list = "";
        fdjson.ig_tags_array = _.union(fdjson.ig_tags_artists_array,fdjson.ig_tags_remixers_array,fdjson.ig_tags_labels_array);
        fdjson.ig_tags_array.forEach((v)=>{ fdjson.ig_tags_list+='@'+v+' '; });
    }


    _toPrintableJSON_facebookTags(fdjson){
        fdjson.fb_tags_artists_array = [];
        fdjson.fb_tags_remixers_array = [];
        fdjson.fb_tags_labels_array = [];

        fdjson.fb_tags_artists_array = this._artists.facebookTagsToArray();
        fdjson.fb_tags_remixers_array = this._remixers.facebookTagsToArray();
        fdjson.fb_tags_labels_array = this._labels.facebookTagsToArray();

        fdjson.fb_tags_list = "";
        fdjson.fb_tags_array = _.union(fdjson.fb_tags_artists_array,fdjson.fb_tags_remixers_array,fdjson.fb_tags_labels_array);
        fdjson.fb_tags_array.forEach((v)=>{ fdjson.fb_tags_list+='@'+v+' '; });
    }


    __fairHashtagDistribution(fdjson){
        let maxLen = Math.max(fdjson.hash_tags_artists_array.length, fdjson.hash_tags_remixers_array.length, fdjson.hash_tags_labels_array.length);
        let htarray = [];
        for(let i=0; i<maxLen; i++){
            if(fdjson.hash_tags_labels_array.length>i) htarray.push(fdjson.hash_tags_labels_array[i]);
            if(fdjson.hash_tags_artists_array.length>i) htarray.push(fdjson.hash_tags_artists_array[i]);
            if(fdjson.hash_tags_remixers_array.length>i) htarray.push(fdjson.hash_tags_remixers_array[i]);
        }
        return htarray;
    }

    _toPrintableJSON_hashTags(fdjson){
        fdjson.hash_tags_artists_array = [];
        fdjson.hash_tags_remixers_array = [];
        fdjson.hash_tags_labels_array = [];

        fdjson.hash_tags_artists_array = this._artists.hashtagsToArray();
        fdjson.hash_tags_remixers_array = this._artists.hashtagsToArray();
        fdjson.hash_tags_labels_array = this._labels.hashtagsToArray();

        // d$('fdjson.artists_array',fdjson.artists_array);
        // d$('fdjson.labels_array',fdjson.labels_array);
        // d$('fdjson.hash_tags_artists_array',fdjson.hash_tags_artists_array);
        // d$('fdjson.hash_tags_labels_array',fdjson.hash_tags_labels_array);

        this.__toPrintableJSON_EnhanceHashtags(fdjson);

        // d$('fdjson.hash_tags_artists_array',fdjson.hash_tags_artists_array);
        // d$('fdjson.hash_tags_labels_array',fdjson.hash_tags_labels_array);
        // d$('______');
        // d$(' ');

        fdjson.hash_tags_list = "";
        fdjson.hash_tags_array = this.__fairHashtagDistribution(fdjson);
        //fdjson.hash_tags_array = _.union(fdjson.hash_tags_artists_array,fdjson.hash_tags_remixers_array,fdjson.hash_tags_labels_array);
        //fdjson.hash_tags_array.forEach((v)=>{ fdjson.hash_tags_list+='#'+v+' '; });
    }


    toEditableJSON(){
        let fdjson = {};
        fdjson.datasource = this._datasource;
        fdjson.title = this.title;
        fdjson.release = this.release;
        fdjson.artworklink = this.artworklink;
        fdjson.buylinks = this.buylinks;
        fdjson.buylinks.push({label:"", url:""});
        fdjson.buylinks.push({label:"", url:""});
        fdjson.artists = this._artists.toArrayEditable();
        fdjson.remixers = this._remixers.toArrayEditable();
        fdjson.labels = this._labels.toArrayEditable();
        return fdjson;
    }


    fromEditableJSON(fdjson){
        this._datasource = fdjson.datasource;
        this.title = fdjson.title;
        this.release = fdjson.release;
        this.artworklink = fdjson.artworklink;
        this.buylinks = null;
        fdjson.buylinks.forEach((v)=>{
            if(v.label.length<1) return;
            this.buylinks = v;
        });
        this._artists.fromArrayEditable(fdjson.artists);
        this._remixers.fromArrayEditable(fdjson.remixers);
        this._labels.fromArrayEditable(fdjson.labels);
        return true;
    }
}

module.exports = TrackSource;
