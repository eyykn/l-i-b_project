const express= require('express');
const path = require('path');
const pug = require("pug");
const { Client } = require('pg'); //PostgreSQL node connection module
var _ = require('lodash');
const app = express();
global.TextEncoder = require("util").TextEncoder;
const { TextDecoder } = require('util');const { random } = require('lodash');
 global.TextDecoder = TextDecoder;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'lookInnaBook',
  password: '2000',
  port: 5432,
});

client.connect().then(() => {
  app.listen(3000);
  console.log("Server listening at http://localhost:3000");
});

//Session Vars
let loggedIn = false;
let loggedInUserInfo = {};
let loggedAsOwner = false;

//Global Vars
let searchResults = [-100];
let bookQuery = "";

const renderBrowsePage = pug.compileFile('views/pages/bookBrowse.pug');
const renderResultsPage = pug.compileFile('views/pages/bookResult.pug');
const renderOrdersPage = pug.compileFile('views/pages/orders.pug');
const renderOrderPage = pug.compileFile('views/pages/order.pug');


//Automatically parse JSON data
app.use(express.json());
// Set the view engine to be Pug
app.set("view engine", "pug");

//Handler for homepage request: GET /
app.get("/", (req, res)=> {
  console.log("Called GET request for /");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    res.render("pages/index");
  }
});

//Handler for request: GET /ownerLogin
app.get("/ownerLogin", (req, res)=> {
  console.log("Called GET request for /ownerLogin");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    res.render("pages/ownerLogin");
  }
});

//Handler for request: GET /login.js
app.get("/login.js", (req, res)=> {
  console.log("Called GET request for /login.js");
  res.sendFile(path.join(__dirname + '/login.js'));
});

//Handler for request: GET /purchasing.js
app.get("/purchasing.js", (req, res)=> {
  console.log("Called GET request for /purchasing.js");
  res.sendFile(path.join(__dirname + '/purchasing.js'));
});

//Handler for request: POST /ownerLogin/verify
app.post("/ownerLogin/verify", async (req, res)=> {
  console.log("Called POST request for /ownerLogin/verify");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    let email=req.body.email;
    let password=req.body.password;
    let SQLquery = `SELECT DISTINCT * FROM owner WHERE email='${email}' AND password='${password}'`;
    let expectedQResp = {
      email: email,
      password: password
    };
    try {
      const response = await client.query(SQLquery);
      if(response.rows[0]) {
        let respOnlyEmPass = {
          email: response.rows[0].email,
          password: response.rows[0].password,
        };
        if (_.isEqual(respOnlyEmPass, expectedQResp)) {
          loggedAsOwner = true;
          loggedIn = true;
          loggedInUserInfo = response.rows[0];
          res.writeHead(200).send();
        } else {
          res.writeHead(401).send();
        }
      } else {
        res.writeHead(401).send();
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send(JSON.stringify(err.stack));
    }
  }
});

//Handler for request: GET /customerCreate
app.get("/ownerCreate", (req, res)=> {
  console.log("Called GET request for /ownerCreate");
  res.render("pages/ownerCreate");
});

//Handler for request: POST /ownerLogin/verify
app.post("/ownerCreate/create", async (req, res)=> {
  console.log("Called POST request for /ownerCreate/create");
  let email=req.body.email;
  let password=req.body.password;
  let name=req.body.name;
  let address=req.body.address;
  let phoneNum=parseInt(req.body.phoneNum);
  let salary=parseFloat(req.body.phoneNum).toFixed(2);
  let nextID = 0;
  let SQLquery = `SELECT MAX(ID) FROM customer`;
  try {
      const response = await client.query(SQLquery);
      if (response.rows) {
        nextID = response.rows[0].max +1;
      } 
      SQLquery = `INSERT INTO customer VALUES (${nextID}, '${email}', '${password}', '${name}', '${address}', ${phoneNum})`;
      await client.query(SQLquery);
      await client.query('COMMIT');
      SQLquery =  `INSERT INTO owner VALUES (${nextID}, '${email}', '${password}', '${name}', '${address}', ${phoneNum}, ${salary})`;
      idCount+=1;
      await client.query(SQLquery);
      await client.query('COMMIT');
      res.status(200).send();
    } catch (e) {
      await client.query('ROLLBACK');
      res.status(500).send(JSON.stringify(e));
    }
});

