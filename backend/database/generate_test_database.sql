-- drop if exists
DROP DATABASE panoptes;

-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema panoptes
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema panoptes
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `panoptes` DEFAULT CHARACTER SET utf8 ;
USE `panoptes` ;

-- -----------------------------------------------------
-- Table `panoptes`.`cameras`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `panoptes`.`cameras` (
  `camera_id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(100) NULL,
  `url` VARCHAR(100) NULL,
  `data_type` VARCHAR(100) NULL,
  PRIMARY KEY (`camera_id`),
  UNIQUE INDEX `camera_url_UNIQUE` (`url` ASC),
  UNIQUE INDEX `title_UNIQUE` (`title` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `panoptes`.`videos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `panoptes`.`videos` (
  `video_id` INT NOT NULL AUTO_INCREMENT,
  `file_path` VARCHAR(100) NOT NULL,
  `camera_id` INT NOT NULL,
  PRIMARY KEY (`video_id`),
  UNIQUE INDEX `file_path_UNIQUE` (`file_path` ASC),
  INDEX `camera_fk_idx` (`camera_id` ASC),
  CONSTRAINT `videos_cameras_fk`
    FOREIGN KEY (`camera_id`)
    REFERENCES `panoptes`.`cameras` (`camera_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `panoptes`.`object_sets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `panoptes`.`object_sets` (
  `object_set_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`object_set_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `panoptes`.`objects`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `panoptes`.`objects` (
  `object_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `object_set_id` INT NULL,
  PRIMARY KEY (`object_id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC),
  INDEX `objects_object_sets_fk_idx` (`object_set_id` ASC),
  CONSTRAINT `objects_object_sets_fk`
    FOREIGN KEY (`object_set_id`)
    REFERENCES `panoptes`.`object_sets` (`object_set_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `panoptes`.`incidents`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `panoptes`.`incidents` (
  `incident_id` INT NOT NULL AUTO_INCREMENT,
  `start_time` INT NOT NULL,
  `end_time` INT NOT NULL,
  `object_id` INT NULL,
  `video_id` INT NULL,
  INDEX `fk_objects_idx` (`object_id` ASC),
  INDEX `incidents_videos_fk_idx` (`video_id` ASC),
  PRIMARY KEY (`incident_id`),
  CONSTRAINT `incidents_objects_fk`
    FOREIGN KEY (`object_id`)
    REFERENCES `panoptes`.`objects` (`object_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `incidents_videos_fk`
    FOREIGN KEY (`video_id`)
    REFERENCES `panoptes`.`videos` (`video_id`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- insert values
INSERT INTO cameras(url, title, data_type) VALUES ("http://localhost:8080/webcam.ogg", "test camera title 1", "video/ogg");
INSERT INTO cameras(url, title, data_type) VALUES ("test camera url 2", "test camera title 2", "video/mp4");
INSERT INTO videos(file_path, camera_id) VALUES ("test video file path 1", 1);
INSERT INTO videos(file_path, camera_id) VALUES ("test video file path 2", 2);
INSERT INTO videos(file_path, camera_id) VALUES ("test video file path 3", 1);
INSERT INTO object_sets(name) VALUES ("test object set name 1");
INSERT INTO object_sets(name) VALUES ("test object set name 2");
INSERT INTO objects(name, object_set_id) VALUES ("test object name 1", 1);
INSERT INTO objects(name, object_set_id) VALUES ("test object name 2", 2);
INSERT INTO objects(name, object_set_id) VALUES ("test object name 3", 2);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (3, 20, 1, 2);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (2, 18, 1, 3);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (11, 16, 2, 1);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (3, 5, 2, 1);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (7, 10, 2, 3);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (9, 20, 3, 2);
INSERT INTO incidents(start_time, end_time, object_id, video_id) VALUES (12, 19, 3, 2);
