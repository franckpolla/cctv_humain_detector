import { DetectedObject } from "@tensorflow-models/coco-ssd";


// this function is drawing the square on the onbject that it detects
export function drawOnCanvas(
  mirror: boolean,
  predictions: DetectedObject[],
  ctx: CanvasRenderingContext2D | null | undefined
) {
  if (!ctx) {
    return; // Handle the case where ctx is null or undefined
  }

  predictions.forEach((detectedObject: DetectedObject) => {
    const { class: name, bbox, score } = detectedObject;
    const [x, y, width, height] = bbox;

    // Define styling variables for better readability
    const baseColor = "yellow";
    const highlightColor = "red";
    const textColor = "white";
    const textFont = "12px Courier New";
    const textOpacity = 0.8;
    const boxOpacity = 0.4;

    ctx.beginPath();

    if (mirror) {
      ctx.rect(ctx.canvas.width - x - width, y, width, height);
    } else {
      ctx.rect(x, y, width, height);
    }

    // Set stroke and fill styles based on class
    ctx.strokeStyle = baseColor;
    ctx.fillStyle = name === "person" ? highlightColor : baseColor;
    ctx.lineWidth = 2; // Adjust line width as needed

    ctx.stroke(); // Draw stroke before fill for better visibility

    // Draw text with drop shadow for readability
    ctx.globalAlpha = textOpacity;
    ctx.fillStyle = textColor;
    ctx.fillText(name, x + 2, y + 15); // Add slight offset for drop shadow

    ctx.globalAlpha = boxOpacity;
    ctx.fill(); // Fill the box after drawing text

    ctx.globalAlpha = 1; // Reset globalAlpha for future drawing
  });
}
