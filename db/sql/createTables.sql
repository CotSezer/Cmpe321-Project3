CREATE DATABASE IF NOT EXISTS 2019400135_;
USE 2019400135_;


CREATE TABLE Users(						/* Must be covered by Audiences and Directors */
	username VARCHAR(30) NOT NULL,		/* each username is unique */
	password VARCHAR(30) NOT NULL,		/* a user must have a password */
	name VARCHAR(30) NOT NULL,			/* a user must have name */
	surname VARCHAR(30) NOT NULL,		/* a user nust have surname */

	PRIMARY KEY(username));
	
CREATE TABLE Audiences(					/* Cannot overlap with Directors */
	username VARCHAR(30) NOT NULL,
	PRIMARY KEY(username),
	FOREIGN KEY(username) REFERENCES Users(username)
		ON DELETE CASCADE				/* if Users is deleted, delete the refered Audiences as well */
		ON UPDATE CASCADE);				/* if a User is updated, update the row refering to the Audience */
	
CREATE TABLE Directors(
	username VARCHAR(30) NOT NULL,
	nation VARCHAR(30) NOT NULL,		/* Each director has exactly one nation */
	PRIMARY KEY(username),
	FOREIGN KEY(username) REFERENCES Users(username)
		ON DELETE CASCADE				/* if Users is deleted, delete the refered Director as well */
		ON UPDATE CASCADE);				/* if a User is updated, update the row refering to the Director */
		
CREATE TABLE Database_Managers(			/* At most 4 Database Managers */ 
	username VARCHAR(30) NOT NULL,		/* a database manager must have a username */
	password VARCHAR(30) NOT NULL,		/* a database manager must have a password */
	PRIMARY KEY(username));
	
CREATE TABLE Platforms(
	platform_id INT UNSIGNED NOT NULL,	/* each platform has a platform id */
	platform_name VARCHAR(30) NOT NULL,	/* each platform has a platform name */
	PRIMARY KEY(platform_id),
	UNIQUE(platform_name));				/* each platform has a unique platform name */
	
CREATE TABLE Genres(
	genre_id INT UNSIGNED NOT NULL,		/* each genre must have a genre id */
	genre_name VARCHAR(30) NOT NULL,	/* each genre must have a genre name */
	PRIMARY KEY(genre_id),
	UNIQUE(genre_name));				/* each genre has a unique genre name */
	
CREATE TABLE Theatres(
	theatre_id INT UNSIGNED NOT NULL,			/* each theatre must have a theatre id */
	theatre_name VARCHAR(30) NOT NULL,			/* each theatre must have a theatre name */
	theatre_district VARCHAR(30) NOT NULL,		/* each theatre must have a theatre district */
	theatre_capacity INT UNSIGNED NOT NULL,		/* each theatre must have a theatre capacity */
	PRIMARY KEY(theatre_id),
	UNIQUE(theatre_name));						/* each theatre has a unique theatre name */
	
CREATE TABLE Times(
	time_id INT UNSIGNED NOT NULL AUTO_INCREMENT,	/* each Time must have a time_id, it increments automatically */
	slot ENUM('1', '2', '3', '4') NOT NULL,			/* Time must have a slot */
	date_time VARCHAR(30) NOT NULL,					/*  MM/DD/YYYY, the name of the variable is changed to date_time in order to avoid conflict with the keyword DATE */
	PRIMARY KEY(time_id),
	UNIQUE(slot, date_time));						/* each Time is unique in terms of slot and date_time combined */
	
