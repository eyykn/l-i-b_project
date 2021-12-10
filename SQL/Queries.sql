--IMPORTANT NOTE: some/most of these queries will not work in PostgreSql if copied & pasted as they rely on values input into the JS application; it is passed into a node js module sending the string queries to the postgres database it is connected to so they are in the string query as string interpolation. 
--For the above query types I have kept the JS syntax used as is in code (seen from $ signs) since the queries won't work copy pasted in SQL and it makes it obvious which queries use what in code variables
--Again, for the above query types, originals can also be found in the server.js file by searching for SQLquery or SQLquerySales or SQLqueryExpend in the file (almost all of the queries have SQLquery variable name and a few have SQLquerySales or SQLqueryExpend) 

--Retrieves the information for an owner having the input email and password combination, used to verify login [line 86 in server.js]
SELECT DISTINCT * FROM owner WHERE email='${email}' AND password='${password}';

--Gets current largest tracking_ID in tracking relation [lines 132 and 226 in server.js]
SELECT MAX(ID) FROM customer;

--Inserts new customer record/tuple with specified ID [line 136 and 233 in server.js]
INSERT INTO customer VALUES (${nextID}, '${email}', '${password}', '${name}', '${address}', ${phoneNum});

--Inserts new owner record/tuple [line 141 in server.js]
INSERT INTO owner VALUES (${nextID}, '${email}', '${password}', '${name}', '${address}', ${phoneNum}, ${salary});

--Retrieves the information for a customer having the input email and password combination, used to verify login [line 169 in server.js]
SELECT DISTINCT * FROM customer WHERE email='${email}' AND password='${password}';

--Commits insertions [many lines in server.js, has to be called after insert/update queries, required by nodejs pg module]
COMMIT;

--Rollsback insertions [many lines in server.js, called in case of error after insert/update queries]
ROLLBACK;

--Retrieves the book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID attributes for all book record/tuples (book relation aggregated with publisher relation) [line 267 in server.js]
SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID;

--Retrieves the book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID attributes for books matching or similar to the given numeric criteria (book relation aggregated with publisher relation) [line 271 in server.js]
SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) WHERE CAST(ROUND(book_price, 0) as char)~CAST(ROUND(${qNum},0) as char) OR num_of_page=${qNum} OR stock=${qNum} GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID;

--Retrieves the book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID attributes for books books matching or similar to the given varchar criteria (book relation aggregated with publisher relation) [line 273 in server.js]
SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) WHERE book_name~'${query}' OR book_author~'${query}' OR genre~'${query}' OR publisher_name~'${query}' GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID;

--Retrieves current largest tracking_ID in tracking relation [line 324 in server.js]
SELECT MAX(tracking_id) FROM tracking;

--Retrieves current largest order_ID in orderR relation [line 331 in server.js]
SELECT MAX(order_ID) FROM orderR;

--Inserts a tracking record/tuple with given tracking_ID value to the tracking relation [line 337 in server.js]
INSERT INTO tracking VALUES (${nextID}, DEFAULT, DEFAULT);

--Inserts an order record/tuple with given values into orderR relation [line 340 in server.js]
INSERT INTO orderR VALUES (${nextOrderID}, ${loggedInUserInfo.id}, '${loggedInUserInfo.email}', ${nextID}, '${billAddress}', '${shipAddress}', ${cardNum}, '${cardDate}', ${cardCVV}, CURRENT_TIMESTAMP(0)::TIMESTAMP WITHOUT TIME ZONE);

--Retrieves the stock for an input book [line 347 in server.js]
SELECT DISTINCT stock FROM book WHERE book_ID=${item.book_ID} AND book_name='${item.book_name}' AND book_author='${item.book_author}';

--Updates the stock for an input book (if this is below 10 which is the threshold for all books then trigger activates) [line 354 in server.js]
UPDATE book SET stock=${newStock} WHERE book_ID=${item.book_ID} AND book_name='${item.book_name}' AND book_author='${item.book_author}';

--Inserts order_book record/tuple to order_book relation with input values [line 357 in server.js]
INSERT INTO order_book VALUES (${nextOrderID}, ${item.book_ID}, '${item.book_name}', '${item.book_author}', ${item.quantity});

--Retrieves all order_IDs for input user ID (so all orders for a user) [line 380 in server.js]
SELECT DISTINCT order_ID FROM orderR WHERE ID=${loggedInUserInfo.id};

--Retrieves all attributes returned by calling the getOrderInfo function defined in Functions.sql for an input order_ID. Function returns all order info related to order ID passed in (aggregate of orderR, order_book, and book relations) [line 402 in server.js]
SELECT DISTINCT * FROM getOrderInfo(${orderID});

--Retreives order total for by calling the getOrderTotal function defined in Functions.sql for an input order_ID. Function returns sum of all book prices for a given order [line 411 in server.js]
SELECT DISTINCT * FROM getOrderTotal(${orderID});

