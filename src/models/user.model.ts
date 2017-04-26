import { Schema, model } from 'mongoose';

const todoSchema = new Schema(
  {
    title: String,
    completed: Boolean
  },
  { '_id': false }
);

const userSchema = new Schema({
  _id: Number,
  name: String,
  username: String,
  email: String,
  address: {
    street: String,
    suite: String,
    city: String,
    zipcode: String,
    geo: {
      lat: String,
      lng: String
    }
  },
  phone: String,
  website: String,
  company: {
    name: String,
    catchPhrase: String,
    bs: String
  },
  todos: [todoSchema],
  posts: [{ type: Number, ref: 'Post' }],
  albums: [{ type: Number, ref: 'Album' }]
});

export const User = model('User', userSchema);