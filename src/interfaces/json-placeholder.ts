import { IUserBase, ITodoBase, IPostBase, ICommentBase, IAlbumBase, IPhotoBase } from './base';

export interface IUserJPH extends IUserBase {
  id?: number;
}

export interface ITodoJPH extends ITodoBase {
  userId?: number;
  id?: number;
}

export interface IPostJPH extends IPostBase {
  userId?: number;
  id?: number;
}

export interface ICommentJPH extends ICommentBase {
  postId?: number;
  id?: number;
}

export interface IAlbumJPH extends IAlbumBase {
  userId?: number;
  id?: number;
}

export interface IPhotoJPH extends IPhotoBase {
  albumId?: number;
  id?: number;
}