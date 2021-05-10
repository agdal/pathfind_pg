var cols = 25;
var rows = 25;
var grid = new Array(cols)

var openPos = []; // Felter der endnu ikke er besøgt
var closePos = []; // Felter der er besøgt / evalueret

var start; // Start posistion
var slut; // Mål
var w, h;
var vej = [];
var ingenL = false;

// Function der lopper gennem arrayet og checker om den skal
// fjerne et spot fra listen (altså stoppe med at undersøge)
function removeFromArray(arr, elt) {
  for (var i = arr.length-1; i>=0; i--) {
    if (arr[i] == elt) {
      arr.splice(i, 1);
    }
  }
}

function heaur(a,b) {
  //var d = dist(a.i,a.j,b.i,b.j)
  var d = abs(a.i-b.i) + abs(a.j-b.j);
  return d;
}

function Pos(i,j) {
  this.i = i;
  this.j = j;

  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.nabo = [];
  this.previous = undefined;
  this.wall = false;

  if (random(1) < 0.2) {
    this.wall = true;
  }

  this.show = function (col){
    fill(col);
    if (this.wall) {
      fill(0);
    }
    noStroke();
    rect(this.i*w, this.j*h, w-1, h-1);
  }

  this.nyNabo = function(grid){
    var i = this.i;
    var j = this.j;

    // husk at undgå error hvis felt er på kanten uden en nabo
    if (i < cols-1) {
      this.nabo.push(grid[i+1][j]);
    }
    if (i>0) {
    this.nabo.push(grid[i-1][j]);
    }
    if (j< rows-1) {
    this.nabo.push(grid[i][j+1]);
    }
    if (j>0) {
    this.nabo.push(grid[i][j-1]);
    }
  }
}

function setup() {
  createCanvas(400, 400);
  w = width / cols;
  h = height / rows;

  // Vi starter med at lave et 2D array
  for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  // lav grid
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++){
      grid[i][j] = new Pos(i,j);
    }
  }

  // check nabo
  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++){
      grid[i][j].nyNabo(grid);
    }
  }


  start = grid[0][0]; // Sætter start positionen 
  slut = grid[cols-1][rows-1]; // Angiver målet, altså hvor vi skal hen

  openPos.push(start);
  start.wall = false;
  slut.wall = false;
}

function draw() {
  if (openPos.length > 0) {
    
    // Led efter løsninger
     var vinder = 0;
     for (var i = 0; i < openPos.length; i++) {
      if (openPos[i].f < openPos[vinder].f) {
        winner = i;
      }
     }

     var current = openPos[vinder];

     // Fortæl når vinder spottet er fundet
     if (current == slut) {
      noLoop();
       console.log("FÆRDIG!");
     }

     removeFromArray(openPos,current);
     closePos.push(current);

     var nabo = current.nabo;
     for (var i = 0;i<nabo.length; i++){
       var nabony = nabo[i];

        if (!closePos.includes(nabony) && !nabony.wall){
          var tempG = current.g + 1;

          if (openPos.includes(nabony)){
            if (tempG < nabony.g) {
              nabony.g;
            }
          } else {
            nabony.g = tempG;
            openPos.push(nabony);
          }
          nabony.h = heaur(nabony,slut);
          nabony.f = nabony.g + nabony.h;
          nabony.previous = current;
        }

     }

  } else {
    // Ingen løsning
    console.log("Ingen mulig løsning...");
    ingenL = true;
    noLoop();
  }

  background(0);

  for (var i = 0; i < cols; i++) {
    for (var j = 0; j < cols; j++){
      grid[i][j].show(color(255));
    }
  }

  for (var i = 0; i < closePos.length; i++) {
    closePos[i].show(color(255,0,0));
  }

  for (var i = 0; i < openPos.length; i++) {
    openPos[i].show(color(0,255,0));
  }

  if (!ingenL){
  vej = [];
  var temp = current;
  vej.push(temp);
  while (temp.previous) {
    vej.push(temp.previous);
    temp = temp.previous;
  }
}

  for (var i = 0; i < vej.length; i++) {
    vej[i].show(color(0,0,255));
  }
}
