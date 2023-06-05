const query = require("./_query");

exports.getAllDirectors = function () {
    return query(`
        SELECT D.username, name, surname, nation, A.platform_id
        FROM Directors D 
        JOIN Users U ON U.username=D.username
        LEFT JOIN Agreements A ON D.username = A.username;
        ;`);
}

exports.getAllMovies = function () {
    return query(`
    SELECT
    m.movie_id,
    m.movie_name,
    u.surname,
    p.platform_name AS platform,
    s.theatre_id,
    t.slot AS time_slot,
    GROUP_CONCAT(s2.predecessor_id ORDER BY s2.predecessor_id ASC SEPARATOR ', ') AS predecessors_list
  FROM
    Movies_Directed_By_Directed_In m
    JOIN Directors d ON m.username = d.username
    JOIN Users u ON d.username = u.username
    JOIN Platforms p ON m.platform_id = p.platform_id
    JOIN Sessions_Allocated_Displayed s ON m.movie_id = s.movie_id
    JOIN Times t ON s.time_id = t.time_id
    LEFT JOIN Series s2 ON m.movie_id = s2.successor_id
  GROUP BY
    m.movie_id,
    m.movie_name,
    u.surname,
    p.platform_name,
    s.theatre_id,
    t.slot
  ORDER BY
    m.movie_id ASC;`);
}

exports.getAudienceRates = function (id) {
    return query(`SELECT m.movie_id, m.movie_name, r.rating
    FROM Movies_Directed_By_Directed_In m
    LEFT JOIN Rating r ON m.movie_id = r.movie_id
    LEFT JOIN Users u ON r.username = u.username
    WHERE u.username = ?;
    `, [id]);
}

exports.getMovieAverageRate = async function (movie_id) {
    let arr = await query(`
    SELECT m.movie_id, m.movie_name, ROUND(AVG(rating), 2) AS overall_rating
    FROM Movies_Directed_By_Directed_In m
    JOIN Rating r ON m.movie_id = r.movie_id
    WHERE m.movie_id = ?
    GROUP BY m.movie_id, m.movie_name;
    `, [movie_id]);
    return arr[0];
}

exports.getDirectorMoviesOrderedByMovieID = async function (username){
    return query(`
        SELECT m.movie_id, m.movie_name, s.theatre_id, t.slot,
        GROUP_CONCAT(s2.predecessor_id ORDER BY s2.predecessor_id ASC SEPARATOR ', ') AS predecessor_id
        FROM Movies_Directed_By_Directed_In m
        LEFT JOIN Sessions_Allocated_Displayed s ON m.movie_id = s.movie_id
        LEFT JOIN Times t ON s.time_id = t.time_id
        LEFT JOIN Series s2 ON m.movie_id = s2.successor_id
        WHERE m.username = ?
        GROUP BY m.movie_id, m.movie_name, s.theatre_id, t.slot
        ORDER BY m.movie_id ASC;
        `, [username]);
}

exports.getDirectorMoviesOrderedByMovieIDFromManager = async function (username){
    return query(`
        SELECT m.movie_id, m.movie_name, s.theatre_id, t.slot, th.theatre_district
        FROM Movies_Directed_By_Directed_In m
        LEFT JOIN Sessions_Allocated_Displayed s ON m.movie_id = s.movie_id
        LEFT JOIN Theatres th ON s.theatre_id = th.theatre_id
        LEFT JOIN Times t ON s.time_id = t.time_id
        WHERE m.username = ?
        ORDER BY m.movie_id ASC;
        `, [username]);
}

exports.getPredecessors = async function (session_id) {
    return query(`
        SELECT predecessor_id 
        FROM Series where successor_id = 
            (SELECT movie_id 
                FROM Sessions_Allocated_Displayed 
                WHERE session_id = ?);
    `, [session_id]);
}

// exports.getMovieTicketDates = async function (username, session_id){
//     return query(`
//     select date_time from Tickets T 
//     join Sessions_Allocated_Displayed S 
//     join Times where username=? 
//     and movie_id = (
//         SELECT movie_id 
//         FROM Sessions_Allocated_Displayed 
//         WHERE session_id = ?) 
//         and S.session_id = T.session_id 
//         and Times.time_id = S.time_id;
//     `, [username, session_id]);
// }


exports.getMovieTicketSession = async function (username, movie_id){
    return query(`
        SELECT s.session_id 
        FROM Tickets t
        JOIN Sessions_Allocated_Displayed s 
        ON s.session_id = t.session_id 
        WHERE t.username = ?
        AND s.movie_id = ?;
    `, [username, movie_id]);
}

exports.buyTicket = async function (username, session_id){
    return query(`
        INSERT INTO Tickets VALUES (?, ?);
    `, [username, session_id]);
}

exports.getSessionDateID = async function(session_id){
    return query(`
        SELECT T.time_id
        FROM Sessions_Allocated_Displayed S
        JOIN Times T ON S.time_id = T.time_id
        WHERE S.session_id = ?;
    `, [session_id]);
}

exports.getTicketCountBySession = async function(session_id){
    let l = await query(`
        SELECT COUNT(*) AS ticket_count
        FROM Sessions_Allocated_Displayed s
        JOIN Tickets t ON s.session_id = t.session_id
        where s.session_id = ?
        GROUP BY s.session_id;
    `, [session_id]);
    return l[0];
}

exports.getTheatreCapacityBySession = async function(session_id){
    let l = await query(`
        select theatre_capacity 
        from Theatres 
        join Sessions_Allocated_Displayed s 
        on s.theatre_id = s.theatre_id 
        where s.session_id = ?;
    `, [session_id]);
    return l[0]['theatre_capacity'];
}

exports.getAudienceTickets = async function(username){
     return query(`
        SELECT m.movie_id, m.movie_name, s.session_id, r.rating, m.average_rating from Tickets t
        JOIN Sessions_Allocated_Displayed s 
        ON s.session_id = t.session_id 
        JOIN Movies_Directed_By_Directed_In m
        ON m.movie_id = s.movie_id
        LEFT join rating r
        ON r.username = t.username and r.movie_id = s.movie_id
        WHERE t.username = ?;
    `, [username]);
}

exports.getAvailableTheatresForSlot = function (slot) {
    return query(`
    SELECT *
    FROM Theatres
    WHERE theatre_id NOT IN (
        SELECT theatre_id
        FROM Reservations
        WHERE time_id IN (
            SELECT time_id
            FROM Times
            WHERE slot = ?
    ));`, [slot]);
}

exports.getAudiencesInMovie = function (movie_id, username) {
    return query(`SELECT u.username, u.name, u.surname
    FROM Users u
    JOIN Tickets t ON u.username = t.username
    JOIN Sessions_Allocated_Displayed s ON t.session_id = s.session_id
    JOIN Movies_Directed_By_Directed_In m ON s.movie_id = m.movie_id
    WHERE m.movie_id = ?
    AND m.username = ?`, [movie_id, username]);
}
