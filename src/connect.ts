import * as mongoose from 'mongoose';

(<any>mongoose).Promise = global.Promise;

const DB_URL = 'mongodb://localhost/json-placeholder';
mongoose.connect(DB_URL);