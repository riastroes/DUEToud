function Stamp() {


    this.stamp;
    this.shapeindex;
    this.type;
    this.asbrush;
    this.inspirationnr;
    this.width;
    this.height;
    this.repeathorizontal;
    this.repeatvertical;
    this.x;
    this.y;
    this.r;
    this.g;
    this.b;
    this.scale;
    this.rotate;
}
Stamp.prototype.init = function(){

    var divdesigner = document.getElementById("divdesigner");
    this.stamp = document.getElementById("stamp");
    var shapes = document.getElementsByClassName("stampshapes");
    var types = document.getElementsByClassName("stamptypes");
    var repeathor = document.getElementById("inrepeathor");
    var repeatver = document.getElementById("inrepeatver");
    var repeatdist = document.getElementById("inrepeatdist");
    var lblstampscale = document.getElementById("lblstampscale");
    var lblstampsize = document.getElementById("lblstampsize");
    var lblstamprotate = document.getElementById("lblstamprotate");


    this.isused = false;
    this.scale = 1;
    this.rotate = 0;

    lblstampscale.innerHTML = "Scale: " + parseInt(instampscale.value * 100) + " %";
    lblstamprotate.innerHTML = "Rotate: " + parseInt(this.rotate) + "&deg;" ;

    this.shapeindex= 3;
    this.type = "copy";
    var w =   divdesigner.offsetWidth;
    var kw = parseInt(w / 4);
    var gw = w - (kw + 40);
    this.width = parseInt(gw/10);
    for (i = 0; i < shapes.length; i++) {
             shapes[i].width = parseInt(gw/10);
             shapes[i].height = parseInt(gw/10);
        }
    

    this.height = this.width;
    var instampsize = document.getElementById("instampsize");
    instampsize.value = this.width;
    lblstampsize.innerHTML =  "Size (10-200px): " + instampsize.value + "px";

    this.stamp.width = this.width;
    this.stamp.height = this.height;
    this.setRepeatHor(1);
    this.setRepeatVer(1);

    this.setRepeatDist(1);
    this.showShape(3);

    this.bgcolor = new RGB(255,255,255);
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.x = 0;
    this.y = 0;




}


Stamp.prototype.nextShape = function(n) {
    if (n == 0) {
        if (event.offsetX > (event.srcElement.offsetWidth / 2)) {
            n = 1;
        }
        else {
            n = -1;
        }
    }
    stop(event);

    this.shapeindex += n;
    this.showShape(this.shapeindex);

}
Stamp.prototype.showShape = function(n) {
  
  var shapes = document.getElementsByClassName("stampshapes");

  for (i = 0; i < shapes.length; i++) {
     shapes[i].style.display = "none";  
  }  
  if (this.shapeindex >= shapes.length) {this.shapeindex = 0} 
  if (this.shapeindex == -1) {this.shapeindex = shapes.length-1} 
    shapes[this.shapeindex].style.display = "block";

    if(app.proces != undefined){
        app.proces.sendGetStamp();
    }
}
Stamp.prototype.setType = function(){
    stop(event);
    var types = document.getElementsByName("stamptype");
    if(types[0].checked){
        this.type = "copy";
    }
    else if(types[1].checked){
        this.type = "color";
    }
    else if(types[2].checked){
        this.type = "lightness";
    }
    app.proces.sendGetStamp();
}
Stamp.prototype.checkAsBrush = function(){
    stop(event);
    var as = document.getElementById("asbrush");
    if (as.checked) {
        this.asbrush = true;
    }
    else{
        this.asbrush = false;
    }
}

Stamp.prototype.setRepeatHor = function(repeathor){
    var inrepeathor  = document.getElementById("inrepeathor");
    var lblrepeathor = document.getElementById("lblrepeathor");
    if(repeathor != undefined){
        inrepeathor.value = repeathor;
    }
    this.repeathorizontal = inrepeathor.value;

    lblrepeathor.innerHTML =  "Repeat " + inrepeathor.value + " x horizontal (1-10)";

}
Stamp.prototype.setRepeatVer = function(repeatver){

    var inrepeatver  = document.getElementById("inrepeatver");
    var lblrepeatver = document.getElementById("lblrepeatver");
    if(repeatver != undefined){
        inrepeatver.value = repeatver;
    }
    this.repeatvertical = inrepeatver.value;
    lblrepeatver.innerHTML =  "Repeat " + inrepeatver.value + " x vertical (1-10)";

}
Stamp.prototype.setRepeatDist = function(repeatdist){

    var inrepeatdist  = document.getElementById("inrepeatdist");
    var lblrepeatdist = document.getElementById("lblrepeatdist");
    if(repeatdist != undefined){
        inrepeatdist.value = repeatdist;
    }
    this.repeatdist = inrepeatdist.value;
    lblrepeatdist.innerHTML =  "Repeat Distance: " + (inrepeatdist.value * 100) + "%";

}
Stamp.prototype.setScale = function(){

    var instampscale  = document.getElementById("instampscale");
    var lblstampscale = document.getElementById("lblstampscale");
    this.scale = instampscale.value;
    lblstampscale.innerHTML =  "Scale: " + parseInt(instampscale.value * 100) + " %";

    app.proces.sendGetStamp();

}
Stamp.prototype.setRotate = function () {

    var instamprotate = document.getElementById("instamprotate");
    var lblstamprotate = document.getElementById("lblstamprotate");
    this.rotate = instamprotate.value;
    lblstamprotate.innerHTML = "Rotate: " + parseInt(instamprotate.value ) + "&deg;";

    app.proces.sendGetStamp();

}
Stamp.prototype.setSize = function(){

    var instampsize  = document.getElementById("instampsize");
    var lblstampsize = document.getElementById("lblstampsize");
    this.width = parseInt(instampsize.value);
    this.height = parseInt(instampsize.value);
    lblstampsize.innerHTML = "Size (10-200px): " + instampsize.value + "px";
    //var shapes = document.getElementsByClassName("stampshapes");
    //for (i = 0; i < shapes.length; i++) {
    //         shapes[i].width = this.width;
    //         shapes[i].height = this.height;
    //    }
    this.stamp.width = this.width;
    this.stamp.height = this.height;
    app.proces.sendGetStamp();

 }
Stamp.prototype.setStamp = function(inspirationnr, x, y, acolor){
    stop(event);
    this.inspirationnr = inspirationnr;


    this.x = x;
    this.y = y;
    this.bgcolor = acolor;
    app.proces.sendGetStamp();

}
Stamp.prototype.getData = function () {
    var stampdata = new Object();

    stampdata.width = this.width;
    stampdata.height = this.height;
    stampdata.x = this.x;
    stampdata.y = this.y;
    stampdata.shapeindex =  this.shapeindex;
    stampdata.type =  this.type;
    stampdata.asbrush = this.asbrush;
    stampdata.inspirationnr = this.inspirationnr;
    stampdata.repeathorizontal = this.repeathorizontal;
    stampdata.repeatvertical = this.repeatvertical;
    stampdata.r = this.r;
    stampdata.g = this.g;
    stampdata.b = this.b;
    stampdata.scale = this.scale;
    stampdata.rotate = this.rotate;
    return stampdata;
}