//Handler for request: GET /customerLogin
app.get("/customerLogin", (req, res)=> {
  console.log("Called GET request for /customerLogin");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    res.render("pages/customerLogin");
  }
});

//Handler for request: POST /ownerLogin/verify
app.post("/customerLogin/verify", async (req, res)=> {
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    console.log("Called POST request for /customerLogin/verify");
    let email=req.body.email;
    let password=req.body.password;
    let SQLquery = `SELECT DISTINCT * FROM customer WHERE email='${email}' AND password='${password}'`;
    let expectedQResp = {
      email: email,
      password: password
    };
    try {
      const response = await client.query(SQLquery);
      if(response.rows[0]) {
        let respOnlyEmPass = {
          email: response.rows[0].email,
          password: response.rows[0].password,
        };
        if (_.isEqual(respOnlyEmPass, expectedQResp)) {
          loggedAsOwner = false;
          loggedIn = true;
          loggedInUserInfo = response.rows[0];
          res.writeHead(200).send();
        } else {
          res.writeHead(401).send();
        }
      } else {
        res.writeHead(401).send();
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send(JSON.stringify(err.stack));
    }
  }
});

//Handler for request: GET /customerCreate
app.get("/customerCreate", (req, res)=> {
  console.log("Called GET request for /customerCreate");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    if (!loggedIn && !loggedAsOwner) {
      console.log("Not authorized to access this page... Redirecting to home, please login!");
      res.redirect('/');
    } else{
      res.render("pages/customerCreate");
    }
  }
});

//Handler for request: POST /ownerLogin/verify
app.post("/customerCreate/create", async (req, res)=> {
  console.log("Called POST request for /customerLogin/create");
  if (loggedIn) {
    res.redirect("/bookBrowse");
  } else {
    let email=req.body.email;
    let password=req.body.password;
    let name=req.body.name;
    let address=req.body.address;
    let phoneNum=parseInt(req.body.phoneNum);
    let SQLquery = `INSERT INTO customer VALUES (DEFAULT, '${email}', '${password}', '${name}', '${address}', ${phoneNum})`;
    try {
        await client.query(SQLquery);
        await client.query('COMMIT');
        res.status(200).send();
      } catch (e) {
        await client.query('ROLLBACK');
        res.status(500).send(JSON.stringify(e));
      }
  }
});


//Handler for request: GET /bookBrowse
app.get("/bookBrowse", async (req, res)=> {
  console.log("Called GET request for /bookBrowse");
  if (!loggedIn) {
    console.log("Not authorized to access this page... Redirecting to home, please login!");
    res.redirect('/');
  } else{
    let data = renderBrowsePage({loggedAsOwner, loggedInUserInfo});
    res.send(data);
  }
});

//Handler for request: GET /bookBrowse/search
app.post("/bookBrowse/search", async (req, res)=> {
  console.log("Called POST request for /bookBrowse/search");
  if (!loggedIn) {
    console.log("Not authorized to access this page... Redirecting to home, please login!");
    res.redirect('/');
  } else{
    let query=req.body.query;
    let SQLquery;
    if (query === 'all') {
      SQLquery = `SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID`;
    } else{
      if (!isNaN(query)) {
        let qNum = parseFloat(query).toFixed(2);;
        SQLquery = `SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) WHERE book_price=${qNum} OR num_of_pages=${qNum} GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID`;
      } else {
        SQLquery = `SELECT book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID FROM book INNER JOIN publisher using(publisher_ID) WHERE book_name='${query}' OR book_author='${query}' OR genre='${query}' OR publisher_name='${query}' GROUP BY book_name, book_author, publisher_name, book_price, genre, num_of_pages, genre, stock, book_ID`;
      }
    }
    try {
      const response = await client.query(SQLquery);
      if(response.rows[0]) {
        searchResults = response.rows;
        console.log(response.rows);
        bookQuery = query;
        res.status(200).send('result success');
        console.log("searchResults" + JSON.stringify(searchResults));
      } else {
        res.status(401).send('result fail');
      } 
    } catch (err) {
      console.log(err.stack);
      res.status(500).send(JSON.stringify(err.stack));
    }
  }
});

