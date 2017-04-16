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
  }
};

let connect = document.getElementById('connect');

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);

// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, false);

// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);

let escCount = 0;
onkeydown = key => {
  if (key.key === 'Escape') {
    setTimeout(() => {
      escCount = 0;
    }, 400);
    escCount++;
    console.log(escCount);
    if (escCount === 2) {
      document.body.classList.toggle('login-close', true);
    }
  }
  else
    console.log(key.key);
};
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
    }
    else {
      ui.robotState.innerHTML = "Disconnected";
      ipc.send('connect', "roborio-4192.local");
    }
  }
}

/**** KEY Listeners ****/

// Gyro rotation
let updateGyro = (key, value) => {
  ui.gyro.val = value;

  ui.gyro.pointer.style.transform = `rotate(${ui.gyro.val}deg)`;
  ui.gyro.number.innerHTML = ui.gyro.val + '°';
};
NetworkTables.addKeyListener('/SmartDashboard/actualHeading', updateGyro);


NetworkTables.addKeyListener('/SmartDashboard/time_running', (key, value) => {
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

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/time_running', (key, value) => {
  // Clear previous list
  while (ui.autoSelect.firstChild) {
    ui.autoSelect.removeChild(ui.autoSelect.firstChild);
  }
  // Make an option for each autonomous mode and put it in the selector
  for (let i = 0; i < value.length; i++) {
    let option = document.createElement('option');
    option.appendChild(document.createTextNode(value[i]));
    ui.autoSelect.appendChild(option);
  }
  // Set value to the already-selected mode. If there is none, nothing will happen.
  ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
});

// Load list of prewritten autonomous modes
NetworkTables.addKeyListener('/SmartDashboard/autonomous/selected', (key, value) => {
  ui.autoSelect.value = value;
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
  let propName = key.substring(16, key.length);
  // Check if value is new and doesn't have a spot on the list yet
  if (isNew && !document.getElementsByName(propName)[0]) {
    // Make sure name starts with /SmartDashboard/. Properties that don't are technical and don't need to be shown on the list.
    if (/^\/SmartDashboard\//.test(key)) {
      // Make a new div for this value
      let div = document.createElement('div'); // Make div
      ui.tuning.list.appendChild(div); // Add the div to the page
      let p = document.createElement('p'); // Make a <p> to display the name of the property
      p.appendChild(document.createTextNode(propName)); // Make content of <p> have the name of the NetworkTables value
      div.appendChild(p); // Put <p> in div
      let input = document.createElement('input'); // Create input
      input.name = propName; // Make its name property be the name of the NetworkTables value
      input.value = value; // Set
      // The following statement figures out which data type the variable is.
      // If it's a boolean, it will make the input be a checkbox. If it's a number,
      // it will make it a number chooser with up and down arrows in the box. Otherwise, it will make it a textbox.
      if (typeof value === "boolean") {
        input.type = 'checkbox';
        input.checked = value; // value property doesn't work on checkboxes, we'll need to use the checked property instead
        input.onchange = function () {
          // For booleans, send bool of whether or not checkbox is checked
          NetworkTables.putValue(key, this.checked);
        };
      }
      else if (!isNaN(value)) {
        input.type = 'number';
        input.onchange = function () {
          // For number values, send value of input as an int.
          NetworkTables.putValue(key, parseInt(this.value));
        };
      }
      else {
        input.type = 'text';
        input.onchange = function () {
          // For normal text values, just send the value.
          NetworkTables.putValue(key, this.value);
        };
      }
      // Put the input into the div.
      div.appendChild(input);
    }
  }
  else {
    // Find already-existing input for changing this variable
    let oldInput = document.getElementsByName(propName)[0];
    if (oldInput) {
      if (oldInput.type === 'checkbox') {
        oldInput.checked = value;
      }
      else {
        oldInput.value = value;
      }
    }
    else {
      console.log('Error: Non-new variable ' + key + ' not present in tuning list!');
    }
  }

}

// Reset gyro value to 0 on click
ui.gyro.container.onclick = function () {
  // Store previous gyro val, will now be subtracted from val for callibration
  ui.gyro.offset = ui.gyro.val;
  // Trigger the gyro to recalculate value.
  updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
};