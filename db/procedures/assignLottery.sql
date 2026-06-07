DROP PROCEDURE IF EXISTS sp.assignLottery;

CREATE PROCEDURE `sp`.`assignLottery`(IN vLotteryNameFk INT)
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
END