var url = "https://api.openweathermap.org/data/2.5/weather?q=";
var apikey = "&units=imperial&appid=ecf071a12fde88e534d97674aa7cd83b";
var cityNames = ["philadelphia", "boston", "phoenix", "seattle", "portland", "new york", "los angeles", "san francisco", "chicago"];
var weatherData = []; // Array to store the weather data for each city

// setting up my high and low colors for my color scale
var lowColor = [16, 193, 201];
var highColor = [234, 78, 0];

function setup() {
  // Set a fixed canvas size to fit your desired page layout
  var canvasWidth = 1000;
  var canvasHeight = 1000;
  createCanvas(canvasWidth, canvasHeight);
  rectMode(CENTER);
  noStroke();
  // stroke(150)
  blendMode(OVERLAY);

  // Load weather data for each city
  var promises = cityNames.map((cityName) => {
    var request = url + cityName + apikey;
    return fetch(request)
      .then((response) => response.json());
  });

  Promise.all(promises)
    .then((data) => {
      weatherData = data;
      drawRectangles(); // Draw the rectangles once data is loaded
    });
}

function drawRectangles() {
  var totalCities = cityNames.length;
  var numberOfColumns = Math.ceil(Math.sqrt(totalCities));
  var numberOfRows = Math.ceil(totalCities / numberOfColumns);
  var rectangleWidth = width / numberOfColumns;
  var rectangleHeight = height / numberOfRows;

  // Use the loaded weather data to display each city's rectangle
  for (var i = 0; i < numberOfRows; i++) {
    for (var j = 0; j < numberOfColumns; j++) {
      var cityIndex = i * numberOfColumns + j;
      if (cityIndex >= totalCities) {
        break; // Skip if there are no more cities to display
      }
      
      var realTemp = weatherData[cityIndex].main.temp;

      var s = map(realTemp, 0, 120, 0, 1);
      var c = lerpColor(color(lowColor), color(highColor), s);
      fill(c);

      var positionX = j * rectangleWidth;
      var positionY = i * rectangleHeight;
      var offset = rectangleWidth / 2;

      rect(positionX + offset, positionY + offset, rectangleWidth, rectangleHeight);

      //Creates 'feels like' circle in middle
      push();
      var feelsLikeTemp = weatherData[cityIndex].main.feels_like;

      var s2 = map(feelsLikeTemp, 0, 120, 0, 1);
      var c2 = lerpColor(color(lowColor), color(highColor), s2);
      
      fill(c2);
      img = circle(positionX + offset, positionY + offset, rectangleHeight);
      img.loadPixels();
      pop();
      
      //CITY LABELS
//       push();
//       // blendMode(MULTIPLY);
//       textAlign(LEFT, CENTER);
//       var city = weatherData[cityIndex].name;
//       fill(220);
//       textSize(16);
//       text(city, positionX + offset/9, positionY + offset/8);
            
//       fill(220);
//       textSize(16);
//       text('feels like ' + feelsLikeTemp, positionX + offset/9, positionY + offset/8 + 20);
//       pop();

      
      
    }
  }
}

function draw() {
  // If data is loaded, the rectangles have already been drawn in setup,
  // so the draw function can be left empty or be used for other animations.
}
