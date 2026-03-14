export function saturationM(ctx, value = 2) {
    if (!ctx) {
        console.error("saturationM:Parameter Missing");
        return;
    }

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        let r = data[i], g = data[i + 1], b = data[i + 2];
        const gray = 0.299 * r + 0.587 * g + 0.114 * b;
        data[i] = gray + (data[i] - gray) * value;
        data[i + 1] = gray + (data[i + 1] - gray) * value;
        data[i + 2] = gray + (data[i + 2] - gray) * value;
    }
    ctx.putImageData(imageData, 0, 0);
}


export function saturation(ctx, img, crop = {}) {
    if (!ctx || !img) {
        console.error("saturation:Parameter missing");
        return;
    }
    const isCropped = Object.keys(crop).length > 0;
    ctx.filter = "saturation(100%)";//normal

    if (isCropped) {
        ctx.canvas.width = crop.cropWidth;
        ctx.canvas.height = crop.cropHeight;
        ctx.drawImage(img, crop.sx, crop.sy, crop.cropWidth, crop.cropHeight, 0, 0, crop.cropWidth, crop.cropHeight);
    } else {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
    }
}