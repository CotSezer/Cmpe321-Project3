const express = require("express");
const router = express.Router();
const db = require("../db/db-utils");
const userTypes = require("../util/user-types");
// const addpredecessors = require("../util/add-predecessors");

// only directors can see these pages
router.use((req, res, next) => {
    if (req.session.userType != userTypes.director) {
        res.redirect("/");
    } else {
        next();
    }
});

router.get('/director', (req, res) => {
    res.render("director/director-menu");
});

router.get('/director/view-available-theatres', (req, res) => {
    res.render("director/view-available-theatres-form");
});

router.post('/director/view-available-theatres', async (req, res) => {
    let slot = req.body.slot;
    let theatres = await db.getAvailableTheatresForSlot(slot);
    res.render("director/view-available-theatres-table", {theatres: theatres});
});

router.get('/director/add-predecessor', (req, res) => {
    res.render("director/add-predecessor");
});

router.post('/director/add-predecessor', async (req, res) => {
    let predecessor = req.body.predecessor;
    let successor = req.body.successor;
    await db.addPredecessor(predecessor, successor);
    res.send("OK");
});

router.get('/director/add-movie', (req, res) => {
    res.render("director/add-movie");
});

router.post('/director/add-movie', async (req, res) => {
    let movie_id = req.body.id;
    let name = req.body.name;
    let duration = req.body.duration;
    let director_username = req.session.username;

    await db.addMovie(movie_id, name, duration, director_username);
    res.send("OK");
});

router.get('/director/add-session', (req, res) => {
    res.render("director/add-session");
});

router.post('/director/add-session', async (req, res) => {
    let movie_id = req.body.id;
    let theatre_id = req.body.theatre_id;
    let slot = req.body.slot;
    let date = req.body.date;

    await db.addSession(movie_id, theatre_id, slot, date);
    res.send("OK");
});

router.get('/director/view-movies', async (req, res) => {
    let username = req.session.username;
    let movies = await db.getDirectorMoviesOrderedByMovieID(username);
    console.log(movies);
    // await addpredecessors(movies);
    res.render("director/view-movies", {movies: movies});
});

router.get('/director/view-audiences', async (req, res) => {
    res.render("director/view-audiences-form");
});

router.post('/director/view-audiences', async (req, res) => {
    let movie_id = req.body.movie_id;
    let director_username = req.session.username;
    let error_check = await db.movieDirectorCheck(movie_id, director_username);
    if (error_check == 1) {
        return res.send("movie not found!");
    } else if (error_check == 2) {
        return res.send("This movie is given by another director!");
    }
    // erroneous cases are checked
    let audiences = await db.getAudiencesInMovie(movie_id, director_username);
    res.render("director/view-audiences-table", {audiences: audiences});
});

router.get('/director/update-movie', async (req, res) => {
    res.render("director/update-movie");
});

router.post('/director/update-movie', async (req, res) => {
    let movie_id = req.body.movie_id;
    let name = req.body.name;
    let director_username = req.session.username;
    let error_check = await db.movieDirectorCheck(movie_id, director_username);
    if (error_check == 1) {
        return res.send("movie not found!");
    } else if (error_check == 2) {
        return res.send("This movie is directed by another director!");
    }
    // erroneous cases are checked
    await db.updateMovieName(movie_id, name);
    res.redirect("/director/view-movies");
});

router.get('/director/add-theatre', (req, res) => {
    res.render("director/add-theatre");
});

router.post('/director/add-theatre', async (req, res) => {
    let theatre_id = req.body.theatre_id;
    let time_id = req.body.time_id;

    await db.addTheatre(theatre_id, time_id);
    res.send("OK");
});

router.get('/director/add-genre', (req, res) => {
    res.render("director/add-genre");
});

router.post('/director/add-genre', async (req, res) => {
    let movie_id = req.body.movie_id;
    let genre_id = req.body.genre_id;

    await db.addGenre(movie_id, genre_id);
    res.send("OK");
});

module.exports = router;
