const canvas = document.querySelector("canvas");
const toolBtns = document.querySelectorAll(".tool");
const fillColor = document.getElementById("fill-color");
const sizeSlider = document.getElementById("size-slider");
const colorsBtn = document.querySelectorAll(".colors .option");
const colorsPicker = document.getElementById("color-picker");
const choosingColor = document.getElementById("choosing-Color");
const clearCanvas = document.querySelector(".clear-canvas");
const saveTmg = document.querySelector(".save-img");
/*************************************** */

const ctx = canvas.getContext("2d", { willReadFrequently: true });
let prevMouseX, prevMouseY, snapshot;
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 1;
let selectedColor = "rgb(0, 0, 0)";

function setCanvasbackground() {
	ctx.fillStyle = "#fff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = selectedColor;
}
window.addEventListener("load", () => {
	// Setting canvas width/height
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	setCanvasbackground();
});

function drawRect(e) {
	//nếu không fill thì vẽ bình thường
	if (!fillColor.checked)
		return ctx.strokeRect(
			e.offsetX,
			e.offsetY,
			prevMouseX - e.offsetX,
			prevMouseY - e.offsetY,
		);
	// thực hiện khi có thêm chức năng fill
	ctx.fillRect(
		e.offsetX,
		e.offsetY,
		prevMouseX - e.offsetX,
		prevMouseY - e.offsetY,
	);
}

function drawTriangle(e) {
	// Begin a new path
	ctx.beginPath();

	// Move to the starting point of the triangle
	ctx.moveTo(prevMouseX, prevMouseY);

	// Calculate the coordinates of the third vertex of the triangle
	const thirdVertexX = 2 * prevMouseX - e.offsetX;
	const thirdVertexY = e.offsetY;

	// Draw lines to the second and third vertices
	ctx.lineTo(e.offsetX, e.offsetY);
	ctx.lineTo(thirdVertexX, thirdVertexY);

	// Close the path to complete the triangle
	ctx.closePath();

	// Stroke or fill the triangle based on the fill color checkbox
	fillColor.checked ? ctx.fill() : ctx.stroke();
}

function drawCirle(e) {
	ctx.beginPath();
	const radius = Math.sqrt(
		(e.offsetX - prevMouseX) ** 2 + (e.offsetY - prevMouseY) ** 2,
	);
	ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
	fillColor.checked ? ctx.fill() : ctx.stroke();
}

/*************************************** */

const startDrawing = (e) => {
	isDrawing = true;
	prevMouseX = e.offsetX;
	prevMouseY = e.offsetY;
	ctx.beginPath();
	ctx.moveTo(e.offsetX, e.offsetY);
	ctx.lineWidth = brushWidth;
	ctx.strokeStyle = selectedColor;
	ctx.fillStyle = selectedColor;
	// coying canvas data & passing as snapshot  value.. this avoids dragging the image
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const continueDrawing = (e) => {
	if (!isDrawing) return;
	// adding copied canvas data on to this canvas
	ctx.putImageData(snapshot, 0, 0);
	if (selectedTool === "brush" || selectedTool === "eraser") {
		ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
		ctx.lineTo(e.offsetX, e.offsetY);
		ctx.stroke();
	} else if (selectedTool === "triangle") {
		drawTriangle(e);
	} else if (selectedTool === "rectangle") {
		drawRect(e);
	} else if (selectedTool === "circle") {
		drawCirle(e);
	}
};

const stopDrawing = () => {
	isDrawing = false;
};

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", continueDrawing);
canvas.addEventListener("mouseup", stopDrawing);

/*************************************** */

toolBtns.forEach((btn) => {
	btn.addEventListener("click", () => {
		//remove active class from the previous option
		document.querySelector(".option.active").classList.remove("active");
		//add active class to the next option
		btn.classList.add("active");
		selectedTool = btn.id;
		// console.log(selectedTool);
	});
});

sizeSlider.addEventListener("change", () => {
	brushWidth = sizeSlider.value;
});

colorsBtn.forEach((btn) => {
	btn.addEventListener("click", () => {
		//remove selected class from the previous option
		document.querySelector(".option.selected").classList.remove("selected");
		//add selected class to the next option
		btn.classList.add("selected");
		//set selectedColor value
		selectedColor = window
			.getComputedStyle(btn)
			.getPropertyValue("background-color");
		choosingColor.style.backgroundColor = selectedColor;
	});
});

colorsPicker.addEventListener("input", () => {
	colorsPicker.parentElement.style.backgroundColor = colorsPicker.value;
	selectedColor = colorsPicker.value;
	choosingColor.style.backgroundColor = selectedColor;
});

clearCanvas.addEventListener("click", () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	setCanvasbackground();
});
saveTmg.addEventListener("click", () => {
	const link = document.createElement("a");
	link.href = canvas.toDataURL();
	link.download = `${Date.now()}.jpg`;
	link.click();
});

//***************************************************

// Khu vực này dùng để xử lý các bug vô tình gặp phải nè

// Add an event listener for 'mouseleave' to handle the case when the mouse leaves the canvas
canvas.addEventListener("mouseleave", stopDrawing);

// Add an event listener for 'mouseenter' to handle the case when the mouse enters the canvas
canvas.addEventListener("mouseenter", (e) => {
	// Only start drawing if the mouse button is already pressed
	if (e.buttons === 1) {
		startDrawing(e);
	}
});

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
function fill(e) {
	// getMousePosition function
	function getMousePosition(e) {
		const rect = canvas.getBoundingClientRect();
		const x = Math.floor(e.clientX - rect.left);
		const y = Math.floor(e.clientY - rect.top);
		return { x, y };
	}

	// getColorUnderMouse function
	function getColorUnderMouse(x, y) {
		const ctx = canvas.getContext("2d");
		const imageData = ctx.getImageData(x, y, 1, 1);
		const rgbColor = `rgb(${imageData.data[0]}, ${imageData.data[1]}, ${imageData.data[2]})`;
		return rgbColor;
	}

	const pointOldColor = getMousePosition(e); // Call getMousePosition here
	const oldColor = getColorUnderMouse(pointOldColor.x, pointOldColor.y);
	const newColor = selectedColor;
	// validate
	function validate(x, y) {
		let cx = getColorUnderMouse(x, y);
		if (cx === oldColor) {
			stackPoint.push({ x, y });
			ctx.fillStyle = newColor;
			ctx.fillRect(x, y, 1, 1);
		}
	}
	const stackPoint = [];
	stackPoint.push(pointOldColor);
	if (oldColor == newColor) return;
	while (stackPoint.length > 0) {
		let pt = stackPoint.pop();
		if (
			pt.x > 0 &&
			pt.y > 0 &&
			pt.x < canvas.width - 1 &&
			pt.y < canvas.height - 1
		) {
			validate(pt.x - 1, pt.y, stackPoint);
			validate(pt.x, pt.y - 1, stackPoint);
			validate(pt.x + 1, pt.y, stackPoint);
			validate(pt.x, pt.y + 1, stackPoint);
		}
	}
}

canvas.addEventListener("mousedown", (e) => {
	if (selectedTool === "fill") fill(e);
});
