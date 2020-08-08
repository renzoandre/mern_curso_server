const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('../services/jwt');
const fs = require('fs');
const path = require('path');
const { exists } = require('../models/user');
const user = require('../models/user');

const saltRounds = 10;
const FILE_PATH = './uploads/avatar';

function signUp(req, res) {
    const user = new User();

    const { name, lastname, email, password, passwordRepeat } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = 'admin';
    user.active = false;

    if (!password || !passwordRepeat) {
        res.status(404).send({ message: 'Las contraseñas son obligatorias' });
    } else {
        if (password !== passwordRepeat) {
            res.status(404).send({ message: 'Las contraseñas no son iguales' });
        } else {
            bcrypt.hash(password, saltRounds, function (err, hash) {
                if (err) {
                    res.status(500).send({ message: 'Error al encriptar contraseña' });
                } else {
                    user.password = hash;
                    user.save((err, userStored) => {
                        if (err) {
                            res.status(500).send({ message: 'El usuario ya existe' });
                        } else {
                            if (!userStored) {
                                res.status(404).send({ message: 'Error al crear el usuario' });
                            } else {
                                res.status(200).send({ user: userStored });
                            }
                        }
                    });
                }
            });
        }
    }
}

function signIn(req, res) {
    const params = req.body;
    const email = params.email.toLowerCase();
    const password = params.password;

    User.findOne({ email: email }, (err, userStored) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor' });
        } else {
            if (!userStored) {
                res.status(404).send({ message: 'Usuario no encontrado' });
            } else {
                bcrypt.compare(password, userStored.password, (err, check) => {
                    if (err) {
                        res.status(500).send({ message: 'Error del servidor' });
                    } else if (!check) {
                        res.status(404).send({ message: 'La contraseña es incorrecta' });
                    } else {
                        if (!userStored.active) {
                            res.status(200).send({ message: 'El usuario no está activo' });
                        } else {
                            res.status(200).send({
                                accessToken: jwt.createAccesToken(userStored),
                                refreshToken: jwt.createRefreshToken(userStored),
                            });
                        }
                    }
                });
            }
        }
    });
}

function getUsers(req, res) {
    User.find().then((users) => {
        if (!users) {
            res.status(404).send({ message: 'No se ha encontrado ningun usuario' });
        } else {
            res.status(200).send({ users });
        }
    });
}

function getUsersActives(req, res) {
    const query = req.query;

    User.find({ active: query.active }).then((users) => {
        if (!users) {
            res.status(404).send({ message: 'No se ha encontrado ningun usuario' });
        } else {
            res.status(200).send({ users });
        }
    });
}

function uploadAvatar(req, res) {
    const params = req.params;

    User.findById({ _id: params.id }, (err, userData) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor' });
        } else {
            if (!userData) {
                res.status(404).send({ message: 'No se ha encontrado ningun usuario' });
            } else {
                let user = userData;

                if (req.files) {
                    let filePath = req.files.avatar.path.split('\\').join('/');
                    let fileSplit = filePath.split('/');
                    let fileName = fileSplit[2];

                    let extSplit = fileName.split('.');
                    let fileExt = extSplit[1];

                    if (fileExt !== 'png' && fileExt !== 'jpg') {
                        res.status(400).send({ message: 'La extesion no es valida. Solo png o jpg' });
                    } else {
                        user.avatar = fileName;
                        User.findOneAndUpdate({ _id: params.id }, user, (err, userData) => {
                            if (err) {
                                res.status(500).send({ message: 'Error del servidor' });
                            } else {
                                if (!userData) {
                                    res.status(404).send({ message: 'No se ha encontrado el usuario' });
                                } else {
                                    res.status(200).send({ avatarName: fileName });
                                }
                            }
                        });
                    }
                }
            }
        }
    });
}

function getAvatar(req, res) {
    const avatarName = req.params.avatarName;
    const filePath = FILE_PATH + '/' + avatarName;

    fs.exists(filePath, (exists) => {
        if (!exists) {
            res.status(404).send({ message: 'EL avatar no existe' });
        } else {
            res.sendFile(path.resolve(filePath));
        }
    });
}

function updateUser(req, res) {
    let userData = req.body;
    userData.email = req.body.email.toLowerCase();
    const params = req.params;

    console.log(userData.password);

    if (userData.password) {
        bcrypt.hash(userData.password, saltRounds, function (err, hash) {
            if (err) {
                res.status(500).send({ message: 'Error al encriptar contrasea' });
            } else {
                userData.password = hash;

                User.findOneAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
                    if (err) {
                        res.status(500).send({ message: 'Error del servidor' });
                    } else {
                        if (!userUpdate) {
                            res.status(404).send({ message: 'No se ha encontrado usuario' });
                        } else {
                            res.status(200).send({ message: 'Usuario actualizado correctamente' });
                        }
                    }
                });
            }
        });
    } else {
        User.findOneAndUpdate({ _id: params.id }, userData, (err, userUpdate) => {
            if (err) {
                res.status(500).send({ message: 'Error del servidor' });
            } else {
                if (!userUpdate) {
                    res.status(404).send({ message: 'No se ha encontrado usuario' });
                } else {
                    res.status(200).send({ message: 'Usuario actualizado correctamente' });
                }
            }
        });
    }
}

function activateUser(req, res) {
    const { id } = req.params;
    const { active } = req.body;

    User.findOneAndUpdate({ _id: id }, { active }, (err, userUpdate) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor' });
        } else {
            if (!userUpdate) {
                res.status(404).send({ message: 'No se ha encontrado el usuario' });
            } else {
                if (active === true) {
                    res.status(200).send({ message: 'Usuario activado correctamente' });
                } else {
                    res.status(200).send({ message: 'Usuario desactivado correctamente' });
                }
            }
        }
    });
}

function deleteUser(req, res) {
    const { id } = req.params;

    User.findOneAndDelete({ _id: id }, (err, userDeleted) => {
        if (err) {
            res.status(500).send({ message: 'Error del servidor' });
        } else {
            if (!userDeleted) {
                res.status(404).send({ message: 'Usuario no encontrado' });
            } else {
                res.status(200).send({ message: 'Usuario eliminado correctamente' });
            }
        }
    });
}

function signUpAdmin(req, res) {
    const user = new User();

    const { name, lastname, email, role, password } = req.body;
    user.name = name;
    user.lastname = lastname;
    user.email = email.toLowerCase();
    user.role = role;
    user.active = true;

    if (!password) {
        res.status(500).send({ message: 'La contraseña es obligatoria' });
    } else {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                res.status(500).send({ message: 'Error al encriptar la contraseña' });
            } else {
                user.password = hash;
                user.save((err, userStored) => {
                    if (err) {
                        res.status(500).send({ message: 'El usuario ya existe' });
                    } else {
                        if (!userStored) {
                            res.status(500).send({ message: 'Error al crear el nuevo usuario' });
                        } else {
                            res.status(200).send({ message: 'Usuario creado correctamente' });
                        }
                    }
                });
            }
        });
    }
}

module.exports = {
    signUp,
    signIn,
    getUsers,
    getUsersActives,
    uploadAvatar,
    getAvatar,
    updateUser,
    activateUser,
    deleteUser,
    signUpAdmin,
};
