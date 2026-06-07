DROP PROCEDURE IF EXISTS sp.registerFamilyPayment;

CREATE PROCEDURE `sp`.`registerFamilyPayment`(
    IN vFamilyFk INT,
    IN vAmount DECIMAL(10, 2),
    IN vIdConcept INT,
    IN vPayMethod VARCHAR(20)
)
BEGIN
	DECLARE vDone INT DEFAULT FALSE;
	DECLARE vMemberFk INT;
	DECLARE vPending DECIMAL(10, 2);
	DECLARE vPayment DECIMAL(10, 2);
	DECLARE vRemaining DECIMAL(10, 2);
	DECLARE vLastMemberFk INT;
	DECLARE vDescription TEXT;

	DECLARE cur_mb CURSOR FOR
		SELECT id
			FROM member
			WHERE familyFk = vFamilyFk
				AND isRegistered = 1
			ORDER BY id;
	
	DECLARE CONTINUE HANDLER FOR NOT FOUND SET vDone = TRUE;
	
	SET vRemaining = vAmount;
	
	SELECT id INTO vLastMemberFk
		FROM member
		WHERE familyFk = vFamilyFk
			AND isRegistered = 1
		ORDER BY id DESC
		LIMIT 1;
	
	IF vPayMethod = 'cash' THEN
		SET vDescription = 'pagat en caixa';
    ELSEIF vPayMethod = 'bank' THEN
        SET vDescription = 'pagat pel banc';
	END IF;
	
	OPEN cur_mb;
	
	pay_loop: LOOP
		FETCH cur_mb INTO vMemberFk;
		IF vDone THEN
			LEAVE pay_loop;
		END IF;
	
		IF vRemaining <= 0 THEN
			LEAVE pay_loop;
		END IF;
		
		IF vIdConcept = 1 THEN
			SELECT (feeAssigned - feePayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		
		ELSEIF vIdConcept = 2 THEN
			SELECT (lotteryAssigned - lotteryPayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		
		ELSEIF vIdConcept = 3 THEN
			SELECT (raffleAssigned - rafflePayed) INTO vPending
				FROM balance
				WHERE memberFk = vMemberFk;
		END IF;
		
		IF vPending <= 0 THEN
			ITERATE pay_loop;
		END IF;
		
		SET vPayment = LEAST(vPending, vRemaining);
		
		INSERT INTO movement (
			transactionDate,
			amount,
			idType,
			idConcept,
			memberFk,
			description
		) VALUES (
			NOW(),
			vPayment,
			2,
			vIdConcept,
			vMemberFk,
			vDescription
		);
		
		SET vRemaining = vRemaining - vPayment;
		
	END LOOP;
	
	CLOSE cur_mb;
	
	IF vRemaining > 0 THEN
		INSERT INTO movement (
			transactionDate,
			amount,
			idType,
			idConcept,
			memberFk,
			description
		) VALUES (
			NOW(),
			vRemaining,
			2,
			vIdConcept,
			vLastMemberFk,
			vDescription
		);
	END IF;
	
END