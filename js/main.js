let stage = new createjs.Stage("canvas");
let statsCanvas = new createjs.Stage("statsCanvas");
let totemCanvas = new createjs.Stage("totemCanvas");




// let c = new createjs.Shape();
// c.graphics.f("#f00").dc(0, 0, 50); // Drawn a 100x100 circle from the center
//
// let t = new createjs.Text("Resize the browser/frame to redraw!", "24px Arial bold", "#000");
// t.x = t.y = 20;
// stage.addChild(c, t);

window.addEventListener("resize", handleResize);

function handleResize() {
  let w = window.innerWidth - 2; // -2 accounts for the border
  let h = window.innerHeight - 2;
  // stage.canvas.width = w;
  // stage.canvas.height = h;
  let ratio = 100 / 100; // 100 is the width and height of the circle content.
  let windowRatio = w / h;
  let scale = w / 100;
  if (windowRatio > ratio) {
    scale = h / 100;
  }

  // Scale up to fit width or height
  // c.scaleX = c.scaleY = scale;
  //
  // // Center the shape
  // c.x = w / 2;
  // c.y = h / 2;

  stage.update();
}

handleResize(); // First draw



function argbStruct(rgbByteString, processAlpha = false) {
  if (rgbByteString.substr(0, 1) === "#") rgbByteString = rgbByteString.substr(1);
  return {
    "a": processAlpha ? chanA(rgbByteString) : 255,
    "r": chanR(rgbByteString),
    "g": chanG(rgbByteString),
    "b": chanB(rgbByteString),
  }
}

function argbString(argbStruct, prefix = "#", processAlpha = false) {
  function toHex(i) {
    i = Math.floor(i);
    return i.toString(16).padStart(2, "0");
  }

  return prefix + (processAlpha ? toHex(argbStruct.a) : "") +
    toHex(argbStruct.r) +
    toHex(argbStruct.g) +
    toHex(argbStruct.b);
}

function rgbaString(argbStruct, processAlpha) {
  let s = argbStruct;
  let alpha = processAlpha ? `, ${s.a / 255}` : '';
  return(`rgba(${s.r}, ${s.g}, ${s.b}${alpha})`);
}

function chanA(rgb4byte) {
  const v = parseInt(rgb4byte, 16);
  return (v >> 24) & 0xff;
}

function chanR(rgb3byte) {
  const v = parseInt(rgb3byte, 16);
  return (v >> 16) & 0xff;
}

function chanG(rgb3byte) {
  const v = parseInt(rgb3byte, 16);
  return (v >> 8) & 0xff;
}

function chanB(rgb3byte) {
  const v = parseInt(rgb3byte, 16);
  return v & 0xff;
}
