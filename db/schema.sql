/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.5.27-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: sp
-- ------------------------------------------------------
-- Server version	10.5.27-MariaDB-ubu2004

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `balance`
--

DROP TABLE IF EXISTS `balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `balance` (
  `memberFk` int(11) NOT NULL,
  `feeAssigned` decimal(10,2) NOT NULL,
  `feePayed` decimal(10,2) NOT NULL,
  `lotteryAssigned` decimal(10,2) NOT NULL,
  `lotteryPayed` decimal(10,2) NOT NULL,
  `raffleAssigned` decimal(10,2) NOT NULL,
  `rafflePayed` decimal(10,2) NOT NULL,
  PRIMARY KEY (`memberFk`),
  CONSTRAINT `balance_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `balance`
--

LOCK TABLES `balance` WRITE;
/*!40000 ALTER TABLE `balance` DISABLE KEYS */;
/*!40000 ALTER TABLE `balance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budget`
--

DROP TABLE IF EXISTS `budget`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budget` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subItemFk` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `budget_subItem_FK` (`subItemFk`),
  KEY `budget_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `budget_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `budget_subItem_FK` FOREIGN KEY (`subItemFk`) REFERENCES `subItem` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budget`
--

LOCK TABLES `budget` WRITE;
/*!40000 ALTER TABLE `budget` DISABLE KEYS */;
/*!40000 ALTER TABLE `budget` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `budgetItem`
--

DROP TABLE IF EXISTS `budgetItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `budgetItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `budgetItem`
--

LOCK TABLES `budgetItem` WRITE;
/*!40000 ALTER TABLE `budgetItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `budgetItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `buy`
--

DROP TABLE IF EXISTS `buy`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `buy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subItemFk` int(11) NOT NULL,
  `supplierFk` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payMethod` enum('efectiu','banc') NOT NULL,
  `ticketReference` varchar(30) DEFAULT NULL,
  `buyed` date DEFAULT curdate(),
  `digitizedDocument` varchar(30) DEFAULT NULL,
  `created` date DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `buy_subItem_FK` (`subItemFk`),
  KEY `buy_supplier_FK` (`supplierFk`),
  KEY `buy_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `buy_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `buy_subItem_FK` FOREIGN KEY (`subItemFk`) REFERENCES `subItem` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `buy_supplier_FK` FOREIGN KEY (`supplierFk`) REFERENCES `supplier` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=643 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `buy`
--

LOCK TABLES `buy` WRITE;
/*!40000 ALTER TABLE `buy` DISABLE KEYS */;
/*!40000 ALTER TABLE `buy` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER buy_beforeInsert
BEFORE INSERT
ON buy FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = (
  	SELECT code FROM sp.fallaYear ORDER BY code DESC LIMIT 1
	);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `cashClosure`
--

DROP TABLE IF EXISTS `cashClosure`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cashClosure` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openingBalance` decimal(10,2) NOT NULL,
  `memberMovements` decimal(10,2) NOT NULL,
  `saleMovements` decimal(10,2) NOT NULL,
  `buyMovements` decimal(10,2) NOT NULL,
  `expectedTotal` decimal(10,2) NOT NULL,
  `totalCounted` decimal(10,2) NOT NULL,
  `coinsLeft` decimal(10,2) NOT NULL,
  `billsRemoved` decimal(10,2) NOT NULL,
  `mismatch` decimal(10,2) GENERATED ALWAYS AS (`totalCounted` - `expectedTotal`) STORED,
  `created` timestamp NOT NULL DEFAULT current_timestamp(),
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cashClosure_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `cashClosure_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cashClosure`
--

LOCK TABLES `cashClosure` WRITE;
/*!40000 ALTER TABLE `cashClosure` DISABLE KEYS */;
/*!40000 ALTER TABLE `cashClosure` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fee` decimal(10,2) NOT NULL,
  `name` varchar(10) DEFAULT NULL,
  `description` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `client`
--

DROP TABLE IF EXISTS `client`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `nif` varchar(10) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=131 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client`
--

LOCK TABLES `client` WRITE;
/*!40000 ALTER TABLE `client` DISABLE KEYS */;
/*!40000 ALTER TABLE `client` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directDebit`
--

DROP TABLE IF EXISTS `directDebit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `directDebit` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `memberFk` int(11) NOT NULL,
  `accountNumber` varchar(24) DEFAULT NULL,
  `calculatedAmount` decimal(10,2) DEFAULT NULL,
  `actualAmount` decimal(10,2) NOT NULL,
  `notes` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `directDebit_member_FK` (`memberFk`),
  CONSTRAINT `directDebit_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=150 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directDebit`
--

LOCK TABLES `directDebit` WRITE;
/*!40000 ALTER TABLE `directDebit` DISABLE KEYS */;
/*!40000 ALTER TABLE `directDebit` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER directDebit_beforeInsert
BEFORE INSERT 
ON directDebit FOR EACH ROW
BEGIN
  DECLARE existingFk INT;

  SELECT directDebitFk
  	INTO existingFk
  	FROM member
 	 WHERE id = NEW.memberFk;

  IF existingFk IS NOT NULL THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Aquest membre ja té una domiciliació assignada';
  END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER directDebit_afterInsert
AFTER INSERT
ON directDebit FOR EACH ROW
BEGIN
  UPDATE member
  	SET directDebitFk = NEW.id
  	WHERE id = NEW.memberFk;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER directDebit_afterDelete
AFTER DELETE 
ON directDebit FOR EACH ROW
BEGIN
  UPDATE member
  SET directDebitFk = NULL
  WHERE id = OLD.memberFk;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `fallaYear`
--

DROP TABLE IF EXISTS `fallaYear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fallaYear` (
  `code` int(11) NOT NULL,
  `created` date DEFAULT NULL,
  `finished` date DEFAULT NULL,
  `finalCash` decimal(10,2) DEFAULT NULL,
  `finalBank` decimal(10,2) DEFAULT NULL,
  `finalStock` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fallaYear`
--

LOCK TABLES `fallaYear` WRITE;
/*!40000 ALTER TABLE `fallaYear` DISABLE KEYS */;
/*!40000 ALTER TABLE `fallaYear` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER fallaYear_beforeInsert
BEFORE INSERT
ON fallaYear FOR EACH ROW
BEGIN
	IF NEW.created IS NULL THEN
		CALL getCurrentDate(NEW.created);
	END IF;
	IF NEW.code IS NULL THEN
		CALL calculateFallaYear(NEW.code);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER fallaYear_beforeUpdate
BEFORE UPDATE
ON fallaYear FOR EACH ROW
BEGIN
	CALL getCurrentDate(NEW.finished);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `family`
--

DROP TABLE IF EXISTS `family`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `family` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `discount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=397 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `family`
--

LOCK TABLES `family` WRITE;
/*!40000 ALTER TABLE `family` DISABLE KEYS */;
/*!40000 ALTER TABLE `family` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grafanaUser`
--

DROP TABLE IF EXISTS `grafanaUser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `grafanaUser` (
  `id` int(11) NOT NULL,
  `nickname` varchar(50) NOT NULL,
  `grafanaId` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grafanaUser`
--

LOCK TABLES `grafanaUser` WRITE;
/*!40000 ALTER TABLE `grafanaUser` DISABLE KEYS */;
/*!40000 ALTER TABLE `grafanaUser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lottery`
--

DROP TABLE IF EXISTS `lottery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lottery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lotteryId` int(11) NOT NULL,
  `assigned` date DEFAULT curdate(),
  `memberFk` int(11) NOT NULL,
  `ticketsMale` int(11) DEFAULT NULL,
  `ticketsFemale` int(11) DEFAULT NULL,
  `ticketsChildish` int(11) DEFAULT NULL,
  `tenthsMale` int(11) DEFAULT NULL,
  `tenthsFemale` int(11) DEFAULT NULL,
  `tenthsChildish` int(11) DEFAULT NULL,
  `isAssigned` tinyint(1) DEFAULT 0,
  `price` decimal(10,2) GENERATED ALWAYS AS (`ticketsMale` * 4 + `ticketsFemale` * 4 + `ticketsChildish` * 4 + `tenthsMale` * 20 + `tenthsFemale` * 20 + `tenthsChildish` * 20) VIRTUAL,
  `benefit` decimal(10,2) GENERATED ALWAYS AS (`ticketsMale` + `ticketsFemale` + `ticketsChildish` + `tenthsMale` * 3 + `tenthsFemale` * 3 + `tenthsChildish` * 3) VIRTUAL,
  `lotteryNameFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_lottery_lotteryNameFk_lotteryId` (`lotteryNameFk`,`lotteryId`),
  KEY `lottery_member_FK` (`memberFk`),
  CONSTRAINT `lottery_lotteryName_FK` FOREIGN KEY (`lotteryNameFk`) REFERENCES `lotteryName` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `lottery_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1095 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lottery`
--

LOCK TABLES `lottery` WRITE;
/*!40000 ALTER TABLE `lottery` DISABLE KEYS */;
/*!40000 ALTER TABLE `lottery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lotteryName`
--

DROP TABLE IF EXISTS `lotteryName`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `lotteryName` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(30) NOT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lotteryName_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `lotteryName_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lotteryName`
--

LOCK TABLES `lotteryName` WRITE;
/*!40000 ALTER TABLE `lotteryName` DISABLE KEYS */;
/*!40000 ALTER TABLE `lotteryName` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER lotteryName_beforeInsert
BEFORE INSERT
ON lotteryName FOR EACH ROW
BEGIN

	SET NEW.fallaYearFk = (
  	SELECT code FROM sp.fallaYear ORDER BY code DESC LIMIT 1
	);

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `dni` varchar(10) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `isRegistered` tinyint(1) DEFAULT NULL,
  `familyFk` int(11) NOT NULL,
  `categoryFk` int(11) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  `directDebitFk` int(11) DEFAULT NULL,
  `isAuthorizationSigned` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `member_family_FK` (`familyFk`),
  KEY `member_category_FK` (`categoryFk`),
  KEY `member_directDebit_FK` (`directDebitFk`),
  CONSTRAINT `member_category_FK` FOREIGN KEY (`categoryFk`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `member_directDebit_FK` FOREIGN KEY (`directDebitFk`) REFERENCES `directDebit` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `member_family_FK` FOREIGN KEY (`familyFk`) REFERENCES `family` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=687 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER member_beforeInsert
BEFORE INSERT
ON `member` FOR EACH ROW
BEGIN
	DECLARE vFallaYearFk INT;

	SET vFallaYearFk = getCurrentFallaYear();
	SET NEW.categoryFk = calculateMemberCategory(NEW.birthdate, vFallaYearFk);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER member_afterInsert
AFTER INSERT
ON `member` FOR EACH ROW
BEGIN
	DECLARE vFallaYearFk INT;

	CALL updateFamilyDiscount(NEW.familyFk);
	CALL insertBalance(NEW.id);
	IF NEW.isRegistered = 1 THEN
    	INSERT INTO memberStatusLog(memberFk, status)
    		VALUES (NEW.id, 1);
  	END IF;
	SET vFallaYearFk = getCurrentFallaYear();
	INSERT INTO membershipHistory (memberFk, fallaYearFk, falla, `position`)
        VALUES (NEW.id, vFallaYearFk, 'Sants Patrons', 'vocal');
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER member_beforeUpdate
BEFORE UPDATE
ON `member` FOR EACH ROW
BEGIN
	IF OLD.birthDate <> NEW.birthDate THEN
		SET NEW.categoryFk = sp.calculateMemberCategory(NEW.birthdate, getCurrentFallaYear());
		CALL modifyMembershipHistory(NEW.id, NEW.isRegistered);
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER member_afterUpdate
AFTER UPDATE
ON `member` FOR EACH ROW
BEGIN
	DECLARE vFallaYearFk INT;

	SET vFallaYearFk = getCurrentFallaYear();
	
	IF OLD.isRegistered = 0 AND NEW.isRegistered = 1 THEN
		CALL insertBalance(NEW.id);
		INSERT INTO membershipHistory (memberFk, fallaYearFk, falla, `position`)
			VALUES (NEW.id, vFallaYearFk, 'Sants Patrons', 'vocal');
	END IF;

	IF OLD.isRegistered = 1 AND NEW.isRegistered = 0 THEN
		DELETE FROM balance
			WHERE memberFk = NEW.id;
		DELETE FROM membershipHistory
			WHERE memberFk = NEW.id AND fallaYearFk = vFallaYearFk;
	END IF;
	
	IF OLD.isRegistered <> NEW.isRegistered THEN
    	INSERT INTO memberStatusLog(memberFk, status)
    		VALUES (NEW.id, NEW.isRegistered);
		CALL updateFamilyDiscount(NEW.familyFk);
		CALL regenerateBalance;
  	END IF;
	
	IF OLD.familyFk <> NEW.familyFk THEN
		CALL updateFamilyDiscount(OLD.familyFk);
		CALL updateFamilyDiscount(NEW.familyFk);
		CALL regenerateBalance;
	END IF;
		
	IF OLD.birthDate <> NEW.birthDate THEN
		CALL regenerateBalance;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `memberStatusLog`
--

DROP TABLE IF EXISTS `memberStatusLog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `memberStatusLog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `memberFk` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `created` date DEFAULT curdate(),
  PRIMARY KEY (`id`),
  KEY `memberStatusLog_member_FK` (`memberFk`),
  CONSTRAINT `memberStatusLog_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=197 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `memberStatusLog`
--

LOCK TABLES `memberStatusLog` WRITE;
/*!40000 ALTER TABLE `memberStatusLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `memberStatusLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membershipHistory`
--

DROP TABLE IF EXISTS `membershipHistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `membershipHistory` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fallaYearFk` int(11) NOT NULL,
  `position` varchar(30) NOT NULL,
  `falla` varchar(50) NOT NULL,
  `memberFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `membershipHistory_fallaYear_FK` (`fallaYearFk`),
  KEY `membershipHistory_member_FK` (`memberFk`),
  CONSTRAINT `membershipHistory_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `membershipHistory_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3221 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membershipHistory`
--

LOCK TABLES `membershipHistory` WRITE;
/*!40000 ALTER TABLE `membershipHistory` DISABLE KEYS */;
/*!40000 ALTER TABLE `membershipHistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `movement`
--

DROP TABLE IF EXISTS `movement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `movement` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `transactionDate` date NOT NULL DEFAULT curdate(),
  `amount` decimal(10,2) NOT NULL,
  `idType` int(11) NOT NULL,
  `idConcept` int(11) NOT NULL,
  `fallaYearFk` int(11) NOT NULL,
  `memberFk` int(11) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `receiptNumber` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movement_member_FK` (`memberFk`),
  KEY `movement_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `movement_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `movement_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20619 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `movement`
--

LOCK TABLES `movement` WRITE;
/*!40000 ALTER TABLE `movement` DISABLE KEYS */;
/*!40000 ALTER TABLE `movement` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`develimp`@`%`*/ /*!50003 TRIGGER movement_beforeInsert
BEFORE INSERT
ON movement FOR EACH ROW
BEGIN
	DECLARE latestReceipt INT DEFAULT 0;

	SET NEW.fallaYearFk = (
  	SELECT code FROM sp.fallaYear ORDER BY code DESC LIMIT 1
	);

	IF NEW.description = 'pagat en caixa' THEN
		SELECT IFNULL(MAX(receiptNumber),0)
			INTO latestReceipt
			FROM sp.movement
			WHERE fallaYearFk = NEW.FallaYearFk;
	
		SET NEW.receiptNumber = latestReceipt + 1;
	END IF;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER movement_afterInsert
AFTER INSERT
ON movement FOR EACH ROW
BEGIN
	UPDATE balance
	SET
		feeAssigned = feeAssigned + IF(NEW.idType = 1 AND NEW.idConcept = 1, NEW.amount, 0),
		feePayed = feePayed + IF(NEW.idType = 2 AND NEW.idConcept = 1, NEW.amount, 0),
		lotteryAssigned = lotteryAssigned + IF(NEW.idType = 1 AND NEW.idConcept = 2, NEW.amount, 0),
		lotteryPayed = lotteryPayed + IF(NEW.idType = 2 AND NEW.idConcept = 2, NEW.amount, 0),
		raffleAssigned = raffleAssigned + IF(NEW.idType = 1 AND NEW.idConcept = 3, NEW.amount, 0),
		rafflePayed = rafflePayed + IF(NEW.idType = 2 AND NEW.idConcept = 3, NEW.amount, 0)
	WHERE
		memberFk = NEW.memberFk;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `partner`
--

DROP TABLE IF EXISTS `partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partner` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `memberFk` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `birthdate` date NOT NULL,
  `dni` varchar(10) NOT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `partner_fallaYear_FK` (`fallaYearFk`),
  KEY `partner_member_FK` (`memberFk`),
  CONSTRAINT `partner_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `partner_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=128 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partner`
--

LOCK TABLES `partner` WRITE;
/*!40000 ALTER TABLE `partner` DISABLE KEYS */;
/*!40000 ALTER TABLE `partner` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sale`
--

DROP TABLE IF EXISTS `sale`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sale` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `subItemFk` int(11) NOT NULL,
  `clientFk` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payMethod` enum('efectiu','banc') NOT NULL,
  `ticketReference` varchar(30) DEFAULT NULL,
  `sold` date DEFAULT curdate(),
  `digitizedDocument` varchar(30) DEFAULT NULL,
  `created` date DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_subItem_FK` (`subItemFk`),
  KEY `sale_client_FK` (`clientFk`),
  KEY `sale_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `sale_client_FK` FOREIGN KEY (`clientFk`) REFERENCES `client` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `sale_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE,
  CONSTRAINT `sale_subItem_FK` FOREIGN KEY (`subItemFk`) REFERENCES `subItem` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sale`
--

LOCK TABLES `sale` WRITE;
/*!40000 ALTER TABLE `sale` DISABLE KEYS */;
/*!40000 ALTER TABLE `sale` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`%`*/ /*!50003 TRIGGER sale_beforeInsert
BEFORE INSERT
ON sale FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = (
  	SELECT code FROM sp.fallaYear ORDER BY code DESC LIMIT 1
	);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `subItem`
--

DROP TABLE IF EXISTS `subItem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subItem` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `budgetItemFk` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subItem_budgetItem_FK` (`budgetItemFk`),
  CONSTRAINT `subItem_budgetItem_FK` FOREIGN KEY (`budgetItemFk`) REFERENCES `budgetItem` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=95 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subItem`
--

LOCK TABLES `subItem` WRITE;
/*!40000 ALTER TABLE `subItem` DISABLE KEYS */;
/*!40000 ALTER TABLE `subItem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `summaryMembersFallaYear`
--

DROP TABLE IF EXISTS `summaryMembersFallaYear`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `summaryMembersFallaYear` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fallaYearFk` int(11) NOT NULL,
  `memberFk` int(11) NOT NULL,
  `assignedFee` decimal(10,2) NOT NULL,
  `assignedLottery` decimal(10,2) NOT NULL,
  `assignedRaffle` decimal(10,2) NOT NULL,
  `payedFee` decimal(10,2) NOT NULL,
  `payedLottery` decimal(10,2) NOT NULL,
  `payedRaffle` decimal(10,2) NOT NULL,
  `difference` decimal(10,2) GENERATED ALWAYS AS (`assignedFee` + `assignedLottery` + `assignedRaffle` - (`payedFee` + `payedLottery` + `payedRaffle`)) VIRTUAL,
  PRIMARY KEY (`id`),
  KEY `summaryMembersFallaYear_fallaYear_FK` (`fallaYearFk`),
  KEY `summaryMembersFallaYear_member_FK` (`memberFk`),
  CONSTRAINT `summaryMembersFallaYear_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `summaryMembersFallaYear_member_FK` FOREIGN KEY (`memberFk`) REFERENCES `member` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2102 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `summaryMembersFallaYear`
--

LOCK TABLES `summaryMembersFallaYear` WRITE;
/*!40000 ALTER TABLE `summaryMembersFallaYear` DISABLE KEYS */;
/*!40000 ALTER TABLE `summaryMembersFallaYear` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER summaryMembersFallaYear_beforeInsert
BEFORE INSERT
ON summaryMembersFallaYear FOR EACH ROW
BEGIN
	CALL getCurrentFallaYear(NEW.fallaYearFk);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `nif` varchar(10) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplierAccount`
--

DROP TABLE IF EXISTS `supplierAccount`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplierAccount` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `accountNumber` varchar(24) NOT NULL,
  `supplierFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `supplierAccount_supplier_FK` (`supplierFk`),
  CONSTRAINT `supplierAccount_supplier_FK` FOREIGN KEY (`supplierFk`) REFERENCES `supplier` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplierAccount`
--

LOCK TABLES `supplierAccount` WRITE;
/*!40000 ALTER TABLE `supplierAccount` DISABLE KEYS */;
/*!40000 ALTER TABLE `supplierAccount` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userCredentials`
--

DROP TABLE IF EXISTS `userCredentials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userCredentials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `password` varchar(100) NOT NULL,
  `userFk` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userCredentials`
--

LOCK TABLES `userCredentials` WRITE;
/*!40000 ALTER TABLE `userCredentials` DISABLE KEYS */;
/*!40000 ALTER TABLE `userCredentials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `worker`
--

DROP TABLE IF EXISTS `worker`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `worker` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `dni` varchar(10) NOT NULL,
  `job` varchar(50) NOT NULL,
  `fallaYearFk` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `worker_fallaYear_FK` (`fallaYearFk`),
  CONSTRAINT `worker_fallaYear_FK` FOREIGN KEY (`fallaYearFk`) REFERENCES `fallaYear` (`code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `worker`
--

LOCK TABLES `worker` WRITE;
/*!40000 ALTER TABLE `worker` DISABLE KEYS */;
/*!40000 ALTER TABLE `worker` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'sp'
--

--
-- Dumping routines for database 'sp'
--
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `calculateMemberCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` FUNCTION `calculateMemberCategory`(vBirthdateFk DATE,
    vFallaYearFk INT
) RETURNS int(11)
    DETERMINISTIC
BEGIN
    DECLARE vFallaAge INT;
    DECLARE vCategoryFk INT;

    SET vFallaAge = calculateMemberFallaAge(vBirthdateFk, vFallaYearFk);

    CASE 
        WHEN vFallaAge < 5 THEN
            SET vCategoryFk = 5;
        WHEN vFallaAge BETWEEN 5 AND 9 THEN
            SET vCategoryFk = 4;
        WHEN vFallaAge BETWEEN 10 AND 13 THEN
            SET vCategoryFk = 3;
        WHEN vFallaAge BETWEEN 14 AND 17 THEN
            SET vCategoryFk = 2;
        ELSE
            SET vCategoryFk = 1;
    END CASE;

    RETURN vCategoryFk;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `calculateMemberFallaAge` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` FUNCTION `calculateMemberFallaAge`(vBirthdateFk DATE,
    vFallaYearFk INT
) RETURNS int(11)
    DETERMINISTIC
BEGIN
    DECLARE vFallaDate DATE;
    DECLARE vFallaAge INT;

    SET vFallaDate = STR_TO_DATE(CONCAT(vFallaYearFk, '-03-19'), '%Y-%m-%d');

    SET vFallaAge = YEAR(vFallaDate) - YEAR(vBirthdateFk);

    IF (
        MONTH(vFallaDate) < MONTH(vBirthdateFk)
        OR (
            MONTH(vFallaDate) = MONTH(vBirthdateFk)
            AND DAY(vFallaDate) < DAY(vBirthdateFk)
        )
    ) THEN
        SET vFallaAge = vFallaAge - 1;
    END IF;

    RETURN vFallaAge;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP FUNCTION IF EXISTS `getCurrentFallaYear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` FUNCTION `getCurrentFallaYear`() RETURNS int(11)
    DETERMINISTIC
BEGIN
	DECLARE vLastFallaYear INT;

	SELECT code INTO vLastFallaYear
		FROM fallaYear
		ORDER BY code DESC
		LIMIT 1;
	
	RETURN vLastFallaYear;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `assignLottery` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `assignLottery`(
  IN vLotteryNameFk INT
)
BEGIN
  DECLARE vDone INT DEFAULT 0;
  DECLARE vId INT;
  DECLARE vMemberFk INT;
  DECLARE vPrice DECIMAL(10,2);
  DECLARE vBenefit DECIMAL(10,2);
  DECLARE vDescription VARCHAR(255);
  DECLARE vFallaYearFk INT;

  DECLARE cur CURSOR FOR
    SELECT id,
           memberFk,
           COALESCE(price, 0),
           COALESCE(benefit, 0)
    	FROM lottery
    	WHERE lotteryNameFk = vLotteryNameFk
     		AND COALESCE(isAssigned, 0) = 0
    	ORDER BY id;

  DECLARE CONTINUE HANDLER FOR NOT FOUND SET vDone = 1;

  SELECT description, fallaYearFk
    INTO vDescription, vFallaYearFk
  	FROM lotteryName
  	WHERE id = vLotteryNameFk
 	LIMIT 1;

  START TRANSACTION;

  OPEN cur;

  read_loop: LOOP
    FETCH cur INTO vId, vMemberFk, vPrice, vBenefit;
    IF vDone THEN
      LEAVE read_loop;
    END IF;

    INSERT INTO movement (memberFk, idType, idConcept, amount, description)
      VALUES (
        vMemberFk,
        2,
        1, 
        vBenefit,
        CONCAT('benefici ', vDescription, ' ', vFallaYearFk)
      );

    INSERT INTO movement (memberFk, idType, idConcept, amount, description)
      VALUES (
        vMemberFk,
        1,
        2,
        (vPrice + vBenefit),
        CONCAT('assignació ', vDescription, ' ', vFallaYearFk)
      );

    UPDATE lottery
      SET isAssigned = 1
      WHERE id = vId;
  END LOOP;

  CLOSE cur;

  COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calculateFallaYear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculateFallaYear`(OUT vSelf INT)
BEGIN
	DECLARE vDate DATETIME;
	DECLARE vDay INT;
    DECLARE vMonth INT;
    DECLARE vYear INT;
   
	SET vDate = NOW();
	SET vDay = DAY(vDate);
    SET vMonth = MONTH(vDate);
    SET vYear = YEAR(vDate);
   
   	CASE
	   	WHEN vMonth > 3 THEN
	   		SET vSelf = vYear + 1;
	   	WHEN vMonth < 2 THEN
	   		SET vSelf = vYear;
	   	WHEN vMonth = 3 AND vDay > 19 THEN 
	   		SET vSelf = vYear + 1;
	   	WHEN vMonth = 3 AND vDay <= 19 THEN
	   		SET vSelf = vYear;
	END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calculateMemberCategory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculateMemberCategory`(
	IN vBirthdate DATETIME, OUT vCategoryFk INT
)
BEGIN
	DECLARE vFallaAge INT;
	CALL calculateMemberFallaAge(vBirthdate, vFallaAge);
	CASE 
		WHEN vFallaAge < 5 THEN
			SET vCategoryFk = 5;
		WHEN vFallaAge >= 5 AND vFallaAge <= 9 THEN
			SET vCategoryFk = 4;
		WHEN vFallaAge >= 10 AND vFallaAge <= 13 THEN
			SET vCategoryFk = 3;
		WHEN vFallaAge >= 14 AND vFallaAge <= 17 THEN
			SET vCategoryFk = 2;
		ELSE
			SET vCategoryFk = 1;
	END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `calculateMemberFallaAge` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `calculateMemberFallaAge`(IN vBirthdate DATETIME, OUT vFallaAge INT)
BEGIN
	DECLARE vFallaYear INT;
    DECLARE vFallaDate DATETIME;

    CALL getCurrentFallaYear(vFallaYear);
   	SET vFallaDate = DATE(CONCAT(vFallaYear, '-03-19'));
    SET vFallaAge = YEAR(vFallaDate)-YEAR(vBirthdate);
    IF (MONTH(vFallaDate) < MONTH(vBirthdate) OR (MONTH(vFallaDate) = MONTH(vBirthdate) AND DAY(vFallaDate) < DAY(vBirthdate))) THEN
    SET vFallaAge = vFallaAge - 1;
END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `changeFallaYear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `changeFallaYear`()
BEGIN
	
	DECLARE vFallaYear INT;
	DECLARE vNewFallaYear INT;
	
	DECLARE EXIT HANDLER FOR SQLEXCEPTION
	BEGIN
	    ROLLBACK;
	    RESIGNAL;
	END;
	
	START TRANSACTION;
		
	SELECT MAX(code) INTO vFallaYear
	    FROM fallaYear
		WHERE finished IS NULL
		FOR UPDATE;
	
	IF vFallaYear IS NULL THEN
	    SIGNAL SQLSTATE '45000'
	    SET MESSAGE_TEXT = 'No hi ha cap exercici obert';
	END IF;
		
	CALL insertSummaryMembersFallaYear(vFallaYear);
	
	UPDATE fallaYear
		SET finished = NOW() WHERE code = vFallaYear;
	
	SET vNewFallaYear = vFallaYear + 1;
	
	
	IF NOT EXISTS (
	    SELECT 1 FROM fallaYear WHERE code = vNewFallaYear
	) THEN
	    INSERT INTO fallaYear (code, created)
	    VALUES (vNewFallaYear, NOW());
	END IF;
	
	UPDATE member
	SET categoryFk = calculateMemberCategory(birthDate, vNewFallaYear)
	WHERE isRegistered;
	
	INSERT INTO movement (
	    amount,
	    idType,
	    idConcept,
	    memberFk,
	    description,
	    fallaYearFk
	)
	SELECT
	    s.difference,
	    1,
	    1,
	    s.memberFk,
	    'any anterior',
	    vNewFallaYear
	FROM summaryMembersFallaYear s
	WHERE s.fallaYearFk = vFallaYear
	  AND s.difference <> 0;
	
	INSERT INTO membershipHistory (
		fallaYearFk,
		position,
		falla,
		memberFk
	)
	SELECT vNewFallaYear,
		'vocal',
		'Sants Patrons',
		s.memberFk
	FROM summaryMembersFallaYear s
	WHERE s.fallaYearFk = vFallaYear;
	
	CALL regenerateBalance;
	
	COMMIT;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getCurrentDate` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `getCurrentDate`(INOUT vDate DATETIME)
BEGIN
	IF vDate IS NULL THEN
        SET vDate = NOW();
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `getCurrentFallaYear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `getCurrentFallaYear`(INOUT vFallaYear INT)
BEGIN
	DECLARE vLastFallaYear INT;

	SELECT code INTO vLastFallaYear
	FROM fallaYear ORDER BY code DESC LIMIT 1;

	IF vFallaYear IS NULL THEN
		SET vFallaYear = vLastFallaYear;
	END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertBalance` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertBalance`(
	IN vId INT
)
BEGIN
	DECLARE vFallaYearFk INT;
	DECLARE vInitialFeeAssigned DECIMAL(10, 2);
	DECLARE vFamilyDiscount DECIMAL(10, 2);
	DECLARE vTotalFeeAssigned DECIMAL(10,2) DEFAULT 0;
	DECLARE vTotalFeePayed DECIMAL(10,2) DEFAULT 0;
	DECLARE vTotalLotteryAssigned DECIMAL(10,2) DEFAULT 0;
	DECLARE vTotalLotteryPayed DECIMAL(10,2) DEFAULT 0;
	DECLARE vTotalRaffleAssigned DECIMAL(10,2) DEFAULT 0;
	DECLARE vTotalRafflePayed DECIMAL(10,2) DEFAULT 0;
	
	CALL getCurrentFallaYear(vFallaYearFk);
	
	SELECT fee INTO vInitialFeeAssigned
		FROM category c
			JOIN member m ON c.id = m.categoryFk
		WHERE m.id = vId;
	
	SELECT discount INTO vFamilyDiscount
		FROM family f
			JOIN member m ON f.id = m.familyFk
		WHERE m.id = vId;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalFeeAssigned
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 1
			AND idConcept = 1;
	
	SET vInitialFeeAssigned = vInitialFeeAssigned - (vFamilyDiscount * vInitialFeeAssigned / 100);
	SET vTotalFeeAssigned = vTotalFeeAssigned + vInitialFeeAssigned;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalFeePayed
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 2
			AND idConcept = 1;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalLotteryAssigned
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 1
			AND idConcept = 2;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalLotteryPayed
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 2
			AND idConcept = 2;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalRaffleAssigned
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 1
			AND idConcept = 3;

	SELECT IFNULL(SUM(amount), 0) INTO vTotalRafflePayed
		FROM movement
		WHERE memberFk = vId
			AND fallaYearFk = vFallaYearFk
			AND idType = 2
			AND idConcept = 3;

	INSERT INTO balance (memberFk, feeAssigned, feePayed, lotteryAssigned, lotteryPayed, raffleAssigned, rafflePayed)
		VALUES (vId, vTotalFeeAssigned, vTotalFeePayed, vTotalLotteryAssigned, vTotalLotteryPayed, vTotalRaffleAssigned, vTotalRafflePayed);		
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `insertSummaryMembersFallaYear` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `insertSummaryMembersFallaYear`(IN vFallaYearFk INT)
BEGIN
    INSERT INTO summaryMembersFallaYear (
        fallaYearFk,
        memberFk,
        assignedFee,
        assignedLottery,
        assignedRaffle,
        payedFee,
        payedLottery,
        payedRaffle
    )
    SELECT vFallaYearFk,
	        b.memberFk,
	        b.feeAssigned,
	        b.lotteryAssigned,
	        b.raffleAssigned,
	        b.feePayed,
	        b.lotteryPayed,
	        b.rafflePayed
    	FROM balance b;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `modifyMembershipHistory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `modifyMembershipHistory`(
	IN vId INT, IN vIsRegistered BOOLEAN
)
BEGIN
	DECLARE vIsCurrentlyRegistered BOOLEAN;
	DECLARE vFallaYear INT;

	CALL getCurrentFallaYear(vFallaYear);

	SELECT isRegistered INTO vIsCurrentlyRegistered FROM member WHERE id = vId;

		IF vIsCurrentlyRegistered = 0 AND vIsRegistered = 1 THEN
			INSERT INTO membershipHistory (
				fallaYearFk, position, falla, memberFk
			) VALUES (vFallaYear, 'vocal', 'Sants Patrons', vId);
		END IF;
	
		IF vIsCurrentlyRegistered = 1 AND vIsRegistered = 0 THEN
			DELETE FROM membershipHistory
			WHERE memberFk = vId AND fallaYearFk = vFallaYear;
		END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `regenerateBalance` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_unicode_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `regenerateBalance`()
BEGIN
    DECLARE vDone INT DEFAULT 0;
    DECLARE vId INT;
    DECLARE vCursor CURSOR FOR 
        SELECT id
            FROM member
            WHERE isRegistered = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET vDone = 1;

    DELETE FROM balance;

    OPEN vCursor;

    read_loop: LOOP
        FETCH vCursor INTO vId;
        IF vDone THEN
            LEAVE read_loop;
        END IF;

        CALL sp.insertBalance(vId);
    END LOOP read_loop;

    CLOSE vCursor;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `registerAllDirectDebitPayments` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `registerAllDirectDebitPayments`(
	IN in_transaction_date DATE,
    IN in_description TEXT
)
BEGIN
    DECLARE done_dd INT DEFAULT FALSE;
    DECLARE v_dd_id INT;
    DECLARE v_dd_amount DECIMAL(10,2);
    DECLARE v_fallaYearFk INT;

    DECLARE cur_dd CURSOR FOR
        SELECT id, actualAmount FROM directDebit;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done_dd = TRUE;
    
    SELECT code INTO v_fallaYearFk
    	FROM fallaYear
    	ORDER BY code DESC
    	LIMIT 1;

    OPEN cur_dd;

    dd_loop: LOOP
        FETCH cur_dd INTO v_dd_id, v_dd_amount;
        IF done_dd THEN
            LEAVE dd_loop;
        END IF;

        BEGIN
            DECLARE done_mb INT DEFAULT FALSE;
            DECLARE v_member_id INT;
            DECLARE v_pending DECIMAL(10,2);
            DECLARE v_payment DECIMAL(10,2);

            DECLARE cur_mb CURSOR FOR
                SELECT id FROM member WHERE directDebitFk = v_dd_id ORDER BY id;

            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done_mb = TRUE;

            OPEN cur_mb;

            fee_loop: LOOP
                FETCH cur_mb INTO v_member_id;
                IF done_mb THEN
                    LEAVE fee_loop;
                END IF;

                IF v_dd_amount <= 0 THEN
                    LEAVE fee_loop;
                END IF;

                SELECT (feeAssigned - feePayed)
                	INTO v_pending
                	FROM balance
                	WHERE memberFk = v_member_id;

                IF v_pending > 0 THEN
                    SET v_payment = LEAST(v_pending, v_dd_amount);

                    INSERT INTO movement (
                        transactionDate, amount, idType, idConcept,
                        memberFk, fallaYearFk, description
                    ) VALUES (
                        in_transaction_date, v_payment, 2, 1,
                        v_member_id, v_fallaYearFk, in_description
                    );

                    SET v_dd_amount = v_dd_amount - v_payment;
                END IF;
            END LOOP;

            CLOSE cur_mb;
        END;

        BEGIN
            DECLARE done_mb INT DEFAULT FALSE;
            DECLARE v_member_id INT;
            DECLARE v_pending DECIMAL(10,2);
            DECLARE v_payment DECIMAL(10,2);

            DECLARE cur_mb CURSOR FOR
                SELECT id FROM member WHERE directDebitFk = v_dd_id ORDER BY id;

            DECLARE CONTINUE HANDLER FOR NOT FOUND SET done_mb = TRUE;

            OPEN cur_mb;

            raffle_loop: LOOP
                FETCH cur_mb INTO v_member_id;
                IF done_mb THEN
                    LEAVE raffle_loop;
                END IF;

                IF v_dd_amount <= 0 THEN
                    LEAVE raffle_loop;
                END IF;

                SELECT (raffleAssigned - rafflePayed)
                	INTO v_pending
                	FROM balance
                	WHERE memberFk = v_member_id;

                IF v_pending > 0 THEN
                    SET v_payment = LEAST(v_pending, v_dd_amount);

                    INSERT INTO movement (
                        transactionDate, amount, idType, idConcept,
                        memberFk, fallaYearFk, description
                    ) VALUES (
                        in_transaction_date, v_payment, 2, 3,
                        v_member_id, v_fallaYearFk, in_description
                    );

                    SET v_dd_amount = v_dd_amount - v_payment;
                END IF;
            END LOOP;

            CLOSE cur_mb;
        END;

    END LOOP;

    CLOSE cur_dd;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `registerFamilyPayment` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `registerFamilyPayment`(
	IN vFamilyFk INT,
    IN vAmount DECIMAL(10, 2),
    IN vIdConcept INT,
    IN vPayMethod VARCHAR(20)
)
BEGIN
	DECLARE vDone INT DEFAULT FALSE;
	DECLARE vMemberFk INT;
	DECLARE vPending DECIMAL(10, 2);
	DECLARE vPayment DECIMAL(10, 2);
	DECLARE vRemaining DECIMAL(10, 2);
	DECLARE vLastMemberFk INT;
	DECLARE vDescription TEXT;

	DECLARE cur_mb CURSOR FOR
		SELECT id
			FROM member
			WHERE familyFk = vFamilyFk
				AND isRegistered = 1
			ORDER BY id;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET vDone = TRUE;
	
	SET vRemaining = vAmount;
	
	SELECT id INTO vLastMemberFk
		FROM member
		WHERE familyFk = vFamilyFk
			AND isRegistered = 1
		ORDER BY id DESC
		LIMIT 1;
	
	IF vPayMethod = 'cash' THEN
		SET vDescription = 'pagat en caixa';
    ELSEIF vPayMethod = 'bank' THEN
        SET vDescription = 'pagat pel banc';
	END IF;
	
	OPEN cur_mb;
	
	pay_loop: LOOP
		FETCH cur_mb INTO vMemberFk;
		IF vDone THEN
			LEAVE pay_loop;
		END IF;
	
		IF vRemaining <= 0 THEN
			LEAVE pay_loop;
		END IF;
		
		IF vIdConcept = 1 THEN
			SELECT (feeAssigned - feePayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		
		ELSEIF vIdConcept = 2 THEN
			SELECT (lotteryAssigned - lotteryPayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		
		ELSEIF vIdConcept = 3 THEN
			SELECT (raffleAssigned - rafflePayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		END IF;
		
		IF vPending <= 0 THEN
			ITERATE pay_loop;
		END IF;
		
		SET vPayment = LEAST(vPending, vRemaining);
		
		INSERT INTO movement (
			transactionDate,
			amount,
			idType,
			idConcept,
			memberFk,
			description
		) VALUES (
			NOW(),
			vPayment,
			2,
			vIdConcept,
			vMemberFk,
			vDescription
		);
		
		SET vRemaining = vRemaining - vPayment;
		
	END LOOP;
	
	CLOSE cur_mb;
	
	IF vRemaining > 0 THEN
		INSERT INTO movement (
			transactionDate,
			amount,
			idType,
			idConcept,
			memberFk,
			description
		) VALUES (
			NOW(),
			vRemaining,
			2,
			vIdConcept,
			vLastMemberFk,
			vDescription
		);
	END IF;
	
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateCalculatedAmounts` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `updateCalculatedAmounts`(IN vMonthsRemaining INT)
BEGIN
    UPDATE directDebit dd
    JOIN (
        SELECT
            m.directDebitFk,
            SUM(b.feeAssigned + b.raffleAssigned - b.feePayed - b.rafflePayed) totalDebt
        FROM member m
        	JOIN balance b ON b.memberFk = m.id
        WHERE m.directDebitFk IS NOT NULL
        GROUP BY m.directDebitFk
    ) sub ON sub.directDebitFk = dd.id
    SET dd.calculatedAmount = ROUND(sub.totalDebt / vMonthsRemaining, 2);
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `updateFamilyDiscount` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`develimp`@`%` PROCEDURE `updateFamilyDiscount`(IN vFamilyFk INT)
BEGIN
    DECLARE vMembers INT DEFAULT 0;
    DECLARE vDiscount INT DEFAULT 0;

    SELECT COUNT(*) INTO vMembers
        FROM member
        WHERE familyFk = vFamilyFk
            AND isRegistered = 1;

    SET vDiscount =
        CASE
            WHEN vMembers <= 2 THEN 0
            WHEN vMembers = 3 THEN 5
            ELSE 10
        END;

    UPDATE family
        SET discount = vDiscount
        WHERE id = vFamilyFk;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'IGNORE_SPACE,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;
/*!50003 DROP PROCEDURE IF EXISTS `upsertMembershipHistory` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `upsertMembershipHistory`(
	IN vMemberFk INT, 
    IN vFallaYearFk INT, 
    IN vFalla VARCHAR(50), 
    IN vPosition VARCHAR(30)
)
BEGIN
	DECLARE vCreated DATE;
    DECLARE vFinished DATE;

    SET vCreated = CONCAT(vFallaYearFk - 1, '-03-20');
    SET vFinished = CONCAT(vFallaYearFk, '-03-19');

    IF NOT EXISTS (
        SELECT 1 FROM fallaYear WHERE code = vFallaYearFk
    ) THEN
        INSERT INTO fallaYear (code, created, finished)
        VALUES (vFallaYearFk, vCreated, vFinished);
    END IF;

    IF EXISTS (
        SELECT 1 FROM membershipHistory
        WHERE memberFk = vMemberFk AND fallaYearFk = vFallaYearFk
    ) THEN
        UPDATE membershipHistory
        SET falla = vFalla, `position` = vPosition
        WHERE memberFk = vMemberFk AND fallaYearFk = vFallaYearFk;
    ELSE
        INSERT INTO membershipHistory (memberFk, fallaYearFk, falla, `position`)
        VALUES (vMemberFk, vFallaYearFk, vFalla, vPosition);
    END IF;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-08 20:29:53