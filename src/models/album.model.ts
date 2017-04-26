import { Schema, model } from 'mongoose';

const photoSchema = new Schema(
  {
    title: String,
    url: String,
    thumbnailUrl: String
  },
  { '_id': false }
);

const albumSchema = new Schema({
  _id: Number,
  _creator: { type: Number, ref: 'User'},
  title: String,
  photos: [photoSchema]
});

export const Album = model('Album', albumSchema);