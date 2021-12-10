--Retrieves all order info related to order ID passed in
CREATE FUNCTION getOrderInfo(orderID integer)
    RETURNS setof order_all_details
	LANGUAGE plpgsql
AS
$$
BEGIN
   	RETURN QUERY
	SELECT distinct *
	FROM order_all_details
	WHERE order_ID = orderID;
END;
$$;

--Retrieves order total for order ID passed in
CREATE FUNCTION getOrderTotal(orderID integer)
    RETURNS numeric
	LANGUAGE plpgsql
AS
$$
DECLARE
	orderTotal numeric;
BEGIN
	SELECT sum((book_price * quantity)) AS total
	into orderTotal
	FROM order_all_details
	WHERE order_ID=orderID;
	
	RETURN orderTotal;
END;
$$;


--Retrieves all order info and sum related to info passed in
CREATE FUNCTION getTotalForInfo(attr varchar, val varchar)
    RETURNS numeric
	LANGUAGE plpgsql
AS
$$
DECLARE
	sumTotal numeric;
BEGIN
	EXECUTE 'SELECT sum(sumTot) AS sumAll FROM (SELECT DISTINCT ' 
			|| quote_ident(attr) 
			||', SUM(book_price * quantity) AS sumTot FROM order_all_details WHERE '
			|| quote_ident(attr) 
			|| '=' 
			|| quote_literal(val) 
			||' GROUP BY '
			|| quote_ident(attr) 
			||') AS subQ;'
    INTO sumTotal;
	
	RETURN sumTotal;
END;
$$;

--Retrieves all order info and sum related to numeric info passed in
CREATE FUNCTION getTotalForInfoNumeric(attr varchar, val numeric)
    RETURNS numeric
	LANGUAGE plpgsql
AS
$$
DECLARE
	sumTotal numeric;
BEGIN
	EXECUTE 'SELECT sum(sumTot) AS sumAll FROM (SELECT DISTINCT ' 
			|| quote_ident(attr) 
			||', SUM(book_price * quantity) AS sumTot FROM order_all_details WHERE '
			|| quote_ident(attr) 
			|| '=' 
			|| quote_literal(val) 
			||' GROUP BY '
			|| quote_ident(attr) 
			||') AS subQ;'
    INTO sumTotal;
	
	RETURN sumTotal;
END;
$$;


--Function that stock_reorder trigger uses to email the publisher to reorder new books
CREATE FUNCTION email_publisher_reorder() 
   RETURNS TRIGGER 
   LANGUAGE plpgsql
AS $$
BEGIN
   	IF  (NEW.stock <= 10) THEN
		UPDATE book SET stock=NEW.stock+10 WHERE book_ID=NEW.book_ID AND book_name=NEW.book_name AND book_author=NEW.book_author;
	END IF;

	RETURN NEW;
END;
$$;
