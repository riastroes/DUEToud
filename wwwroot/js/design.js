var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true };
document.onmouseup   = function() { isMouseDown = false };

function Design() {

    this.horruler;
    this.verruler;
    this.canvas;
    this.canvasbg;
    this.canvastop;
    this.ctx; 
    this.ctxbg;
    this.ctxtop;
    this.width;
    this.height;
    this.DPI;
    this.viewwidth;
    this.viewheight;

    this.id;
    this.name;
    this.date;
    this.bgcolor;



}
Design.prototype.init = function(id) {

    this.horruler = document.getElementById("canvashorruler");
    this.verruler = document.getElementById("canvasverruler");
    this.canvas = document.getElementById("canvasdesign");
    this.canvasbg = document.getElementById("canvasbackground");
    this.canvastop = document.getElementById("canvastop");
    this.ctx = this.canvas.getContext("2d");
    this.ctxbg = this.canvasbg.getContext("2d");
    this.ctxtop = this.canvastop.getContext("2d");
    this.width = app.DESIGNWIDTH;
    this.height = app.DESIGNHEIGHT;
    this.DPI = app.DPI;
    this.viewwidth = this.canvas.width;
    this.viewheight = this.canvas.height;
    this.bgcolor = new RGB(255,255,255);


    this.initDesignSize(app.DESIGNWIDTH, app.DESIGNHEIGHT);
 

}
Design.prototype.initDesignSize = function (WIDTH, HEIGHT) {
    var indesignsize = document.getElementById("indesignsize");
    var lbldesignsize = document.getElementById("lbldesignsize");

    indesignsize.value = (WIDTH / app.DPI) * 2.54;
    indesignsize.max = (app.MAXDESIGNWIDTH / app.DPI) * 2.54;
    
    this.width = WIDTH;
    this.height = HEIGHT;
    app.DESIGNWIDTH = WIDTH;
    app.DESIGNHEIGHT = HEIGHT;

    lbldesignsize.innerHTML = indesignsize.value + " x " + indesignsize.value + " cm"

    this.setupRulers();
}
Design.prototype.ChangeDesignSize = function () {
    var indesignsize = document.getElementById("indesignsize");
    
    var w = indesignsize.value * (app.DPI / 2.54);
    this.initDesignSize(w,w);
}
Design.prototype.setupRulers = function() {
    var horctx = this.horruler.getContext("2d");
    horctx.fillStyle = "#efefef";
    horctx.fillRect(0,0,this.horruler.width, this.horruler.height);
    this.drawRuler(horctx, "horizontal");

    var verctx = this.verruler.getContext("2d");
    verctx.fillStyle = "#efefef";
    verctx.fillRect(0,0,30, this.verruler.height);
    this.drawRuler(verctx, "vertical");

}
Design.prototype.drawRuler = function (ctx, type) {

    var maxwidth = app.DESIGNWIDTH / (app.DPI / 2.54);
    var maxheight = app.DESIGNHEIGHT / (app.DPI / 2.54);
    
    if(type == "horizontal"){
        var w = Math.floor(this.horruler.width / maxwidth);

        for (var i = 1; i < maxwidth; i++){
            
            if (i % Math.floor(maxwidth/2) == 0){
                ctx.fillStyle = "#ff0000";
                ctx.fillText(i.toString() , (i*w)-5, 10);
                ctx.strokeStyle = "#ff0000";
               
            }
            else if (i % Math.floor(maxwidth /4) == 0){
                ctx.fillStyle = "#000099";
                ctx.fillText(i.toString() , (i*w)-5, 10);
                ctx.strokeStyle = "#000099";
               
            }
            else if (i % Math.floor(maxwidth / 8) == 0){
                
                ctx.fillStyle = "#000000";
                ctx.fillText(i.toString() , (i*w)-5, 10);
                ctx.strokeStyle = "#000000";
            }
            else{
                ctx.fillStyle = "#000000";
                ctx.fillText(i.toString(), (i * w) - 5, 10);
                ctx.lineTo(i * w, 20);
                ctx.strokeStyle = "#000000";
            }
            ctx.beginPath();
            ctx.moveTo(i * w, 30 );
            ctx.lineTo(i * w, 18);
            ctx.stroke();
        }

    }
    else if(type == "vertical"){
        
        var h = Math.floor(this.verruler.height / maxheight);

        for (var i = 1; i <= maxheight; i++){
            
            if (i % Math.floor(maxheight/2) == 0){
                ctx.fillStyle = "#ff0000";
                ctx.fillText(i.toString() ,2, (i*h)  + 5);
                ctx.strokeStyle = "#ff0000";
            }
            else if (i % Math.floor(maxheight / 4) == 0){
                ctx.fillStyle = "#000099";
                ctx.fillText(i.toString() ,2, (i*h)  + 5);
                ctx.strokeStyle = "#000099";
            }
            else if (i % Math.floor(maxheight / 8) == 0){
                ctx.fillStyle = "#000000";
                ctx.fillText(i.toString() ,2, (i*h)  + 5);
                ctx.strokeStyle = "#000000";

            }
            else{
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#000000";
                ctx.fillText(i.toString(), 2, (i * h) + 5);
            }
            ctx.beginPath();
            ctx.moveTo(30, i * h);
            ctx.lineTo(18 , i * h);
            ctx.stroke();
        }
       
    }
}
Design.prototype.rulers =function(){
    var btnrulers = document.getElementById("btnrulers");
    if(btnrulers.innerHTML == "Off"){
        btnrulers.innerHTML = "On";
        this.showRulerLines(false);
    }
    else{
        btnrulers.innerHTML = "Off";
        this.showRulerLines(true);
    }
}
Design.prototype.showRulerLines = function(on){
    var ctx = this.verruler.getContext("2d");
    ctx.lineWidth = 0.2;
    if (on) {
        var maxwidth = app.DESIGNWIDTH / (app.DPI / 2.54);
        var maxheight = app.DESIGNHEIGHT / (app.DPI / 2.54);

        var h = Math.floor(this.verruler.height / maxheight);

        for (var i = 1; i <= maxheight; i++){
            
            if(i == Math.floor(maxheight/2)){
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "#ff0000";
                ctx.fillStyle = "#ff0000";
            }
            else if (i == Math.floor(maxheight /4)){
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = "#000099";
                ctx.fillStyle = "#000099";
            }
            else if (i == Math.floor(maxheight / 4 * 3)) {
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = "#000099";
                ctx.fillStyle = "#000099";
            }
            else {
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#000000";
            }

           
            ctx.beginPath();
            ctx.moveTo(30, i * h);
            ctx.lineTo(this.verruler.width , i * h);
            ctx.stroke();
        }

        var w = Math.floor((this.verruler.width - 30) / maxwidth);

       for (var i = 1; i <= maxwidth; i++){
            
            if (i == Math.floor(maxwidth/2)){
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = "#ff0000";
                ctx.fillStyle = "#ff0000";
            }
            else if (i == Math.floor(maxwidth/4)){
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = "#000099";
                ctx.fillStyle = "#000099";
            }
            else if (i == Math.floor(maxwidth /4 * 3)) {
                ctx.lineWidth = 0.3;
                ctx.strokeStyle = "#000099";
                ctx.fillStyle = "#000099";
            }
            else{
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = "#000000";
                ctx.fillStyle = "#000000";
            }
            
           
            ctx.beginPath();
            ctx.moveTo(30+(i * w), 0);
            ctx.lineTo(30+(i* w), this.verruler.height );
            ctx.stroke();
        }
        
       
    }
    else{
        ctx.clearRect(30,0,ctx.canvas.width-30,ctx.canvas.height);
    }
}
Design.prototype.setBackgroundColor = function(r, g, b) {
    this.bgcolor = new RGB(r,g,b);
    this.ctxbg.fillStyle = this.bgcolor.color();
    this.ctxbg.fillRect(0,0,this.viewwidth, this.viewheight);
    if (app.proces != undefined && app.proces != null) {
        app.proces.sendSetBgColor();
    }

}

