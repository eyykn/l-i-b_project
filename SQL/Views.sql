-- Create order detail view
 CREATE VIEW order_all_details AS 
    SELECT distinct *
    from orderR inner join order_book using(order_ID) inner join book using(book_Id, book_name, book_author);