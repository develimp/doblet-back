USE sp;

CREATE TRIGGER member_beforeUpdate
BEFORE UPDATE
ON `member` FOR EACH ROW
BEGIN
	IF OLD.birthDate <> NEW.birthDate THEN
		SET NEW.categoryFk = sp.calculateMemberCategory(NEW.birthdate, getCurrentFallaYear());
		CALL modifyMembershipHistory(NEW.id, NEW.isRegistered);
	END IF;
END