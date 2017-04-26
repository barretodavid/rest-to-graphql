import { buildSchema } from 'graphql';
import * as Koa from 'koa';
import * as mount from 'koa-mount';
import * as convert from 'koa-convert';
import * as graphqlHTTP from 'koa-graphql';

import './connect';
import { User, Post, Album } from './models';
import { UserModel, PostModel, AlbumModel } from './interfaces';

const HTTP_PORT = 3000;
const app = new Koa();

const mySchema = buildSchema(`
  type Geo {
    lat: String
    lng: String
  }

  type Address {
    street: String
    suite: String
    city: String
    zipcode: String
    geo: Geo
  }
  
  type Company {
    name: String
    catchPhrase: String
    bs: String
  }

  type Todo {
    title: String
    completed: Boolean
  }

  type Comment {
    name: String
    email: String
    body: String
  }

  type Post {
    _id: Int
    _creator: User
    title: String
    body: String
    comments: [Comment]
  }

  type Photo {
    title: String
    url: String
    thumbnailUrl: String
  }

  type Album {
    _id: Int
    _creator: User
    title: String
    photos: [Photo]
  }
  
  type User {
    _id: Int!
    name: String
    username: String
    email: String
    phone: String
    website: String
    company: Company
    address: Address
    todos: [Todo]
    posts: [Post]
    albums: [Album]
  } 

  type Query {
    users(_id: Int): [User]
    todos(_id: Int): [Todo]
    posts: [Post]
    comments: [Comment]
    albums: [Album]
    photos: [Photo]
  }
`);

const root = {
  users: (args) => User.find(args).populate('posts albums'),
  todos: (args) => {
    return User.find({}, {_id: 0, todos: 1})
      .then((users: UserModel[]) => {
        return users.reduce((todos, user) => {
          return [...todos, ...user.todos];
        }, []);
      });
  },
  posts: () => Post.find().populate('_creator'),
  comments: () => {
    return Post.find({}, {_id: 0, comments: 1})
      .then((posts: PostModel[]) => {
        return posts.reduce((comments, post) => {
          return [...comments, ...post.comments];
        }, []);
      });
  },
  albums: () => Album.find().populate('_creator'),
  photos: () => {
    return Album.find({}, {_id: 0, photos: 1})
      .then((albums: AlbumModel[]) => {
        return albums.reduce((photos, album) => {
          return [...photos, ...album.photos];
        }, []);
      });
  }
};

app.use(mount('/graphql', convert(graphqlHTTP({
  schema: mySchema,
  rootValue: root,
  graphiql: true
}))));

app.listen(HTTP_PORT, () => console.log(`Running in port ${HTTP_PORT}`));