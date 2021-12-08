--Retrieves all order info related to order ID passed in
create function getOrderInfo(orderID integer)
    returns setof order_all_details
	language plpgsql
as
$$
begin
   	return QUERY
	select distinct *
	from order_all_details
	where order_ID = orderID;
end;
$$;

--Retrieves order total for order ID passed in
create function getOrderTotal(orderID integer)
    returns numeric
	language plpgsql
as
$$
declare
	orderTotal numeric;
begin
	select sum((book_price * quantity)) as total
	into orderTotal
	from order_all_details
	where order_ID=orderID;
	
	return orderTotal;
end;
$$;


--Retrieves all order info and sum related to info passed in
create function getTotalForInfo(attr varchar, val varchar)
    returns numeric
	language plpgsql
as
$$
declare
	sumTotal numeric;
begin
	EXECUTE 'SELECT sum(sumTot) as sumAll FROM (SELECT DISTINCT ' 
			|| quote_ident(attr) 
			||', SUM(book_price * quantity) as sumTot FROM order_all_details WHERE '
			|| quote_ident(attr) 
			|| '=' 
			|| quote_literal(val) 
			||' GROUP BY '
			|| quote_ident(attr) 
			||') as subQ;'
    INTO sumTotal;
	
	RETURN sumTotal;
end;
$$;

--Retrieves all order info and sum related to numeric info passed in
create function getTotalForInfoNumeric(attr varchar, val numeric)
    returns numeric
	language plpgsql
as
$$
declare
	sumTotal numeric;
begin
	EXECUTE 'SELECT sum(sumTot) as sumAll FROM (SELECT DISTINCT ' 
			|| quote_ident(attr) 
			||', SUM(book_price * quantity) as sumTot FROM order_all_details WHERE '
			|| quote_ident(attr) 
			|| '=' 
			|| quote_literal(val) 
			||' GROUP BY '
			|| quote_ident(attr) 
			||') as subQ;'
    INTO sumTotal;
	
	RETURN sumTotal;
end;
$$;


--Function that stock_reorder trigger uses to email the publisher to reorder new books
CREATE FUNCTION email_publisher_reorder() 
   RETURNS TRIGGER 
   LANGUAGE PLPGSQL
AS $$
BEGIN
   	IF  (NEW.stock <= 10) THEN
		UPDATE book SET stock=OLD.stock+10 WHERE book_ID=NEW.book_ID AND book_name=NEW.book_name AND book_author=NEW.book_author;
	END IF;

	RETURN NEW;
END;
$$;
