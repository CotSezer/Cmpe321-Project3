const express = require("express");
const router = express.Router();
const db = require("../db/db-utils");
const userTypes = require("../util/user-types");


// only managers can see these pages
router.use((req, res, next) => {
    if (req.session.userType != userTypes.manager) {
        res.redirect("/");
    } else {
        next();
    }
});

router.get('/manager', (req, res) => {
    res.render("manager/manager-menu");
});

router.get('/manager/add-audience', (req, res) => {
    res.render("manager/add-audience");
});

router.post('/manager/add-audience', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let surname = req.body.surname;
    await db.addAudience(username, password, name, surname);
    res.send("OK");
});

router.get('/manager/add-director', (req, res) => {
    res.render("manager/add-director");
});

router.post('/manager/add-director', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    let name = req.body.name;
    let surname = req.body.surname;
    let nation = req.body.nation;
    let platform_id = req.body.platform_id;
    await db.addDirector(username, password, name, surname, nation, platform_id);
    res.send("OK");
});

router.get('/manager/delete-audience', (req, res) => {
    res.render("manager/delete-audience");
});

router.post('/manager/delete-audience', async (req, res) => {
    let username = req.body.username;
    await db.deleteAudience(username);
});
router.get('/manager/update-director', (req, res) => {
    res.render("manager/update-director");
});

router.post('/manager/update-director', async (req, res) => {
    let username = req.body.username;
    let platform = req.body.platform;
    await db.updateDirectorPlatform(username, platform);
    res.send("OK");
});

router.get('/manager/view-directors', async (req, res) => {
    let directors = await db.getAllDirectors();
    res.render("manager/view-directors", {directors: directors});
});

router.get('/manager/view-director-movies', async (req, res) => {
    res.render("manager/view-director-movies-form");
});

router.post('/manager/view-director-movies', async (req, res) => {
    let username = req.body.director_username;
    let movies = await db.getDirectorMoviesOrderedByMovieIDFromManager(username);
    res.render("manager/view-director-movies-table", {movies: movies});
});

router.get('/manager/view-rates', async (req, res) => {
    res.render("manager/view-rates-form");
});

router.post('/manager/view-rates', async (req, res) => {
    let id = req.body.id;
    let rates = await db.getAudienceRates(id);
    res.render("manager/view-rates-table", {rates: rates});
});

router.get('/manager/view-avg-rate', async (req, res) => {
    res.render("manager/view-avg-rate-form");
});

router.post('/manager/view-avg-rate', async (req, res) => {
    let movie_id = req.body.movie_id;
    let avgMovie = await db.getMovieAverageRate(movie_id);
    res.render("manager/view-avg-rate-table", {avgMovie: avgMovie});
});


router.get('/manager/add-platform', (req, res) => {
    res.render("manager/add-platform");
});

router.post('/manager/add-platform', async (req, res) => {
    let platform_id = req.body.platform_id;
    let platform_name = req.body.platform_name;
    await db.addPlatform(platform_id, platform_name);
    res.send("OK");
});

module.exports = router;
