const jwt = require('jsonwebtoken')
const {secret} = require('../config.js')

module.exports = function (req, res, next) {
    try {
        console.log(req.cookies)
        const token = req.cookies.jwt;
        if (!token) {
            res.redirect('/auth/login');
            return res.status(403).json({message: "Пользователь не авторизован"})
        }
        const decodedData = jwt.verify(token, secret)
        //console.log(`REQUSER:${req.user}`)
        //console.log(`REQUSER:${decodedData}`)
        //console.log(`REQUSER:${decodedData}`)
        
        req.user = decodedData
        console.log(`REQUSER:${decodedData}`)
        next()
        return token
    } catch (e) {
        console.log(e)
        res.redirect('/auth/login');
        return res.status(403).json({message: "Пользователь не авторизован"})
    }
};