DROP PROCEDURE IF EXISTS sp.getCurrentDate;

CREATE PROCEDURE `sp`.`getCurrentDate`(INOUT vDate DATETIME)
BEGIN
	IF vDate IS NULL THEN
        SET vDate = NOW();
    END IF;
END