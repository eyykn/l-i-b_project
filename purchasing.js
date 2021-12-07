let cart = {};

function getResults(q){
    if (q === "") {
      q = 'all';
    } 
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              if (request.status === 200 && request.responseText === 'result success') {
                window.location.replace("/bookResult");
              } else if(request.status === 401 && request.responseText === 'result fail') {
                alert(`No results found for query ${q}, adjust search and try again...`);
              }
              else {
                alert(request.responseText);
              }
          } 
      };
      request.open('POST', window.location.href+'/search', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.query=q;
      request.send(JSON.stringify(requestObj)); //Send request
}

function placeOrder(shipA, billA, cardN, cardD, cardC){
  if (shipA === "" || billA === "" || cardN === "" || cardD === "" || cardC === "") {
    alert("Please enter complete login details and try again!");
  } else {
    //Make a get request to the database
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200 && request.responseText === 'order success') {
              alert("Order Placed");
              window.location.replace("/orders");
            } else {
              alert(request.responseText);
            }
        } 
    };
    request.open('POST', window.location.href+'/order', true);
    request.setRequestHeader("Content-Type", "application/json");
    //Creates object to send to server side with name and review
    let requestObj= {};
    requestObj.shipAddr=shipA;
    requestObj.billAddr=billA;
    requestObj.cardNum=cardN;
    requestObj.cardDate=cardD;
    requestObj.cardCVV=cardC;
    requestObj.cart=cart;
    request.send(JSON.stringify(requestObj)); //Send request
  }
}

function addToCart(id){
  document.getElementById("items").innerHTML = "";
  //Make a get request to the database
  let item = document.getElementById(id).innerHTML;
  let semiColonIndices = [];
  let commaIndices = [];
  for(var i=0; i<item.length;i++) {
    if (item[i] === ":") semiColonIndices.push(i);
    if (item[i] === ",") commaIndices.push(i);
  }
  let sIndex = -1;
  let cIndex = -1;
  let stock = item.slice(semiColonIndices[semiColonIndices.length-1]+2, commaIndices[commaIndices.length-1]);
  if (cart[id]) {
    let quantity = cart[id].quantity;
    if (stock < quantity+1) {
      cart[id].quantity += 1;
    } else {
      alert("Not enough in stock");
    }
  } else{
    if (stock < 1) {
      cart[id] = {
        book_ID: id,
        book_name: item.slice(semiColonIndices[sIndex+=1]+2, commaIndices[cIndex+=1]),
        book_author: item.slice(semiColonIndices[sIndex+=1]+2, commaIndices[cIndex+=1]),
        quantity: 1
      };
    } else {
      alert("Not enough in stock");
    }
  }
  Object.values(cart).forEach((val) => {
    document.getElementById("items").innerHTML += `<li><p>"Title: ${val.book_name}, Author: ${val.book_author}, Quantity: ${val.quantity}"</p><button id="remBtn" value="-" onclick="removeFromCart(${val.book_ID})")></button></li>`;
  });
  console.log(JSON.stringify(cart));
}


function removeFromCart(id){
  if (cart[id].quantity === 1) {
    delete cart[id];
  } else {
    cart[id].quantity -=  1;
  }
  document.getElementById("items").innerHTML = "";
  Object.values(cart).forEach((val) => {
    document.getElementById("items").innerHTML += `<li><p>"Title: ${val.book_name}, Author: ${val.book_author}, Quantity: ${val.quantity}"</p><button id="remBtn" value="-" onclick="removeFromCart(${val.book_ID})")></button></li>`;
  });
}


function goToSearch(){
  if (cart) {
    alert("Please complete current order before making another search or cart contents will be lost!");
  } else {
    window.location.replace("/bookBrowse");
  }
}

function doneOrder(){
  if (cart) {
    document.getElementById("checkoutInfo").innerHTML = `<h3>Shipping Address:</h3><input type="textbox" id="shipAddr"/><h3>Billing Address:</h3><input type="textbox" id="billAddr"/><h3>Card Num:</h3><input type="textbox" id="cardNum"/><h3>Card Date:</h3><input type="textbox" id="cardDate"/><h3>Card CVV:</h3><input type="textbox" id="cardCVV"/>`;
  } else  {
    alert("Add items to cart before finalizing order!");
  }
}