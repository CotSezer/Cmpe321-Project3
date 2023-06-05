const express = require('express');
const session = require('express-session');
require('express-async-errors'); // for handling all promise rejects

const app = express();
const port = 80;

app.set("view engine", "ejs");

// for taking form data
app.use(express.urlencoded({
    extended: false
}));

// for storing login sessions
app.use(session({
    secret: "yyyy",
    resave: false,
    saveUninitialized: false,
}
));

// for serving the public folder
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

const routes = require("./back-end/index");
app.get("*", routes);
app.post("*", routes);

// If there is an error this function is fired
app.use((err, req, res, next) => {
    console.log(err);
    if (err.sqlMessage) {
        return res.send(err.sqlMessage);
    }
    res.status(500);
    next(err);
});
