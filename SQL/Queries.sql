--Please note some of these queries will not work in PostgreSql if copied & pasted as they rely on values input into the JS application 
--I will mark these input values to the JS code as input_<attribute> in the following queries
--These queries' originals can also be found in the server.js file by searching for SQLquery in the file (all queries have that variable name)

--Retrieves the information for an owner having the input email and password combination, used to verify login 
SELECT DISTINCT * FROM owner WHERE email='input_email' AND password='input_password';

--Inserts new customer record
INSERT INTO owner VALUES (DEFAULT, 'input_email', 'input_password', 'input_name', 'input_address', input_phone_num, input_salary);

--Inserts new customer record
INSERT INTO customer VALUES (DEFAULT, 'input_email', 'input_password', 'input_name', 'input_address', input_phone_num);

--Retrieves the information for a customer having the input email and password combination, used to verify login 
SELECT DISTINCT * FROM customer WHERE email='input_email' AND password='input_password';

--Retrieve selected a book's name, author, publisher_ID,  for all books
SELECT DISTINCT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID;

--Retrieve selected attributes for all books matching the input criteria (numeric attributes)
SELECT DISTINCT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID WHERE book_price=input_price OR num_of_pages=input_pages;

--Retrieve selected attributes for all books matching the input criteria (string attributes)
SELECT DISTINCT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book  INNER JOIN publisher using(publisher_ID) GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID WHERE book_name='input_name' OR book_author='input_author' OR genre='input_genre';
