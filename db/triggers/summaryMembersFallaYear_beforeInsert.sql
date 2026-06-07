USE sp;

CREATE TRIGGER summaryMembersFallaYear_beforeInsert
BEFORE INSERT
ON summaryMembersFallaYear FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = getCurrentFallaYear();
END