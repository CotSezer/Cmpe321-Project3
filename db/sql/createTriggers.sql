DROP TRIGGER IF EXISTS calculate_average_rating;

CREATE TRIGGER calculate_average_rating AFTER INSERT ON rating
FOR EACH ROW
BEGIN
    DECLARE avg_rating DECIMAL(5,2);

    -- Calculate the average rating for the movie
    SELECT AVG(rating) INTO avg_rating
    FROM rating
    WHERE movie_id = NEW.movie_id;

    -- Update the average_rating column in the movies table
    UPDATE Movies_Directed_By_Directed_In
    SET average_rating = avg_rating
    WHERE movie_id = NEW.movie_id;
END;
