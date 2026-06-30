// util/crop-helper.ts
//



export async function getCroppedImg (imageSrc: string, crop: {x:number, y:number, height:number, width: number}) {
    const image = new Image();
    image.src = imageSrc;

    await new Promise((resole) => {
        image.onload = resole;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx?.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);
    return canvas.toDataURL("image/jpeg");
}