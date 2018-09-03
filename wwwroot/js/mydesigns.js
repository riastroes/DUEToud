function initMyDesigns() {
    sendGetMyDesigns();
}
function getDesigns(){
    sendGetAllDesigns();
}

function sendGetMyDesigns() {

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "mydesigns";
   

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){

                var data = JSON.parse(this.response);
                showMyDesigns(data);

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
function showMyDesigns(data) {
    var mydesigns = document.getElementById("mydesigns");
    var div ="";
    for(var i = 0; i < data.length; i++){
        var design = data[i];
        var frame = document.createElement("div");
        frame.class = "frame";
        frame.style.display="inline-block";
        var str = "<div class='tegel' id='thumb" + design.Id + "'><br/>";
        str += "<div id='likes'>likes:</div>";
       
        frame.innerHTML = str;
       
        
        mydesigns.appendChild(frame);

    }

    for(var i = 0; i < data.length; i++){
        var design = data[i];

        getThumbnail(design.Id, 200,200);
    }
}
function showSharedDesigns(data) {
    var shareddesigns = document.getElementById("shareddesigns");
    var str ="";
    for(var i = 0; i < data.length; i++){
        var design = data[i];
        var frame = document.createElement("div");
        frame.style.display="inline-block";
        var str = "<div class='tegel' id='thumb" + design.Id + "'></div><br/>";
        
        frame.innerHTML = str;
        shareddesigns.appendChild(frame);
    }

    for(var i = 0; i < data.length; i++){
        var design = data[i];

        getThumbnail(design.Id, 200,200);
    }
}
function showAllSharedDesigns(data) {
    var shareddesigns = document.getElementById("shareddesigns");
    var str = "";
    for (var i = 0; i < data.length; i++) {
        var design = data[i];
        var frame = document.createElement("div");
        frame.style.display = "inline-block";
        var str = "<div class='tegel' id='thumb" + design.Id + "'></div><br/>";
        var p = "<p>Created by " + design.Owner +"</p>";
       
        frame.innerHTML = str;
        
        shareddesigns.appendChild(frame);
    }

    for (var i = 0; i < data.length; i++) {
        var design = data[i];

        getThumbnail(design.Id, 200, 200);
    }
}

function sendGetAllDesigns() {

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "alldesigns";
   

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){

                var data = JSON.parse(this.response);
                createTableAllDesigns(data);

                 
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
function createTableAllDesigns(data) {
    var alldesigns = document.getElementById("alldesigns");
    var tab = "<table class='tbldesigns' width='100%' ><tr><th>Name</th><th></th><th>Date</th><th>Time</th><th>Owner</th><th>Design</th><th>View</th><th></th><th></th><th>Shared</th></tr>"

    for(var i = 0; i < data.length; i++){
        var design = data[i];
        var dat = new Date(design.Date);
        var strdat =  dat.getDate() +"-" + (dat.getMonth()+1) +"-" + dat.getFullYear();
        var strtime = dat.getHours() + ":" + dat.getMinutes();

        
        
        tab += "<tr><td>" + design.Name + "-" + design.Id + "</td>";
        tab += "<td id='thumb" + design.Id + "'></td>";
        tab += "<td>"+ strdat +"</td>";
        tab += "<td>"+ strtime +"</td>";
        tab += "<td>"+ design.Owner +"</td>";
        tab += "<td>"+ design.Width + "x" + design.Height  +"px</td>";
        tab += "<td>"+ design.ViewWidth + "x" + design.ViewHeight  +"px</td>";

        tab += "<td><button class='button' onclick='checkDesign(" + design.Id + ")'>Check</button></td>";
        tab += "<td><button class='button' onclick='showPattern(" + design.Id + ")'>Show</button></td>";
        if(design.Shared == true){
             tab += "<td>yes</td>";
        }
        else{
            tab += "<td>no</td>";
        }
        tab += "<td><button class='button' onclick='downloadDesign(" + design.Id + ")'>Download</button></td>";
        tab += "<td><button class='button' onclick='sendDeleteDesign(" + design.Id + ")'>Delete</button></td>";
        
        tab += "</tr>"

        
    }
     tab += "</table>";
    
   alldesigns.innerHTML = tab;

    for(var i = 0; i < data.length; i++){
        var design = data[i];

        getThumbnail(design.Id, 50,50);
    }

}
function sendGetADesign(id){
    
    //hier toevoegen verschillende knoppen afhankelijk van eigen design of andersmans design.
    // haal eerst informatie op over het design.
    var img = document.createElement("img");
    img.onload = function () {
        var frame = document.getElementById("divframe");
        frame.innerHTML = "";
        frame.appendChild(img);
    }
    img.src = "/DUET?id=" + id + "&w=700&h=700";
    

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "getdesign";
    data.designid = id;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json, true);
    request.onload = function () {

        if (request.status >= 200 && request.status < 400) {
            if (this.response != "" && this.response.indexOf("Error") < 0) {

                var design = JSON.parse(this.response);
                if (design != null) {
                    var designnr = document.getElementById("designnr");
                    designnr.innerHTML = "DUET-" + design.Id;
                    var p = document.createElement("p");
                    var str = "";
                    var p = document.createElement("p");
                    str += "This design is ready to order";
                    if (design.Shared) {
                        str += "!<br/>";
                    }
                    else {
                        str += " or share with other DUET members.<br/> ";
                    }
                    var cmwidth = Math.floor(design.Width / design.DPI * 2.54);
                    var cmheight = Math.floor(design.Height / design.DPI * 2.54);
                    str += "The maximum size of this pattern is " + cmwidth + "x" + cmheight + " cm <br/>and can be repeated horizontally and vertically.<br/><br/>";
                    str += "This design is created by " + design.Owner + "<br/> ";
                    str += "Created on :" + design.Date + "<br/> ";
                     
                    str += "Width :" + design.Width + " pixels.<br/> ";
                    str += "Height :" + design.Height + " pixels.<br/> ";
                    str += "DPI :" + design.DPI + " pixels per inch (2,54cm).<br/>";
                    str += "Used stamps :" + design.UsedStamps +  "<br/> ";
                    str += "Used stampings : " + design.UsedStampings + "<br/> ";
                    if (design.Shared) {
                        str += "This is a shared design and has "  + design.Likes + " likes."
                    }
                    else {
                        str += "This design is not shared.<br/> ";
                    }
                    p.innerHTML = str;

                    var div = document.getElementById("divinfo");
                    div.innerHTML = "";
                    div.appendChild(p);

                    var buttons = document.getElementById("divbuttons");
                    var str = "";
                    if (app.user == design.Owner) {
                        str += "<button class='button' onclick='loadDesign(" + design.Id + ")'>Change Design</button>";
                    }
                    str += "<button class='button' onclick='showPattern(" + design.Id + ")'>Show as Pattern</button>";
                    if (design.Shared) {
                        str += "<button class='button' onclick='sendShareDesign(" + design.Id + ")'>Stop sharing with DUET members</button>";
                    }
                    else {
                        str += "<button class='button' onclick='sendShareDesign(" + design.Id + ")'>Share with DUET members</button>";
                    }
                    str += "<button class='button' onclick='orderDesign(" + design.Id + ")'>Order photo's, a samples or fabric</button>";
                    if (app.user == design.Owner) {
                        str += "<button class='button' onclick='sendDeleteDesign(" + design.Id + ")'>Delete</button>";
                    }
                    
                    buttons.innerHTML += str;
                }
            }

        }
    }
    request.send();
}
function sendDeleteDesign(id) {

    var data = new Object();
    data.GUID = app.GUID;
    data.func = "deletedesign";
    data.designid = id;
   

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == "" && this.response.indexOf("Error") < 0){
                document.location.reload();
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
function sendShareDesign(index){

    var data = new Object();
    data.GUID = app.GUID;
    data.index = index;
    data.func = "share";
    data.designid = index;


    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response == ""){
                document.location.reload();
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

function downloadDesign(id) {
    var data = new Object();
    data.GUID = app.GUID;
    data.func = "download";
    data.designid = id;

    var json = JSON.stringify(data);

    var request = new XMLHttpRequest();
    request.open('POST', app.localhost + "api/design/" + json , true);
    request.onload = function() {

        if (request.status >= 200 && request.status < 400) {
            if(this.response != "" && this.response.indexOf("Error") < 0){
                var data = JSON.parse(this.response);


                var link = document.createElement("a");
                link.download = data.filename;
                link.href = "data:image/png;base64," + data.raw;
                link.click();
            }
           
        } 
    }
    request.send();
}
