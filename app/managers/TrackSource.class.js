
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
        this._artists = [];
        this._labels = [];
        this._release = "";
        this._artworklink = "";
        this._beatportlink = "";
        this._q_artists = "";
        this._q_title = "";
        this._q_labels = "";
    }


    get title(){ return this._title; }
    get artists(){ return this._artists; }
    get labels(){ return this._labels; }
    get q_title(){ return this._q_title; }
    get q_artists(){ return this._q_artists; }
    get q_labels(){ return this._q_labels; }
    get release(){ return this._release; }
    get artworklink(){ return this._artworklink; }
    get beatportlink(){ return this._beatportlink; }
    get artists_instagram_tags(){ }
    get label_instagram_tags(){  }

    set title(v){ this._title=v; this.q_title=v; return true; }
    set artists(v){ this._artists=v; this.q_artists=v; return true;  }
    set labels(v){ this._labels=v; this.q_labels=v; return true; }
    set q_title(v){ this._q_title=this._q_string(v); return true; }
    set q_artists(v){ this._q_artists=this._q_string(v); return true; }
    set q_labels(v){ this._q_labels=this._q_string(v); return true; }
    set release(v){ this._release=v; return true; }
    set artworklink(v){ this._artworklink=v;return true;  }
    set beatportlink(v){ this._beatportlink=v;return true;  }
    set artist_instagram_tags(v){ return true;  }
    set label_instagram_tags(v){ return true;  }


    fromRawData(spec_raw_json){
        //adapter
    }

    _q_string(v){
        //TODO handle special characters
        //v = Utils.onlyLettersNumbers(v);
        return v.split(' ').splice(0,2).join('+');
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
        fdjson.artists = this.artists;
        fdjson.labels = this.labels;
        fdjson.release = this.release;
        fdjson.q_title = this.q_title;
        fdjson.q_artists = this.q_artists;
        fdjson.q_labels = this.q_labels;
        fdjson.artists_instagram_tags = this.artists_instagram_tags.join(', ');
        fdjson.labels_instagram_tags = this.labels_instagram_tags.join(', ');
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        return fdjson;
    }

    toMinimalJSON(){
        let fdjson = {};
        fdjson.title = this.title;
        fdjson.artists = this.artists;
        fdjson.labels = this.labels;
        fdjson.release = this.release;
        fdjson.artists_instagram_tags = this.artists_instagram_tags.join(', ');
        fdjson.labels_instagram_tags = this.labels_instagram_tags.join(', ');
        fdjson.artworklink = this.artworklink;
        fdjson.beatportlink = this.beatportlink;
        return fdjson;
    }
}

module.exports = TrackSource;
