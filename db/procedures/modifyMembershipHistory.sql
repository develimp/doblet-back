DROP PROCEDURE IF EXISTS sp.modifyMembershipHistory;

CREATE PROCEDURE `sp`.`modifyMembershipHistory`(
	IN vId INT, IN vIsRegistered BOOLEAN
)
BEGIN
	DECLARE vIsCurrentlyRegistered BOOLEAN;
	DECLARE vFallaYear INT;

	SET vFallaYear = getCurrentFallaYear();

	SELECT isRegistered INTO vIsCurrentlyRegistered FROM member WHERE id = vId;

		IF vIsCurrentlyRegistered = 0 AND vIsRegistered = 1 THEN
			INSERT INTO membershipHistory (
				fallaYearFk, position, falla, memberFk
			) VALUES (vFallaYear, 'vocal', 'Sants Patrons', vId);
		END IF;
	
		IF vIsCurrentlyRegistered = 1 AND vIsRegistered = 0 THEN
			DELETE FROM membershipHistory
			WHERE memberFk = vId AND fallaYearFk = vFallaYear;
		END IF;
END