DROP PROCEDURE IF EXISTS sp.regenerateBalance;

CREATE PROCEDURE `sp`.`regenerateBalance`()
BEGIN
    DECLARE vDone INT DEFAULT 0;
    DECLARE vId INT;
    DECLARE vCursor CURSOR FOR 
        SELECT id
            FROM member
            WHERE isRegistered = 1;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET vDone = 1;

    DELETE FROM balance;

    OPEN vCursor;

    read_loop: LOOP
        FETCH vCursor INTO vId;
        IF vDone THEN
            LEAVE read_loop;
        END IF;

        CALL sp.insertBalance(vId);
    END LOOP read_loop;

    CLOSE vCursor;
END