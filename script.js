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
// Correcting the touch position
function getTouchPos(canvasDom, touchEvent) {
	var rect = canvasDom.getBoundingClientRect();
	return {
		x: touchEvent.touches[0].clientX - rect.left,
		y: touchEvent.touches[0].clientY - rect.top,
	};
}

// Updated touchstart event handler
canvas.addEventListener(
	"touchstart",
	(e) => {
		const touchPos = getTouchPos(canvas, e);
		const x = touchPos.x;
		const y = touchPos.y;
		startDrawing({ offsetX: x, offsetY: y });
		e.preventDefault(); // Prevent scrolling when touching the canvas
	},
	false,
);

// Updated touchmove event handler
canvas.addEventListener(
	"touchmove",
	(e) => {
		if (isDrawing) {
			const touchPos = getTouchPos(canvas, e);
			const x = touchPos.x;
			const y = touchPos.y;
			continueDrawing({ offsetX: x, offsetY: y });
			e.preventDefault(); // Prevent scrolling when touching the canvas
		}
	},
	false,
);

// Updated touchend event handler
canvas.addEventListener(
	"touchend",
	() => {
		stopDrawing();
		e.preventDefault(); // Prevent scrolling when touching the canvas
	},
	false,
);
//******************************************************************************
