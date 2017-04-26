import { User, Post, Album } from './models';

import './connect';

// User.find()
//   .then(console.log);

Post.findById(1)
  .populate('_creator')
  .then(console.log);

// Album.findById(1)
//   .populate('_creator')
//   .then(console.log);
