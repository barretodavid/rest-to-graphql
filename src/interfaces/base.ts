export interface IUserBase {
  name?: string;
  username?: string;
  email?: string;
  address?: {
    street?: string;
    suite?: string;
    city?: string;
    zipcode?: string;
    geo?: {
      lat?: string;
      lng?: string;
    }
  };
  phone?: string;
  website?: string;
  company?: {
    name?: string;
    catchPhrase?: string;
    bs?: string;
  };
}

export interface ITodoBase {
  title?: string;
  completed?: boolean;
}

export interface IPostBase {
  title?: string;
  body?: string;
}

export interface ICommentBase {
  name?: string;
  email?: string;
  body?: string;
}

export interface IAlbumBase {
  title?: string;
}

export interface IPhotoBase {
  title?: string;
  url?: string;
  thumbnailUrl?: string;
}