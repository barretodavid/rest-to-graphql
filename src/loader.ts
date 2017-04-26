import fetch from 'node-fetch';
import { connect, Document } from 'mongoose';

import { 
  IUserJPH, IPostJPH, ITodoJPH, ICommentJPH, IAlbumJPH, IPhotoJPH, 
  IUserMongo, UserModel, PostModel, AlbumModel 
} from './interfaces';

import './connect';
import { User, Post, Album } from './models';

const JPH_BASE_URL = 'https://jsonplaceholder.typicode.com';

function getEntities<T>(endpoint: string): Promise<T[]> {
  return fetch(`${JPH_BASE_URL}/${endpoint}`)
    .then(res => res.text())
    .then(jsonUsers => JSON.parse(jsonUsers));
}

function getUsers(): Promise<IUserJPH[]> {
  return getEntities('users');
}

function getTodos(): Promise<ITodoJPH[]> {
  return getEntities('todos');
}

function getPosts(): Promise<IPostJPH[]> {
  return getEntities('posts');
}

function getComments(): Promise<ICommentJPH[]> {
  return getEntities('comments');
}

function getAlbums(): Promise<IAlbumJPH[]> {
  return getEntities('albums');
}

function getPhotos(): Promise<IPhotoJPH[]> {
  return getEntities('photos');
}

function createUsersModel(users: IUserJPH[], todos: ITodoJPH[], posts: IPostJPH[], albums: IAlbumJPH[]): UserModel[] {
  return users.map(user => {
    const userTodos = todos.filter(todo => todo.userId === user.id);
    const userPosts = posts.filter(post => post.userId === user.id);
    const userAlbums = albums.filter(album => album.userId === user.id);
    return createUserModel(user, userTodos, userPosts, userAlbums);
  });
}

function createUserModel(
  user: IUserJPH, userTodos: ITodoJPH[], userPosts: IPostJPH[], userAlbums: IAlbumJPH[]
): UserModel {
  const formattedTodos = userTodos.map(todo => {
    const formattedTodo = { ...todo };
    delete formattedTodo['id'];
    delete formattedTodo['userId'];
    return formattedTodo;
  });

  const postsId = userPosts.map(post => post.id);
  const albumsId = userAlbums.map(album => album.id);

  const formattedUser = { ...user, '_id': user['id'], todos: formattedTodos, posts: postsId, albums: albumsId };
  delete formattedUser['id'];
  return <UserModel>(new User(formattedUser));
}

function createPostsModel(posts: IPostJPH[], comments: ICommentJPH[]): PostModel[] {
  return posts.map(post => {
    const postComments = comments.filter(comment => comment.postId === post.id);
    return createPostModel(post, postComments);
  });
}

function createPostModel(post: IPostJPH, postComments: ICommentJPH[]): PostModel {
  const formattedComments = postComments.map(comment => {
    const formattedComment = { ...comment };
    delete formattedComment['id'];
    delete formattedComment['postId'];
    return formattedComment;
  });
  const formattedPost = { ...post, '_id': post.id, '_creator': post.userId, comments: formattedComments };
  delete formattedPost['id'];
  delete formattedPost['userId'];
  return <PostModel>(new Post(formattedPost));
}

function createAlbumsModel(albums: IAlbumJPH[], photos: IPhotoJPH[]): AlbumModel[] {
  return albums.map(album => {
    const albumPhotos = photos.filter(photo => photo.albumId === album.id);
    return createAlbumModel(album, albumPhotos);
  });
}

function createAlbumModel(album: IAlbumJPH, albumPhotos: IPhotoJPH[]): AlbumModel {
  const formattedPhotos = albumPhotos.map(photo => {
    const formattedPhoto = { ...photo };
    delete formattedPhoto['id'];
    delete formattedPhoto['albumId'];
    return formattedPhoto;
  });
  const formattedAlbum = { ...album, '_id': album.id, '_creator': album.userId, photos: formattedPhotos };
  delete formattedAlbum['id'];
  delete formattedAlbum['userId'];
  return <AlbumModel>(new Album(formattedAlbum));
}


Promise.all([getUsers(), getTodos(), getPosts(), getComments(), getAlbums(), getPhotos()])
  .then(([ users, todos, posts, comments, albums, photos ]) => {
    const usersModel = createUsersModel(users, todos, posts, albums);
    const postsModel = createPostsModel(posts, comments);
    const albumsModel = createAlbumsModel(albums, photos);

    return Promise.all([
      User.create(usersModel),
      Post.create(postsModel),
      Album.create(albumsModel)      
    ]);
  })
  .then(() => {
    console.log('Fetching and saving completed');
    process.exit(0);
  })
  .catch(error => {
    console.log(`Opps something went wrong: ${error}`);
    process.exit(1);
  });