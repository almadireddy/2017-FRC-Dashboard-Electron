document.getElementById("defaultOpen").click();

function openPID(evt, cityName) {
  // Declare all variables
  var i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

let strokeStyle1 = '#00A6FB';
let strokeStyle2 = '#006494';
let targetStroke = '#E76F51';

let fillStyle1 = 'rgba(0, 166, 251, 0.45)';
let fillStyle2 = 'rgba(0, 100, 148, 0.45)';

// Drive PID Graph Configuration
let drivePID = new SmoothieChart({
  grid: { strokeStyle:'rgba(255, 255, 255, 0.45)', fillStyle:'rgb(0, 0, 0)',
    lineWidth: 1, millisPerLine: 1000, verticalSections: 4, },
  labels: { fillStyle:'rgb(60, 0, 0)' }
});
// Data
let measuredLeft  = new TimeSeries();
let measuredRight = new TimeSeries();
let target        = new TimeSeries();

// Add a random value to each line every second
setInterval(function() {
  measuredLeft.append(new Date().getTime(), Math.random());
  measuredRight.append(new Date().getTime(), Math.random());
  target.append(new Date().getTime(), Math.random());
}, 1000);

drivePID.addTimeSeries(measuredLeft, {
  strokeStyle:strokeStyle1,
  fillStyle:fillStyle1,
  lineWidth:3
});

drivePID.addTimeSeries(measuredRight,{
  strokeStyle: strokeStyle2,
  fillStyle: fillStyle2,
  lineWidth:3
});

drivePID.addTimeSeries(target, {
  strokeStyle: targetStroke,
  lineWidth: 3
});

drivePID.streamTo(document.getElementById("drivePIDGraph"), 1000);



// Gyro PID Graph Configuration
let gyroPID = new SmoothieChart({
  grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(0, 0, 0)',
    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
  labels: { fillStyle:'rgb(60, 0, 0)' }
});
// Data
let measuredAngle  = new TimeSeries();
let targetAngle     = new TimeSeries();

// Add a random value to each line every second
setInterval(function() {
  measuredAngle.append(new Date().getTime(), Math.random());
  targetAngle.append(new Date().getTime(), Math.random());
}, 1000);

gyroPID.addTimeSeries(measuredAngle, {
  strokeStyle:strokeStyle1,
  fillStyle:fillStyle1,
  lineWidth:3
});

gyroPID.addTimeSeries(targetAngle, {
  strokeStyle: targetStroke
});

gyroPID.streamTo(document.getElementById("gyroPIDGraph"), 1000);



// Drive PID Graph Configuration
let flywheelPID = new SmoothieChart({
  grid: { strokeStyle:'rgb(125, 0, 0)', fillStyle:'rgb(0, 0, 0)',
    lineWidth: 1, millisPerLine: 250, verticalSections: 6, },
  labels: { fillStyle:'rgb(60, 0, 0)' }
});
// Data
let measuredVelocity  = new TimeSeries();
let targetVelocity    = new TimeSeries();

// Add a random value to each line every second
setInterval(function() {
  measuredVelocity.append(new Date().getTime(), Math.random());
  targetVelocity.append(new Date().getTime(), Math.random());
}, 1000);

flywheelPID.addTimeSeries(measuredVelocity, {
  strokeStyle:strokeStyle1,
  fillStyle:fillStyle1,
  lineWidth:3
});

flywheelPID.addTimeSeries(targetVelocity, {
  strokeStyle: targetStroke
});

flywheelPID.streamTo(document.getElementById("flywheelPIDGraph"), 1000);