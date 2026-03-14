export function brightnessM(ctx, value = 50) {
    if (!ctx) {
        console.error("BrightnessM:Parameter Missing");
        return;
    }
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] + value);//R
        data[i + 1] = Math.min(255, data[i + 1] + value);//G
        data[i + 2] = Math.min(255, data[i + 2] + value);//B
    }
    ctx.putImageData(imageData, 0, 0);
}


export function brightness(ctx, img, crop = {}) {
    if (!ctx || !img) {
        console.error("Brightness:Parameter missing");
        return;
    }
    const isCropped = Object.keys(crop).length > 0;
    ctx.filter = "brightness(100%)";//normal
    /*
    150-brighter
    50-darker
    */
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