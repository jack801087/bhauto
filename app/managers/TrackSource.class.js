
class TrackSource {

    /*
    * "artworklink": "https://geo-media.beatport.com/image_size/350x350/8e4452cb-5f60-46e9-8ef3-c455c8a505bf.jpg",
      "beatportlink": "https://www.beatport.com/track/killing-delirium-original-mix/11302752",
      "title": "Killing Delirium (Original Mix)",
      "artist": "Yinn",
      "label": "Mephyst",
      "release": "2018-12-10"*/

    constructor(){
        this._title = "";
        this._artist = "";
        this._label = "";
        this._release = ""; /*date*/
        this._artist_instagram_tags = [];
        this._label_instagram_tags = [];
        this._artworklink = "";
        this._beatportlink = "";
        this._q_artist = "";
        this._q_title = "";
        this._q_label = "";
    }


    get title(){ return this._title; }
    get artist(){ return this._artist; }
    get label(){ return this._label; }
    get q_title(){ return this._q_title; }
    get q_artist(){ return this._q_artist; }
    get q_label(){ return this._q_label; }
    get release(){ return this._release; }
    get artworklink(){ return this._artworklink; }
    get beatportlink(){ return this._beatportlink; }
    get artist_instagram_tags(){ return this._artist_instagram_tags; }
    get label_instagram_tags(){ return this._label_instagram_tags; }

    set title(v){ this._title=v; this.q_title=v; return true; }
    set artist(v){ this._artist=v; this.q_artist=v; return true;  }
    set label(v){ this._label=v; this.q_label=v; return true; }
    set q_title(v){ this._q_title=this._q_string(v); return true; }
    set q_artist(v){ this._q_artist=this._q_string(v); return true; }
    set q_label(v){ this._q_label=this._q_string(v); return true; }
    set release(v){ this._release=v; return true; }
    set artworklink(v){ this._artworklink=v;return true;  }
    set beatportlink(v){ this._beatportlink=v;return true;  }
    set artist_instagram_tags(v){ this._artist_instagram_tags=v;return true;  }
    set label_instagram_tags(v){ this._label_instagram_tags=v;return true;  }


    fromRawData(spec_raw_json){
        //adapter
    }

    _q_string(v){
        //TODO handle special characters
        //v = Utils.onlyLettersNumbers(v);
        return v.split(' ').splice(0,2).join('+');
    }


    addArtistInstagramTags(aitags){
        this._artist_instagram_tags = _.union(this._artist_instagram_tags,aitags);
    }


    addLabelInstagramTags(litags){
        this._label_instagram_tags = _.union(this._artist_instagram_tags,litags);
    }

    toJSON(){
        let fdjson = {};
        fdjson.title = this.title;
        fdjson.artist = this.artist;
        fdjson.label = this.label;
        fdjson.release = this.release;
        fdjson.q_title = this.q_title;
        fdjson.q_artist = this.q_artist;
        fdjson.q_label = this.q_label;
        fdjson.artist_instagram_tags = this.artist_instagram_tags.join(', ');
        fdjson.label_instagram_tags = this.label_instagram_tags.join(', ');
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        return fdjson;
    }

    toMinimalJSON(){
        let fdjson = {};
        fdjson.title = this.title;
        fdjson.artist = this.artist;
        fdjson.label = this.label;
        fdjson.release = this.release;
        fdjson.artist_instagram_tags = this.artist_instagram_tags.join(', ');
        fdjson.label_instagram_tags = this.label_instagram_tags.join(', ');
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        return fdjson;
    }
}

module.exports = TrackSource;
