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
