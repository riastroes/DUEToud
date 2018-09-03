
function startDesign() {

    app.topic("divdesigner");
    initDesignerUI();
    initCanvasUI();
    moveSettings();

    app.palette = new Palette();
    app.palette.init();
    app.stamp = new Stamp();
    app.stamp.init();

    clearTimeout(app.timer);
    app.inspiration = new Inspiration();
    app.inspiration.init(true, 8000);
    app.inspiration.carousel();

    
   
    app.design = new Design();
    app.design.init();


    app.proces = new Proces();
    app.proces.init();

    app.proces.sendNewDesign();




   


}
function initDesignerUI() {

    var divdesigner = document.getElementById("divdesigner");
    var paneldesign = document.getElementById("paneldesign");
    var panelsettings = document.getElementById("panelsettings");
    var panelinspiration = document.getElementById("panelinspiration");
    var root = document.getElementById("root");
    //var inspiration = document.getElementById("inspiration");
    var canvaspalette = document.getElementById("canvaspalette");


    var w =  divdesigner.offsetWidth;
    var kw = parseInt(w / 4);
    var gw = w - kw;

    divdesigner.style.top ="55px";
    paneldesign.style.top ="55px";
    panelsettings.style.top ="55px";
    panelinspiration.style.top ="55px";
    root.style.top= w + 55 +"px";


    paneldesign.width = gw;
    panelsettings.width = kw;
    panelinspiration.width = gw;
    root.width = w;
    //inspiration.width = gw;
    canvaspalette.width = kw;
 
    divdesigner.height = paneldesign.width;
    paneldesign.height = paneldesign.width;
    panelsettings.height = paneldesign.width;
    panelinspiration.height = paneldesign.width;


    paneldesign.style.width = w + "px";
    panelsettings.style.width = kw + "px";
    panelinspiration.style.width = gw + "px";

    inspiration.style.width = gw - 40 + "px";
    root.style.width = w + "px";

    paneldesign.style.left ="0px";
    panelsettings.style.left = gw + "px";
    panelinspiration.style.left = w +"px";

    paneldesign.style.height = paneldesign.style.width;
    panelsettings.style.height = paneldesign.style.width;
    panelinspiration.style.height = paneldesign.style.width;


}
function moveSettings(){
    
    var divdesigner = document.getElementById("divdesigner");
    var panelsettings = document.getElementById("panelsettings");
    var panelinspiration = document.getElementById("panelinspiration");
    var btnDesign = document.getElementById("btndesign");

    var w= divdesigner.offsetWidth;
    var kw = parseInt(w / 4);
    var gw = w - kw;

    if(panelsettings.style.left != "0px")
    {
        //open
        panelsettings.style.right = kw + "px";
        panelsettings.style.left = "0px";
        panelinspiration.style.left = (kw) + "px";
        btnDesign.innerHTML = "Designer";
    }else{
        //dicht
        panelsettings.style.right = "0px";
        panelsettings.style.left = gw + "px";
        panelinspiration.style.left = (w) + "px";
        btnDesign.innerHTML = "Inspiration";
    }
    stop(event);
}

function initCanvasUI(){
    var divdesigner = document.getElementById("divdesigner");
    var divcanvas = document.getElementById("divcanvas");
    var canvas = document.getElementById("canvasdesign");
    var canvasbg = document.getElementById("canvasbackground");
    var canvastop = document.getElementById("canvastop");

    var marge = 20
    var w= divdesigner.offsetWidth;
    var kw = parseInt(w / 4);
    var gw = w - (kw + (2* marge));

    canvas.width = gw;
    canvas.height = gw;
    canvasbg.width = gw;
    canvasbg.height = gw;
    canvastop.width = gw;
    canvastop.height = gw;

    canvas.style.top = "94px";
    canvastop.style.top = "94px";
    canvasbg.style.top = "94px";
    canvas.style.left = marge + "px";
    canvastop.style.left = marge + "px";
    canvasbg.style.left = marge + "px";
    

}

