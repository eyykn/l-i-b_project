--Trigger to check stock for each book, if it is equal to or less than 10, then 10 new gets reordered
CREATE TRIGGER stock_reorder AFTER UPDATE ON book
FOR EACH ROW
EXECUTE PROCEDURE email_publisher_reorder();