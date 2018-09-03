
function initShow(){
    sendGetShow(0);
}
function initShared(){    
    sendGetAllShared(0);
}
function initCheckDesign() {

    app = new App("DUET");
    autoLogin(app.GUID);

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    var query = document.location.search;
    if(query.length > 0){
        var ids = query.split("=");
        var id = ids[1];
        var img = document.getElementById("DUETdesign");
        img.src="/DUET?id=" + id + "&w=3000&h=3000";
    }
    
}
function initShowPattern(){
    app = new App("DUET");
    autoLogin(app.GUID);

    history.pushState(null, null, location.href);
    window.onpopstate = function () {
        history.go(1);
    };

    
    var query = document.location.search;
    if(query.length > 0){
        var ids = query.split("=");
        var id = ids[1];
        showDesign(id);
    }
    
}
function sendGetShow(id){

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "show";
    data.designid = id;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != ""){
                var img = document.createElement("img");
                var data = JSON.parse(this.response);
                img.width = data.width;
                img.height = data.height;
                img.src = "data:image\/(png|jpg);base64," + data.raw;
                var root = document.getElementById("models");
                root.appendChild(img);
                 
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


function sendGetAllShared(){

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "allshared";
   

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){

                var data = JSON.parse(this.response);
                showAllSharedDesigns(data);
                                 
            }
           

        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
}


function showDesign(id) {
    
   
    var img = document.createElement("img");
        img.onload = function(){
            var frame = document.getElementById("frame");
            frame.innerHTML = "";
            frame.appendChild(img);

        }
        img.src = "/DUETPATTERN?id=" + id + "&w=" + 1000 + "&h=" + 1000;

}
function getDesign(id){
    document.location.href="mydesign.html?id=" + id;
}
function loadDesign(id) {
    document.location.href = "design.html?id=" + id;
}
function orderDesign(id){
    document.location.href ="order.html?id=" + id;
}

function checkDesign(id){
    //document.location.href="check.html?id=" + id;
    app.popup  = window.open("check.html?id=" + id,"DUET Check Pattern", "resizable,scrollbars,status");
}
function showPattern(id){
    //document.location.href="showpattern.html?id=" + id;
    app.popup  = window.open("showpattern.html?id=" + id,"DUET Show Pattern", "resizable,scrollbars,status");
}
