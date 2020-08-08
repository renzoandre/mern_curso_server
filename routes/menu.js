const express = require('express');
const MenuController = require('../controllers/menu');

const middle_auth = require('../middleware/authenticated');

const api = express.Router();

api.post('/add-menu', [middle_auth.ensureAuth], MenuController.addMenu);
api.get('/get-menu', MenuController.getMenus);
api.put('/update-menu/:id', [middle_auth.ensureAuth], MenuController.updateMenu);
api.put('/activate-menu/:id', [middle_auth.ensureAuth], MenuController.activateMenu);
api.delete('/delete-menu/:id', [middle_auth.ensureAuth], MenuController.deleteMenu);

module.exports = api;
