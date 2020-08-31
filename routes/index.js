const express = require("express");
const router = express.Router();
const {v4: uuidv4} = require("uuid");

module.exports = () => {

    router.get('/',(req, res) => {

        res.redirect(`/${uuidv4()}`); // uuidv4() esta funcion genera un id alfanumerico unico
    });

    router.get('/:room',(req, res) => {
        res.render("room",{roomId: req.params.room});
    });

    return router;
}