// site javascript


var errors;
function start(){
    
    app = new App("DUET");
    
    var search = document.location.search;
    search = search.replace("?","");
    if( search ==""){
        autoLogin(app.GUID);
        app.topic("login");
    }
    else {
        autoLogin(app.GUID);
        app.topic(search);
    }
   
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };

    app.inspiration = new Inspiration();
    app.inspiration.init(false, 2000);
}
function designstart(){
    
    app = new App("DUET");
    autoLogin(app.GUID);
    app.getSettings();
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };

    app.inspiration = new Inspiration();
    app.inspiration.init(false, 2000);

    var query = document.location.search;
    if (query.length > 0) {
        var props = query.split("=");
        startDesigner(props[1]);
    }
    
}
function adesignstart(){
    app = new App("DUET");
    autoLogin(app.GUID);
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };
    var query = document.location.search;
    if (query.length > 0) {
        var props = query.split("=");
        
        sendGetADesign(props[1]);
    }
}
function adminstart(){
    app = new App("DUET");
    autoLogin(app.GUID);
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };
    app.getSettings();

    app.proces = new Proces();

}
//function teststart(){
//    app = new App("DUET");
//    autoLogin(app.GUID);

//    history.pushState(null, null, location.href);
//    window.onpopstate = function () {
//        history.go(1);
//    };

//}
function myordersstart() {
    app = new App("DUET");

    autoLogin(app.GUID);
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };
   sendGetMyOrders();
}
function showstart(){
    app = new App("DUET");
    autoLogin(app.GUID);

}
function orderstart(){
    app = new App("DUET");
    
    autoLogin(app.GUID);
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };
    sendCreateOrder();
}
function sharedstart(){
    app = new App("DUET");
    autoLogin(app.GUID);
    var url = location.href;
    history.pushState(null, null, url);
    window.onpopstate = function () {
        history.go(1);
    };
    

}

var elem;
function getOrCreateGUIDInLocalStorage(){
    var store ="";
    if (typeof(Storage) !== "undefined") {
         store = localStorage.getItem("DUETGUID");
         if(store == "" || store == undefined){
            store = new Date().getUTCMilliseconds()
            localStorage.setItem("DUETGUID",store );
         }

    }
    else{
        getText("nowebstorage", errors);
    }
    return store;
}
function getOrCreateDESIGNGUIDInLocalStorage(){
    var store ="";
    if (typeof(Storage) !== "undefined") {
         store = localStorage.getItem("DUETDESIGNGUID");
         if(store == "" || store == undefined){
            store = new Date().getUTCMilliseconds()
            localStorage.setItem("DUETDESIGNGUID",store );
         }

    }
    else{
        getText("nowebstorage", errors);
    }
    return store;
}

//function getText(title, element) {

//    //Deze functie gaat een html-tekst opgehalen met een webservice.
//    var error = document.getElementById("errors");

//    var request = new XMLHttpRequest();
//    request.open('GET', app.localhost + "api/webtext/" + title , true);
//    request.onload = function() {

//        if (request.status >= 200 && request.status < 400) {
            
//             element.innerHTML = this.response;
//        } else {
//           errors.innerHTML = this.response; 
//        }
//    }
//    request.send();
//}
function autoLogin(GUID){
    //Deze functie logt een bekende gebruiker direct in.

    var request = new XMLHttpRequest();
    request.open('GET', app.localhost + "api/member/" + GUID , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if (this.response != "") {
                app.user = this.response;
                
                var divuser = document.getElementById("divuser");
                if(divuser != undefined && divuser != null){
                    divuser.innerHTML = "Welcome " + this.response;
                }
                if ((app.user == "Ria Stroes" || app.user == "JOLANTA IZABELA") && document.location.search == "?admin") {
                    app.topic("divadmin");
                }
                else if (document.location.search == "?admin") {
                    document.location.href = "index.html?contact";
                }
                var register = document.getElementById("member");
                if (register) {
                    register.href = "";
                    register.innerHTML = "Welcome " + this.response;
                }
                

            }
            else if (document.location.search == "?admin") {
                document.location.href = "index.html?contact";
            }
        } else {
            document.location.href = "index.html?contact";
            
        }
    }
    request.send();
}



function login() {

    var inemail = document.getElementById("loginemail");
    var inpassword = document.getElementById("loginpassword");

    const data = new Object();
    data.GUID = app.GUID;
    data.func = "login";
    data.email = inemail.value.toLowerCase();
    data.password = inpassword.value;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    
    request.open('POST', app.localhost + "api/member/" + json  , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){
                  app.user = this.response;
                  document.location.href ="design.html";

          }
          else if(this.response.indexOf("Error") >= 0){
                app.user = "";
                var resultlogin = document.getElementById("resultlogin");
                resultlogin.innerHTML =  this.response;
                resultlogin.innerHTML +=  "<br/>You have to register before you can use this tool or correct your mistake.";

          }

        }
        else{
             var resultlogin = document.getElementById("resultlogin");
             resultlogin.innerHTML =  this.response;
        }
    }
    request.send();

   
}

