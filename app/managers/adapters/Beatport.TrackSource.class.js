const TrackSource_class = require('../TrackSource.class.js');
class Beatport_TrackSource extends TrackSource_class {

    constructor(){
        super();
    }


    fromRawData(spec_raw_json){
        /* see assets/utils_data/beatport_cart.jquery.js */

        this.title = spec_raw_json.title;
        this.artist = this._splitMultipleArtists(spec_raw_json.artist);
        this.label = this._splitMultipleLabels(spec_raw_json.label);
        this.release = spec_raw_json.release;
        this.artist_instagram_tags = [];
        this.label_instagram_tags = [];
        this.artworklink = spec_raw_json.artworklink;
        this.beatportlink = spec_raw_json.beatportlink;
    }

    _splitMultipleArtists(str){
        let arr = str.split(',');
        let final=[];
        arr.forEach((v)=>{
            v=_.trim(v);
            final.push(super.newArtistObj(v));
        });
        return final;
    }

    _splitMultipleLabels(str){
        let arr = str.split(',');
        let final=[];
        arr.forEach((v)=>{
            v=_.trim(v);
            final.push(super.newLabelObj(v));
        });
        return final;
    }

}

module.exports = Beatport_TrackSource;
