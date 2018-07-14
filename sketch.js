var canvas;

const TWO_PI = 6.213185;

/*Options*/
var cameraDragging;
var waveTypeElem;
var cameraZoom = 1.5;
var heightOfWaves = 100;
var waveSpeed = TWO_PI / 128;
var nbr_blocks = 10;
var offsetFactor = 6.5;

/*Global variables*/
var backgroundColor;
var angle = 0;
var camera_rot_x = 0;
var camera_rot_z = 0;

function setup() {
  canvas = createCanvas(400, 400, WEBGL);
  backgroundColor = window.getComputedStyle(document.body)['backgroundColor'];
  canvas.parent("sketchContainer");
  canvas.class("movingBlocks");
}

function selectedWaveType() {
  return select("#waveType").value();
}

function selectedToggleCamera() {
  return select("#cameraDragging").checked();
}

function sliderCameraZoom(){
  return select("#cameraZoom").value();
}

/**
 * Define optionnal values such as number of blocks, toggle of camera dragging and wave type
 */
function defineOptions() {

  waveType = selectedWaveType();
  cameraDragging = selectedToggleCamera();
  cameraZoom = sliderCameraZoom();

  heightOfWavesElem = select('#heightOfWaves');
  heightOfWaves = heightOfWavesElem.value();
  offsetFactorElem = select('#offsetFactor');
  offsetFactor = offsetFactorElem.value();
  nbr_blocksElem = select('#nbr_blocks');
  nbr_blocks = nbr_blocksElem.value();
}

function draw() {
  background(backgroundColor);
  noStroke();
  isoCamera(0, 0, cameraZoom);
  defineOptions();

  /* Camera Dragging based on index.html*/
  rotateX(camera_rot_x);
  rotateZ(camera_rot_z);

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

      var h = 0;

      switch (waveType) {
        case "center":
          h = computeHeight(sin(angle + sq(index_x * offset) + sq(index_y * offset)));
          break;

        case "side":
          h = computeHeight(sin(angle + index_x * offset));
          break;

        case "diagonal":
          h = computeHeight(sin(angle + index_x * offset + index_y * offset));
          break;

        case "drop":
          h = computeHeight(sin(angle - sq(index_x * offset) + sq(index_y * offset)));
          break;

        case "bump":
          h = computeHeight(sin(angle + index_x * offset) * cos(index_y * offset));
          break;
      }

      push();
      rectMode(CENTER);
      translate(block_x, block_y, 0);
      drawBox(w - gap, w - gap, h);
      pop();
    }
  }
}

/**
 * Helper function to decide of the color given two coordinates, computes based on distance to origin
 * @param initialValue colour value of a side of the rectangle
 * @param coordinates x and y of the rectangle
 * @param darkeningFactor, the higher the value => far from the origin, faster the side gets darker. If 0 then no darkening effect happens.
 * @return the new value of colour, between 0 and initialValue
 */
function mapColourUsingDistance(initialValue, height) {
  return map(height, 10, heightOfWaves, 10, initialValue);
}

function drawBox(w, h, p) {
  fill(mapColourUsingDistance(255, p));
  box(w, h, p);

  /* @TODO lookup this solution and pass from 30 FPS to 60 FPS
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

/**
 * Return the height of the cube with given sin/cos function
 * @param sinFunction
 * @return computed value
 */
function computeHeight(sinFunction) {
  return map(sinFunction, -1, 1, 10, heightOfWaves);
}

function mouseDragged() {
  var rate = 0.01;

  if (cameraDragging) {
    camera_rot_x += (pmouseY - mouseY) * rate;
    camera_rot_z += (mouseX - pmouseX) * rate;
  }
}

/**
 * Positions the camera in a isometric standard
 * @param x translate along the x-axis for given value
 * @param y translate along y-axis for given value
 * @param darkeningFactor zoom-in for value > 1 and zoom out for value < 1
 */
function isoCamera(x, y, zoom) {
  var isoThetaX = radians(60);
  var isoThetaZ = radians(45);

  translate(x, y);
  scale(zoom);
  rotateX(isoThetaX);
  rotateZ(isoThetaZ);
}
