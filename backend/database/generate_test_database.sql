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
  `timestamp` DATETIME NULL,
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
  `timestamp` DATETIME NULL,
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
