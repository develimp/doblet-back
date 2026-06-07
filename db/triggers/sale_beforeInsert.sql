CREATE TRIGGER sale_beforeInsert
BEFORE INSERT
ON sale FOR EACH ROW
BEGIN
	SET NEW.fallaYearFk = getCurrentFallaYear();
END