module.exports = {
    redEffect(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i + 0] = pixels.data[i + 0] + 100; // RED
            pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
            pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // BLUE
        }
        return pixels;
    },
    rgbSplit(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i - 150] = pixels.data[i + 0]; // RED
            pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
            pixels.data[i - 550] = pixels.data[i + 2]; // BLUE
        }
        return pixels;
    },
    invert(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            pixels.data[i + 0] = 255 - pixels.data[i + 0];
            pixels.data[i + 1] = 255 - pixels.data[i + 1];
            pixels.data[i + 2] = 255 - pixels.data[i + 2];
        }
        return pixels;
    },
    grayscale(pixels) {
        for (let i = 0; i < pixels.data.length; i += 4) {
            let avg = (pixels.data[i + 0] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;
            pixels.data[i + 0] = avg;
            pixels.data[i + 1] = avg;
            pixels.data[i + 2] = avg;
        }
        return pixels;
    },
    greenScreen(pixels) {
        const levels = {};
        document.querySelectorAll('.rgb input').forEach(input => levels[input.name] = input.value);
        for (let i = 0; i < pixels.data.length; i += 4) {
            let red = pixels.data[i + 0];
            let green = pixels.data[i + 1];
            let blue = pixels.data[i + 2];
            let alpha = pixels.data[i + 3];
            if (red >= levels.rmin &&
                green >= levels.gmin &&
                blue >= levels.bmin &&
                red <= levels.rmax &&
                green <= levels.gmax &&
                blue <= levels.bmax) {
                // remove pixel
                pixels.data[i + 3] = 0;
            }
        }
        return pixels;
    }
}
