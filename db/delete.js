const query = require("./_query");

exports.deleteAudience = function (username) {
    return query(`
        DELETE FROM Users WHERE username=(SELECT username FROM Audiences WHERE username=?);
        DELETE FROM Rating WHERE username = ?;
        DELETE FROM Tickets WHERE username = ?;
        DELETE FROM Subscribes WHERE username = ?;
    `, [username, username, username, username]);
}
