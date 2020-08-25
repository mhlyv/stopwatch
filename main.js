const acceleration_limit = -0.3;
var acceleration;

function reload() {location.reload();}

function check_acceleration(event) {
	if (event.acceleration.z < acceleration_limit) acceleration = true;
}

function button_start() {
	// switch to reset button
	document.getElementById("arm-button").value = "Reset";
	document.getElementById("arm-button").style.background = "#ff0000";
	document.getElementById("arm-button").addEventListener("click", reload);
	document.getElementById("arm-button").removeEventListener("click", arm_click);
	document.getElementById("countdown-button").style.visibility = "hidden";
	document.getElementById("countdown-button").removeEventListener("click", countdown);
	document.getElementById("stopwatch").innerHTML = "";
}

function button_reset() {
	// switch to 2 buttons
	document.getElementById("arm-button").value = "Arm";
	document.getElementById("arm-button").style.background = "#0055FF";
	document.getElementById("arm-button").removeEventListener("click", reload);
	document.getElementById("countdown-button").style.visibility = "visible";
}

function time_click(start_time) {
	var interval = setInterval(() => {
		// check if the device was accelerated over the limit
		if (acceleration) {
			// reset to original
			clearInterval(interval);
			window.removeEventListener("devicemotion", check_acceleration);
			button_reset();
			main();
		}

		// display time elapsed since the start
		var time = Date.now() - start_time;
		document.getElementById("stopwatch").innerHTML = ""
			+ Math.floor(time / 1000) + ":"
			+ (time % 1000);
	}, 1);
}

function arm_click() {
	button_start();
	window.addEventListener("devicemotion", check_acceleration);

	// check if the device was accelerated over the limit
	var interval = setInterval(() => {
		if (acceleration) {
			window.removeEventListener("devicemotion", check_acceleration);
			clearInterval(interval);
			acceleration = false;

			// timeout to escape stopping from the starting hit
			setTimeout(() => {
				window.addEventListener("devicemotion", check_acceleration);
			}, 300);

			time_click(Date.now());
		}
	}, 1);
}

function countdown() {
	button_start();

	// count down for 10 seconds
	var i = 10;
	var interval = setInterval(() => {
		if (!i) {
			document.getElementById("stopwatch").innerHTML = "";
			clearInterval(interval);
			acceleration = false;

			window.addEventListener("devicemotion", check_acceleration);
			time_click(Date.now());
		}

		document.getElementById("stopwatch").innerHTML = "" + i;
		i = i - 1;
	}, 1000);
}

function main() {
	if (window.DeviceMotionEvent) {
		acceleration = false;
		document.getElementById("arm-button").addEventListener("click", arm_click);
		document.getElementById("countdown-button").addEventListener("click", countdown);
	} else {
		alert("devicemotion not supported");
		throw("devicemotion not supported");
		return false;
	}
}
