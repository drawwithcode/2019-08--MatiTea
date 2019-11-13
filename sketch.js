let myMap;
let canvas;
let position;
let currentPosition;
let distance;

let mappa = new Mappa('MapboxGL', 'pk.eyJ1IjoibWF0aXRlYSIsImEiOiJjazJtYXAzbmQwY2NsM2JueGpjdTZ4MjJhIn0.3Thvh_RPeoRnccaE0hUK-w');

// defining the fence polygon
let polygon = [
  { lat: 45.507855, lon: 9.167527 }, //top right
  { lat: 45.504574, lon: 9.169361 }, //bottom right
  { lat: 45.503571, lon: 9.164355 }, //bottom left
  { lat: 45.507050, lon: 9.163025 }, //top left
];

// Polimi coordinates
let poliLat = 45.505932;
let poliLon = 9.165888;

function preload() {
  currentPosition = getCurrentPosition();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  imageMode(CENTER);
  textAlign(CENTER);

  let options = {
    lat: currentPosition.latitude,
    lng: currentPosition.longitude,
    zoom: 15,
    style: "mapbox://styles/matitea/ck2rd819a3cbp1cmk5923dcne",
    tabIndex: 2
  }

  positionIcon = loadImage("./assets/map-marker.svg");

  // initialize the var myMap
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  fence = new geoFencePolygon(polygon, insideTheFence, outsideTheFence, 'km')
}

function draw() {
  clear();

  // x and y position transormed from coordinates
  position = myMap.latLngToPixel(currentPosition.latitude, currentPosition.longitude);
  polimi = myMap.latLngToPixel(poliLat, poliLon);

  // icons position
  image(positionIcon, position.x, position.y - 15);
  image(positionIcon, polimi.x, polimi.y - 15);

  InsideAndOutsideFenceActions();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function insideTheFence(position) {
  print("User is inside of the fence");
  print(fence.insideFence);
  websiteButton();
}

function outsideTheFence(position) {
  print("User is outside of the fence");
}

function InsideAndOutsideFenceActions() {
  if (fence.insideFence == true) {
    push();
    textSize(20);
    fill(50, 27, 86);
    noStroke();
    textFont("Montserrat");
    textStyle(BOLD);
    text('Welcome to Polimi School of Design!', polimi.x, (polimi.y) - 55);
    text('You are here', position.x, (position.y) - 55);
    pop();

  } else if (fence.insideFence == false) {
    distance = calcGeoDistance(currentPosition.latitude, currentPosition.longitude, 45.505932, 9.165888, 'km');

    // text
    push();
    textSize(20);
    fill(50, 27, 86);
    noStroke();
    textFont("Montserrat");
    textStyle(BOLD);
    text('Distance from Politecnico-Campus Candiani: ' + ceil(distance) + ' km \n Get there and reload this page!', position.x, (position.y) - 80);
    pop();
    //draw distance between currenPosition and Polimi
    push();
    strokeWeight(2);
    line(position.x - 1, position.y, polimi.x, polimi.y);
    pop();
  }
}

function websiteButton() {
  let siteButton = createButton('Click here to visit our website');
  siteButton.position((windowWidth / 2) - 180, (windowHeight / 5) * 4);
  siteButton.addClass("button");
  siteButton.mousePressed(openWebsite);
}

function openWebsite() {
  window.open("http://www.design.polimi.it/en/", "_self");
}

function showWebsiteButton() {
  if (fence.insideFence == false) {
    websiteButton();
  }
}