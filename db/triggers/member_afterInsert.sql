USE sp;

CREATE TRIGGER member_afterInsert
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
END