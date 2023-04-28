const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { validationResult } = require('express-validator')
const {secret} = require("../config.js")
const db =require('../db/controller.js')

//import {createPath} from './server.js'

//const createPath = require('../server.js');

const createPath = (page) => path.resolve('./templates', `${page}.ejs`);

const generateAccessToken = (id, username) => {
    const payload = {
        id
    }
    return jwt.sign(payload, secret, {expiresIn: "2h"} )
}

class authController {
    async registrationPost(req, res) {
        try {
            //console.log('registrationPOST');
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({message: "Ошибка при регистрации", errors})
            }
            const {username, password} = req.body;

            let user = await db.dbGetByUsername(username);

            if(user.length !== 0){
                console.log('ERROR:Username already registred');
                return res.status(400).json({message: "Пользователь с таким именем уже существует"})
            }


            const hashPassword = bcrypt.hashSync(password, 8);

            db.dbAddUser(username,hashPassword)
            //res.redirect('/');
            return res.json({message: "Пользователь успешно зарегистрирован"})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async loginPost(req, res) {
        try {
            const {username, password} = req.body

            let users = await db.dbGetByUsername(username);
            let user=users[0];
            console.log(user)
            console.log(`User Password:${user}`)

            if(user.length === 0){
                return res.status(400).json({message: `Пользователь ${username} не найден`})
            }

            // if (!user) {
            //     return res.status(400).json({message: `Пользователь ${username} не найден`})
            // }

            const validPassword = bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: `Введен неверный пароль`})
            }
            console.log(`USER:${user.id}`)
            const token = generateAccessToken(user.id, user.username)
            res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
            console.log(`Пользователь ${username} получил токен`)
            //res.redirect('/notes');
            //res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
            //res.json({token})
            // res.on('finish',()=>{
            //     if (res.headersSent) {
            //     res.redirect('/')
            //     }
            // })
            // res.on('finish', () => {
            //     if (!res.headersSent) {
            //       // if the headers haven't been sent yet
            //       res.setHeader('Location', '/');
            //       res.statusCode = 302;
            //       res.end();
            //     }
            //   });
            return res.json({token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    

    registrationGet = (req, res) => {
        res.render(createPath('signup'));
    }

    loginGet = (req, res) => {
        res.render(createPath('login'));
    }

    logoutGet = (req, res) => {
        res.cookie('jwt', '', { maxAge: 1 });
        res.redirect('/notes');
      }

    // async getUsers(req, res) {
    //     try {
    //         const users = await User.find()
    //         res.json(users)
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
}

// controller actions
// module.exports.registrationGet = (req, res) => {
//     res.render('signup');
//   }
  
//   module.exports.loginGet = (req, res) => {
//     res.render('login');
//   }

module.exports = new authController()