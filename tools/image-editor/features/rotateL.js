

export function rotateL(ctx, img, angle, cropOption = {}) {
    if (!ctx || !img) {
        console.error("RotateL:Parameter missing");
        return;
    }
    const newAngle = (angle + 90 + 360) % 360;

    const isCropped = Object.keys(cropOption).length > 0;

    const width = isCropped ? cropOption.cropWidth : img.width;
    const height = isCropped ? cropOption.cropHeight : img.height;

    const isOdd = (newAngle / 90) % 2 !== 0;

    ctx.canvas.height = isOdd ? width : height;
    ctx.canvas.width = isOdd ? height : width;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (isCropped) {
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);//set canvas center origin to img center
        ctx.rotate(-newAngle * Math.PI / 180);//rotate canvas coordinate systems,In radian
        ctx.drawImage(img, cropOption.sx, cropOption.sy, width, height, -width / 2, -height / 2, width, height);
        ctx.restore();
    } else {
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
        ctx.rotate(-newAngle * Math.PI / 180);
        ctx.drawImage(img, -width / 2, -height / 2);
        ctx.restore();
    }
    return newAngle;
}

