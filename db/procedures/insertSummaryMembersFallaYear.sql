DROP PROCEDURE IF EXISTS sp.insertSummaryMembersFallaYear;

CREATE PROCEDURE `sp`.`insertSummaryMembersFallaYear`(IN vFallaYearFk INT)
BEGIN
    INSERT INTO summaryMembersFallaYear (
        fallaYearFk,
        memberFk,
        assignedFee,
        assignedLottery,
        assignedRaffle,
        payedFee,
        payedLottery,
        payedRaffle
    )
    SELECT vFallaYearFk,
	        b.memberFk,
	        b.feeAssigned,
	        b.lotteryAssigned,
	        b.raffleAssigned,
	        b.feePayed,
	        b.lotteryPayed,
	        b.rafflePayed
    	FROM balance b;
END