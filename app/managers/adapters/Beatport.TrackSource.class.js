const TrackSource_class = require('../TrackSource.class.js');
class Beatport_TrackSource extends TrackSource_class {

    constructor(){
        super();
    }


    fromRawData(spec_raw_json){
        /* see assets/utils_data/beatport_cart.jquery.js */

        this.title = spec_raw_json.title;
        this.artists = spec_raw_json.artists.split(',');
        this.labels = spec_raw_json.labels.split(',');
        this.release = spec_raw_json.release;
        this.artworklink = spec_raw_json.artworklink;
        this.beatportlink = spec_raw_json.beatportlink;
    }


}

module.exports = Beatport_TrackSource;
