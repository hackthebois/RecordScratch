CREATE TABLE `ratings` (
	`id` varchar(256) NOT NULL,
	`albumId` varchar(256) NOT NULL,
	`artistId` varchar(256) NOT NULL,
	`rating` tinyint NOT NULL,
	CONSTRAINT `ratings_id` PRIMARY KEY(`id`)
);
