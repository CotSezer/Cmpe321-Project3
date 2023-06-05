const query = require("./_query");

exports.dbManagerExists = async function (username) {
    let arr = await query("SELECT 1 FROM Database_Managers WHERE username = ?;", [username]);
    return arr.length != 0;
};
//injection attack for SQL ?????
exports.dbManagerPassCorrect = async function (username, password) {
    let arr = await query("SELECT 1 FROM Database_Managers WHERE username = ? AND password = ?;", [username, password]);
    return arr.length != 0;
};

exports.dbDirectorExists = async function (username) {
    let arr = await query("SELECT 1 FROM Directors WHERE username = ?;", [username]);
    return arr.length != 0;
};

exports.dbDirectorPassCorrect = async function (username, password) {
    let arr = await query(`SELECT 1 FROM Directors D
    JOIN Users U ON D.username=U.username
    WHERE U.username = ? AND password =?;`, [username, password]);
    return arr.length != 0;
};

exports.dbAudienceExists = async function (username) {
    let arr = await query("SELECT 1 FROM Audiences WHERE username = ?;", [username]);
    return arr.length != 0;
};

exports.dbAudiencePassCorrect = async function (username, password) {
    let arr = await query(`SELECT 1 FROM Audiences A
    JOIN Users U ON A.username=U.username
    WHERE U.username = ? AND password = ?;`, [username, password]);
    return arr.length != 0;
};

exports.audienceBoughtTicket = async function (audienceUsername, sessionID) {
    let arr = await query(`
        SELECT 1 FROM Tickets T
        WHERE T.username=?
        AND T.session_id=?
    `, [audienceUsername, sessionID]);
    return arr.length != 0;
}

exports.audienceCheckTicket = async function (username, movie_id) {
    let arr = await query(`
        SELECT 1
        FROM Tickets T
        JOIN Sessions_Allocated_Displayed S ON T.session_id = S.session_id
        WHERE T.username = ? and S.movie_id = ?;
    `, [username, movie_id]);
    return arr.length != 0;

}
/**
 * For checking movie of Director
 * @param {*} movie_id 
 * @param {*} director_username 
 * @returns 
 * 1 if movie does not exist, 
 * 2 if movie is not directed by this Director, 
 * 0 if movie exists and directed by this Director
 */
exports.movieDirectorCheck = async function (movie_id, director_username) {
    let test1 = await query(`SELECT 1 FROM Movies_Directed_By_Directed_In C 
    WHERE C.movie_id=?;`, [movie_id]);
    if (test1 == 0){
        return 1;
    }

    let test2 = await query(`SELECT 1 FROM Movies_Directed_By_Directed_In C 
    JOIN Directors I ON I.username=C.username
    WHERE I.username=?
    AND C.movie_id=?`, [director_username, movie_id]);
    if(test2 == 0){
        return 2;
    }

    // all prerequisites are satisfied
    return 0;
}