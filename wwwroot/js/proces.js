/******** proces ********/
function Proces(){
    this.GUID;
    this.func;

    this.index =[];
    this.x = [];
    this.y = [];
    this.i;
    //this.fromindex;


    this.width;
    this.height;
    this.bgcolor;
    this.stamp;
    this.inspiration;

}
Proces.prototype.init = function() {
    this.GUID = app.GUID;
    this.design = app.design;
    this.stamp = app.stamp;
    this.inspiration = app.inspiration;
    this.index = [];
    this.x = [];
    this.y = [];
    this.i = 0;
    this.from = this.i;

}
Proces.prototype.seedInspiration = function() {
    //wordt alleen aangeroepen na het creeren van een nieuwe database.

    this.GUID = app.GUID;
    this.func ="seed";
    var json = JSON.stringify(this);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/inspiration/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            var result = document.getElementById("result1");
            result.innerHTML ="Inspirations are added."

        } else {
           var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();

}

Proces.prototype.deleteInspiration = function() {
   

    var intitle = document.getElementById("indeletetitle");
    if(intitle.value != ""){

        this.GUID = app.GUID;
        this.func ="deleteinspiration";
        this.title = intitle.value;

        var json = JSON.stringify(this);

        var request = new XMLHttpRequest();
        request.open('POST', app.localhost + "api/inspiration/" + json , true);
        request.onload = function() {

            if (request.status >= 200 && request.status < 400) {
               //ok

            } else {
               var errors = document.getElementById("errors");
               errors.innerHTML = this.response; 
            }
        }
        request.send();
    }

}
Proces.prototype.addInspiration = function() {
    //wordt alleen aangeroepen na het creeren van een nieuwe database.

    var intitle = document.getElementById("inaddtitle");
    var insrc = document.getElementById("inaddsrc");

    if(intitle.value != "" && insrc.value != ""){

        this.GUID = app.GUID;
        this.func = "addinspiration";
        this.title = intitle.value;
        this.src = insrc.value;

        var json = JSON.stringify(this);

        var request = new XMLHttpRequest();
        request.open('POST', app.localhost + "api/inspiration/" + json , true);
        request.onload = function() {

            if (request.status >= 200 && request.status < 400) {
                //ok
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 

            } else {
               var errors = document.getElementById("errors");
               errors.innerHTML = this.response; 
            }
        }
        request.send();
    }

}
Proces.prototype.add = function(x,y) {
    
    if(this.i > 0){
        if(this.x[this.i-1] == x && this.y[this.i-1] == y){
            //do nothing
        }
        else{
            this.index[this.i] = this.from + this.i;
            this.x[this.i] = x;
            this.y[this.i] = y;
            this.i++;
        }
    }
    else {
        this.index[this.i] = this.from + this.i;
        this.x[this.i] = x;
        this.y[this.i] = y;
        this.i++;
    }

    if(this.i > 0){

        var btnundo = document.getElementById("btnundodesign");
        btnundo.className ="button30";
        btnundo.click = function(){app.proces.undo();}

    }
   
}

Proces.prototype.xy = function() {
    
    if(this.from < this.i){
        this.sendXY();

    }
}
Proces.prototype.sendNewDesign = function (id) {
    app.design = new Design();
    app.design.init();
    app.proces.init();
    var data = new Object();
    data.GUID = this.GUID;
    data.design = app.design.getData();


    data.func ="newdesign";

    var json = JSON.stringify(data);
    var request = new XMLHttpRequest();

    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error")  < 0){
                
                var data  = JSON.parse(this.response);
                app.design.id = data.Id;
                app.design.name  = data.Name;
                app.design.date = data.Date;

                var mydesigntitle = document.getElementById("mydesigntitle");
                mydesigntitle.innerHTML = "My Design:   " + app.design.name +"-" + data.Id;

                var mysettings = document.getElementById("mysettings");
                mysettings.innerHTML = "Settings for " + app.design.name +"-" + data.Id;

                app.design.setBackgroundColor(255,255,255);
                app.proces.sendGetStamp();

                var query = document.location.search;
                if(query.length > 0){
                    myalert("Wait... Your design is loading");
                    var ids = query.split("=");
                    var id = ids[1];
                    moveSettings();

                    app.proces.sendCopyDesign(id);

                   
                    

                    //reset history
                    var url = location.href;
                    var index = url.indexOf("?");
                    if(index>=0){
                        url = url.substring(0,index);
                        history.pushState(null, null, url);
                        window.onpopstate = function () {
                            history.go(1);
                        };
                    }
                }
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
    this.init();              //start a new proces;
}

Proces.prototype.sendSetBgColor = function() {

    var data = new Object();
    data.GUID = this.GUID;
    data.func ="setbgcolor";
    data.design = app.design.getData();

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == ""){
                
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
    //this.init();              //start a new proces;
}
Proces.prototype.sendGetStamp = function() {

    var data = new Object();
    data.GUID = this.GUID;
    data.func = "getstamp";


    var data1 = new Object();
    data1.stamp = app.stamp.getData();
    data1.inspiration = app.inspiration.getData();
    data1.proces = this.getData();
    

    app.design.saveClientDesign();
    
    var json = JSON.stringify(data);
    var json1 = JSON.stringify(data1);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error")  < 0){
                app.stamp.stamp.src = "data:image/png;base64,"+ this.response;
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
    request.send(json1);
    //this.init();              //start a new proces;
}

