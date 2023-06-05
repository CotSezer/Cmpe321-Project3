const query = require("./_query");

exports.updateDirectorPlatform = function (username, platform) {
    return query("UPDATE Agreements SET platform_id = ? WHERE username = ?", [platform, username]);
};

exports.updateMovieName = function (movie_id, name) {
    return query("UPDATE Movies_Directed_By_Directed_In SET movie_name = ? WHERE movie_id = ?", [name, movie_id]);
};
