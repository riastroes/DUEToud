function getOrders() {
    sendGetAllOrders();
}

function sendGetMyOrders(){
    var data = new Object();
    data.GUID = app.GUID;
    data.func ="getmyorders";

    var json = JSON.stringify(data);
    var request = new XMLHttpRequest();

    request.open('POST', app.localhost + "api/order/" + json , true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            if(this.response.indexOf("Error") < 0){
                var orders = JSON.parse(this.response);
                createTableMyOrders(orders);
            }
            else if(this.response == ""){
                var divorders = document.getElementById("divorders");
                divorders.innerHTML = "You have no orders yet."
            } else {
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }
        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
}
function createTableMyOrders(orders){
    var myorders = document.getElementById("myorders");
    var tab = "<table width='100%' class='tblorders'>"
    tab += "<tr><th>Ordernr</th>"
    tab += "<th>Order Date</th>"
    tab += "<th>Description</th>"
    tab += "<th>Delivery</th>"
    tab += "<th class='right'>Price</th>"
    tab += "<th class='right'>ShippingCost</th>"
    tab += "<th class='right'>Total</th>"
    tab += "<th class='right'>BTW</th>"
    tab += "<th>status</th>"

    tab += "</tr>";

    for(var i = 0; i < orders.length; i++){

        var ordernr = "DUET" + orders[i].DesignId +"-" + orders[i].MemberId +"-" + orders[i].Id
        var dat = new Date(orders[i].OrderDate);
            var strorderdate =  dat.getDate() +"-" + (dat.getMonth()+1) +"-" + dat.getFullYear();
            var strtime = dat.getHours() + ":" + dat.getMinutes();
        var confirmed ="";
        if(orders[i].Confirmed){confirmed ="yes";}else{confirmed ="no";}
        var description = "";
        if(orders[i].Sample){description ="Sample";}
        else if(orders[i].Photo){description ="Photo " + orders[i].Photosize;}
        else if(orders[i].Fabric){description = orders[i].Meters + " meters Fabric";}
        else {description = "";}
        var delivery = orders[i].DeliveryType;
        var ordercost  = orders[i].OrderCost.toFixed(2);
        var deliverycost = orders[i].DeliveryCost.toFixed(2);
        if(deliverycost == 0){deliverycost ="";}
        var total = orders[i].Total.toFixed(2);
        var btw = orders[i].BTW.toFixed(2);
        var status = "none";
        if(orders[i].Confirmed){status ="confirmed"};
        if(orders[i].Payed){status ="in progress"};
        if(orders[i].Processed && delivery =="pick up"){status ="ready for pick up"}
        if(orders[i].Processed && delivery =="ready for sending"){status ="ready for shipping"}
        if(orders[i].Shipped && delivery == "send"){status ="shipped"}
        if(orders[i].Ready){status ="ready"}


        tab += "<tr>";
        tab += "<td>" + ordernr+ "</td>";
        tab += "<td>" +strorderdate + "</td>";
        tab += "<td>" +description + "</td>";
        tab += "<td>" +delivery + "</td>";
        tab += "<td class='right'>" +ordercost + "</td>";
        tab += "<td class='right'>" +deliverycost + "</td>";
        tab += "<td class='right'>" +total + "</td>";
        tab += "<td class='right'>" +btw + "</td>";
        tab += "<td>" +status+ "</td>";
        tab += "</tr>";
    }
    myorders.innerHTML = tab;
}
function sendGetAllOrders(){
    var data = new Object();
    data.GUID = app.GUID;
    data.func ="getallorders";

    var json = JSON.stringify(data);
    var request = new XMLHttpRequest();

    request.open('POST', app.localhost + "api/order/" + json , true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            if(this.response.indexOf("Error") < 0){
                var orders = JSON.parse(this.response);
                createTableAllOrders(orders);
            }
            else if(this.response == ""){
                var divorders = document.getElementById("divorders");
                divorders.innerHTML = "There are no orders yet."
            } else {
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }
        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
}
function createTableAllOrders(orders){
    var allorders = document.getElementById("allorders");
    var tab = "<table width='100%' class='tblorders'>"
    tab += "<tr><th>Ordernr</th>"
    tab += "<th></th>"
    tab += "<th>Order Date</th>"
    tab += "<th>Description</th>"

    tab += "<th class='right'>Price</th>"
    tab += "<th class='right'>ShippingCost</th>"
    tab += "<th class='right'>BTW</th>"
    tab += "<th class='right'>Total</th>"


    tab += "<th>Payed</th>"
    tab += "<th>Processed</th>"
    tab += "<th>Delivery</th>"
    tab += "<th>Address</th>"
    tab += "<th>Shipped</th>"
    tab += "<th>status</th>"
    tab += "<th>Ready</th>"

    tab += "</tr>";

    for(var i = 0; i < orders.length; i++){
        var orderid = orders[i].Id;
        var ordernr = "DUET" + orders[i].designID +"-" + orders[i].memberID +"-" + orders[i].Id
        var dat = new Date(orders[i].OrderDate);
        var strorderdate =  dat.getDate() +"-" + (dat.getMonth()+1) +"-" + dat.getFullYear();
        var strtime = dat.getHours() + ":" + dat.getMinutes();
        var confirmed ="";
        if(orders[i].Confirmed){confirmed ="yes";}else{confirmed ="no";}
        var description = "";
        if(orders[i].Sample){description ="Sample";}
        else if(orders[i].Photo){description ="Photo " + orders[i].Photosize;}
        else if(orders[i].Fabric){description = orders[i].Meters + " meters Fabric";}
        else {description = "";}
        var delivery = orders[i].DeliveryType;
        var ordercost  = orders[i].OrderCost.toFixed(2);
        var deliverycost = orders[i].DeliveryCost.toFixed(2);
        if(deliverycost == 0){deliverycost ="";}
        var total = orders[i].Total.toFixed(2);
        var btw = orders[i].BTW.toFixed(2);

        var status = "open";
        if(orders[i].Confirmed){status ="Confirmed"};
        if(orders[i].Payed){status ="Payed"};
        if(orders[i].Processed){status ="Processed"}
        if(orders[i].Shipped){status ="Shipped"}
        if(orders[i].Ready){status ="Ready"}

    
        var address = orders[i].MemberName + "<br/>";
        address += orders[i].MemberAddress + "<br/>";
        address += orders[i].MemberZipcode + " " + orders[i].MemberCity + "<br/>";
        address += orders[i].MemberCountry ;

        var contact = orders[i].MemberName + "<br/>";
        contact += orders[i].MemberPhone + "<br/>";
        contact += orders[i].MemberEmail + "<br/>";

        tab += "<tr>";
        tab += "<td>" + ordernr+ "</td>";
        tab += "<td id='thumb" + orders[i].designID + "'></td>";
        tab += "<td>" +strorderdate + "</td>";
        tab += "<td>" +description + "</td>";

        tab += "<td class='right'>" +ordercost + "</td>";
        tab += "<td class='right'>" +deliverycost + "</td>";
        tab += "<td class='right'>" +btw + "</td>";
        tab += "<td class='right'>" +total + "</td>";


        if(orders[i].Payed){
        var paydate = new Date(orders[i].PayDate);
        var strpaydate =  paydate.getDate() +"-" + (paydate.getMonth()+1) +"-" + paydate.getFullYear();

            tab += "<td>" + strpaydate + "</td>"
        }
        else{
            tab += "<td><button onclick='setStatus(" + orderid + ", \"Payed\")'>Payed</button></td>";
        }
        if(orders[i].Processed){
        var processeddate = new Date(orders[i].ProcessedDate);
        var strprocesseddate =  processeddate.getDate() +"-" + (processeddate.getMonth()+1) +"-" + processeddate.getFullYear();

            tab += "<td>" + strprocesseddate + "</td>";
        }
        else{
            tab += "<td><button onclick='setStatus(" + orderid + ", \"Processed\")'>Processed</button></td>";
        }
        if( delivery == "pick up"){
        var pickupdate = new Date(orders[i].ProcessedDate);
        var strpickupdate =  pickupdate.getDate() +"-" + (pickupdate.getMonth()+1) +"-" + pickupdate.getFullYear();

            tab += "<td>" +delivery + " by</td>";
            tab += "<td>" + contact + strpickupdate  + "</td>";
        }
        else{
            tab += "<td>" + delivery + " to</td>";
            tab += "<td>" + address  + "</td>";
        }
        if(orders[i].Shipped){
        var shippingdate = new Date(orders[i].ShippedDate);
        var strshippingdate =  shippingdate.getDate() +"-" + (shippingdate.getMonth()+1) +"-" + shippingdate.getFullYear();

            tab += "<td>" + strshippingdate + "</td>";
        }
        else{
            tab += "<td><button onclick='setStatus(" + orderid + ", \"Shipped\")'>Shipped</button></td>";
        }
        tab += "<td>" +status+ "</td>";
        if(orders[i].Ready){
            tab += "<td>OK</td>";
        }
        else{
                tab += "<td><button onclick='setStatus(" + orderid + ", \"Ready\")'>Ready</button></td>";
        }   

        tab += "</tr>";
    }
    allorders.innerHTML = tab;
    for(var i = 0; i < orders.length; i++){
        var designid = orders[i].designID;

        getThumbnail(designid, 50,50);
    }

}
function setStatus( id, status){
    var data = new Object();
    data.GUID = app.GUID;
    data.func ="orderstatus";
    data.orderid = id;
    data.status = status;

    

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/order/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == ""){
                sendGetAllOrders();
            }
            else {
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }

        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();  
}   
