/********* inspiration.js ************/


function Inspiration(){
    this.divinspiration;
    this.width;
    this.height;
    this.index;
    this.title;
    this.slides =[];
    this.dots =[];
    this.showDots;
    this.lock;
    this.isLocked;
    this.x;
    this.y;

    //this.mode;

}
Inspiration.prototype.init = function(showdots){
    this.divinspiration =document.getElementById("divinspiration");
    this.lock =document.getElementById("inspirationlock");
    this.slides = document.getElementsByClassName("slides");

    if(showdots){
        this.dots = document.getElementsByClassName("dots");
        this.showdots = showdots;
    }

    this.divinspiration.style.padding ="0px";
    this.divinspiration.style.margin ="0px";

    
    this.width = this.slides[0].offsetWidth;
    this.height = this.slides[0].offsetHeight;
    this.index = 1;
    this.show(this.index);
    this.x = parseInt( this.width/2 );
    this.y = parseInt( this.height/2);
    this.index = 1;
    this.title = this.slides[this.index - 1].alt;
    this.isLocked = false;

}
Inspiration.prototype.clickLock = function() {
    if (this.isLocked) {
        app.timer = setTimeout(app.inspiration.carousel, 4000); 
        this.lock.src = "images/google/lock-open.svg";
        this.isLocked = false;
    }
    else {
        clearTimeout(app.timer);
        this.lock.src = "images/google/lock-closed.svg";
        this.isLocked = true;
    }
}
Inspiration.prototype.show = function(index){
    for(var i = 0; i < this.slides.length; i++){
        this.slides[i].style.display ="none";
        if(this.showdots){
            this.dots[i].className = this.dots[i].className.replace(" w3-white", "");
        }
    }
    this.index = index;
    this.slides[this.index - 1].style.display ="block";
    if(this.showdots){
        this.dots[this.index -1].className += " w3-white";
    }


}
Inspiration.prototype.showDot = function(index){
    this.show(index);
    stop(event);
}
Inspiration.prototype.showNext = function(direction){
    var next = this.index + direction;
    if(next > this.slides.length){next = 1;}
    if(next < 1){next = this.slides.length;}

    this.show(next);
    stop(event);
}

Inspiration.prototype.carousel = function(){
    var i;
    var x = document.getElementsByClassName("slides");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none"; 
    }
    app.inspiration.index++;
    if (app.inspiration.index > x.length) {app.inspiration.index = 1} 
    x[app.inspiration.index-1].style.display = "block"; 

    app.timer = setTimeout(app.inspiration.carousel, 4000); 
}

Inspiration.prototype.xy = function(imagenr){
    
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.index = imagenr;
    if (this.index > 0 && this.index  <= this.slides.length && this.index >= 0) {
        this.title = this.slides[this.index-1].alt;
        var acolor = this.getColor(this.index, this.x,this.y);
        app.palette.add(acolor);
        this.width = this.slides[this.index-1].offsetWidth;
        this.height = this.slides[this.index-1].offsetHeight;
        app.stamp.setStamp(this.index, this.x,this.y, acolor);
    }
    document.scrollingElement.scrollTop= 0;
}
Inspiration.prototype.getColor = function(imagenr, x, y){
    var img = document.getElementById("img" + imagenr);
    if(img != null){
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        var data = canvas.getContext('2d').getImageData(x,y, 1, 1).data;
        return new RGB(data[0],data[1],data[2]);

    } else {
        return new RGB(0,0,0);
    }
        
    
}
Inspiration.prototype.getData = function () {
    var inspirationdata = new Object();
    inspirationdata.width= this.width;
    inspirationdata.height= this.height;
    inspirationdata.index= this.index;
    inspirationdata.title= this.title;
    inspirationdata.x = this.x;
    inspirationdata.y = this.y;


    return inspirationdata;
}