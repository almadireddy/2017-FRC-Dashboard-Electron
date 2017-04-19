// Define UI elements
let ui = {
  timer: document.getElementById('timer'),
  robotState: document.getElementById('robot-state'),
  gyro: {
    container: document.getElementById('compass-container'),
    val: 0,
    pointer: document.getElementById('cls-3'),
    number: document.getElementById('gyroAngle')
  },
  current: {
    frontLeft:  document.getElementById('current-frontLeft'),
    frontRight: document.getElementById('current-frontRight'),
    backLeft:   document.getElementById('current-backLeft'),
    backRight:  document.getElementById('current-backRight'),
    climber:    document.getElementById('current-climber'),
    actuator:   document.getElementById('current-actuator'),
    vrm:        document.getElementById('current-vrm'),
  },
  auton: {
    baseline:   document.getElementById('default'),
    left:       document.getElementById('left'),
    middle:     document.getElementById('middle'),
    right:      document.getElementById('right'),
  },
  pid: {
    gyro: {
      kp: null,
      ki: null,
      kd: null,
    },
    drive: {
      kp: null,
      ki: null,
      kd: null,
    },
    flywheel: {
      kp: null,
      ki: null,
      kd: null,
    }
  }
};

let robotConnected = false;

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

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

if (noElectron) {
  document.body.classList.add('login-close');
}

function onRobotConnection(connected) {
  let state = connected ? 'Robot connected!' : 'Robot disconnected.';
  console.log(state);
  ui.robotState.data = state;

  if (!noElectron) {
    if (connected) {
      ui.robotState.innerHTML = "Connected";
      robotConnected = true;
    }
    else {
      ui.robotState.innerHTML = "Disconnected";
      ipc.send('connect', "roborio-4192-frc.local");
      robotConnected = false;
    }
  }
}

function autonSelect(id) {
  let i, autonButtons;

  autonButtons = document.getElementsByClassName("autonButton");

  for (i = 0; i < autonButtons.length; i++) {
    autonButtons[i].className = "autonButton";
  }

  document.getElementById(id).className += ' active';
  NetworkTables.putValue('Selected Autonomous', id);
}

/**** KEY Listeners ****/

// Gyro rotation
NetworkTables.addKeyListener('actualHeading', (key, value) => {
  ui.gyro.val = value;

  ui.gyro.pointer.style.transform = `rotate(${ui.gyro.val}deg)`;
  ui.gyro.number.innerHTML = ui.gyro.val + '°';
});

// Actuator Display
NetworkTables.addKeyListener('Actuator Encoder Position', (key, value) => {
  if (value > 40000) {
    animateActuatorForward();
  } else {
    animateActuatorBackward();
  }
});

// Graphs
setInterval(function () {
  let leftEncoder   = NetworkTables.getValue("Left Encoder Value", 0.0);
  let rightEncoder  = NetworkTables.getValue("Right Encoder Value", 0.0);
  let driveTarget   = NetworkTables.getValue("targetDistance", 0.0);
  measuredLeft.append(new Date().getTime(), leftEncoder);
  measuredRight.append(new Date().getTime(), rightEncoder);
  target.append(new Date().getTime(), driveTarget);

  let flywheelVelocity = NetworkTables.getValue("flywheelMeasuredRPM", 0.0);
  let flywheelTarget   = NetworkTables.getValue("targetRPM", 0.0);
  measuredVelocity.append(new Date().getTime(), flywheelVelocity);
  targetVelocity.append(new Date().getTime(), flywheelTarget);

  let actualHeading    = NetworkTables.getValue("actualHeading", 0.0);
  let targetHeading    = NetworkTables.getValue("targetHeading", 0.0);
  measuredAngle.append(new Date().getTime(), actualHeading);
  targetAngle.append(new Date().getTime(), targetHeading);

}, 200);

