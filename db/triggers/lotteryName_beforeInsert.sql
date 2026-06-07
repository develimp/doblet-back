CREATE TRIGGER lotteryName_beforeInsert
BEFORE INSERT
ON lotteryName FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = getCurrentFallaYear();
END