CREATE TABLE Agreements(
	username VARCHAR(30) NOT NULL,					/* each agreement is between one director and one platform */
	platform_id INT UNSIGNED NOT NULL,				
	PRIMARY KEY(username),							/* a Director can agree with at most one Platform */
	FOREIGN KEY(username) REFERENCES Directors(username)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY(platform_id) REFERENCES Platforms(platform_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);
	
CREATE TABLE Movies_Directed_By_Directed_In(
	movie_id INT UNSIGNED NOT NULL,								/* each movie must have a movie id */
	movie_name VARCHAR(30) NOT NULL,							/* each movie must have a movie name */
	duration INT UNSIGNED NOT NULL,								/* each movie must have a duration */
	average_rating FLOAT NOT NULL DEFAULT 0.0,					/* each movie must have an average rating, default value is 0.0 */
	username VARCHAR(30) NOT NULL,								/* each movie must have a director */
	platform_id INT UNSIGNED NOT NULL,							/* each movie must have a platform where it is rated */
	PRIMARY KEY(movie_id),
	UNIQUE(movie_name),											/* each movie is unique in terms of movie name */
	FOREIGN KEY(username) REFERENCES Directors(username)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY(platform_id) REFERENCES Platforms(platform_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);
	
CREATE TABLE Subscribes(
	username VARCHAR(30) NOT NULL,							/* each subscription is between an Audience and a Platform */
	platform_id INT UNSIGNED NOT NULL,
	PRIMARY KEY(username, platform_id),
	FOREIGN KEY(username) REFERENCES Audiences(username)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY(platform_id) REFERENCES Platforms(platform_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);

CREATE TABLE Series(
	predecessor_id INT UNSIGNED NOT NULL,				/* If a Movie has a predecessor, then use this relationship to model the series of Movies */
	successor_id INT UNSIGNED NOT NULL,
	PRIMARY KEY(predecessor_id, successor_id),
	FOREIGN KEY(predecessor_id) REFERENCES Movies_Directed_By_Directed_In(movie_id),
	FOREIGN KEY(successor_id) REFERENCES Movies_Directed_By_Directed_In(movie_id));
	
CREATE TABLE Types(
	movie_id INT UNSIGNED NOT NULL,				/* each movie has at least one genre */
	genre_id INT UNSIGNED NOT NULL,
	PRIMARY KEY(movie_id, genre_id),
	FOREIGN KEY(movie_id) REFERENCES Movies_Directed_By_Directed_In(movie_id),
	FOREIGN KEY(genre_id) REFERENCES Genres(genre_id));
	
CREATE TABLE Reservations(						/* each reservation is unique in terms of theatre and time */
	theatre_id INT UNSIGNED NOT NULL,			/* each reservation is allocated to at most one session */
	time_id INT UNSIGNED NOT NULL,				/* if a movie's duration is 2 and its slot is 3, the movie is allocated to slots 3 and 4 combined */
	PRIMARY KEY(theatre_id, time_id),
	FOREIGN KEY(theatre_id) REFERENCES Theatres(theatre_id),
	FOREIGN KEY(time_id) REFERENCES Times(time_id));
	
CREATE TABLE Sessions_Allocated_Displayed(
	session_id INT UNSIGNED NOT NULL AUTO_INCREMENT,			/* each session is allocated to exactly one reservation */
	theatre_id INT UNSIGNED NOT NULL,			/* In each session, exactly one movie is displayed */
	time_id INT UNSIGNED NOT NULL,
	movie_id INT UNSIGNED NOT NULL,
	PRIMARY KEY(session_id),
	FOREIGN KEY(movie_id) REFERENCES Movies_Directed_By_Directed_In(movie_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);

CREATE TABLE Rating(					/* Rating table to store the ratings of Audiences for Movies */
	username VARCHAR(30) NOT NULL,
	movie_id INT UNSIGNED NOT NULL,
	rating FLOAT NOT NULL,
	PRIMARY KEY(username, movie_id),
	FOREIGN KEY(username) REFERENCES Audiences(username)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY(movie_id) REFERENCES Movies_Directed_By_Directed_In(movie_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);
	
CREATE TABLE Tickets(						/* A user can buy a ticket to a movie, if he/she watched its predecessor */
	username VARCHAR(30) NOT NULL,
	session_id INT UNSIGNED NOT NULL,
	PRIMARY KEY(username, session_id),
	FOREIGN KEY(username) REFERENCES Audiences(username)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY(session_id) REFERENCES Sessions_Allocated_Displayed(session_id)
		ON DELETE CASCADE
		ON UPDATE CASCADE);
	


INSERT INTO `2019400135_`.`Database_Managers` (`username`, `password`) VALUES ('manager1', 'managerpass1');
INSERT INTO `2019400135_`.`Database_Managers` (`username`, `password`) VALUES ('manager2', 'managerpass2');
INSERT INTO `2019400135_`.`Database_Managers` (`username`, `password`) VALUES ('manager35', 'managerpass35');


INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('steven.jobs', 'apple123', 'Steven', 'Jobs');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('minion.lover', 'bello387', 'Felonius', 'Gru');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('steve.wozniak', 'pass4321', 'Ryan', 'Andrews');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('he.gongmin', 'passwordpass', 'He', 'Gongmin');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('carm.galian', 'madrid9897', 'Carmelita', 'Galiano');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('kron.helene', 'helenepass', 'Helene', 'Kron');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('arzucan.ozgur', 'deneme123', 'Arzucan', 'Ozgur');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('egemen.isguder', 'deneme124', 'Egemen', 'Isguder');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('busra.oguzoglu', 'deneme125', 'Busra', 'Oguzoglu');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('peter.weir', 'peter_weir879', 'Peter', 'Weir');
INSERT INTO `2019400135_`.`Users` (`username`, `password`, `name`, `surname`) VALUES ('kyle.balda', 'mynameiskyle9', 'Kyle', 'Balda');

INSERT INTO `2019400135_`.`Platforms` (`platform_id`, `platform_name`) VALUES ('10130', 'IMDB');
INSERT INTO `2019400135_`.`Platforms` (`platform_id`, `platform_name`) VALUES ('10131', 'Letterboxd');
INSERT INTO `2019400135_`.`Platforms` (`platform_id`, `platform_name`) VALUES ('10132', 'FilmIzle');
INSERT INTO `2019400135_`.`Platforms` (`platform_id`, `platform_name`) VALUES ('10133', 'Filmora');
INSERT INTO `2019400135_`.`Platforms` (`platform_id`, `platform_name`) VALUES ('10134', 'BollywoodMDB');



INSERT INTO `2019400135_`.`Audiences` (`username`) VALUES ('steven.jobs');
INSERT INTO `2019400135_`.`Audiences` (`username`) VALUES ('steve.wozniak');
INSERT INTO `2019400135_`.`Audiences` (`username`) VALUES ('arzucan.ozgur');
INSERT INTO `2019400135_`.`Audiences` (`username`) VALUES ('egemen.isguder');
INSERT INTO `2019400135_`.`Audiences` (`username`) VALUES ('busra.oguzoglu');

INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('arzucan.ozgur', '10130');
INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('steven.jobs', '10130');
INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('busra.oguzoglu', '10131');
INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('steve.wozniak', '10131');
INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('steven.jobs', '10131');
INSERT INTO `2019400135_`.`Subscribes` (`username`, `platform_id`) VALUES ('egemen.isguder', '10132');


INSERT INTO `2019400135_`.`Directors` (`username`, `nation`) VALUES ('he.gongmin', 'Turkish');
INSERT INTO `2019400135_`.`Directors` (`username`, `nation`) VALUES ('carm.galian', 'Turkish');
INSERT INTO `2019400135_`.`Directors` (`username`, `nation`) VALUES ('kron.helene', 'French');
INSERT INTO `2019400135_`.`Directors` (`username`, `nation`) VALUES ('peter.weir', 'Spanish');
INSERT INTO `2019400135_`.`Directors` (`username`, `nation`) VALUES ('kyle.balda', 'German');

INSERT INTO `2019400135_`.`Agreements` (`username`, `platform_id`) VALUES ('he.gongmin', '10130');
INSERT INTO `2019400135_`.`Agreements` (`username`, `platform_id`) VALUES ('carm.galian', '10131');
INSERT INTO `2019400135_`.`Agreements` (`username`, `platform_id`) VALUES ('kron.helene', '10130');
INSERT INTO `2019400135_`.`Agreements` (`username`, `platform_id`) VALUES ('peter.weir', '10131');
INSERT INTO `2019400135_`.`Agreements` (`username`, `platform_id`) VALUES ('kyle.balda', '10132');





INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80001', 'Animation');
INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80002', 'Comedy');
INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80003', 'Adventure');
INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80004', 'Real Story');
INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80005', 'Thriller');
INSERT INTO `2019400135_`.`Genres` (`genre_id`, `genre_name`) VALUES ('80006', 'Drama');


INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20001', 'Despicable Me', '2', '5', 'kyle.balda', '10132');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20002', 'Catch Me If You Can', '2', '0', 'he.gongmin', '10130');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20003', 'The Bone Collector', '2', '0', 'carm.galian', '10131');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20004', 'Eagle Eye', '2', '5', 'kron.helene', '10130');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20005', 'Minions: The Rise Of Gru', '1', '5', 'kyle.balda', '10132');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20006', 'The Minions', '1', '5', 'kyle.balda', '10132');
INSERT INTO `2019400135_`.`Movies_Directed_By_Directed_In` (`movie_id`, `movie_name`, `duration`, `average_rating`, `username`, `platform_id`) VALUES ('20007', 'The Truman Show', '3', '5', 'peter.weir', '10131');


INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20001', '80001');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20005', '80001');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20006', '80001');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20001', '80002');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20005', '80002');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20006', '80002');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20007', '80002');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20002', '80003');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20004', '80003');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20002', '80004');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20003', '80005');
INSERT INTO `2019400135_`.`Types` (`movie_id`, `genre_id`) VALUES ('20007', '80006');

