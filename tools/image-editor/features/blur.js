export function boxBlur(ctx) {
    if (!ctx) {
        console.error("Blur:parameter missing");
        return;
    }
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const kernel = [
        1 / 9, 1 / 9, 1 / 9,
        1 / 9, 1 / 9, 1 / 9,
        1 / 9, 1 / 9, 1 / 9
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
                data[(y * width + x) * 4 + c] = sum;
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

export function GaussianBlur(ctx) {
    if (!ctx) {
        console.error("Blur:parameter missing");
        return;
    }
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const kernel = [
        1 / 16, 2 / 16, 1 / 16,
        2 / 16, 4 / 16, 2 / 16,
        1 / 16, 2 / 16, 1 / 16
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
                data[(y * width + x) * 4 + c] = Math.min(255, Math.max(0, sum));
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