Design.prototype.xy = function() {
    
    var x = event.offsetX - 30; // minus rulerwidth
    var y = event.offsetY;
    this.XY(x,y);
}
Design.prototype.XY = function(x,y){
    
    var cw = parseInt((app.stamp.width * app.stamp.scale) / 2); // cw = halve breedte stamp
    var ch = parseInt((app.stamp.height * app.stamp.scale)/ 2); // ch = halve hoogte stamp

    var m = cw;

    x -= cw;    //x = center.x of stamp
    y -= ch;    //y = center.y of stamp
    

    var repeatwidth = parseInt(( this.viewwidth / app.stamp.repeathorizontal) * app.stamp.repeatdist);
    var repeatheight = parseInt(( this.viewheight / app.stamp.repeatvertical) * app.stamp.repeatdist);
    for (var r = 0; r < app.stamp.repeatvertical; r++) {
        for (var c = 0; c < app.stamp.repeathorizontal; c++) {
            var rx = (x + (c * repeatwidth)) % this.viewwidth;
            var ry = (y + (r * repeatheight)) % this.viewheight;

            if (app.stamp.rotate > 0) {
                this.ctx.save();
                this.ctx.translate(rx + cw ,ry + ch );
                this.ctx.rotate(degrees(app.stamp.rotate));
                this.ctx.drawImage(app.stamp.stamp, -cw, -ch , app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                this.ctx.restore();
            }
            else {
               this.ctx.drawImage(app.stamp.stamp, rx, ry, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
            }
            app.proces.add(rx,ry);

            if (rx > (this.viewwidth - ((app.stamp.width * app.stamp.scale) + m))) {

                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate((rx + cw) - this.viewwidth, ry + ch );
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx - this.viewwidth, ry, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx-this.viewwidth,ry);

            }
            if (ry > (this.viewheight - ((app.stamp.height * app.stamp.scale) + m))) {
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate(rx + cw, (ry + ch) - this.viewheight );
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx, ry - this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx,ry - this.viewheight);
             }
            if (rx < ((app.stamp.width * app.stamp.scale)+m)) {
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate((rx + cw) + this.viewwidth, ry + ch);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx + this.viewwidth, ry, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx+this.viewwidth,ry);
            }
            if (ry < ((app.stamp.height * app.stamp.scale)+m)) {
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate(rx + cw, (ry  + ch)+ this.viewheight);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx, ry + this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx,ry + this.viewheight);
            }
            if (ry < ((app.stamp.height * app.stamp.scale)+m) && rx < ((app.stamp.width * app.stamp.scale)+m)) {
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate(rx + cw + this.viewwidth, ry + ch + this.viewheight);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx + this.viewwidth, ry + this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx + this.viewwidth,ry + this.viewheight);
            }
            if(ry < ((app.stamp.height * app.stamp.scale)+m) &&  rx > (this.viewwidth - ((app.stamp.width * app.stamp.scale)+m))){
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate(rx + cw - this.viewwidth, ry + ch + this.viewheight);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx - this.viewwidth, ry + this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx - this.viewwidth,ry + this.viewheight);

             }
            if(ry > (this.viewheight -((app.stamp.height * app.stamp.scale)+m)) &&  rx > ((this.viewwidth - (app.stamp.width * app.stamp.scale)+m))){
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate((rx + cw) - this.viewwidth, (ry + ch) - this.viewheight);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx - this.viewwidth, ry - this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx - this.viewwidth, ry - this.viewheight);

             }
            if (ry > (this.viewheight - ((app.stamp.height * app.stamp.scale)+m)) && rx < ((app.stamp.width * app.stamp.scale)+m)) {
                if (app.stamp.rotate > 0) {
                    this.ctx.save();
                    this.ctx.translate((rx + cw) + this.viewwidth, (ry + ch) - this.viewheight);
                    this.ctx.rotate(degrees(app.stamp.rotate));
                    this.ctx.drawImage(app.stamp.stamp, -cw, -ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                    this.ctx.restore();
                }
                else {
                    this.ctx.drawImage(app.stamp.stamp, rx + this.viewwidth, ry - this.viewheight, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
                }
                app.proces.add(rx + this.viewwidth, ry - this.viewheight);
            }

        }
    }

}
Design.prototype.cursor = function(){
    var x = event.offsetX - 30;
    var y = event.offsetY;
    var cw = parseInt((app.stamp.width * app.stamp.scale) / 2);
    var ch = parseInt((app.stamp.height * app.stamp.scale) / 2);


    if (app.stamp.asbrush == true && isMouseDown) {
        
        this.XY(x, y);
    }

    if (this.cursorok || this.cursorok == undefined) {
        this.cursorok = false;
        this.ctxtop.save();

        
        this.ctxtop.clearRect(0, 0, this.viewwidth, this.viewheight);
        this.ctxtop.translate(x, y);
        this.ctxtop.rotate(degrees(app.stamp.rotate));
        this.ctxtop.drawImage(app.stamp.stamp,-cw,-ch, app.stamp.width * app.stamp.scale, app.stamp.height * app.stamp.scale);
        this.ctxtop.restore();
        this.cursorok = true;
    }


}
Design.prototype.create = function() {
    stop(event);
    this.clear();
    app.proces.sendNewDesign();

}
Design.prototype.clear = function(){

    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
}
Design.prototype.cleartop = function(){
    this.ctxtop.clearRect(0, 0, this.viewwidth, this.viewheight);
}
Design.prototype.delete = function() {
    stop(event);
    this.init();
    this.clear();
    app.proces.sendDeleteProcesses();

}
Design.prototype.save = function() {
    stop(event);
    this.init();
    app.proces.sendSaveDesign();
}
Design.prototype.ready = function() {
    stop(event);
    this.init();
    app.proces.sendSaveDesign(true);

}
Design.prototype.saveClientDesign = function() {
    var canvas = document.getElementById("canvasdesign");
    var ctx = canvas.getContext("2d");
    sessionStorage.setItem("DUETSTEP",canvas.toDataURL("image/png"));

    var btnundo = document.getElementById("btnundodesign");
    btnundo.className ="button30no";
    btnundo.click = function(){};
}
Design.prototype.restoreClientDesign = function() {
    if(sessionStorage.getItem("DUETSTEP")){
        var canvas = document.getElementById("canvasdesign");
        var img = document.createElement("img");
        img.width = canvas.width;
        img.height = canvas.height;
        img.onload = function(){
            var canvas = document.getElementById("canvasdesign");
            app.design.clear();
            var ctx = canvas.getContext("2d");
            ctx.drawImage(this, 0,0, canvas.width, canvas.height);
        }
        img.src = sessionStorage.getItem("DUETSTEP");
       
    }
}
Design.prototype.getData = function(){
    var designdata = new Object();
    designdata.width = this.width;
    designdata.height = this.height;
    designdata.viewwidth = this.viewwidth;
    designdata.viewheight = this.viewheight;
    designdata.id = this.id;
    designdata.bgred = this.bgcolor.r;
    designdata.bggreen = this.bgcolor.g;
    designdata.bgblue= this.bgcolor.b;
    return designdata;
}