function registerMemberUI() {
    var error = document.getElementById("registrationerrors");
    error.innerHTML ="";
   
    var inname = document.getElementById("registername");
    var inemail = document.getElementById("registeremail");
    var inpassword = document.getElementById("registerpassword");
    var inphone = document.getElementById("registerphone");
    var inaddress = document.getElementById("registeraddress");
    var inzipcode = document.getElementById("registerzipcode");
    var incity = document.getElementById("registercity");
    var incountry = document.getElementById("registercountry");

    if (inname.value == "") {
        error.innerHTML += "Please fill in your name.<br/>"
    }
    if (inemail.value == "") {
        error.innerHTML += "Please fill in your emailaddress.<br/>"
    }
    else if (inemail.value.indexOf("@") == -1) {
        error.innerHTML += "This emailaddress is incorrect.<br/>"
    }
    if (inpassword.value == "") {
        error.innerHTML += "Please fill in your password.<br/>"
    }
    else if(inpassword.value.length < 5) {
        error.innerHTML += "This password is too short.(minimum:5)<br/>"
    }

   
    if(error.innerHTML ==""){
        //no errors
        const data = new Object();
        data.GUID = app.GUID;
        data.func = "register";
        data.name = inname.value;
        data.email = inemail.value.toLowerCase();
        data.password = inpassword.value;

        data.phone = inphone.value;
        data.address = inaddress.value;
        data.zipcode = inzipcode.value.toUpperCase();
        data.city = incity.value.toUpperCase();
        data.country = incountry.value.toUpperCase();
        registerMember(JSON.stringify(data));
    };

}
function registerMember(register) {
    
    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + register , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            document.location.href ="design.html";
        } else {
            
           var errors = document.getElementById("errors");
           errors.innerHTML = "Error: Sorry, something went wrong"; 
        }
    }
    request.send();
    
}

