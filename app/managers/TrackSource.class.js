const SocialNode_class = require('./micro/SocialNode.class.js');

class TrackSource {

    constructor(){
        this._title = "";
        this._artists = new SocialNode_class();
        this._labels = new SocialNode_class();
        this._release = "";
        this._artworklink = "";
        this._beatportlink = "";
        this._q_artists = "";
        this._q_title = "";
        this._q_labels = "";
    }


    get title(){ return this._title; }
    get artists(){ return this._artists.toString(); }
    get labels(){ return this._labels.toString(); }
    get artists_instagram_tags(){ }
    get labels_instagram_tags(){  }
    get release(){ return this._release; }
    get artworklink(){ return this._artworklink; }
    get beatportlink(){ return this._beatportlink; }

    set title(v){ this._title=v; this.q_title=v; return true; }
    set artists(v){
        if(_.isArray(v)){
            this._artists.fromArray(v);
            this.q_artists=this._artists.toString();
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
    set beatportlink(v){ this._beatportlink=v;return true;  }


    fromRawData(spec_raw_json){
        //adapter
    }


    addArtistInstagramTags(aitags){
        this._artists_instagram_tags = _.union(this._artists_instagram_tags,aitags);
    }


    addLabelInstagramTags(litags){
        this._labels_instagram_tags = _.union(this._artists_instagram_tags,litags);
    }

    toJSON(){
        let fdjson = {};
        fdjson.title = this.title;
        fdjson.artists = this._artists.toPlainArray();
        fdjson.labels = this._labels.toPlainArray();
        fdjson.release = this.release;
        fdjson.q_title = Utils.String.html_query_string(this.q_title);
        //fdjson.artists_instagram_tags = this.artists_instagram_tags.join(', ');
        //fdjson.labels_instagram_tags = this.labels_instagram_tags.join(', ');
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        return fdjson;
    }

    toEditableJSON(){
        let fdjson = {};
        fdjson.title = this.title;
        fdjson.release = this.release;
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        fdjson.artists = this._artists.toArrayEditable();
        fdjson.labels = this._labels.toArrayEditable();
        //TODO create empty string in instagram tags array
        return fdjson;
    }
}

module.exports = TrackSource;