--Retrieves the shipping address for a given order matching the input order_ID and tracking_ID [line 455 in server.js]
SELECT DISTINCT shipping_address FROM orderR WHERE tracking_id=${trackingID} AND order_ID=${orderID};

--Retrieves the time difference between current time this query is called and the timestamp of the order (order_date_time attribute), uses the get_time_since_order view defined in Views.sql  [line 448 in server.js]
SELECT DISTINCT difference FROM get_time_since_order WHERE tracking_id=${trackingID};

--Updates the tracking information (tracking address and status) for a given tracking_ID to have fixed in-transit info [line 463 in server.js]
UPDATE tracking SET tracking_address='2 InTransit St, London EC1A 7JQ, United Kingdom', tracking_status='In Transit' WHERE tracking_id=${trackingID};

--Updates the tracking information (tracking address and status) for a given tracking_ID to be user's shipping address and delievered status [line 465 in server.js]
UPDATE tracking SET tracking_address='${shipAddr}', tracking_status='Delivered' WHERE tracking_id=${trackingID};

--Retrieves the tracking address and status for a given tracking_ID [line 469 in server.js]
SELECT DISTINCT tracking_address, tracking_status FROM tracking WHERE tracking_id=${trackingID};

--Retrieves/Returns the total sum of sum of each order (so basically sum of all order totals) for a given date range, uses the order_totals_for_dates view defined in Views.sql [lines 522 and 641 in server.js]
SELECT SUM(sum) FROM order_totals_for_dates WHERE date>='${date1}' and date <'${date2}'

--Retrieves/Returns the total sum of sum of each order (so basically sum of all order totals) for a given date, uses the order_totals_for_dates view defined in Views.sql [lines 524 and 644 in server.js]
SELECT SUM(sum) FROM order_totals_for_dates WHERE date = '${date1}';

--Retrieves/Returns the total sum of sum of each order (so basically sum of all order totals) for all dates (all-time), uses the order_totals_for_dates view defined in Views.sql [lines 527 and 648 in server.js]
SELECT SUM(sum) FROM order_totals_for_dates;

--Retrieves the total sum earned from every sale having the numeric query value provided for the numeric typed attribute name provided, uses the getTotalForInfoNumeric having dynamic SQL in Functions.sql [line 552 in server.js]
SELECT * FROM getTotalForInfoNumeric('${type}', ${query});

--Retrieves the total sum earned from every sale having the varchar query value provided for the varchar typed attribute name provided, uses the getTotalForInfo having dynamic SQL in Functions.sql [line 555 in server.js]
SELECT * FROM getTotalForInfo('${type}', '${query}');

--Retrieves the sum of (sum of publishers' cut) and (sum of salary paid to owner for a day) for a given date range, uses the salary_paid_totals_for_day and publisher_paid_totals_for_dates views defined in Views.sql [lines 593 and 642 in server.js]
SELECT (SUM(publisher_paid_totals_for_dates.sum) + (SUM(salary_paid_totals_for_day.sum) * ${daysBetween})) AS expenditure FROM salary_paid_totals_for_day, publisher_paid_totals_for_dates WHERE date>='${date1}' AND date <'${date2}';

--Retrieves the sum of (sum of publishers' cut) and (sum of salary paid to owner for a day) for a given date, uses the salary_paid_totals_for_day and publisher_paid_totals_for_dates views defined in Views.sql [line 595 and 645 in server.js]
SELECT (SUM(salary_paid_totals_for_day.sum) + SUM(publisher_paid_totals_for_dates.sum)) AS expenditure FROM salary_paid_totals_for_day, publisher_paid_totals_for_dates WHERE date='${date1}';

--Retrieves the sum of (sum of publishers' cut) and (sum of salary paid to owner for a day) for all dates (all-time), uses the salary_paid_totals_for_day and publisher_paid_totals_for_dates views defined in Views.sql [line 596 and 649 in server.js]
SELECT (SUM(salary_paid_totals_year.sum) + SUM(publisher_paid_totals_for_dates.sum)) AS expenditure FROM salary_paid_totals_year, publisher_paid_totals_for_dates;

--Retrieves the sum of salary paid to owner for a day for all dates (all-time), uses the salary_paid_totals_for_day view defined in Views.sql [lines 606 and 660 in server.js]
SELECT (SUM(salary_paid_totals_for_day.sum)) AS expenditure FROM salary_paid_totals_for_day;

--Retrieves current largest tracking_ID in tracking relation [line 702 in server.js]
SELECT MAX(book_id) FROM book;

--Inserts a book record/tuple with the given information into the book relation [line 705 in server.js]
INSERT INTO book VALUES (${nextID}, '${bookName}', '${bookAuth}', ${pubID}, '${pubEm}', ${pubPerc}, ${bookPrice}, '${bookGen}', ${bookPages}, ${bookSt});

--Deletes a book record/tuple with the given information from the book relation [line 723 in server.js]
DELETE FROM book WHERE book_id=${bookID} AND book_name='${bookName}' AND book_author='${bookAuth}';