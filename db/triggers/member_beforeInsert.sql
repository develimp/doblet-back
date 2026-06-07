USE sp;

CREATE TRIGGER member_beforeInsert
BEFORE INSERT
ON `member` FOR EACH ROW
BEGIN
	IF NEW.categoryFk IS NULL THEN
		SET NEW.categoryFk = sp.calculateMemberCategory(NEW.birthdate, getCurrentFallaYear());
	END IF;
END