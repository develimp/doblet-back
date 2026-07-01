USE sp;

CREATE TRIGGER member_afterUpdate
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
END