function initRegistration(){

    var response ="";
    const data = new Object();
    data.GUID = app.GUID;
    data.func = "initregistration";

    var json = JSON.stringify(data);


    
    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != ""  && this.response.indexOf("Error") < 0){
                var member = JSON.parse(this.response);

                if(app.topicname == "changeregistration"){
                    var inname = document.getElementById("changeregistername");
                    var inemail = document.getElementById("changeregisteremail");
                    var inpassword = document.getElementById("changeregisterpassword");
                    var inphone = document.getElementById("changeregisterphone");
                    var inaddress = document.getElementById("changeregisteraddress");
                    var inzipcode = document.getElementById("changeregisterzipcode");
                    var incity = document.getElementById("changeregistercity");
                    var incountry = document.getElementById("changeregistercountry");
                    inname.value = get(member.Name);
                    inemail.value =  get(member.Email);
                    inpassword.value =  get(member.Password);
                    inphone.value =  get(member.Phone);
                    inaddress.value =  get(member.Address);
                    inzipcode.value =  get(member.Zipcode);
                    incity.value =  get(member.City);
                    incountry.value =  get(member.Country);
                    

                }
                if(app.topicname == "unsubscribe"){
                    var inname = document.getElementById("unsubscribename");
                    var inemail = document.getElementById("unsubscribeemail");
                    var inpassword = document.getElementById("unsubscribepassword");
                    inname.value = member.Name;
                    inemail.value = member.Email;
                    inpassword.value = member.Password;

                }
            }
            
            
        } else {
           var errors = document.getElementById("errors");
            errors.innerHTML = this.response; 
        }
    }
    request.send();


}
function validatePassword(pw) {

    return /[A-Z]/       .test(pw) &&
           /[a-z]/       .test(pw) &&
           /[0-9]/       .test(pw) &&
           /[^A-Za-z0-9]/.test(pw) &&
           pw.length > 4;

}
function changeRegistrationMemberUI() {
    var error = document.getElementById("errors");
    error.innerHTML ="";
   
    var inname = document.getElementById("changeregistername");
    var inemail = document.getElementById("changeregisteremail");
    var inpassword = document.getElementById("changeregisterpassword");
    var inphone = document.getElementById("changeregisterphone");
    var inaddress = document.getElementById("changeregisteraddress");
    var inzipcode = document.getElementById("changeregisterzipcode");
    var incity = document.getElementById("changeregistercity");
    var incountry = document.getElementById("changeregistercountry");
    if (inname.value == "") {
        error.innerHTML += "Please fill in your name.<br/>"
    }
    if (inemail.value == "") {
        error.innerHTML += "Please fill in your emailaddress.<br/>"
    }
    else if (inemail.value.indexOf("@") == -1) {
        error.innerHTML += "This emailaddress is incorrect.<br/>"
    }
    if (inpassword.value == "") {
        error.innerHTML += "Please fill in your password.<br/>"
    }
    else if(validatePassword(inpassword.value)) {
        
        error.innerHTML += "This password is too short (minimum:4) or has illegal characters.<br/>"
    }
    if(error.innerHTML ==""){
        //no errors
        const data = new Object();
        data.GUID = app.GUID;
        data.func = "changeregistration";
        data.name = inname.value;
        data.email = inemail.value.toLowerCase();
        data.password = inpassword.value;

        data.phone = inphone.value;
        data.address = inaddress.value.toUpperCase();
        data.zipcode = inzipcode.value.toUpperCase();
        data.city = incity.value.toUpperCase();
        data.country = incountry.value;

        
        changeRegistrationMember(JSON.stringify(data));
    };

}
function changeRegistrationMember(register) {
    
    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + register , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            app.topic("responseChangeRegistration");
        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
   
    
}
function unsubscribeMemberUI() {
    var error = document.getElementById("errors");
    error.innerHTML ="";


    var inname = document.getElementById("unsubscribename");
    var inemail = document.getElementById("unsubscribeemail");
    var inpassword = document.getElementById("unsubscribepassword");
    var inremark = document.getElementById("unsubscriberemark");
    if (inname.value == "") {
        error.innerHTML += "Please fill in your name.<br/>"
    }
    if (inemail.value == "") {
        error.innerHTML += "Please fill in your emailaddress.<br/>"
    }
    else if (inemail.value.indexOf("@") == -1) {
        error.innerHTML += "Your emailaddress is incorrect.<br/>"
    }
    if (inpassword.value =="") {
        error.innerHTML += "Please fill in your password.<br/>"
    }
    else if(inpassword.value.length < 5) {
        error.innerHTML += "This password is too short.(minimum:5)<br/>"
    }

    if(error.innerHTML ==""){
        //no errors
        const data = new Object();
        data.GUID = app.GUID;
        data.func = "unsubscribe";
        data.name = inname.value;
        data.email = inemail.value.toLowerCase();
        data.password = inpassword.value;
        data.remark = inremark.value;

        unsubscribeMember(JSON.stringify(data))
    };

}
function unsubscribeMember(unsubscribe) {
    
    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + unsubscribe , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            app.topic("responseUnsubscribe");
        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
}
function getMembers(){
    const data = new Object();
    data.GUID = app.GUID;
    data.func ="members";
    

    var json = JSON.stringify(data)
    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != 0 && this.response.indexOf("Error") < 0){

                var data = JSON.parse(this.response);

                var members = document.getElementById("members");
                var str ="<table id='tabmembers' width='100%'><tr><th>Member</th><th>Email</th><th>Phone</th><th>Address</th><th>Zipcode</th><th>City</th><th>Country</th><th>StartDate</th><th>Visits</th></tr>"
                for(var i = 0; i < data.length; i++){

                    var dat = new Date(data[i].StartDate);
                    var strdat = dat.getDate() +"-" + (dat.getMonth()+1) +"-" + dat.getFullYear() ;
        

                    str+="<tr><td>" + get(data[i].Name) + "</td>"
                    str+="<td>" + get(data[i].Email) + "</td>"
                    str+="<td>" + get(data[i].Phone) + "</td>"
                    str+="<td>" + get(data[i].Address) + "</td>"
                    str+="<td>" + get(data[i].Zipcode) + "</td>"
                    str+="<td>" + get(data[i].City) + "</td>"
                    str+="<td>" + get(data[i].Country) + "</td>"

                    str+="<td>" + strdat + "</td>"
                    str+="<td>" + get(data[i].Visits) + "</td>"
                    str+="</tr>";
                }
                str +="</table>";
                members.innerHTML = str;
            }

        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
}
function get(field){
        if(field == null || field == undefined){
            return "";
        }
        else{
            return field;
        }
}
function stop(evt) {
    if(evt){
        if (typeof evt.stopPropagation == "function") {
            evt.stopPropagation();
        } else {
            evt.cancelBubble = true;
        }
    }
}
function myalert(msg){
    var alertbox = document.getElementById("alertbox");
    var alertmessage = document.getElementById("alertmessage");
    alertbox.style.display = "block";
    alertmessage.innerHTML = msg;
    //alertbox.scrollIntoView();
    var a = document.getElementById("top");
    document.scrollingElement.scrollTop= 0;
   

}
function stopalert(){
    var alertbox = document.getElementById("alertbox");
    alertbox.style.display = "none";
}
function getThumbnail(id, width, height) {
    
    var thumb = document.createElement("img");
    thumb.onload = function(){

        thumb.onclick = function () { document.location.href="adesign.html?id=" + id;}
        thumb.alt = "a DUET";
        var td = document.getElementById("thumb" + id);
        td.innerHTML = "";
        td.appendChild(thumb);
    }
    thumb.src =  "/DUET?id=" + id +"&w=" + width +"&h=" + height;
}

function degrees(g) {
    return g * (Math.PI / 180);
}
/* Get the documentElement (<html>) to display the page in fullscreen */
//var elem = document.documentElement;

/* View in fullscreen */
function openFullscreen() {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
}

/* Close fullscreen */
function closeFullscreen() {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.mozCancelFullScreen) { /* Firefox */
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) { /* IE/Edge */
                document.msExitFullscreen();
            }
}
function resizeDesigner(){
    document.location.reload();
}

/*********** USER *************/
function User() {
    this.id;
    this.name;
    this.email;
    this.password;
    this.ismember = false;

}
/*********** END USER *************/