Ece Yaykiran (#101101184)

COMP3005 Project - Instructions to Compile/Run:

1. Download project code.

2. Go to the project directory and type: 
  1a. npm install
  
  This will download the dependencies listed in the package.json file.

3. Go to your PostgreSQL client (pgAdmin) and create a databse titled "lookInnaBook" and copy-paste the contents of the "DDL.sql" file in the SQL folder into the query editor of the database. 

    This will create the database the JS application uses. 

4. Again in your PostgreSQL client (pgAdmin) and copy-paste the contents of the "insertionsFile.sql" file in the SQL folder into the query editor of the database. 

    This will populate the database the JS application uses. 

5. Go to the server.js file and update lines 12 and 15 to include your PostgreSQL user details, specifically the user and password details. 

    This will ensure the JS application can connect to the database created. 

6. Open a terminal window and type then run the follwoing command: node server.js
  
  This will run the server, which will display the home page on localhost:3000.

7. Open a browser window and go to the following address: localhost:3000. I've used Google Chrome. 

8. Interact with the web app as you please. 
