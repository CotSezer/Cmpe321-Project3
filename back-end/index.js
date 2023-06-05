const express = require("express");
const router = express.Router();
const userTypes = require("../util/user-types");

router.get('/', (req, res) => {
    if (req.session.userType == userTypes.manager) {
        res.redirect("/manager");
    } else if (req.session.userType == userTypes.director) {
        res.redirect("/director");
    } else if (req.session.userType == userTypes.audience){
        res.redirect("/audience");
    } else {
        res.redirect("/login");
    }
});

router.get('/logout', (req, res) => {
    delete req.session.userType;
    delete req.session.username;
    res.redirect("/login");
});

const login = require("./login");
router.get("/login*", login);
router.post("/login*", login);

const manager = require("./manager");
router.get("/manager*", manager);
router.post("/manager*", manager);

const director = require("./director");
router.get("/director*", director);
router.post("/director*", director);

const audience = require("./audience");
router.get("/audience*", audience);
router.post("/audience*", audience);

module.exports = router;
