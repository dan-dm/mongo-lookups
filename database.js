import {MongoClient} from 'mongodb';
import config from './config.js';

class MongoManager {
    constructor(config) {
        this.url = config.url;
        this._connect(config.db);
    }

    async _connect(db) {
        try {
            this.client = new MongoClient(this.url, {useNewUrlParser: true});
            this.client.connect();
            this.db = this.client.db(db);
        } catch (error) {
          throw error;  
        }
    }
    async close() {
        this.client.close();
    }
}

export default new MongoManager(config);