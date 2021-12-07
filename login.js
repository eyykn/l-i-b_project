function verifyLogin(e, p){
    if (e === "" || p === "") {
      alert("Please enter complete login details and try again!");
    } else {
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              if (request.status === 200) {
                window.location.replace("/bookBrowse");
              } else if (request.status === 401) {
                alert("Please enter correct login details and try again!");
              } else {
                alert(request.responseText);
              }
          } 
      };
      request.open('POST', window.location.href+'/verify', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.email=e;
      requestObj.password=p;
      request.send(JSON.stringify(requestObj)); //Send request
    }
}

function addLogin(e, p, n, a, pN, sal){
    if (e === "" || p === "") {
      alert("Please enter complete login details and try again!");
    } else {
      //Make a get request to the database
      let request = new XMLHttpRequest();
      request.onreadystatechange = function() {
          if (request.readyState === 4) {
              if (request.status === 200) {
                window.location.replace("/customerLogin");
              } else {
                alert(request.responseText);
              }
          } 
      };
      request.open('POST', window.location.href+'/create', true);
      request.setRequestHeader("Content-Type", "application/json");
      //Creates object to send to server side with name and review
      let requestObj= {};
      requestObj.email=e;
      requestObj.password=p;
      requestObj.name=n;
      requestObj.address=a;
      requestObj.phoneNum=pN;
      if (window.location.href.includes('ownerLogin')) {
        requestObj.salary=sal;
      }
      request.send(JSON.stringify(requestObj)); //Send request
    }
}