Proces.prototype.sendXY = function() {

   

    var data =new Object();
    data.GUID = this.GUID;
    data.func = "xy";
   
   

    var data1 = new Object();
    data1.stamp = app.stamp.getData();
    data1.inspiration = app.inspiration.getData();  
    data1.proces = this.getData();
    //data1.index = [];
   // data1.x = [];
   // data1.y = [];

    //var d =0;
    //for (var i = this.from ; i < this.i; i++) {
    //    data1.index[d] = i;
    //    data1.x[d] = this.x[i];
     //   data1.y[d] = this.y[i];
   //     d++;
   // }
   // this.from = this.i;
    app.design.saveClientDesign();

    var json = JSON.stringify(data);
    var json1 = JSON.stringify(data1);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == ""){
                if (app.proces.index == 0) {
                    //var btnsavedesign = document.getElementById("btnsavedesign");
                    //btnsavedesign.className="button30";
                    //btnsavedesign.click = function(){app.design.save();}
                }
            } else if (this.response.indexOf("Error") >=0){
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }
        } else {
            var errors = document.getElementById("errors");
            errors.innerHTML = this.response; 
        }
    }
    request.send(json1);
    //this.init();              //start a new proces;
}
Proces.prototype.sendDeleteProcesses = function () {
    var data = new Object();
    data.GUID = this.GUID;
    data.designid = id;

    data.func = "deleteprocesses";

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json, true);
    request.onload = function () {

        if (request.status >= 200 && request.status < 400) {
            if (this.response != "" && this.response.indexOf("Error") >= 0) {

                var errors = document.getElementById("errors");
                errors.innerHTML = this.response;

            }


        } else {
            var errors = document.getElementById("errors");
            errors.innerHTML = this.response;
        }
    }
    request.send();
    this.init();
}
Proces.prototype.sendDeleteDesign = function(id) {
   
    //delete the current design and make a new design.
    var data =new Object();
    data.GUID = this.GUID;
    data.designid = id;

    data.func ="deletedesign";

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if (this.response != "" && this.response.indexOf("Error") >= 0) {

                var errors = document.getElementById("errors");
                errors.innerHTML = this.response;

            }
            else {
                document.location.href = "mydesigns.html";
            }
           

        } else {
            var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send();
    this.init();

}
Proces.prototype.sendCopyDesign = function (id) {

   
    var data = new Object();
    data.GUID = this.GUID;
    data.design = app.design.getData();
    data.func = "copydesign";
    data.copyid = id;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json, true);
    request.onload = function () {

        if (request.status >= 200 && request.status < 400) {
            if (this.response != "" && this.response.indexOf("Error") < 0) {
                var data = JSON.parse(this.response);
                app.proces.from = data.UsedStampings;
                app.design.initDesignSize(data.Width, data.Height);
                
                var img = document.createElement("img");
                img.width = app.design.viewwidth;
                img.height = app.design.viewheight;
                img.onload = function () {
                    var canvas = document.getElementById("canvasdesign");
                    var ctx = canvas.getContext("2d");
                    ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
                    app.design.saveClientDesign();
                    stopalert();
                }
                img.src = "/DUET?id=" + id + "&w=" + app.design.width + "&h=" + app.design.height;

                app.design.setBackgroundColor(data.Red, data.Green, data.Blue);
                app.palette.add(new RGB(data.Red, data.Green, data.Blue));

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
Proces.prototype.sendSaveDesign = function (ready) {

    app.ready = ready;
    
    var data = new Object();
    data.GUID = this.GUID;
    data.func ="savedesign";
   
    var data1 = new Object();
    data1.design = app.design.getData();
    data1.proces = this.getData();
    app.design.saveClientDesign();


    var json = JSON.stringify(data);
    var json1 = JSON.stringify(data1);
    var request = new XMLHttpRequest();
   
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == ""){

                
                if(app.ready){
                    app.ready = false;
                    stopalert();
                    document.location.href = "mydesigns.html";
                }
                else{
                    myalert("Your design is saved."); 
                    setTimeout(stopalert, 6000);
                }

            }
            else{
                myalert("Sorry, something is wrong! Your design cannot be saved."); 
                var errors = document.getElementById("errors");
                errors.innerHTML = this.response; 
            }

        } else {
            var errors = document.getElementById("errors");
           errors.innerHTML = this.response; 
        }
    }
    request.send(json1);
    myalert("Wait until your design is saved.");
}
Proces.prototype.undo = function() {
    stop(event);
    if(this.i > this.from){
            this.index = this.index.splice(0, this.from);
            this.x = this.x.splice(0, this.from);
            this.y = this.y.splice(0, this.from);
    }
    if(this.from == 0){
        app.design.clear();
    }
    else{
        app.design.restoreClientDesign();
    }

    this.i = this.from;
}
Proces.prototype.getData = function(){


    var procesdata = new Object();
    procesdata.x = this.x;
    procesdata.y = this.y;
    procesdata.index = this.index;
    procesdata.stampid = -1;
    procesdata.designid = app.design.id;
    this.i = 0
    this.from += this.x.length;
    this.x =[];
    this.y =[];
    this.index = [];
    return procesdata;
}



