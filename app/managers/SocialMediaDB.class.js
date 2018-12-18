
class SocialMediaDB {

    constructor(dbpath){
        // set DataHolder
        /*
        db = {
            prop1:""
            _09:{
                array:[
                    {
                        name:"abc",
                        hash:"a3h2hk5g32kh5g2kbc",
                        inst_tags:[],
                        fb_tags:[]
                    }
                ]
            }
        }
        */
    }

    _gethash(key){
        /*
        NOT NEEDED FOR NOW
        var sha1 = require('sha1');
        var hash = sha1("my message");
        console.log(hash); // 104ab42f1193c336aa2cf08a2c946d5c6fd0fcdb

        var md5 = require('md5');
        var hash = md5("my message");
        console.log(hash); // 8ba6c19dc1def5702ff5acbf2aeea5aa
        */
    }

    get(key){
        // return array of objects
        /*
        [
            {
                key:'abc def gfh',
                instagram:['abc','ddd',hhh'],
                facebook:['abc','ddd',hhh']
            }
        ]
        */
    }

    set(key,tags,reset){
        //reset=false default
        //tags object - merged with existent
        /*
        {
            instagram:['abc','ddd',hhh'],
            facebook:['abc','ddd',hhh']
        }
        */
    }



}

module.exports = new SocialMediaDB();
