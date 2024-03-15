const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

window.addEventListener("load", () => {
	// Setting canvas width/height
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
});

let isDrawing = false;

const startDrawing = (e) => {
	isDrawing = true;
	ctx.beginPath(); // Start a new path
	ctx.moveTo(e.offsetX, e.offsetY); // Move to the starting point of the path
};

const continueDrawing = (e) => {
	if (!isDrawing) return;
	ctx.lineTo(e.offsetX, e.offsetY); // Add a new point to the path
	ctx.stroke(); // Draw the path
};

const stopDrawing = () => {
	isDrawing = false;
};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", continueDrawing);
canvas.addEventListener("mouseup", stopDrawing);

//******************************************************************************
// USE INTERFACE MOBIE
// Touch events
canvas.addEventListener("touchstart", (e) => {
	isDrawing = true;
	const touch = e.touches[0];
	const x = touch.clientX;
	const y = touch.clientY;
	points.push({ x, y, alpha: 1 }); // Add initial point with full opacity
});

canvas.addEventListener("touchmove", (e) => {
	if (isDrawing) {
		const touch = e.touches[0];
		const x = touch.clientX;
		const y = touch.clientY;
		points.push({ x, y, alpha: 1 }); // Add new points with full opacity
		drawPoints(); // Draw points with current opacity
	}
});

canvas.addEventListener("touchend", () => {
	isDrawing = false;
});
//******************************************************************************
