// Function to send a request to get the expenditures with the input query and response to the results to html page
function getExpenditures(q){
    if (q === "") {
      q = 'all';
    }
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            document.getElementById("reportResults").innerHTML = `<p>Expenditures for "${q}" date: ${request.responseText}</p>`;
        } else if (request.status === 500) {
            alert(request.responseText);
        }
      };
      request.open('POST', window.location.href+'/expenditures', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.query=q;
      request.send(JSON.stringify(requestObj)); //Send request
}

// Function to send a request to get the sales with the input query and response to the results to html page
function getSales(q){
    console.log("getSales Called");
    if (q === "") {
      q = 'all';
    } 
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            document.getElementById("reportResults").innerHTML = `<p>Sales total for "${q}" date: ${request.responseText}</p>`;
        } else if (request.status === 500) {
            alert(request.responseText);
        }
      };
      request.open('POST', window.location.href+'/sales', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.query=q;
      request.send(JSON.stringify(requestObj)); //Send request
}

// Function to send a request to get the sales with the input queries and response to the results to html page
function getSalesByInfo(type, q){
    if (type === "" || q === "") {
        alert("Please specify a type and/or query to get sales for or use the profit by date generator above.");
    } else {
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            document.getElementById("reportResults").innerHTML = `<p>Sales total for "${q}" info: ${request.responseText}</p>`;
        } else if (request.status === 500) {
            alert(request.responseText);
        }
      };
      request.open('POST', window.location.href+'/salesInfo', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.type=type;
      requestObj.query=q;
      request.send(JSON.stringify(requestObj)); //Send request
    }
}


// Function to send a request to get the profits (sales - expenditure) with the input query and response to the results to html page
function getProfits(q){
    console.log("getProfits Called");
    if (q === "") {
      q = 'all';
    } 
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            document.getElementById("reportResults").innerHTML = `<p>Profits for "${q}" date: ${request.responseText}</p>`;
        } else if (request.status === 500) {
            alert(request.responseText);
        }
      };
      request.open('POST', window.location.href+'/profits', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.query=q;
      request.send(JSON.stringify(requestObj)); //Send request
}