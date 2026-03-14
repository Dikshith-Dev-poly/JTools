export function flipV(ctx, img, toggle = "true", crop = {}) {
    if (!ctx || !img) {
        console.error("FlipV:Parameter missing");
        return;
    }
    const isCropped = Object.keys(crop).length > 0;


    ctx.save();
    if (isCropped) {
        ctx.canvas.width = crop.cropWidth;
        ctx.canvas.height = crop.cropHeight;
        if (toggle === "true") {
            ctx.scale(1, -1);
            ctx.drawImage(img, crop.sx, crop.sy, crop.cropWidth, crop.cropHeight, 0, -crop.height, crop.cropWidth, crop.cropHeight);
        } else {
            ctx.drawImage(img, crop.sx, crop.sy, crop.cropWidth, crop.cropHeight, 0, 0, crop.cropWidth, crop.cropHeight);
        }
    } else {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        if (toggle === "true") {
            ctx.scale(1, -1);
            ctx.drawImage(img, 0, -img.height);
        } else {
            ctx.drawImage(img, 0, 0);
        }
    }
    ctx.restore();
}