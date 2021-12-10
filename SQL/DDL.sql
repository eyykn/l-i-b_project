--Creates publisher relation
create table publisher
	(publisher_ID		            integer, 
     publisher_email		       varchar(30), 
     publisher_name		            varchar(30), 
     publisher_address		       varchar(50), 
	publisher_phone_number		  numeric(12,0),
     bank_account_num   		       numeric(10,0),
	primary key (publisher_ID, publisher_email)
	);

--Creates customer relation
create table customer
	(ID		                        integer, 
     email		                   varchar(30), 
     password		                   varchar(30), 
     name		                        varchar(30), 
     address		                   varchar(50), 
	phone_number		              numeric(12,0),
	primary key (ID, email)   
	);

--Creates owner relation
create table owner
	(yearly_salary   		        numeric(8,2) not null
	) inherits (customer);

--Creates book relation
create table book
	(book_ID		                  integer, 
     book_name		                  varchar(50), 
	book_author		             varchar(30), 
     publisher_ID                     integer, 
     publisher_email		        varchar(30), 
     publisher_percentage		   numeric(5,2),
     book_price		             numeric(6,2),
     genre		                  varchar(20), 
     num_of_pages		             numeric(7,0),
     stock		                  numeric(10,0),
	primary key (book_ID, book_name, book_author),
    foreign key (publisher_ID, publisher_email) references publisher
        on delete set null
	);

--Creates tracking relation
create table tracking
	(tracking_ID		             integer, 
     tracking_address		        varchar(50) default '1 Warehouse St, K15 8B6, Ottawa, ON, Canada', 
     tracking_status		        varchar(20) default 'Packaging Order', 
	 primary key (tracking_ID)
	);
	
--Creates orderR relation     
create table orderR
	(order_ID		                  integer, 
     ID		                       integer, 
     email		                  varchar(30),
     tracking_ID		             integer, 
     billing_address		        varchar(50), 
     shipping_address		        varchar(50), 
     card_num   		             numeric(10,0),
     card_expiration_date   		   varchar(7),
     card_cvv                         numeric(4,0),
     order_date_time                  timestamp without time zone,
	primary key (order_ID),
    foreign key (ID, email) references customer
        on delete set null,
    foreign key (tracking_ID) references tracking
        on delete set null
	);

--Creates order_book relation
create table order_book
	(order_ID		                  integer, 
     book_ID		                  integer, 
     book_name		                  varchar(30), 
	book_author		             varchar(30), 
     quantity		                  numeric(4,0),
	primary key (order_ID, book_ID, book_name, book_author),
     foreign key (order_ID) references orderR
        on delete cascade,
     foreign key (book_ID, book_name, book_author) references book
        on delete cascade
	);