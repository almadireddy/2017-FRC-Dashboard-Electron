document.getElementById("default").click();

let bar = $('#actuator-bar');
let head = $('#actuator-head');
let actuatorText = document.getElementById('actuatorPosition');
let deltaY = 50;

function animateActuatorForward() {
  $({originalY: bar.attr('y')}).animate( {originalY: 70-deltaY}, {
    duration: 200,
    step: function (now) {
      bar.attr('y', now);
    }
  });
  $({ogHeight: bar.attr('height')}).animate( {ogHeight: 150 + deltaY}, {
    duration: 200, step: function (now) {
      bar.attr('height', now);
    }
  });
  $({y: head.attr('y')}).animate( {y: 4}, {
    duration: 200, step: function (now) {
      head.attr('y', now);
    }
  });
  actuatorText.innerHTML = 'Extended';
}

function animateActuatorBackward() {
  $({originalY: bar.attr('y')}).animate( {originalY: 70}, {
    duration: 200,
    step: function (now) {
      $('#actuator-bar').attr('y', now);
    }
  });
  $({ogHeight: bar.attr('height')}).animate( {ogHeight: 150}, {
    duration: 200, step: function (now) {
      $('#actuator-bar').attr('height', now);
    }
  });
  $({y: head.attr('y')}).animate( {y: 54}, {
    duration: 200, step: function (now) {
      head.attr('y', now);
    }
  });
  actuatorText.innerHTML = 'Retracted';
}

$('.actuator-container').hover(function () {
  animateActuatorForward();
}, function() {
  animateActuatorBackward();
});

function autonSelect(id) {
  // Declare all variables
  let i, autonButtons;

  // Get all elements with class="tabcontent" and hide them
  autonButtons = document.getElementsByClassName("autonButton");
  for (i = 0; i < autonButtons.length; i++) {
    autonButtons[i].className = "autonButton";
  }

  document.getElementById(id).className += ' active';
  NetworkTables.putValue('Selected Autonomous', id);
}

document.getElementById("defaultOpen").click();
function openPID(evt, cityName) {
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabContent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.position = "absolute";
    tabcontent[i].style.visibility = "hidden";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tab");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById(cityName).style.position = "inherit";
  document.getElementById(cityName).style.visibility = "visible";
  evt.currentTarget.className += " active";
}


$('#cpuUsage').circliful({
  animationStep: 5,
  foregroundBorderWidth: 5,
  backgroundBorderWidth: 15,
  backgroundColor: '#1e222b',
  foregroundColor: '#00A6FB',
  percent: 75,
  halfCircle: true,
  fontColor: '#f1f1f1',
  percentageTextSize: 30,
  text: 'CPU Usage',
  textBelow: true,
  textY: 130,
  textAdditionalCss: 'font-style: italic; font-weight: 500; font-size: 30px',
  textStyle: "font-style: italic; font-weight: 300; font-size: 20px",
  textColor: '#f1f1f1'
});


$('#ramUsage').circliful({
  animationStep: 5,
  foregroundBorderWidth: 5,
  backgroundBorderWidth: 15,
  backgroundColor: '#1e222b',
  foregroundColor: '#00A6FB',
  percent: 39,
  halfCircle: true,
  fontColor: '#f1f1f1',
  percentageTextSize: 30,
  text: 'RAM Usage',
  textBelow: true,
  textY: 130,
  textAdditionalCss: 'font-style: italic; font-weight: 500; font-size: 30px',
  textStyle: "font-style: italic; font-weight: 300; font-size: 20px",
  textColor: '#f1f1f1'
});


$('#powerDraw').circliful({
  animationStep: 5,
  foregroundBorderWidth: 5,
  backgroundBorderWidth: 15,
  backgroundColor: '#1e222b',
  foregroundColor: '#00A6FB',
  percent: 72,
  halfCircle: true,
  fontColor: '#f1f1f1',
  percentageTextSize: 30,
  text: 'Power Draw',
  textBelow: true,
  textY: 130,
  textAdditionalCss: 'font-style: italic; font-weight: 500; font-size: 30px',
  textStyle: "font-style: italic; font-weight: 300; font-size: 20px",
  textColor: '#f1f1f1'
});


//////////////////////////////////////////////////////////////////////////////

let strokeStyle1 = '#00A6FB';
let strokeStyle2 = '#006494';
let targetStroke = '#E76F51';

let fillStyle1 = 'rgba(0, 166, 251, 0.45)';
let fillStyle2 = 'rgba(0, 100, 148, 0.45)';

