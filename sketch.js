const TWO_PI = 6.213185;

/*Options*/
var cameraDragging = true;
var cameraZoom = 2;
var heightOfWaves = 100;
var waveSpeed = TWO_PI / 128;
var nbr_blocks = 10;
var offsetFactor = 6.5;

/*Global variables*/
var angle = 0;
var camera_rot_x = 0;
var camera_rot_z = 0;

function setup() {
  createCanvas(500, 500, WEBGL);
}

function draw() {
  background(0);
  noStroke();
  isoCamera(0, 0, cameraZoom);

  if (cameraDragging) {
    rotateX(camera_rot_x);
    rotateZ(camera_rot_z);
  }

  angle -= waveSpeed;
  angle %= TWO_PI;

  /*Drawing of the cubes*/
  for (var index_y = floor(-nbr_blocks / 2); index_y < ceil(nbr_blocks / 2); index_y++) {
    for (var index_x = floor(-nbr_blocks / 2); index_x < ceil(nbr_blocks / 2); index_x++) {
      var offset = offsetFactor * waveSpeed;
      var w = 15;
      var gap = 0; //decides of the gap between the rectangles, 0 for noGap
      var block_x = index_x * w;
      var block_y = index_y * w;

      var h = computeHeight(sin(angle + sq(index_x * offset) + sq(index_y * offset)));

      push();
      rectMode(CENTER);
      translate(block_x, block_y, 0);
      drawBox(w - gap, w - gap, h);
      pop();
    }
  }
}

function mapColourUsingDistance(initialValue, height){
  return map(height, 10, heightOfWaves, 10, initialValue);
}

function drawBox(w, h, p){
  fill(mapColourUsingDistance(255, p));
  box(w, h, p);

/*
  //Top
  beginShape();
  fill(mapColourUsingDistance(255, x, y, p));
  vertex(-w/2, -h/2, p/2);
  vertex(w/2, -h/2, p/2);
  vertex(w/2, h/2, p/2);
  vertex(-w/2, h/2, p/2);
  endShape(CLOSE);


  //Bottom
  beginShape();
  fill(mapColourUsingDistance(255, x, y, p));
  vertex(w/2, -h/2, -p/2);
  vertex(-w/2, -h/2, -p/2);
  vertex(-w/2, h/2, -p/2);
  vertex(w/2, h/2, -p/2);
  endShape(CLOSE);


  //Left
  beginShape();
  fill(mapColourUsingDistance(64, x, y, p), mapColourUsingDistance(224, x, y, p), mapColourUsingDistance(208, x, y, p));
  vertex(-w/2, h/2, p/2);
  vertex(w/2, h/2, p/2);
  vertex(w/2, h/2, -p/2);
  vertex(-w/2, h/2, -p/2);
  endShape(CLOSE);

  //Top
  beginShape();
  fill(mapColourUsingDistance(64, x, y, p), mapColourUsingDistance(224, x, y, p), mapColourUsingDistance(208, x, y, p));
  vertex(-w/2, -h/2, -p/2);
  vertex(w/2, -h/2, -p/2);
  vertex(w/2, -h/2, p/2);
  vertex(-w/2, -h/2, p/2);
  endShape(CLOSE);

  //Right
  beginShape();
  fill(mapColourUsingDistance(255, x, y, p), mapColourUsingDistance(165, x, y, p), 0);
  vertex(w/2, -h/2, p/2);
  vertex(w/2, -h/2, -p/2);
  vertex(w/2, h/2, -p/2);
  vertex(w/2, h/2, p/2);
  endShape(CLOSE);


  //Left
  beginShape();
  fill(mapColourUsingDistance(255, x, y, p), mapColourUsingDistance(165, x, y, p), 0);
  vertex(-w/2, -h/2, -p/2);
  vertex(-w/2, -h/2, p/2);
  vertex(-w/2, h/2, p/2);
  vertex(-w/2, h/2, -p/2);
  endShape(CLOSE);
  */

}

function computeHeight(sinFunction) {
  return map(sinFunction, -1, 1, 10, heightOfWaves);
}

function mouseDragged() {
  var rate = 0.01;
  camera_rot_x += (pmouseY - mouseY)*rate;
  camera_rot_z += (mouseX - pmouseX)*rate;
}

function isoCamera(x, y, zoom) {
  var isoThetaX = radians(60);
  var isoThetaZ = radians(45);

  translate(x, y);
  scale(zoom);
  rotateX(isoThetaX);
  rotateZ(isoThetaZ);
}
