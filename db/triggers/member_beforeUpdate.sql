USE sp;

CREATE TRIGGER member_beforeUpdate
BEFORE UPDATE
ON `member` FOR EACH ROW
BEGIN
	SET NEW.categoryFk = sp.calculateMemberCategory(NEW.birthdate, getCurrentFallaYear());
	CALL modifyMembershipHistory(NEW.id, NEW.isRegistered);
END