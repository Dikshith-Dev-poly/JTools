/*
  width/height=ratio;
  imgRatio > targetRatio -> width is more,i.e. image is wider
  imgRatio < targetRatio -> height is more,i.e. Image is Too Tall



  if height is known
  width=height*ratio; -> from formula

  if width is known
  height=width/ratio;-> from formula

*/


export function cropImage(ctx, img, ratio) {
    if (!ctx || !img || !ratio) {
        console.error("crop:Parameter missing");
        return;
    }
    if (ratio === "free") {
        ctx.canvas.width = img.width;
        ctx.canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        return;
    }

    const ratios = { "1:1": [1, 1], "4:3": [4, 3], "16:9": [16, 9], "3:2": [3, 2], "9:16": [9, 16] };
    if (!ratios[ratio]) {
        console.error("Aspect ratio not found");
        return;
    }

    const [rx, ry] = ratios[ratio];

    const imgRatio = img.width / img.height;
    const targetRatio = rx / ry;


    let cropWidth, cropHeight;


    if (imgRatio > targetRatio) {
        cropHeight = img.height;
        cropWidth = cropHeight * targetRatio;
    } else {
        cropWidth = img.width;
        cropHeight = cropWidth / targetRatio;
    }

    const sx = (img.width - cropWidth) / 2;
    const sy = (img.height - cropHeight) / 2;

    ctx.canvas.width = cropWidth;
    ctx.canvas.height = cropHeight;
    ctx.drawImage(img, sx, sy, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
}


export function customCrop(ctx, img, width, height) {
    if (!ctx || !img || !width || !height || !Number.isFinite(width) || !Number.isFinite(height)) {
        console.error("Crop:Parameter missing");
        return;
    }

    const sx = (img.width - width) / 2;
    const sy = (img.height - height) / 2;

    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(img, sx, sy, width, height, 0, 0, width, height);
}