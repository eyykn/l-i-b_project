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


function getSalesByInfo(type, q){
    if (type === "" || q === "") {
        alert("Please specify a type and/or query to get sales for or use the profit by date generator above.");
    } 
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