const query = require("./_query");

exports.addAudience = function (username, password, name, surname) {
    return query(`
        INSERT INTO Users VALUES (?, ?, ?, ?);
        INSERT INTO Audiences (username) VALUES (?);
    `, [username, name, surname, password, username]);
};

exports.addDirector = function (username, password, name, surname, nation, platform_id) {
    return query(`
        INSERT INTO Users VALUES (?, ?, ?, ?);
        INSERT INTO Directors VALUES (?, ?);
        INSERT INTO Agreements Values (?, ?);
    `, [username, name, surname, password, username, nation, username, platform_id]);
};
  

exports.addMovie = function (movie_id, name, duration, director_username) {
    return query(`
        INSERT INTO Movies_Directed_By_Directed_In 
        VALUES (?, ?, ?, 0.0, ?, 
            (SELECT platform_id 
            FROM Agreements 
            WHERE username=?));
    `,[movie_id, name, duration, director_username, director_username]);

};

exports.addSession = function (movie_id, theatre_id, slot, date) {
    return query(`
        INSERT INTO Times (slot, date_time) values (?, ?);
        INSERT INTO Sessions_Allocated_Displayed (theatre_id, movie_id, time_id) VALUES (?, ?, 
            (SELECT time_id FROM Times WHERE slot=? AND date_time=?)
    )`, [slot, date, theatre_id, movie_id, slot, date]);
};

exports.addPredecessor = function (predecessor, successor) {
    return query(`
        INSERT INTO Series VALUES (?, ?);
    `,[predecessor, successor]);
};

exports.addRating = function (username, movie_id, rating) {
    return query(`
        INSERT INTO Rating VALUES (?, ?, ?);
    `,[username, movie_id, rating]);
};

exports.addPlatform = function (platform_id, platform_name) {
    return query(`
        INSERT INTO Platforms VALUES (?, ?);
    `,[platform_id, platform_name]);
};

exports.addTheatre = function (theatre_id, time_id) {
    return query(`
        INSERT INTO Reservations VALUES (?, ?);
    `,[theatre_id, time_id]);
};

exports.addGenre = function (movie_id, genre_id) {
    return query(`
        INSERT INTO Types VALUES (?, ?);
    `,[movie_id, genre_id]);
};