NetworkTables.addKeyListener('time_running', (key, value) => {
  // Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
  if (typeof value === 'string')
    value = value === "true";
  // When this NetworkTables variable is true, the timer will start.
  // You shouldn't need to touch this code, but it's documented anyway in case you do.
  let s = 135;
  if (value) {
    // Make sure timer is reset to black when it starts
    ui.timer.style.color = '#f1f1f1';
    // Function below adjusts time left every second
    let countdown = setInterval(function () {
      s--; // Subtract one second
      // Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
      let m = Math.floor(s / 60);
      // Create seconds number that will actually be displayed after minutes are subtracted
      let visualS = (s % 60);
      // Add leading zero if seconds is one digit long, for proper time formatting.
      visualS = visualS < 10 ? '0' + visualS : visualS;
      if (s < 0) {
        // Stop countdown when timer reaches zero
        clearTimeout(countdown);
        return;
      }
      else if (s <= 15) {
        // Flash timer if less than 15 seconds left
        ui.timer.style.color = (s % 2 === 0) ? '#f44' : 'transparent';
      }
      else if (s <= 30) {
        // Solid red timer when less than 30 seconds left.
        ui.timer.style.color = '#f44';
      }
      ui.timer.firstChild.data = m + ':' + visualS;
    }, 1000);
  }
  else {
    s = 135;
  }
  NetworkTables.putValue(key, false);
});

// Global Listener
function onValueChanged(key, value, isNew) {
  // Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
  if (value === 'true') {
    value = true;
  }
  else if (value === 'false') {
    value = false;
  }

  // The following code manages tuning section of the interface.
  // This section displays a list of all NetworkTables variables (that start with /SmartDashboard/) and allows you to directly manipulate them.
  // let propName = key.substring(16, key.length);
  // // Check if value is new and doesn't have a spot on the list yet
  // if (isNew && !document.getElementsByName(propName)[0]) {
  //   // Make sure name starts with /SmartDashboard/. Properties that don't are technical and don't need to be shown on the list.
  //   if (/^\/SmartDashboard\//.test(key)) {
  //     // Make a new div for this value
  //     let div = document.createElement('div'); // Make div
  //     ui.tuning.list.appendChild(div); // Add the div to the page
  //     let p = document.createElement('p'); // Make a <p> to display the name of the property
  //     p.appendChild(document.createTextNode(propName)); // Make content of <p> have the name of the NetworkTables value
  //     div.appendChild(p); // Put <p> in div
  //     let input = document.createElement('input'); // Create input
  //     input.name = propName; // Make its name property be the name of the NetworkTables value
  //     input.value = value; // Set
  //     // The following statement figures out which data type the variable is.
  //     // If it's a boolean, it will make the input be a checkbox. If it's a number,
  //     // it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
  //     if (typeof value === "boolean") {
  //       input.type = 'checkbox';
  //       input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
  //       input.onchange = function () {
  //         // For booleans, send bool of whether or not checkbox is checked
  //         NetworkTables.putValue(key, this.checked);
  //       };
  //     }
  //     else if (!isNaN(value)) {
  //       input.type = 'number';
  //       input.onchange = function () {
  //         // For number values, send value of input as an int.
  //         NetworkTables.putValue(key, parseInt(this.value));
  //       };
  //     }
  //     else {
  //       input.type = 'text';
  //       input.onchange = function () {
  //         // For normal text values, just send the value.
  //         NetworkTables.putValue(key, this.value);
  //       };
  //     }
  //     // Put the input into the div.
  //     div.appendChild(input);
  //   }
  // }
  // else {
  //   // Find already-existing input for changing this variable
  //   let oldInput = document.getElementsByName(propName)[0];
  //   if (oldInput) {
  //     if (oldInput.type === 'checkbox') {
  //       oldInput.checked = value;
  //     }
  //     else {
  //       oldInput.value = value;
  //     }
  //   }
  //   else {
  //     console.log('Error: Non-new variable ' + key + ' not present in tuning list!');
  //   }
  // }

}