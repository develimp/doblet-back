DROP FUNCTION IF EXISTS sp.calculateMemberFallaAge;

CREATE FUNCTION `sp`.`calculateMemberFallaAge`(vBirthdateFk DATE, vFallaYearFk INT) RETURNS INT
    DETERMINISTIC
BEGIN
    DECLARE vFallaDate DATETIME;
    DECLARE vFallaAge INT;

    SET vFallaDate = STR_TO_DATE(CONCAT(vFallaYearFk, '-03-19'), '%Y-%m-%d');

    SET vFallaAge = YEAR(vFallaDate) - YEAR(vBirthdateFk);

    IF (
        MONTH(vFallaDate) < MONTH(vBirthdateFk)
        OR (
            MONTH(vFallaDate) = MONTH(vBirthdateFk)
            AND DAY(vFallaDate) < DAY(vBirthdateFk)
        )
    ) THEN
        SET vFallaAge = vFallaAge - 1;
    END IF;

    RETURN vFallaAge;
END