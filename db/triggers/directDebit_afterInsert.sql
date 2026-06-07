CREATE TRIGGER directDebit_afterInsert
AFTER INSERT
ON directDebit FOR EACH ROW
BEGIN
	UPDATE member
	SET directDebitFk = NEW.id
	WHERE id = NEW.memberFk;
END