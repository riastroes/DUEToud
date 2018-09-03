/********* palette  ************/
function Palette(){
    this.canvas = document.getElementById("canvaspalette");
    this.ctx = this.canvas.getContext("2d");
    this.colors =[];
    this.bgcolor ;

    this.init();

}
Palette.prototype.init = function() {
    var divsettings = document.getElementById("panelsettings");
    this.canvas = document.getElementById("canvaspalette");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width=divsettings.offsetWidth - 40;
    this.canvas.height = 30;
    this.colors[0] = new RGB(255,255,255);
    this.bgcolor = this.colors[0];
    this.show();

}
Palette.prototype.add = function(rgb){
    this.colors[this.colors.length] = rgb;
    this.show();

}
Palette.prototype.show = function() {
    var x, y;
    var w, h;
    y = 0;
    w = this.canvas.width / this.colors.length;
    h = this.canvas.height;

    for (var i = 0; i < this.colors.length; i++) {
        x = i * w;
        this.ctx.fillStyle = this.colors[i].color();
        this.ctx.fillRect(x, y, w, h);
    }
}
Palette.prototype.setBgColor = function() {
    var x;
    if(event != null){
        x = event.offsetX;
    }
    else{
        x = 1;
    }

    var w = this.canvas.width / this.colors.length;
    var i = Math.floor(x / w);

    var selectedcolor = this.colors[i];
    //this.colors =[];
    //this.colors[0] = selectedcolor;
    //this.show();
    app.design.setBackgroundColor(selectedcolor.r,selectedcolor.g,selectedcolor.b );
    stop(event);

}
Palette.prototype.getBgColor = function(){
    return this.colors[0];
}
