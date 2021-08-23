//size input box
$(function(){
    $("#sizeInput").keypress(function(e){
      if(e.keyCode == 13){
        e.preventDefault();
      if($.isNumeric($("#sizeInput").val()) && $("#sizeInput").val() > 0 && $("#sizeInput").val() < 102){
        generateGraph($("#sizeInput").val());
      }
    }
      else 
          return;
    });

    $("#sizeInput").focusout(function(){
        if($.isNumeric($("#sizeInput").val()) && $("#sizeInput").val() > 0 && $("#sizeInput").val() < 102){
          generateGraph($("#sizeInput").val());
        }
        else 
            return;
    });
});

function checkText(){
  if($.isNumeric($("#sizeInput").val()) && $("#sizeInput").val() > 0 && $("#sizeInput").val() < 102){
    generateGraph($("#sizeInput").val());
  }
}

//variables needed for calculations
let canvas = document.getElementById("graph");
let context = canvas.getContext("2d");
let t;

var canvSize = Math.min($(window).height(), $(window).width())/1.3;
context.canvas.width = canvSize;
context.canvas.height = canvSize;

var matrix;
var size;
var currTimeout;
var explore;
var draw;
var exploreSpeed;
const random = (min, max) => Math.floor(Math.random() * (max - min+1)) + min;

function updateTimeInterval(val) {
  document.getElementById('timeIntervalVal').innerText = val;
}

const range = document.getElementById('timeInterval');
const rangeVal = document.getElementById('timeIntervalVal');
setValue = ()=>{
  rangeVal.innerText = range.value;
  exploreSpeed = range.value;
};
document.addEventListener("DOMContentLoaded", setValue);
range.addEventListener('input', setValue);


//generate solvable matrix based on size
function generateGraph(size = Math.ceil(Math.random()*20)+10){ 
    clearTimeout(currTimeout);
    clearTimeout(explore);
    clearTimeout(draw);

    size = parseInt(size);
    if(size % 2 == 0) size += 1;

    $(function(){
        $("#currSize").text(size);
        $("#sizeInput").attr("placeholder", size + " (Odd number 1-101)");
    });
    
    //console.log(size);
    var cellWidth = canvSize/size;
    var cellHeight = canvSize/size;
    //console.log(cellWidth);

    matrix = new Array();
    for(var i=0; i<size; i++){
        matrix[i] = new Array();
        for(var j=0; j<size; j++){
            matrix[i][j] = 0;
            // context.fillStyle = (matrix[i][j] == 0) ? "#000000" : "#FFFFFF";
            // context.fillRect(i*cellWidth,j*cellHeight, cellWidth, cellHeight);
        }
    }

    
    innerWalls(1, size-2, 1, size-2, true); //marks interior walls as 1
    outerWalls(size); //exterior walls are 1

    for(var i=0; i<size; i++){ //drawing walls
        for(var j=0; j<size; j++){
            context.fillStyle = (matrix[i][j] == 1) ? "#000000" : "#FFFFFF";
            context.fillRect(i*cellWidth,j*cellHeight, cellWidth, cellHeight);

            context.fillStyle = "#000000";
            context.fillRect(i*cellWidth,j*cellHeight, 1, cellHeight);
            context.fillRect(i*cellWidth,j*cellHeight, cellWidth, 1);
            context.fillRect((i+1)*cellWidth-1,j*cellHeight-1, 1, cellHeight);
            context.fillRect(i*cellWidth,(j+1)*cellHeight, cellWidth, 1);

            context.fillStyle = "green";
            context.font = cellWidth/2 + "px Arial";
            //context.fillText("Test", i*cellWidth, j*cellHeight+(cellHeight/1.5));
        }
    }
    context.fillStyle = "red";
    context.fillRect(cellWidth, cellHeight, cellWidth, cellHeight);
    context.fillRect(cellWidth*(size-2), cellWidth*(size-2), cellWidth, cellHeight);

    context.fillStyle = "black";


    
}

//generateGraph helper
function outerWalls(size){
    for(var i = 0; i < size; i++){
        if(i == 0 || i == size - 1){
            for(var j = 0; j < matrix.length; j++)
                matrix[i][j] = 1;
        }else{
            matrix[i][0] = 1;
            matrix[i][size-1] = 1;
        }
    }
}

//generateGraph helper
function innerWalls(minX, maxX, minY, maxY, state) {
    if (state) {

        if (maxX - minX < 2) {
            return;
        }

        var y = Math.floor(random(minY, maxY)/2)*2;
        hWall(minX, maxX, y);

        innerWalls(minX, maxX, minY, y-1, !state);
        innerWalls(minX, maxX, y+1, maxY, !state);
    } else {
        if (maxY - minY < 2) {
            return;
        }

        var x = Math.floor(random(minX, maxX)/2)*2;
        vWall(minY, maxY, x);

        innerWalls(minX, x-1, minY, maxY, !state);
        innerWalls(x + 1, maxX, minY, maxY, !state);
    }
}

//generateGraph helper
function hWall(minX, maxX, y){
    var passage = Math.floor(random(minX,maxX)/2)*2+1;
    for(var i = minX; i <= maxX; i++){
        if (i == passage) matrix[y][i] = 0;
        else matrix[y][i] = 1;
    }
}

