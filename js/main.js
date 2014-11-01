


$(function() {

//Initilization
designscale=1;
var designcanvas =  $('#designCanvas')[0];
var designcontext = designcanvas.getContext('2d');
displayscale=0.15;
selectedmodel=-1;
selectedpoint = -1;
var displaycanvas = $('#displayCanvas')[0];
var displaycontext = displaycanvas.getContext('2d');
var currentModel = new model();
currentModel.glassArray[0]  = new point(-75,75);
currentModel.glassArray[1]  = new point(75,75);
currentModel.glassArray[2]  = new point(75,-75);
currentModel.glassArray[3]  = new point(55,-75);
currentModel.glassArray[4]  = new point(55,55);
currentModel.glassArray[5]  = new point(-55,55);
currentModel.glassArray[6]  = new point(-55,-75);
currentModel.glassArray[7]  = new point(-75,-75);
currentModel.mirrorArray[0] = new point(-100,-95);
currentModel.mirrorArray[1] = new point(100,-95);
currentModel.mirrorArray[2] = new point(100,-105);
currentModel.mirrorArray[3] = new point(-100,-105);

changeSizes();




//Auto-sizing Divs
$(window).resize(function() {
  changeSizes();
});
function changeSizes(){
var main_content_height = $('#content').height() - 87;
$('#main_content').height(main_content_height);
var div_height = (main_content_height/2) - 20 ;
$('.inline_division').height(div_height);
$('.division').height(div_height);
var inline_division_width = ($('#content').width()/3) -26;
$('.inline_division').width(inline_division_width);
$('.division').width($('#content').width()-31);

$('#designCanvas').attr('width', $('.inline_division').innerWidth());
$('#designCanvas').attr('height', $('.inline_division').innerHeight());

designcontext.restore();
designcontext.translate($('.inline_division').innerWidth()/2,$('.inline_division').innerHeight()/2);
designcontext.scale(designscale,designscale);

$('#displayCanvas').attr('width', $('.division').innerWidth());
$('#displayCanvas').attr('height', $('.division').innerHeight());

displaycontext.restore();
displaycontext.translate($('.division').innerWidth()/2,$('.division').innerHeight()*0.2);
displaycontext.scale(displayscale,displayscale);

drawDesignCanvas();
drawDisplayCanvas();
}

//Zoom in
$('#zoomIn').click( function()
           {
             designscale = designscale * 1.1;
             changeSizes();        }
        );
//Zoom out
$('#zoomOut').click( function()
           {
             designscale = designscale / 1.1;
             changeSizes();
           }
        );


//Model file
function model(){
	this.glassArray = []; //1
	this.mirrorArray = []; //2

}

//Points used for array 
function point(x,y){
	this.x = x;
	this.y = y;
}
//Displaying Canvas
function drawDisplayCanvas () {
displaycontext.clearRect(-10000, -10000, 20000, 20000);
drawElements(displaycontext);
}
//Design Canvas
function drawDesignCanvas(){
designcontext.clearRect(-10000, -10000, 20000, 20000); // Clear canvas
drawElements(designcontext);
designcontext.fillStyle = 'grey';
designcontext.lineWidth = 0;
drawPoints(currentModel.glassArray,designcontext);
drawPoints(currentModel.mirrorArray,designcontext);
}
//Elements that are drawn for both models
function drawElements(context){



context.beginPath();
context.strokeStyle = 'rgba(100,100,100,0.3)';
context.fillStyle = 'rgba(150,150,150,0.3)';
context.fillRect(-10,-10 , 20, 1210);
context.strokeRect(-10,-10 , 20, 1210);
context.closePath();

context.beginPath();
context.fillStyle = 'rgba(69,69,69,0.6)';
context.fillRect(-10000,1200,20000,500);
context.closePath();

context.beginPath();
context.arc(0, 0, 5, 0, Math.PI * 2);
context.strokeStyle = 'orange';
context.fillStyle= 'rgba(255,200,0,0.5)';
context.stroke();
context.fill();
context.closePath();

drawShape(currentModel.glassArray , context);
context.strokeStyle = 'black';
context.lineJoin="round";
context.lineWidth = 2;
context.stroke();
context.fillStyle= 'rgba(200,255,255,0.3)';
context.fill();

drawShape(currentModel.mirrorArray , context);
context.strokeStyle = 'black';
context.lineJoin="round";
context.lineWidth = 2;
context.stroke();
context.fillStyle= 'rgba(200,200,200,1)';
context.fill();
}

//Draws the Shape made up of a point array, scale and context
function drawShape(points,context){
var arrayLength = points.length;
if(points && arrayLength > 0){
	context.beginPath();
	context.moveTo(points[0].x, points[0].y);
	for (var i = 1; i < arrayLength; i++) {
	context.lineTo(points[i].x, points[i].y);   
}
	context.lineTo(points[0].x, points[0].y);
	context.closePath();
}
}
//The little blobs that you can move
function drawPoints(points,context){
var arrayLength = points.length;
if(points && arrayLength > 0){
for (var i = 0; i < arrayLength; i++) {
	context.beginPath();
	context.arc(points[i].x, points[i].y,3/designscale, 0, Math.PI * 2);
	context.closePath(); 
	context.fill();  
}

}
}


//Mouse movements for canvases
var dragging = false;

$('#designCanvas').mousedown(function(e){

var pointoncanvas = new point((e.pageX - $('#designCanvas').offset().left) ,(e.pageY - $('#designCanvas').offset().top));

if(returnPointNumberForDesignCanvasArray(currentModel.glassArray,pointoncanvas)!=-1){
selectedmodel = 1;
selectedpoint = returnPointNumberForDesignCanvasArray(currentModel.glassArray,pointoncanvas);
}else if(returnPointNumberForDesignCanvasArray(currentModel.mirrorArray,pointoncanvas)!=-1){
selectedmodel = 2;
selectedpoint = returnPointNumberForDesignCanvasArray(currentModel.mirrorArray,pointoncanvas);
}else{
selectedmodel=-1;
}

if(selectedmodel!=-1){
dragging = true;
}

if(doesMousePointOnCanvasOverlapPoint(glasshoverpoint,pointoncanvas)){
currentModel.glassArray.splice(newpointnumber+1,0,glasshoverpoint);
selectedmodel=1;
selectedpoint=newpointnumber+1;
dragging=true;
}else if(doesMousePointOnCanvasOverlapPoint(mirrorhoverpoint,pointoncanvas)){
currentModel.mirrorArray.splice(newpointnumber+1,0,mirrorhoverpoint);
selectedpoint=2;
selectedpoint=newpointnumber+1;
dragging=true;
}





});

$(document).mouseup(function(e){
    dragging = false;
    
})
var glasshoverpoint;
var mirrorhoverpoint;
$('#designCanvas').mousemove(function(e){
   var pointoncanvas = new point((e.pageX - $('#designCanvas').offset().left) ,(e.pageY - $('#designCanvas').offset().top));
    if(dragging == false){

    glasshoverpoint = testForHoverOverMidPoints(currentModel.glassArray,pointoncanvas);
		mirrorhoverpoint = testForHoverOverMidPoints(currentModel.mirrorArray,pointoncanvas);
    	if(glasshoverpoint!=-1){
    		drawDesignCanvas(); 
    		designcontext.fillStyle= 'rgba(200,255,255,0.3)';
    		designcontext.beginPath();
			designcontext.arc(glasshoverpoint.x, glasshoverpoint.y,3, 0, Math.PI * 2);
			designcontext.closePath(); 
			designcontext.fill();
			
    	}else if(mirrorhoverpoint!=-1){
    		drawDesignCanvas(); 
    		designcontext.fillStyle= 'rgba(200,255,255,0.3)';
    		designcontext.beginPath();
			designcontext.arc(mirrorhoverpoint.x, mirrorhoverpoint.y,3, 0, Math.PI * 2);
			designcontext.closePath(); 
			designcontext.fill();  
    	}else{
    	drawDesignCanvas();
    	}

    }else{
    

    switch(selectedmodel){
    	case 1:
    	currentModel.glassArray[selectedpoint].x = (pointoncanvas.x - ($('#designCanvas').width()/2))/designscale;
    	currentModel.glassArray[selectedpoint].y = (pointoncanvas.y - ($('#designCanvas').height()/2))/designscale;
    	break;
    	case 2:
    	currentModel.mirrorArray[selectedpoint].x = (pointoncanvas.x - ($('#designCanvas').width()/2))/designscale;
    	currentModel.mirrorArray[selectedpoint].y = (pointoncanvas.y - ($('#designCanvas').height()/2))/designscale;
    	break;
    }
drawDesignCanvas();
drawDisplayCanvas();
}
});

//Testing for mouse movement over the midpoint
var newpointnumber;
function testForHoverOverMidPoints(pointarray,mousepoint){
var arrayLength = pointarray.length;
var midpoints = [];
for (var i = 0; i < (arrayLength - 1); i++) {

midpoints[i]=midPoint(pointarray[i],pointarray[i+1]);

}
midpoints[arrayLength-1]=midPoint(pointarray[0],pointarray[arrayLength-1]);

arrayLength = midpoints.length;


if(returnPointNumberForDesignCanvasArray(midpoints,mousepoint)!=-1){
newpointnumber = returnPointNumberForDesignCanvasArray(midpoints,mousepoint);
return midpoints[newpointnumber];
}else{
	return -1;
}
}
function midPoint(p1,p2){
return new point((p1.x+p2.x)/2, (p1.y+p2.y)/2)
}

//Find which point it was
function returnPointNumberForDesignCanvasArray(arrayofpoints,mousepoint){
var arrayLength = arrayofpoints.length;

for (var i = 0; i < arrayLength; i++) {
if(doesMousePointOnCanvasOverlapPoint(arrayofpoints[i],mousepoint)){
return i;
}
}
return -1;
}
function doesMousePointOnCanvasOverlapPoint(canvaspoint,mousepoint){
	var transformedpointoncanvas = new point(   (canvaspoint.x*designscale+$('#designCanvas').width()/2)  , 
                                              (canvaspoint.y*designscale+$('#designCanvas').height()/2) );
	if(lineDistance(transformedpointoncanvas,mousepoint)<10){
	return true;
	}
	}

  function ray(){
    this.points = [];
  }

  var raynumber = 10;
  function traceLightRays(){
    rayArray = [];
    for(var i = 0; i < raynumber; i++){
      rayArray[i] = new ray();
      ray.point[0]= new point(0,0);
      
    }
  }



function lineDistance( point1, point2 ){
  var xs = 0;
  var ys = 0;
 
  xs = point2.x - point1.x;
  xs = xs * xs;
 
  ys = point2.y - point1.y;
  ys = ys * ys;
 
  return Math.sqrt( xs + ys );
}

});