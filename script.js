$(function(){
    $("#sizeInput").focusout(function(){
        if($.isNumeric($("#sizeInput").val()) || $("#sizeInput").val() > 0){
            generateGraph($("#sizeInput").val());
        }
        else 
            return;
    });
});


let canvas = document.getElementById("graph");
let context = canvas.getContext("2d");

var matrix;
var size;
const random = (min, max) => Math.floor(Math.random() * (max - min+1)) + min;

function generateGraph(size = Math.ceil(Math.random()*20)+10){

    size = parseInt(size);
    if(size % 2 == 0) size += 1;

    $(function(){
        $("#currSize").text(size);
    });
    
    console.log(size);
    var cellWidth = 800/size;
    var cellHeight = 800/size;
    console.log(cellWidth);

    matrix = new Array();
    for(var i=0; i<size; i++){
        matrix[i] = new Array();
        for(var j=0; j<size; j++){
            matrix[i][j] = 0;
            // context.fillStyle = (matrix[i][j] == 0) ? "#000000" : "#FFFFFF";
            // context.fillRect(i*cellWidth,j*cellHeight, cellWidth, cellHeight);
        }
    }

    
    innerWalls(1, size-2, 1, size-2, true);
    outerWalls(size);

    for(var i=0; i<size; i++){
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
            context.fillText("Test", i*cellWidth, j*cellHeight+(cellHeight/1.5));
        }
    }
    context.fillStyle = "red";
    context.fillRect(cellWidth, cellHeight, cellWidth, cellHeight);
    context.fillRect(cellWidth*(size-2), cellWidth*(size-2), cellWidth, cellHeight);

    context.fillStyle = "black";
    for(var i=0; i<size; i++){
        for(var j=0; j<size; j++){
            
        }
    }

    
}

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

function hWall(minX, maxX, y){
    var passage = Math.floor(random(minX,maxX)/2)*2+1;
    for(var i = minX; i <= maxX; i++){
        if (i == passage) matrix[y][i] = 0;
        else matrix[y][i] = 1;
    }
}

function vWall(minY, maxY, x){
    var passage = Math.floor(random(minY,maxY)/2)*2+1;
    for(var i = minY; i <= maxY; i++){
        if (i == passage) matrix[i][x] = 0;
        else matrix[i][x] = 1;
    }
}

class point {
    constructor(x, y, dist){
        this.x = x;
        this.y = y;
        this.dist = dist;
    }
}

function execDijk(src1, src2, dest1, dest2) {
    size = $("#currSize").text();


    context.fillStyle = "red";
    var tot = matrix.length*matrix[0]*length;
    var dist = new Array(matrix.length);
    var visited = new Array(matrix.length);
    for(var i=0; i<matrix.length; i++){
        dist[i] = new Array();
        visited[i] = new Array();
        for(var j=0; j<matrix[0].length; j++){
            dist[i][j] = Number.MAX_SAFE_INTEGER;
            visited[i][j] = false;
        }
    }   
    var queue = new PriorityQueue();
    var p = new point(src1, src2, 0);
    queue.push(p);
    dist[src1][src2] = 0;
    visited[src1][src2] = true;
    const diffX = [0,0,1,-1];
    const diffY = [-1,1,0,0];

    while(queue.size() > 0){
        var u = queue.pop();
        var x = u.x;
        var y = u.y;
        var d = u.dist;

        visited[x][y] = true;

        console.log(size)
        context.fillRect(x*800/size, y*800/size, 800/size, 800/size);

        for(var i=0; i<4; i++){
            var neighRow = x + diffY[i];
            var neighCol = y + diffX[i];
            //console.log(visited[neighRow][neighCol]);
            if(neighCol >= 0 && neighRow >= 0 && matrix[neighRow][neighCol] == 0 && visited[neighRow][neighCol] == false){
                console.log("here");
                dist[neighRow][neighCol] += 1;
                var t = new point(neighRow, neighCol, dist[neighRow][neighCol]);
                queue.push(t);
            }
        }
    }
}

function executeAlgo() {
    execDijk(1, 1, matrix.length-2, matrix.length-2);
}

generateGraph();














//helper functions 


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