-- Create order detail view (aggregate of orderR, order_book, and book relations)
 CREATE VIEW order_all_details AS 
    SELECT distinct *
    FROM orderR INNER JOIN order_book USING(order_ID) INNER JOIN book USING(book_Id, book_name, book_author);

--Gets difference between current time and time since order
create view get_time_since_order AS
	SELECT distinct tracking_ID, AGE(current_timestamp, order_date_time) AS difference
	FROM orderR;

--Gets all order price totals and their dates (seperate totals for seperate orders)
CREATE VIEW order_totals_for_dates AS
	SELECT DISTINCT DATE(order_date_time) AS date, SUM(book_price * quantity)
	FROM order_all_details
	GROUP BY order_all_details.order_date_time;

--Gets all money paid to publishers from an order based on publisher_percentage and their dates (seperate totals for seperate orders)
CREATE VIEW publisher_paid_totals_for_dates AS
    SELECT DISTINCT DATE(order_date_time) AS date, SUM(book_price * (publisher_percentage/100))
    FROM order_all_details
    GROUP BY order_all_details.order_date_time;


--Gets all money paid to an owner for one day (assumes yearly salary is 8 hours per day for 260 days and all owners work all days) (seperate totals for seperate orders)
CREATE VIEW salary_paid_totals_for_day AS
	SELECT sum(yearly_salary/260)
	FROM owner
	GROUP BY ID;