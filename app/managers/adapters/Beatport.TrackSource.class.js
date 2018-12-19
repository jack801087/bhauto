const TrackSource_class = require('../TrackSource.class.js');
class Beatport_TrackSource extends TrackSource_class {

    constructor(){
        super();
    }


    fromRawData(spec_raw_json){
        /* see assets/utils_data/beatport_cart.jquery.js */

        this.title = spec_raw_json.title;
        this.artist = spec_raw_json.artist;
        this.label = spec_raw_json.artist;
        this.release = spec_raw_json.release;
        this.artist_instagram_tags = [];
        this.label_instagram_tags = [];
        this.artworklink = spec_raw_json.artworklink;
        this.beatportlink = spec_raw_json.beatportlink;
    }

}

module.exports = Beatport_TrackSource;
