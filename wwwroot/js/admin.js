//function testText() {

//    //Deze functie test of een html-tekst opgehaald kan worden met een webservice.

//    var intext = document.getElementById("intext");
//    var title = intext.value;
//    var result = document.getElementById("resulttext");

//    getText(title, result);

//}

//function testGUID(){

//    var result = document.getElementById("localstorageresult");
//    if(app.GUID == localStorage.getItem("DUETGUID")){
//        result.innerHTML = app.GUID;
//    }
//    else{
//        getText("nowebstorage", result);
//    }
//}

function j_Admin_GetDesign() {
    var inwidth = document.getElementById("inwidth");
    var inheight = document.getElementById("inheight");
    var width = parseInt(inwidth.value);
    var height = parseInt(inheight.value);

    var img = document.getElementById("imgdesign");
    var result = getDesign(img, width, height);

}

//function testDrawImage() {

//    var data = new Object();
//    data.func = "test";
//    data.GUID =App.GUID;

//    var json = JSON.stringify(data);

//    var request = new XMLHttpRequest();
//    request.open('POST', app.localhost + "api/design/" + json , true);
//    request.onload = function() {

//    }

//    request.send();
//}

//function testWebservice() {

//    var data = new Object();
//    data.func = "test12";
//    data.GUID =app.GUID;

//    var body = new Object();
//    body.p = 12;

//    var json = JSON.stringify(data);
//    var json1 = JSON.stringify(body);

//    var request = new XMLHttpRequest();
//    request.open('POST', app.localhost + "api/design/" + json , true);

//    request.setRequestHeader("Content-type", "application/json");
//    request.onload = function() {
//        if (request.status >= 200 && request.status < 400) {
//            var result = document.getElementById('result12');
//            result.innerHTML = this.responseText;
//        }
//    }

//    request.send(json1);
//}

function sendAppSetting(field) {

    var data = new Object();
    data.func = "settings";
    data.GUID = app.GUID;
    data.field = document.getElementById(field).id;
    data.value = document.getElementById(field).value;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + json , true);

    request.setRequestHeader("Content-type", "application/json");
    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            document.location.reload();
        }
        else {
            var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
        }
    }

    request.send();
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