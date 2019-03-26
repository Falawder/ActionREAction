-- drop database if exists example_docker_db;
-- create database example_docker_db;
/*use example_db;

--
-- Table structure for table `example_table`
--

DROP TABLE IF EXISTS `example_table`;
CREATE TABLE `example_table` (
  `id`        bigint(20)   NOT NULL,
  `INS_DATE`  datetime     NOT NULL,
  `NAME`      varchar(255) NOT NULL,
  `VALUE`     varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `EXAMPLE_TABLE`
--

LOCK TABLES `example_table` WRITE;
INSERT INTO `example_table` (id, INS_DATE, NAME, VALUE)
VALUES
( 1, now(), 'example-1', 'value-1'),
( 2, now(), 'example-2', 'value-2'),
( 3, now(), 'example-3', 'value-3'),
( 4, now(), 'example-4', 'value-4'),
( 5, now(), 'example-5', 'value-5'),
( 6, now(), 'example-6', 'value-6'),
( 7, now(), 'example-7', 'value-7'),
( 8, now(), 'example-8', 'value-8'),
( 9, now(), 'example-9', 'value-9');
UNLOCK TABLES;
*/


-- CREATE DATABASE bdd_sdzee DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

-- USE bdd_sdzee;
-- -- CREATE USER 'java'@'localhost' IDENTIFIED BY 'SdZ_eE';
-- -- GRANT ALL ON bdd_sdzee.* TO 'java'@'localhost' IDENTIFIED BY 'SdZ_eE';

-- CREATE TABLE  bdd_sdzee.Utilisateur (
--  id INT( 11 ) NOT NULL AUTO_INCREMENT ,
--  email VARCHAR( 60 ) NOT NULL ,
--  mot_de_passe VARCHAR( 32 ) NOT NULL ,
--  nom VARCHAR( 20 ) NOT NULL ,
--  date_inscription DATETIME NOT NULL ,
--  PRIMARY KEY ( id ),
--  UNIQUE ( email )
-- ) ENGINE = INNODB;

-- INSERT INTO Utilisateur (email, mot_de_passe, nom, date_inscription) VALUES ('coyote@mail.acme', MD5('bipbip'), 'Coyote', NOW());
-- INSERT INTO Utilisateur (email, mot_de_passe, nom, date_inscription) VALUES ('jadorejquery@unefois.be', MD5('avecdesfrites'), 'Thunderseb', NOW());

CREATE DATABASE IF NOT EXISTS area DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE area;

CREATE TABLE area.users (
  id INT(11) NOT NULL AUTO_INCREMENT,
  firstname VARCHAR(20) NOT NULL,
  lastname VARCHAR(20) NOT NULL,
  email VARCHAR(60) NOT NULL,
  pass VARCHAR(32),
  token VARCHAR(60),
  created DATETIME NOT NULL,
  method VARCHAR(20) NOT NULL,
  facebook_access_token VARCHAR(300),
  facebook_user_id VARCHAR(60),
  google_access_token VARCHAR(300),
  google_user_id VARCHAR(60),
  google_user_mail VARCHAR(60),
  github_access_token VARCHAR(300),
  github_user_id VARCHAR(60),
  instagram_access_token VARCHAR(300),
  instagram_user_id VARCHAR(60),
  discord_access_token VARCHAR(200),
  discord_user_id VARCHAR (200),
  googlenotification_trigger BOOL,
  slack_user_id VARCHAR(20),
  slack_msgtrigger BOOL,
  slack_reacttrigger BOOL,
  slack_uploadtrigger BOOL,
  slack_access_token VARCHAR(100),
  spotify_access_token VARCHAR(300),
  spotify_user_id VARCHAR(100),
  slack_postmsg_url VARCHAR(200),
  repetitivejob_trigger BOOL,
  oncejob_trigger BOOL,
  PRIMARY KEY (id),
  UNIQUE (email)
) ENGINE = INNODB;

INSERT INTO users (id, firstname, lastname, email, pass, token, created, method, slack_reacttrigger) VALUES ('1','max', 'bubu', 'max@bubu.max', 'maxbubu', '9e169fbd-9352-48a4-bf69-6f0c719fede1', NOW(), 'app', false);
