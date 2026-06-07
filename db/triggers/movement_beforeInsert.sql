USE sp;

CREATE TRIGGER movement_beforeInsert
BEFORE INSERT
ON movement FOR EACH ROW
BEGIN
	DECLARE latestReceipt INT DEFAULT 0;

	SET NEW.fallaYearFk = (
  	SELECT code FROM sp.fallaYear ORDER BY code DESC LIMIT 1
	);

	IF NEW.description = 'pagat en caixa' THEN
		SELECT IFNULL(MAX(receiptNumber),0)
			INTO latestReceipt
			FROM sp.movement
			WHERE fallaYearFk = NEW.FallaYearFk;
	
		SET NEW.receiptNumber = latestReceipt + 1;
	END IF;
END