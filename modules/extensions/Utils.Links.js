
class Utils_Links {

    constructor(){
        this._regexp = {
            'url_domain':/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im
            /*  'http://abc.ggg.com/kjhsf?fdklsjd'.match(rg)
                [
                    'http://abc.ggg.com',
                    'abc.ggg.com',
                    index: 0,
                    input: 'http://abc.ggg.com/kjhsf?fdklsjd'
                ]
            */
        };
    }


    getSitename(url){
        let url_pieces = url.match(this._regexp);
        if(url_pieces.length<2) return '';
        return url_pieces[1];
    }
}

module.exports = new Utils_String();
