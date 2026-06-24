DROP PROCEDURE IF EXISTS sp.updateFamilyDiscount;

CREATE PROCEDURE `sp`.`updateFamilyDiscount`(IN vFamilyFk INT)
BEGIN
    DECLARE vMembers INT DEFAULT 0;
    DECLARE vDiscount INT DEFAULT 0;

    SELECT COUNT(*) INTO vMembers
        FROM member
        WHERE familyFk = vFamilyFk
            AND isRegistered = 1;

    SET vDiscount =
        CASE
            WHEN vMembers <= 2 THEN 0
            WHEN vMembers = 3 THEN 5
            ELSE 10
        END;

    UPDATE family
        SET discount = vDiscount
        WHERE id = vFamilyFk;
END