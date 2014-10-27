


$(function() {

//Initilization

var designcanvas =  $('#designCanvas')[0];
var designcontext = designcanvas.getContext('2d');
var displaycanvas = $('#displayCanvas')[0];
var displaycontext = displaycanvas.getContext('2d');
var currentModel = new model();
currentModel.glassArray[0]  = new point(-75,75);
currentModel.glassArray[1]  = new point(75,75);
currentModel.glassArray[2]  = new point(75,-75);
currentModel.glassArray[3]  = new point(-75,-75);
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
designcontext.scale(1,1);

$('#displayCanvas').attr('width', $('.division').innerWidth());
$('#displayCanvas').attr('height', $('.division').innerHeight());

displaycontext.restore();
displaycontext.translate($('.division').innerWidth()/2,$('.division').innerHeight()*0.2);
displaycontext.scale(0.2,0.2);

drawDesignCanvas();
drawDisplayCanvas();

}


//Model file
function model(){
	this.glassArray = [];
	this.mirrorArray = [];

}

//Points used for array 
function point(x,y){
	this.x = x;
	this.y = y;
}
//Displaying Canvas
function drawDisplayCanvas () {
displaycontext.clearRect(0, 0, displaycontext.canvas.width, displaycontext.canvas.height);
drawElements(displaycontext);
}
//Design Canvas
function drawDesignCanvas(){
designcontext.clearRect(0, 0, designcontext.canvas.width, designcontext.canvas.height); // Clear canvas
drawElements(designcontext);
designcontext.fillStyle = 'grey';
designcontext.lineWidth = 0;
drawPoints(currentModel.glassArray,designcontext);
drawPoints(currentModel.mirrorArray,designcontext);
}
function drawElements(context){
context.arc(0, 0, 10, 0, Math.PI * 2);
context.strokeStyle = 'orange';
context.fillStyle= 'rgba(255,200,0,0.5)';
context.stroke();
context.fill();


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
function drawPoints(points,context){
var arrayLength = points.length;
if(points && arrayLength > 0){
for (var i = 0; i < arrayLength; i++) {
	context.beginPath();
	context.arc(points[i].x, points[i].y,3, 0, Math.PI * 2);
	context.closePath(); 
	context.fill();  
}

}
}



});