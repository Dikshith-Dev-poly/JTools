// Sobel edge detector
export function edgeDetection(ctx) {
    if (!ctx) {
        console.error("EdgeDetection:parameter missing");
        return;
    }
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const copy = new Uint8ClampedArray(data);
    const gxKernel = [
        -1, 0, 1,
        -2, 0, 2,
        -1, 0, 1
    ];

    const gyKernel = [
        -1, -2, -1,
        0, 0, 0,
        1, 2, 1
    ];
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            let gx = 0;
            let gy = 0;
            for (let ky = -1; ky <= 1; ky++) {
                for (let kx = -1; kx <= 1; kx++) {
                    const pixelIndex = ((y + ky) * width + (x + kx)) * 4;
                    const gray =
                        0.299 * copy[pixelIndex] +
                        0.587 * copy[pixelIndex + 1] +
                        0.114 * copy[pixelIndex + 2];
                    const kernelIndex = ((ky + 1) * 3 + (kx + 1));
                    gx += gray * gxKernel[kernelIndex];
                    gy += gray * gyKernel[kernelIndex];
                }
            }
            const mag = Math.sqrt(gx * gx + gy * gy);
            const index = (y * width + x) * 4;
            data[index] = Math.min(255, mag);
            data[index + 1] = Math.min(255, mag);
            data[index + 2] = Math.min(255, mag);

        }
    }
    ctx.putImageData(imageData, 0, 0);
}
