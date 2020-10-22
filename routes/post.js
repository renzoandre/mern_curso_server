const express = require('express');
const PostController = require('../controllers/post');

const middle_auth = require('../middleware/authenticated');

const api = express.Router();

api.post('/add-post', [middle_auth.ensureAuth], PostController.addPost);
api.get('/get-posts', PostController.getPosts);
api.put('/update-post/:id', [middle_auth.ensureAuth], PostController.updatePost);
api.delete('/delete-post/:id', [middle_auth.ensureAuth], PostController.deletePost);
api.get('/get-post/:url', PostController.getPost);

module.exports = api;
