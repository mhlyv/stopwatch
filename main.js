const acceleration_limit = -0.3;
var acceleration;

function reload() {location.reload();}

// function motion(event) {
// 	document.getElementById("accelerometer-x").innerHTML = "X: " + event.acceleration.x;
// 	document.getElementById("accelerometer-y").innerHTML = "Y: " + event.acceleration.y;
// 	document.getElementById("accelerometer-z").innerHTML = "Z: " + event.acceleration.z;
// }

function check_acceleration(event) {
	if (event.acceleration.z < acceleration_limit) acceleration = true;
}

function button_start() {
	document.getElementById("arm-button").value = "Reset";
	document.getElementById("arm-button").style.background = "#ff0000";
	document.getElementById("arm-button").addEventListener("click", reload);
	document.getElementById("countdown-button").style.visibility = "hidden";
}

function button_reset() {
	document.getElementById("arm-button").value = "Arm";
	document.getElementById("arm-button").style.background = "#0055FF";
	document.getElementById("arm-button").removeEventListener("click", reload);
	document.getElementById("countdown-button").style.visibility = "visible";
}

function time_click(start_time) {
	var interval = setInterval(() => {
		if (acceleration) {
			clearInterval(interval);
			window.removeEventListener("devicemotion", check_acceleration);
			button_reset();
			main();
		}

		var time = Date.now() - start_time;
		document.getElementById("stopwatch").innerHTML = ""
			+ Math.floor(time / 1000) + ":"
			+ (time % 1000);
	}, 1);
}

function arm_click() {
	button_start();
	document.getElementById("stopwatch").innerHTML = "";
	document.getElementById("arm-button").removeEventListener("click", arm_click);
	document.getElementById("countdown-button").removeEventListener("click", countdown);

	window.addEventListener("devicemotion", check_acceleration);
	var interval = setInterval(() => {
		if (acceleration) {
			window.removeEventListener("devicemotion", check_acceleration);
			clearInterval(interval);
			acceleration = false;
			var time = Date.now();

			// timeout to escape stopping from the starting hit
			setTimeout(() => {window.addEventListener("devicemotion", check_acceleration);}, 300);
			time_click(time);
		}
	}, 1);
}

function countdown() {
	button_start();
	document.getElementById("stopwatch").innerHTML = "";
	document.getElementById("arm-button").removeEventListener("click", arm_click);
	document.getElementById("countdown-button").removeEventListener("click", countdown);

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
	if (!window.DeviceMotionEvent) {
		throw("devicemotion not supported");
		alert("devicemotion not supported");
		return false;
	}

	acceleration = false;
	// window.addEventListener("devicemotion", motion);
	document.getElementById("arm-button").addEventListener("click", arm_click);
	document.getElementById("countdown-button").addEventListener("click", countdown);
}
