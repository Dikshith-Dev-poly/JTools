export function contrastM(ctx, value = 2) {
    if (!ctx) {
        console.error("ContrastM:Parameter Missing");
        return;
    }

    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = (data[i] - 128) * value + 128;
        data[i + 1] = (data[i + 1] - 128) * value + 128;
        data[i + 2] = (data[i + 2] - 128) * value + 128;
    }
    ctx.putImageData(imageData, 0, 0);
}


export function contrast(ctx, img, crop = {}) {
    if (!ctx || !img) {
        console.error("contrast:Parameter missing");
        return;
    }
    const isCropped = Object.keys(crop).length > 0;
    ctx.filter = "contrast(100%)";//normal

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