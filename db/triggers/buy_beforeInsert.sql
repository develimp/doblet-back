CREATE TRIGGER buy_beforeInsert
BEFORE INSERT
ON buy FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = getCurrentFallaYear();
END