const express = require('express');
const CourseController = require('../controllers/course');

const middle_auth = require('../middleware/authenticated');

const api = express.Router();

api.post('/add-course', [middle_auth.ensureAuth], CourseController.addCourse);
api.get('/get-courses', CourseController.getCourses);
api.delete('/delete-course/:id', [middle_auth.ensureAuth], CourseController.deleteCourse);
api.put('/update-course/:id', [middle_auth.ensureAuth], CourseController.updateCourse);

module.exports = api;
