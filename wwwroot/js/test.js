function j_Test_Autologin() {
    app = new App("DUET");
    if (app.GUID != "") {
        var request = new XMLHttpRequest();
        request.open('GET', app.localhost + "api/member/" + app.GUID, true);
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                if (this.response != "") {
                    app.user = this.response;
                    var divuser = document.getElementById("divuser");
                    divuser.innerHTML = "Welcome " + app.user + "<br/>";
                    j_Test_Query();
                }
                else {
                    var bo = document.getElementById("body");
                    bo.innerHTML = "";
                    bo.innerHTML = "Sorry no access!"
                }
            }
            else {
                var bo = document.getElementById("body");
                bo.innerHTML = "";
                bo.innerHTML = "Sorry no access!"
            }
        }
        request.send();
    }
    else {
        var bo = document.getElementById("body");
        bo.innerHTML = "";
        bo.innerHTML = "Sorry no access!"
    }
}
function j_Test_Query() {
    if(app.user != ""){
        var query = document.location.search
        if (query.length > 0) {
            var props = query.split("=");
            var img = document.getElementById("testimg");
            img.alt = "DUET-" + props[0];
            img.src = "/DUET?id=" + props[0] + "&w=" + props[1] + "&h=" + props[2];
        }
    }
}
function j_Admin_Input() {
    if(app.user != ""){
        var inid = document.getElementById("inid");
        var inwidth = document.getElementById("inwidth");
        var inheight = document.getElementById("inheight");
        var img = document.getElementById("testimg");
        img.alt = "DUET-" + inid.value;
        img.src = "/DUET?id=" + inid.value + "&w=" + inwidth.value + "&h=" + inheight.value;
    }
}
function j_Test_Design() {
    var data = new Object();
    data.GUID = app.GUID;
    data.func = "testdesign";
    data.designid = 1;

    var request = new XMLHttpRequest();
    var json = JSON.stringify(data);
    request.open('POST', app.localhost + "api/test/" + json, true);
    
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            if (this.response.indexOf("Error") <0) {
                var div = document.getElementById("resulttestdesign");
                div.innerHTML = this.response;
            }
           
        }
        
    }
    request.send();
}