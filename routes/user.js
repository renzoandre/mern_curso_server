const express = require('express');
const UserController = require('../controllers/user');
const multipart = require('connect-multiparty');

const middle_auth = require('../middleware/authenticated');
const FILE_PATH = './uploads/avatar';
const middle_upload_avatar = multipart({ uploadDir: FILE_PATH });

const api = express.Router();

api.post('/sign-up', UserController.signUp);
api.post('/sign-in', UserController.signIn);
api.get('/users', [middle_auth.ensureAuth], UserController.getUsers);
api.get('/users-actives', [middle_auth.ensureAuth], UserController.getUsersActives);
api.put('/upload-avatar/:id', [middle_auth.ensureAuth, middle_upload_avatar], UserController.uploadAvatar);
api.get('/get-avatar/:avatarName', UserController.getAvatar);
api.put('/update-user/:id', [middle_auth.ensureAuth], UserController.updateUser);
api.put('/activate-user/:id', [middle_auth.ensureAuth], UserController.activateUser);
api.delete('/delete-user/:id', [middle_auth.ensureAuth], UserController.deleteUser);
api.post('/sign-up-admin', [middle_auth.ensureAuth], UserController.signUpAdmin);

module.exports = api;
