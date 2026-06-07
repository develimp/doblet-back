DROP FUNCTION IF EXISTS sp.calculateMemberCategory;

CREATE FUNCTION `sp`.`calculateMemberCategory`(vBirthdateFk DATE, vFallaYearFk INT) RETURNS INT
	DETERMINISTIC
BEGIN
	DECLARE vFallaAge INT;
	DECLARE vCategoryFk INT;

	SET vFallaAge = calculateMemberFallaAge(vBirthdateFk, vFallaYearFk);

	CASE 
		WHEN vFallaAge < 5 THEN
			SET vCategoryFk = 5;
		WHEN vFallaAge BETWEEN 5 AND 9 THEN
			SET vCategoryFk = 4;
		WHEN vFallaAge BETWEEN 10 AND 13 THEN
			SET vCategoryFk = 3;
		WHEN vFallaAge BETWEEN 14 AND 17 THEN
			SET vCategoryFk = 2;
		ELSE
			SET vCategoryFk = 1;
	END CASE;

	RETURN vCategoryFk;
END