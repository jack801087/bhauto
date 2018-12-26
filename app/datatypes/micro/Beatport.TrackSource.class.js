
class Beatport_TrackSource extends TrackSource {

    constructor(datasource){
        super(datasource);
        this._regex_remix = /\(([^)]+\sremix)\)/gi;
    }


    fromRawData(spec_raw_json){
        /* see assets/utils_data/beatport_cart.jquery.js */
        this.filterTitle(spec_raw_json);

        this.title = spec_raw_json.title;
        this.artists = spec_raw_json.artists.split(',');
        this.labels = spec_raw_json.labels.split(',');
        this.release = spec_raw_json.release;
        this.artworklink = spec_raw_json.artworklink;
        this.buylinks = {label:'Buy', url:spec_raw_json.beatportlink};
    }


    filterTitle(spec_raw_json){
        let remix_matches = spec_raw_json.title.match(this._regex_remix);
        if(remix_matches){
            remix_matches.forEach((v)=>{
                let s_pos = Utils.String.php_stripos(v,'remix');
                if(s_pos===false) return;
                v = v.substring(1,s_pos-1);
                spec_raw_json.artists += ', '+v;
            });
        }
    }


}

module.exports = Beatport_TrackSource;
