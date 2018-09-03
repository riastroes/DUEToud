
function sendCreateOrder() {

    var data = new Object();
    data.GUID = app.GUID;
    data.func ="neworder";
    var query = document.location.search;
    if(query.length > 0){
        var ids = query.split("=");
        data.id = ids[1];
        }

    var json = JSON.stringify(data);
    var request = new XMLHttpRequest();

    request.open('POST', app.localhost + "api/order/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){

                var data = JSON.parse(this.response);
                var img = document.createElement("img");
                img.onload = function() {
                    var frame = document.getElementById("frame");
                    frame.width = screen.availWidth;
                    frame.height = "500px";
                    frame.innerHTML = "";
                    frame.appendChild(img);
                    var inordernr1 = document.getElementById("inordernr1");
                    inordernr1.innerHTML = data.ordernr;
                    var inordernr2 = document.getElementById("inordernr2");
                    inordernr2.innerHTML = data.ordernr;
                    var inordernr3 = document.getElementById("inordernr3");
                    inordernr3.innerHTML = data.ordernr;
                    var address = document.getElementById("address");
                        address.innerHTML = data.name  + "<BR/>" + data.address +"<BR/>" + data.zipcode + " " + data.city + "<BR/>" + data.country
                    
                    var incountry = document.getElementById("incountry");
                    incountry.value = data.country;
                    calcPrize();

                }
                img.src = "/DUET?id=" + data.designid + "&w=600&h=600";


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
function changeShipping(){
    var radioshipping = document.getElementsByName("deliverytype");
    var pickup = document.getElementById("pickup");
    var shipping = document.getElementById("shipping");
    var deliverytype = document.getElementById("hiddeliverytype");
    if(radioshipping[0].checked){
        pickup.style.display ="block";
        shipping.style.display ="none";
        deliverytype.value = "pick up";
    }
    else{
        pickup.style.display ="none";
        shipping.style.display ="block";
        deliverytype.value = "send";
    }
    calcPrize();
}
function changeOrderType(){
    var radioordertype = document.getElementsByName("ordertype");
    var photo = document.getElementById("photo");
    var sample = document.getElementById("sample");
    var fabric = document.getElementById("fabric");
    var spnordertype = document.getElementById("spnordertype");
    var inphotosize = document.getElementById("spnphotosize");
    var ordertype = document.getElementById("hidordertype");

    if(radioordertype[0].checked){
        
        sample.style.display ="block";
        fabric.style.display ="none";
        photo.style.display ="none";
        spnordertype.innerHTML = "sample";
        ordertype.value = "sample";
    }
    if(radioordertype[1].checked){
        sample.style.display ="none";
        fabric.style.display ="block";
        photo.style.display ="none";
        spnordertype.innerHTML = "fabric";
        ordertype.value ="fabric";
    }
    else{
        sample.style.display ="none";
        fabric.style.display ="none";
        photo.style.display ="block";
        ordertype.value ="photo";

        spnordertype.innerHTML = "photo " + getPhotoSize();
    }
    calcPrize();
}
function getPhotoSize(){
    var hidphotosize = document.getElementById("hidphotosize");
    var photosizes = document.getElementsByName("inphotosize");
    calcPrize();
    if(photosizes[0].checked){hidphotosize.value ="small"; return "small";}
    else if(photosizes[1].checked){ hidphotosize.value ="medium";return "medium";}
    else if(photosizes[2].checked){ hidphotosize.value ="big";return "big";}


}
function changePhotoSize(){
    getPhotoSize();
   
}
function calcPrize(){
    var incostorder = document.getElementById("incostorder");
    var incostdelivery = document.getElementById("incostdelivery");
    var intotal = document.getElementById("intotal");
    var btw = document.getElementById("btw");
    var price = 0;
    var dprice= 0;
    var photo = document.getElementById("photo");
    var sample = document.getElementById("sample");
    var fabric = document.getElementById("fabric");

    if(sample.style.display =="block"){
        price += 8;
        dprice += 1;

    }
    else if(photo.style.display =="block"){
        var photosizes = document.getElementsByName("inphotosize");
            if(photosizes[0].checked){ 
                price += 5; 
                dprice += 1;}
            else if(photosizes[1].checked){ 
                price += 10; 
                dprice += 1.50;}
            else if(photosizes[2].checked){ 
                price += 15; 
                dprice += 2;}
    }
    else if(fabric.style.display =="block"){
        var inmeters = document.getElementById("inmeters");
        price += parseInt(inmeters.value) * 25;
        dprice += parseInt(inmeters.value) * 2;
    }
    price = Math.floor(price * 100) / 100;
    var incountry = document.getElementById("incountry");
    if(incountry.value == "NEDERLAND"){
        dprice = Math.floor(dprice * 100) / 100;
    }
    else{
        dprice = Math.floor((dprice * 1.5) * 100) /100;
    }
    var pickup = document.getElementById("pickup");
    if(pickup.style.display == "block"){
        dprice = 0;
    }
    incostorder.innerHTML = "<b>" +  price.toFixed(2) + " euro" + "</b>";
    incostdelivery.innerHTML = "<b>" +  dprice.toFixed(2) + " euro" + "</b>";
    intotal.innerHTML = "<b>" +  (price + dprice).toFixed(2) + " euro" + "</b>";
    btw.innerHTML = ( Math.floor(((price + dprice) - ((price + dprice) /1.21)) *100)/100).toFixed(2)  + " euro" ;


    var hidcostorder = document.getElementById("hidcostorder");
    var hidcostdelivery = document.getElementById("hidcostdelivery");
    var hidtotal = document.getElementById("hidtotal");
    var hidbtw = document.getElementById("hidbtw");

    hidcostorder.value = price.toFixed(2);
    hidcostdelivery.value = dprice.toFixed(2);
    hidbtw.value = (Math.floor(((price + dprice) - ((price + dprice) /1.21)) *100)/100).toFixed(2);
    hidtotal.value = (price + dprice).toFixed(2);

}
function confirmOrder(){
    var hidcostorder = document.getElementById("hidcostorder");
    var hidcostdelivery = document.getElementById("hidcostdelivery");
    var hidtotal = document.getElementById("hidtotal");
    var hidbtw = document.getElementById("hidbtw");

    

    var data = new Object();
    data.GUID = app.GUID;
    data.func ="confirmorder";

    var data1 = new Object();
    var ordernr = document.getElementById("inordernr1").innerHTML;
    var ordernrparts = ordernr.split("-");
    data1.orderid = ordernrparts[2];
    data1.ordertype = document.getElementById("hidordertype").value;
    data1.photosize =  document.getElementById("hidphotosize").value;
    data1.meters = document.getElementById("inmeters").value;
    data1.deliverytype = document.getElementById("hiddeliverytype").value;
    data1.costorder = hidcostorder.value;
    data1.costdelivery = hidcostdelivery.value;
    data1.btw = hidbtw.value;
    data1.total = hidtotal.value;


    var json = JSON.stringify(data);
    var json1 = JSON.stringify(data1);
    var request = new XMLHttpRequest();

    request.open('POST', app.localhost + "api/order/" + json , true);
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            if(this.response == "" && this.response.indexOf("Error") < 0){
                 myalert("We are excited to recieve your order, as soon as we recieve your payment we will start handling your order.");
            } else {
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }
        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send(json1);
}

