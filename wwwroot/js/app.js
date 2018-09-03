var app;
function App(name) {
    this.name = name;
    this.localhost = "";
    this.user = "";
    this.GUID = this.getOrCreateGUIDInLocalStorage();
    this.design;
    this.palette;
    this.proces;
    this.topicname;
    this.ROOT;
    this.MAXDESIGNWIDTH;
    this.MAXDESIGNHEIGHT;
    this.DPI;
    this.PROCESDAYS;
    this.designwidth;
    this.designheight;
    
}
App.prototype.getOrCreateGUIDInLocalStorage = function() {
    var store = "";
    if (typeof (Storage) !== "undefined") {
        store = localStorage.getItem("DUETGUID");
        if (store == "" || store == undefined) {
            store = new Date().getUTCMilliseconds()
            localStorage.setItem("DUETGUID", store);
        }
    }
    return store;
}

App.prototype.topic = function (name) {
    this.topicname = name;
    var topics = document.getElementsByClassName("topic")
    var atopic = document.getElementById(name);
    for (var i = 0; i < topics.length; i++) {
        topics[i].style.display = "none";
    }
    if (atopic != null && atopic != undefined) {
        atopic.style.display = "block";

        if (name == "unsubscribe") {
            initRegistration();
        }
        else if (name == "changeregistration") {
            initRegistration();
        }
        else if (name == "divmembers") {
            getMembers();
        }
        else if (name == "divdesigns") {
            getDesigns();
        }
        else if (name == "divorders") {
            getOrders();
        }
    }
}
App.prototype.open = function (id) {
    var div = document.getElementById(id);
    div.style.display = "block";
}
App.prototype.close = function (id) {
    var div = document.getElementById(id);
    div.style.display = "none";
}
App.prototype.left = function (id) {
    var div = document.getElementById(id);
    var iright = document.getElementById("righthelp");
    iright.style.display = "inline-block";
    var ileft = document.getElementById("lefthelp");
    ileft.style.display = "none";
    div.style.right = "auto";
    div.style.left = "0px";
}
App.prototype.right = function (id) {
    var div = document.getElementById(id);
    var ileft = document.getElementById("lefthelp");
    ileft.style.display = "inline-block";
    var iright = document.getElementById("righthelp");
    iright.style.display = "none";
    div.style.right = "0px";
    div.style.left = "auto";
}
App.prototype.getSettings = function() {
    var data = new Object();
    data.GUID = this.GUID;
    data.func = "getsettings";

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/member/" + json, true);
    request.onload = function () {

        if (request.status >= 200 && request.status < 400) {
            if (this.response.indexOf("Error") <= 0) {

                data = this.response.split(",");
                if (document.location.pathname.indexOf("/admin") >= 0) {
                    var inroot = document.getElementById("inroot");
                    var inmaxdesignwidth = document.getElementById("inmaxdesignwidth");
                    var inmaxdesignheight = document.getElementById("inmaxdesignheight");
                    var inDPI = document.getElementById("inDPI");
                    var inprocesdays = document.getElementById("inprocesdays");
                
                    inroot.value = data[0];
                    inmaxdesignwidth.value = data[1];
                    inmaxdesignheight.value = data[2];
                    inDPI.value = data[3];
                    inprocesdays.value = data[4];
                    var resultsize = document.getElementById("resultsize");
                    resultsize.innerHTML = (inmaxdesignwidth.value / (inDPI.value / 2.54)) + " cm";
                }
                app.ROOT = data[0];
                app.MAXDESIGNWIDTH = parseInt(data[1]);
                app.MAXDESIGNHEIGHT = parseInt(data[2]);
                app.DPI = parseInt(data[3]);
                app.PROCESDAYS =  parseInt(data[4]);
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

