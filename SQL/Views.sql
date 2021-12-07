-- Create order detail view
 CREATE VIEW order_all_details AS 
    SELECT distinct *
    from orderR inner join order_book using(order_ID) inner join book using(book_Id, book_name, book_author);

--Gets difference between current time and time since order
create view get_time_since_order AS
	SELECT distinct tracking_ID, AGE(current_timestamp, order_date_time) AS difference
	FROM orderR;