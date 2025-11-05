import _fetch from 'node-fetch';


class main 
{

    private db_url: string;

    constructor() {
        this.db_url = "https://db.silvernote.fr";  
    }


    private async fetch
    (path: string, parms: any)
    {
        return await _fetch(this.db_url + path, {
            ...parms,
            Headers: {
                "Authorisation": "key 1",
                "X-api-key": "key 2"
            }
        })
    }

    private async archiveDB
    ()
    {
        
    }


}


new main();