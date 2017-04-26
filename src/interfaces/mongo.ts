import { IUserBase, ITodoBase, IPostBase, ICommentBase, IAlbumBase, IPhotoBase } from './base';
import { Document } from 'mongoose';

export interface IUserMongo extends IUserBase {
  _id?: number;
  todos?: Array<ITodoBase>;
}

export interface IPostMongo extends IPostBase {
  _id?: number;
  _creator?: number;
  comments?: Array<ICommentBase>;
}

export interface IAlbumMongo extends IAlbumBase {
  _id?: number;
  _creator?: number;
  photos?: Array<IPhotoBase>;
}

export type UserModel = IUserMongo & Document;
export type PostModel = IPostMongo & Document;
export type AlbumModel = IAlbumMongo & Document;