//generateGraph helper
function vWall(minY, maxY, x){
    var passage = Math.floor(random(minY,maxY)/2)*2+1;
    for(var i = minY; i <= maxY; i++){
        if (i == passage) matrix[i][x] = 0;
        else matrix[i][x] = 1;
    }
}

//class for prioQueue elements
class point {
    constructor(x, y, dist){
        this.x = x;
        this.y = y;
        this.dist = dist;
    }
}

//dijkstra algorithm displayed on current matrix
function execDijk(src1, src2, dest1, dest2) {
    size = $("#currSize").text();

    context.fillStyle = "red";
    var tot = matrix.length*matrix[0]*length;
    var dist = new Array(matrix.length);
    var visited = new Array(matrix.length);
    var parent = new Array(matrix.length);
    for(var i=0; i<matrix.length; i++){
        dist[i] = new Array();
        visited[i] = new Array();
        parent[i] = new Array();
        for(var j=0; j<matrix[0].length; j++){
            dist[i][j] = Number.MAX_SAFE_INTEGER;
            visited[i][j] = false;
            parent[i][j] = new point(0,0,0);
        }
    }   

    var queue = [];
    var p = new point(src1, src2, 0);
    queue.push(p);
    dist[src1][src2] = 0;
    visited[src1][src2] = true;
    parent[src1][src2] = -1;
    const diffX = [-1,0,0,1];
    const diffY = [0,-1,1,0];
    var queue1 = [];
    t = 0;
    var x, y;

    while(queue.length > 0){
        var u = queue.shift();
        x = u.x;
        y = u.y;
        var d = u.dist;

        for(var i=0; i<4; i++){
            var neighRow = x + diffX[i];
            var neighCol = y + diffY[i];
            //console.log(visited[neighRow][neighCol]);
            if(neighCol > 0 && neighRow > 0 && neighCol < matrix.length && neighRow < matrix[0].length && matrix[neighRow][neighCol] == 0 && !visited[neighRow][neighCol]){
                //console.log("here");
                visited[neighRow][neighCol] = true;
                dist[neighRow][neighCol] += 1;
                if(dist[parent[neighRow][neighCol].x][parent[neighRow][neighCol]] > dist[neighRow][neighCol]){
                  parent[neighRow][neighCol] = u;
                }
                parent[neighRow][neighCol] = u;
                var z = new point(neighRow, neighCol, dist[neighRow][neighCol]);
                queue.push(z);
            }
        }
        queue1.push(u);
        t++;
    }

    function exploreLoop() { //draws how dijkstra finds paths
      u = queue1.shift();
      context.fillRect((u.x)*canvSize/size, (u.y)*canvSize/size, canvSize/size, canvSize/size);
      if(queue1.length != 0) explore = setTimeout(exploreLoop, exploreSpeed);
    }
    exploreLoop();

    function checkExplored() {
      if(queue1.length != 0) currTimeout = setTimeout(checkExplored, exploreSpeed);
      else{
        resetGrid();
        printPath(parent, dest1, dest2, src1, src2); //draw optimal path
      }
    }
    checkExplored();
    
}

//draw path from dijkstra result
function printPath(parent, x, y, src1, src2){
  var stack = [];
  var u = new point(x, y, 0);
  stack.push(u);
  while(u.x != src1 || u.y != src2){
    var nextNode = new point(parent[u.x][u.y].x, parent[u.x][u.y].y, 0);
    //console.log(nextNode.x);
    stack.push(nextNode);
    u = nextNode;
  }
  context.fillStyle = "red";

  function exploreLoop() { //draws how dijkstra finds paths
    u = stack.pop();
    context.fillRect((u.x)*canvSize/size, (u.y)*canvSize/size, canvSize/size, canvSize/size);
    if(stack.length != 0) draw = setTimeout(exploreLoop, exploreSpeed);
  }
  exploreLoop();
}

//empty grid for redraw
function resetGrid() {
  var cellWidth = canvSize/matrix.length;
  var cellHeight = canvSize/matrix.length;
  for(var i=0; i<matrix.length; i++){
    for(var j=0; j<matrix.length; j++){
        context.fillStyle = (matrix[i][j] == 1) ? "#000000" : "#FFFFFF";
        context.fillRect(i*cellWidth,j*cellHeight, cellWidth, cellHeight);

        context.fillStyle = "#000000";
        context.fillRect(i*cellWidth,j*cellHeight, 1, cellHeight);
        context.fillRect(i*cellWidth,j*cellHeight, cellWidth, 1);
        context.fillRect((i+1)*cellWidth-1,j*cellHeight-1, 1, cellHeight);
        context.fillRect(i*cellWidth,(j+1)*cellHeight, cellWidth, 1);
    }
}
context.fillStyle = "red";
context.fillRect(cellWidth, cellHeight, cellWidth, cellHeight);
context.fillRect(cellWidth*(matrix.length-2), cellWidth*(matrix.length-2), cellWidth, cellHeight);

context.fillStyle = "black";
}

function executeAlgo() {
  clearTimeout(currTimeout);
  clearTimeout(explore);
  clearTimeout(draw);
  resetGrid();
  execDijk(1, 1, matrix.length-2, matrix.length-2);
}

generateGraph();














//helper classes/functions 


const topp = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a.dist < b.dist) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[topp];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > topp) {
      this._swap(topp, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[topp] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > topp && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = topp;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}