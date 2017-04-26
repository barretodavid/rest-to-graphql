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

function createUserDocument(user: IUserJPH, userTodos: ITodoJPH[]): UserModel {
  const formattedTodos = userTodos.map(todo => {
    const formattedTodo = { ...todo };
    delete formattedTodo['id'];
    delete formattedTodo['userId'];
    return formattedTodo;
  });
  const formattedUser = { ...user, '_id': user['id'], todos: formattedTodos };
  delete formattedUser['id'];
  return <UserModel>(new User(formattedUser));
}

function createPostDocument(post: IPostJPH, postComments: ICommentJPH[]): PostModel {
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

function createAlbumDocument(album: IAlbumJPH, albumPhotos: IPhotoJPH[]): AlbumModel {
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

function getUsersModel(): Promise<UserModel[]> {
  return Promise.all([getUsers(), getTodos()])
    .then(([ users, todos ]) => {
      const usersModel = users.map(user => {
        const userTodos = todos.filter(todo => todo.userId === user.id);
        return createUserDocument(user, userTodos);
      });
      return usersModel;
    });
}

function getPostsModel(): Promise<PostModel[]> {
  return Promise.all([getPosts(), getComments()])
    .then(([ posts, comments ]) => {
      const postsModel = posts.map(post => {
        const postComments = comments.filter(comment => comment.postId === post.id);
        return createPostDocument(post, postComments);
      });
      return postsModel;
    });
}

function getAlbumsModel(): Promise<AlbumModel[]> {
  return Promise.all([getAlbums(), getPhotos()])
    .then(([ albums, photos ]) => {
      const albumsModel = albums.map(album => {
        const albumPhotos = photos.filter(photo => photo.albumId === album.id);
        return createAlbumDocument(album, albumPhotos);
      });
      return albumsModel;
    });
}

function fetchAndSaveUsers(): Promise<UserModel[]> {
  return getUsersModel()
    .then(users => User.create(users));
}

function fetchAndSavePosts(): Promise<PostModel[]> {
  return getPostsModel()
    .then(posts => Post.create(posts));
}

function fetchAndSaveAlbums(): Promise<AlbumModel[]> {
  return getAlbumsModel()
    .then(albums => Album.create(albums));
}

Promise.all([ User.remove({}), Post.remove({}), Album.remove({})])
  .then(() => {
    return Promise.all([fetchAndSaveUsers(), fetchAndSavePosts(), fetchAndSaveAlbums()]);
  })
  .then(() => {
    console.log('Fetching and saving completed');
    process.exit(0);
  });