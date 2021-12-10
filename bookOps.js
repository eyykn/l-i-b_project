let cart = {};

// Function to send a request to get the search result with the input query 
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

// Function to send a request to server that triggers order addition to database with given details, empties checkout details upon success.
function placeOrder(shipA, billA, cardN, cardD, cardC){
  if (shipA === "" || billA === "" || cardN === "" || cardD === "" || cardC === "") {
    alert("Please enter complete checkout details and try again!");
  } else {
    //Make a get request to the database
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200 && request.responseText === 'order success') {
              alert("Order Placed");
              cart = {};
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

// Function to add input product to cart
function addToCart(id){
  document.getElementById("items").innerHTML = "";
  //Make a get request to the database
  let item = document.getElementById(id).innerHTML;
  let eql_indices = [];
  let commaIndices = [];
  for(var i=0; i<item.length;i++) {
    if (item[i] === "=") eql_indices.push(i);
    if (item[i] === ",") commaIndices.push(i);
  }
  let sIndex = -1;
  let cIndex = -1;
  let stock = item.slice(eql_indices[eql_indices.length-1]+2, commaIndices[commaIndices.length-1]);
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
        book_name: item.slice(eql_indices[sIndex+=1]+2, commaIndices[cIndex+=1]),
        book_author: item.slice(eql_indices[sIndex+=1]+2, commaIndices[cIndex+=1]),
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

// Function to remove input product to cart
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

// Function to reload page for new search 
function goToSearch(){
  if (document.getElementById("items").innerHTML !== "") {
    alert("Please complete current order before making another search or cart contents will be lost!");
  } else {
    window.location.replace("/bookBrowse");
  }
}

// Function to add display of form to complete order checkout
function doneOrder(){
  if (cart) {
    document.getElementById("checkoutInfo").innerHTML = `<h3>Shipping Address:</h3><input type="textbox" id="shipAddr"/><h3>Billing Address:</h3><input type="textbox" id="billAddr"/><h3>Card Num:</h3><input type="textbox" id="cardNum"/><h3>Card Date:</h3><input type="textbox" id="cardDate"/><h3>Card CVV:</h3><input type="textbox" id="cardCVV"/>`;
  } else  {
    alert("Add items to cart before finalizing order!");
  }
}

// Function to send a request to get the tracking details with the input query 
function trackOrder(trackingID){
    //Make a get request to the database
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4) {
            if (request.status === 200) {
              let data = JSON.parse(request.responseText);
              data = data.trackingInfo;
              document.getElementById("trackingInfo").innerHTML = `<h3>Current Address: ${data[0]}, Status: ${data[1]}</h3>`;
            } else if(request.status === 401 && request.responseText === 'result fail') {
              document.getElementById("trackingInfo").innerHTML = `<h3>No tracking info found try again...</h3>`;
            }
            else {
              alert(request.responseText);
            }
        } 
    };
    request.open('GET', window.location.href+'/' + trackingID, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(); //Send request
}

// Function to send request to server that triggers the addition or removal of book wth input details
function submitChange(aT, bI, bN, bA, pubI, pubE, pubP, bP, bG, bPG, bS){
  if ((aT === 'REMOVE') && (bI === "" || bN === "" || bA === "")) {
      alert("Please enter complete removal details and try again!");
  } else if ((aT === 'ADD') && (bN === "" || bA === "" || pubI === "" || pubE === "" || pubP === "" || bP === "" || bG === "" || bPG === "" || bS === "")) {
      alert("Please enter complete addition details and try again!");
  } else {
    let action = aT.toLowerCase();
    //Make a get request to the database
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            document.getElementById("removedConf").innerHTML = `<h3>"${aT}"" successful for "[${bI}, ${bN}, ${bA}]": ${request.responseText}</h3>`;
            document.getElementById('bookNm').value = "";
            document.getElementById('bookAuth').value  = "";
            document.getElementById('bookName').value = "";
            document.getElementById('bookAuthor').value  = "";
            document.getElementById('pubID').value  = "";
            document.getElementById('pubEm').value  = "";
            document.getElementById('pubPerc').value  = "";
            document.getElementById('bookPr').value  = "";
            document.getElementById('gen').value  = "";
            document.getElementById('bookNP').value  = "";
             document.getElementById('bookSt').value  = "";
        } else if (request.status === 500)  {
            alert(request.responseText);
        } 
    };
    request.open('POST', window.location.href+'/'+action, true);
    request.setRequestHeader("Content-Type", "application/json");
    //Creates object to send to server side with name and review
    let requestObj= {};
    requestObj.bookID=bI;
    requestObj.bookName=bN;
    requestObj.bookAuth=bA;
    if (action === 'add') {
      requestObj.pubID=pubI;
      requestObj.pubEm=pubE;
      requestObj.pubPerc=pubP;
      requestObj.bookPrice=bP;
      requestObj.bookGen=bG;
      requestObj.bookPages=bPG;
      requestObj.bookSt=bS;
    }
    request.send(JSON.stringify(requestObj)); //Send request
  }
}