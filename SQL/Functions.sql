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
