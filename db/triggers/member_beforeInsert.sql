USE sp;

CREATE TRIGGER member_beforeInsert
BEFORE INSERT
ON `member` FOR EACH ROW
BEGIN
	DECLARE vFallaYearFk INT;

	SET vFallaYearFk = getCurrentFallaYear();
	SET NEW.categoryFk = calculateMemberCategory(NEW.birthdate, vFallaYearFk);
END