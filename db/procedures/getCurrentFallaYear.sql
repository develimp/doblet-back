DROP FUNCTION IF EXISTS sp.getCurrentFallaYear;

CREATE FUNCTION `sp`.`getCurrentFallaYear`() RETURNS INT
	DETERMINISTIC
BEGIN
	DECLARE vLastFallaYear INT;

	SELECT code INTO vLastFallaYear
		FROM fallaYear
		ORDER BY code DESC
		LIMIT 1;

	RETURN vLastFallaYear;
END