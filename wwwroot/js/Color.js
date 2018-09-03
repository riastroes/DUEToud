function RGB(r,g,b){
    this.r = r;
    this.g = g;
    this.b = b;
}
RGB.prototype.color = function(){
    return "rgb(" + this.r + "," + this.g + "," +this.b+ ")";
}