//Handler for request: GET /bookBrowse
app.get("/bookResult", async (req, res)=> {
  console.log("Called GET request for /bookResult");
  console.log("searchResults" + JSON.stringify(searchResults));
  if (searchResults[0] === -100) {
    res.redirect('/bookBrowse');
  } else{
    let searchArr = searchResults.map((item) => Object.values(item));
    console.log("searchArr" + JSON.stringify(searchArr));
    let data = renderResultsPage({loggedAsOwner, loggedInUserInfo, bookQuery, searchArr});
    searchResults = [-100];
    bookQuery = "";
    res.send(data);
  }
});


//Handler for request: GET /bookBrowse
app.post("/bookResult/order", async (req, res)=> {
  console.log("Called GET request for /bookResult/order");
  let shipAddress=req.body.shipAddr;
  let billAddress=req.body.billAddr;
  let cardNum=req.body.cardNum;
  let cardDate=req.body.cardDate;
  let cardCVV=parseInt(req.body.cardCVV);
  let orderItems=req.body.cart;
  //CURRENT_TIMESTAMP()
  console.log(JSON.stringify(orderItems));
  idCount = parseInt(loggedInUserInfo.id)+1;
  console.log(loggedInUserInfo);
  console.log(loggedInUserInfo.id);
  let nextID = 0;
  let nextOrderID = 0;
  let SQLquery = `SELECT MAX(tracking_id) FROM tracking`;
  try {
    let response = await client.query(SQLquery);
    if (response.rows) {
      nextID = response.rows[0].max +1;
      console.log(nextID);
    } 
    SQLquery = `SELECT MAX(order_ID) FROM orderR`;
    response = await client.query(SQLquery);
    if (response.rows) {
      nextOrderID = response.rows[0].max +1;
      console.log(nextOrderID);
    } 
    SQLquery = `INSERT INTO tracking VALUES (${nextID}, DEFAULT, DEFAULT)`;
    await client.query(SQLquery);
    await client.query('COMMIT');
    SQLquery = `INSERT INTO orderR VALUES (${nextOrderID}, ${loggedInUserInfo.id}, '${loggedInUserInfo.email}', ${nextID}, '${billAddress}', '${shipAddress}', ${cardNum}, '${cardDate}', ${cardCVV}, CURRENT_TIMESTAMP)`;
    await client.query(SQLquery);
    await client.query('COMMIT'); 
    Object.values(orderItems).forEach(async (item) => {
      console.log(Object.values(orderItems));
      let stock;
      let newStock;
      SQLquery = `SELECT DISTINCT stock FROM book WHERE book_ID=${item.book_ID} AND book_name='${item.book_name}' AND book_author='${item.book_author}'`;
      try {
        const response = await client.query(SQLquery);
        if(response.rows[0]) {
          stock = response.rows[0].stock;
          newStock = stock - item.quantity;
        }
        SQLquery = `UPDATE book SET stock=${newStock} WHERE book_ID=${item.book_ID} AND book_name='${item.book_name}' AND book_author='${item.book_author}'`;
        await client.query(SQLquery);
        await client.query('COMMIT');
        SQLquery = `INSERT INTO order_book VALUES (${nextOrderID}, ${item.book_ID}, '${item.book_name}', '${item.book_author}', ${item.quantity})`;
        await client.query(SQLquery);
        await client.query('COMMIT');
        res.status(200).send('order success');
      } catch (err) {
        await client.query('ROLLBACK');
        console.log(err.stack);
        res.status(500).send(JSON.stringify(err));
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.log(err.stack);
    res.status(500).send(JSON.stringify(err));
  }
});

//Handler for request: GET /orders
app.get("/orders", async (req, res)=> {
  console.log("Called GET request for /orders");
  let SQLquery = `SELECT DISTINCT order_ID FROM orderR WHERE ID=${loggedInUserInfo.id}`;
  let ordersInfo = [];
  try {
    const response = await client.query(SQLquery);
    console.log(JSON.stringify(response.rows));
    if(response.rows) {
      ordersInfo = response.rows;
    } 
    let data = renderOrdersPage({loggedAsOwner, loggedInUserInfo, ordersInfo});
    res.send(data);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send(JSON.stringify(err.stack));
  }
});


//Handler for request: GET /orders/:id
app.get("/orders/:id", async (req, res)=> {
  let orderID = req.params.id;
  console.log("Called GET request for /orders/" + orderID);
  let SQLquery = `SELECT DISTINCT * FROM getOrderInfo(${orderID});`;
  let orderInfos = [];
  let orderInfo = {};
  try {
    let response = await client.query(SQLquery);
    if(response.rows) {
      orderInfos = response.rows;
      console.log(orderInfos);
    } 
    SQLquery = `SELECT DISTINCT * FROM getOrderTotal(${orderID});`;
    response = await client.query(SQLquery);
    let totalPrice  = response.rows[0].getordertotal; 
    orderInfos.forEach((info) => {
      if (!orderInfo[orderID]) {
        orderInfo[orderID] = {
          orderID: orderID,
          shipAddr: info.shipping_address,
          billAddr: info.billing_address,
          trackingID: info.tracking_id,
          orderTime: info.order_date_time.toString(),
          books: [`${info.book_name} x ${info.quantity}`],
          totalPrice: totalPrice,
        };
      } else {
        let tempArr = orderInfo[orderID].books;
        tempArr.push(`${info.book_name} x ${info.quantity}`);
        orderInfo[orderID].books = tempArr;
      }
    });
    orderInfo = orderInfo[orderID];
    let data = renderOrderPage({loggedAsOwner, loggedInUserInfo, orderInfo});
    res.send(data);
  } catch (err) {
    console.log(err.stack);
    res.status(500).send(JSON.stringify(err.stack));
  }
});

//Handler for request: GET /orders
app.get("/orders/:id/:trackingID", async (req, res)=> {
  let orderID = req.params.id;
  let trackingID = req.params.trackingID;
  let minsPassed;
  let trackingInfo;
  let shipAddr;
  console.log("Called GET request for /orders/" + orderID + "/" + trackingID);
  try {
    let SQLquery = `SELECT DISTINCT shipping_address FROM orderR WHERE tracking_id=${trackingID} AND order_ID=${orderID}`;
    let response = await client.query(SQLquery);
    if(response.rows) {
      shipAddr = response.rows[0].shipping_address;
      console.log("shipAddr" + shipAddr);
    }
    SQLquery = `SELECT DISTINCT difference FROM get_time_since_order WHERE tracking_id=${trackingID};`;
    response = await client.query(SQLquery);
    if(response.rows) {
      let timePassed = response.rows[0].difference;
      minsPassed = timePassed.minutes;
    }
    console.log(minsPassed);
    if (minsPassed >= 2 && minsPassed < 5) {
      SQLquery = `UPDATE tracking SET tracking_address='2 InTransit St, London EC1A 7JQ, United Kingdom', tracking_status='In Transit'`;
    } else if (minsPassed >= 5) {
      SQLquery = `UPDATE tracking SET tracking_address='${shipAddr}', tracking_status='Delivered'`;
    }
    await client.query(SQLquery);
    await client.query('COMMIT');
    SQLquery = `SELECT DISTINCT tracking_address, tracking_status FROM tracking WHERE tracking_id=${trackingID}`;
    response = await client.query(SQLquery);
    if(response.rows) {
      let trackingAddr = response.rows[0].tracking_address;
      let tracking_status = response.rows[0].tracking_status;
      trackingInfo = [trackingAddr, tracking_status];
      console.log("trackingInfo" + trackingInfo);
    }
    res.send({trackingInfo});
  } catch (err) {
    console.log(err.stack);
    await client.query('ROLLBACK');
    res.status(500).send(JSON.stringify(err.stack));
  }
});

//Handler for request: GET /logout
app.get("/logout", async (req, res)=> {
  console.log("Called GET request for /bookBrowse");
  if (!loggedIn) {
    console.log("Not logged in... Redirecting to home, please login!");
  } else{
    console.log("Sucessfully logged out!");
    loggedIn = false;
    loggedAsOwner = false;
    loggedInUserInfo = {};
  }
  res.redirect('/');
});