INSERT INTO `2019400135_`.`Theatres` (`theatre_id`, `theatre_name`, `theatre_district`, `theatre_capacity`) VALUES ('40001', 'Sisli_1', 'Sisli', '300');
INSERT INTO `2019400135_`.`Theatres` (`theatre_id`, `theatre_name`, `theatre_district`, `theatre_capacity`) VALUES ('40002', 'Sisli_2', 'Sisli', '200');
INSERT INTO `2019400135_`.`Theatres` (`theatre_id`, `theatre_name`, `theatre_district`, `theatre_capacity`) VALUES ('40003', 'Besiktas1', 'Besiktas', '100');
INSERT INTO `2019400135_`.`Theatres` (`theatre_id`, `theatre_name`, `theatre_district`, `theatre_capacity`) VALUES ('40004', 'Besiktas2', 'Besiktas', '100');
INSERT INTO `2019400135_`.`Theatres` (`theatre_id`, `theatre_name`, `theatre_district`, `theatre_capacity`) VALUES ('40005', 'Besiktas3', 'Besiktas', '500');


INSERT INTO `2019400135_`.`Times` (`time_id`, `slot`, `date_time`) VALUES ('1', '1', '3/15/23');
INSERT INTO `2019400135_`.`Times` (`time_id`, `slot`, `date_time`) VALUES ('3', '1', '3/16/23');
INSERT INTO `2019400135_`.`Times` (`time_id`, `slot`, `date_time`) VALUES ('2', '3', '3/15/23');
INSERT INTO `2019400135_`.`Times` (`time_id`, `slot`, `date_time`) VALUES ('4', '3', '3/16/23');

INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50001', '40001', '1', '20001');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50002', '40001', '2', '20001');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50003', '40002', '1', '20001');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50004', '40002', '2', '20002');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50005', '40003', '3', '20003');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50006', '40003', '4', '20004');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50007', '40004', '3', '20005');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50008', '40004', '4', '20006');
INSERT INTO `2019400135_`.`Sessions_Allocated_Displayed` (`session_id`, `theatre_id`, `time_id`, `movie_id`) VALUES ('50009', '40005', '3', '20007');

INSERT INTO `2019400135_`.`Series` (`predecessor_id`, `successor_id`) VALUES ('20001', '20005');
INSERT INTO `2019400135_`.`Series` (`predecessor_id`, `successor_id`) VALUES ('20006', '20005');
INSERT INTO `2019400135_`.`Series` (`predecessor_id`, `successor_id`) VALUES ('20001', '20006');



INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50001');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('steven.jobs', '50001');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50002');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('steven.jobs', '50002');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50003');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50004');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('steve.wozniak', '50004');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('steve.wozniak', '50005');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('arzucan.ozgur', '50006');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50007');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50008');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('busra.oguzoglu', '50009');
INSERT INTO `2019400135_`.`Tickets` (`username`, `session_id`) VALUES ('egemen.isguder', '50009');


INSERT INTO `2019400135_`.`Rating` (`username`, `movie_id`, `rating`) VALUES ('egemen.isguder', '20001', '5');
INSERT INTO `2019400135_`.`Rating` (`username`, `movie_id`, `rating`) VALUES ('egemen.isguder', '20005', '5');
INSERT INTO `2019400135_`.`Rating` (`username`, `movie_id`, `rating`) VALUES ('egemen.isguder', '20006', '5');
INSERT INTO `2019400135_`.`Rating` (`username`, `movie_id`, `rating`) VALUES ('arzucan.ozgur', '20004', '5');
INSERT INTO `2019400135_`.`Rating` (`username`, `movie_id`, `rating`) VALUES ('busra.oguzoglu', '20007', '5');

INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40001', '1');
INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40002', '1');
INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40001', '2');
INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40002', '2');
INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40003', '3');
INSERT INTO `2019400135_`.`Reservations` (`theatre_id`, `time_id`) VALUES ('40003', '4');

	
	