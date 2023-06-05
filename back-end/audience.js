const express = require("express");
const router = express.Router();
const db = require("../db/db-utils");
const userTypes = require("../util/user-types");
const compareDates = require("../util/date-comparison");
const { audienceBoughtTicket } = require("../db/db-utils");
const { audienceCheckTicket } = require("../db/db-utils");

// only audiences can see these pages
router.use((req, res, next) => {
    if (req.session.userType != userTypes.audience) {
        res.redirect("/");
    } else {
        next();
    }
});

router.get('/audience', (req, res) => {
    res.render("audience/audience-menu");
});

router.get('/audience/list-movies', async (req, res) => {
    let movies = await db.getAllMovies();
    //await addPrerequisites(movies);
    res.render("audience/list-movies", {movies: movies});
});

router.get('/audience/buy-ticket', (req, res) => {
    res.render("audience/buy-ticket");
});

async function hasWatched(ticketSession, currentTimeID) {
    for (let session of ticketSession) {
        // if date passed return true

        let dateID = await db.getSessionDateID(session["session_id"]);
        console.log("DateID = ?", dateID);
        console.log("CurrentID = ?", currentTimeID);

        if (dateID[0]["time_id"] < currentTimeID[0]["time_id"]) {
            return true;
        }



    }
    return false;
}

async function hasUnwatchedPredecessors(predecessors, username, currentTimeID) {
    for (let pred of predecessors) {
        let ticketSession = await db.getMovieTicketSession(username, pred["predecessor_id"]);
        console.log(ticketSession);
        let watched = await hasWatched(ticketSession, currentTimeID);
        if (!watched) {
            return true;
        }

    }
    return false;
}

router.post('/audience/buy-ticket', async (req, res) => {
    let id = req.body.session_id;
    let username = req.session.username;
    let bought = await db.audienceBoughtTicket(username, id);
    if (bought) {
        return res.send("audience has bought this ticket!");
    }
    // check predecessors
    let pre = await db.getPredecessors(id);

    let currentTimeID = await db.getSessionDateID(id);

    let checkUncwatched = await hasUnwatchedPredecessors(pre, username, currentTimeID);
    
    if (checkUncwatched) {
        return res.send("You need to take predecessor tickets first!");
    }

    let theatre_capacity = await db.getTheatreCapacityBySession(id);
    let nofTickets = await db.getTicketCountBySession(id);
    if (nofTickets >= theatre_capacity) {
        return res.send('theatre full');
    }
    await db.buyTicket(username, id);
    res.redirect("/audience/view-tickets");
});

router.get('/audience/view-tickets', async (req, res) => {
    let username = req.session.username;
    let tickets = await db.getAudienceTickets(username);
    res.render("audience/view-tickets", {tickets: tickets});
});

router.get('/audience/rate-movie', async (req, res) => {
    res.render("audience/rate-movie-form");
});

router.post('/audience/rate-movie', async (req, res) => {
    let username = req.session.username;
    let movie_id = req.body.movie_id;
    let rating = req.body.rating;
    let check = await audienceCheckTicket(username, movie_id);
    if (check) {
        try {
            await db.addRating(username, movie_id, rating);
            res.redirect("/audience/view-tickets");
        } catch (error){
            res.send("YOU CANNOT GIVE A RATE AGAIN");
        }
    } else {
        res.send("YOU CANNOT GIVE A RATE THIS MOVIE");
    }
});

module.exports = router;