// Drive PID Graph Configuration
let drivePID = new SmoothieChart.SmoothieChart({
  grid: {
    strokeStyle: 'rgba(255, 255, 255, 0.45)',
    fillStyle: 'rgb(30,34,43)',
    lineWidth: 1,
    millisPerLine: 1000,
    verticalSections: 0,
  },
  labels: {fillStyle: 'rgb(60, 0, 0)'}
});
// Data
let measuredLeft = new SmoothieChart.TimeSeries();
let measuredRight = new SmoothieChart.TimeSeries();
let target = new SmoothieChart.TimeSeries();

// Add a random value to each line every second
setInterval(function () {
  measuredLeft.append(new Date().getTime(), Math.random());
  measuredRight.append(new Date().getTime(), Math.random());
  target.append(new Date().getTime(), Math.random());
}, 1000);

drivePID.addTimeSeries(measuredLeft, {
  strokeStyle: strokeStyle1,
  fillStyle: fillStyle1,
  lineWidth: 3
});

drivePID.addTimeSeries(measuredRight, {
  strokeStyle: strokeStyle2,
  fillStyle: fillStyle2,
  lineWidth: 3
});

drivePID.addTimeSeries(target, {
  strokeStyle: targetStroke,
  lineWidth: 3
});

drivePID.streamTo(document.getElementById("drivePIDGraph"), 1000);


// Gyro PID Graph Configuration
let gyroPID = new SmoothieChart.SmoothieChart({
  grid: {
    strokeStyle: 'rgba(255, 255, 255, 0.45)',
    fillStyle: 'rgb(30,34,43)',
    lineWidth: 1,
    millisPerLine: 1000,
    verticalSections: 0,
  },
  labels: {fillStyle: 'rgb(60, 0, 0)'}
});
// Data
let measuredAngle = new SmoothieChart.TimeSeries();
let targetAngle = new SmoothieChart.TimeSeries();

// Add a random value to each line every second
setInterval(function () {
  measuredAngle.append(new Date().getTime(), Math.random());
  targetAngle.append(new Date().getTime(), Math.random());
}, 1000);

gyroPID.addTimeSeries(measuredAngle, {
  strokeStyle: strokeStyle1,
  fillStyle: fillStyle1,
  lineWidth: 3
});

gyroPID.addTimeSeries(targetAngle, {
  strokeStyle: targetStroke
});

gyroPID.streamTo(document.getElementById("gyroPIDGraph"), 1000);


// Flywheel PID Graph Configuration
let flywheelPID = new SmoothieChart.SmoothieChart({
  grid: {
    strokeStyle: 'rgba(255, 255, 255, 0.45)',
    fillStyle: 'rgb(30,34,43)',
    lineWidth: 1,
    millisPerLine: 1000,
    verticalSections: 0,
  },
  labels: {fillStyle: 'rgb(60, 0, 0)'}
});
// Data
let measuredVelocity = new SmoothieChart.TimeSeries();
let targetVelocity = new SmoothieChart.TimeSeries();

// Add a random value to each line every second
setInterval(function () {
  measuredVelocity.append(new Date().getTime(), Math.random());
  targetVelocity.append(new Date().getTime(), Math.random());
}, 1000);

flywheelPID.addTimeSeries(measuredVelocity, {
  strokeStyle: strokeStyle1,
  fillStyle: fillStyle1,
  lineWidth: 3
});

flywheelPID.addTimeSeries(targetVelocity, {
  strokeStyle: targetStroke
});

flywheelPID.streamTo(document.getElementById("flywheelPIDGraph"), 1000);


/////////////////////////////////////////////////////////////////////////////

(function () {
  // Retrieve remote BrowserWindow
  const {BrowserWindow} = require('electron').remote

  function init() {
    // Minimize task
    document.getElementById("min-btn").addEventListener("click", (e) => {
      var window = BrowserWindow.getFocusedWindow();
      window.minimize();
    });

    // Maximize window
    document.getElementById("max-btn").addEventListener("click", (e) => {
      var window = BrowserWindow.getFocusedWindow();
      if (window.isMaximized()) {
        window.unmaximize();
      } else {
        window.maximize();
      }
    });

    // Close app
    document.getElementById("close-btn").addEventListener("click", (e) => {
      var window = BrowserWindow.getFocusedWindow();
      window.close();
    });
  };

  document.onreadystatechange = () => {
    if (document.readyState == "complete") {
      init();
    }
  };
})();