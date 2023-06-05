const express = require("express");
const router = express.Router();
const db = require("../db/db-utils");
const userTypes = require("../util/user-types");

// logged in users cannot see login pages
router.use((req, res, next) => {
    if (req.session.userType != undefined) {
        res.redirect("/");
    } else {
        next();
    }
});

router.get('/login', (req, res) => {
    res.render("login/login-selection");
});

router.get('/login/manager', (req, res) => {
    res.render("login/login-manager");
});

router.post('/login/manager', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let exists = await db.dbManagerExists(username);
    if (!exists) {
        return res.send("wrong username");
    }

    let correctPass = await db.dbManagerPassCorrect(username, password);
    if (correctPass) {
        // manager logged in
        req.session.userType = userTypes.manager;
        req.session.username = username;
        res.redirect("/manager");
    } else {
        res.send("wrong password");
    }
});

router.get('/login/director', (req, res) => {
    res.render("login/login-director");
});

router.post('/login/director', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let exists = await db.dbDirectorExists(username);
    if (!exists) {
        return res.send("wrong username");
    }
    let correctPass = await db.dbDirectorPassCorrect(username, password);
    if (correctPass) {
        // director logged in
        req.session.userType = userTypes.director;
        req.session.username = username;
        res.redirect("/director");
    } else {
        res.send("wrong password");
    }
});


router.get('/login/audience', (req, res) => {
    res.render("login/login-audience");
});

router.post('/login/audience', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let exists = await db.dbAudienceExists(username);

    if (!exists) {
        return res.send("wrong username");
    }
    let correctPass = await db.dbAudiencePassCorrect(username, password);
    if (correctPass) {
        // audience logged in
        req.session.userType = userTypes.audience;
        req.session.username = username;
        res.redirect("/audience");
    } else {
        res.send("wrong password");
    }
});

module.exports = router;
