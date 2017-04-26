import { Schema, model } from 'mongoose';

const commentSchema = new Schema(
  {
    name: String,
    email: String,
    body: String
  },
  { '_id': false }
);

const postSchema = new Schema({
  _id: Number,
  _creator: { type: Number, ref: 'User'},
  title: String,
  body: String,
  comments: [commentSchema]
});

export const Post = model('Post', postSchema);