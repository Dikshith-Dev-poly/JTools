export function emboss(ctx) {
    if (!ctx) {
        console.error("Emboss:parameter missing");
        return;
    }
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const kernel = [
        -2, -1, 0,
        -1, 1, 1,
        0, 1, 2
    ];
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) {
                let sum = 0;
                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const pixelIndex = ((y + ky) * width + (x + kx)) * 4 + c;
                        const kernelIndex = ((ky + 1) * 3 + (kx + 1));
                        sum += copy[pixelIndex] * kernel[kernelIndex];
                    }
                }
                data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum + 128));
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
