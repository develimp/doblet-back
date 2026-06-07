DROP PROCEDURE IF EXISTS sp.changeFallaYear;

CREATE PROCEDURE `sp`.`changeFallaYear`()
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
END