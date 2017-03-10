const gifshot = require('gifshot');

const effects = require('./effects');

const video = document.querySelector('.player');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const snapPhotoButton = document.querySelector('button.takePhoto');
const clearPhotosButton = document.querySelector('button.clearStrip');

function recordCanvas() {
    let chunks = [];
    let stream = canvas.captureStream(25);
    let options = { mimeType: 'video/webm;codecs=vp9' };
    let recorder = new MediaRecorder(stream, options);
    recorder.start();
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = (e) => {
        let blob = new Blob(chunks, { type: 'video/webm' });
        let v = document.createElement('video');
        v.id = 'blobby';
        v.src = window.URL.createObjectURL(blob);
        v.hidden = true;
        document.body.appendChild(v);
        console.log(v);
        createGIF(v.src);
        // v.loop = true;
        // v.play();
    }
    setTimeout(() => {
        recorder.stop();
    }, 2000);
}

function createGIF(videos) {
    gifshot.createGIF({
        'video': videos
    }, (obj) => {
        let image = obj.image;
        let animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
    })
}

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(localMediaStream => {
            video.src = window.URL.createObjectURL(localMediaStream);
            video.play();
        })
        .catch(err => {
            console.error('OHHH NOOOOOEEES!!! ', err);
            alert('You denied the webcam access... maybe you should not do that?');
        });
}



function createImageGIF() {
    if (strip.children.length === 0) return;
    let images = Array.from(document.querySelectorAll('.strip a img')).map(img => img.src);
    gifshot.createGIF({
        'images': images
    }, (obj) => {
        let image = obj.image;
        let animatedImage = document.createElement('img');
        animatedImage.src = image;
        document.body.appendChild(animatedImage);
    });
    clearStrip();
}

function paintToCanvas() {
    // recordCanvas();
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;
    positionVideo();
    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        let pixels = ctx.getImageData(0, 0, width, height);
        // pixels = effects.rgbSplit(pixels);
        ctx.putImageData(pixels, 0, 0);
    }, 20);
}

function takePhoto() {
    snap.currentTime = 0;
    snap.play();
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'sexy');
    link.innerHTML = `<img src="${data}" alt="sexy human" />`;
    strip.insertBefore(link, strip.firstChild);
}

function takeVideo(type, buffer) {
    const data = type === 'video' ? window.URL.createObjectURL(new Blob(buffer)) : canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.setAttribute('download', 'sexy');
    const tag = type === 'video' ? 'video' : 'img';
    link.innerHTML = `<${tag} src="${data}" />`;
    link.href = data;
    strip.insertBefore(link, strip.firstChild);
}

function positionVideo() {
    let canvasCoords = canvas.getBoundingClientRect();
    let videoCoords = video.getBoundingClientRect();
    let coords = {
        x: canvasCoords.right - videoCoords.right,
        y: canvasCoords.top - videoCoords.top
    }
    video.style.transform = `translate(${coords.x}px, ${coords.y}px)`;
}

function clearStrip() {
    let photos = document.querySelectorAll('.strip a');
    if (photos.length) {
        photos.forEach(photo => strip.removeChild(photo))
    } else {
        console.log('ashdksa');
    };
    // clearPhotosButton.style.display = 'none';
}
getVideo();
// document.querySelector('.start').addEventListener('click', () => getVideo());
video.addEventListener('canplay', paintToCanvas);
snapPhotoButton.addEventListener('click', takePhoto);
clearPhotosButton.addEventListener('click', clearStrip);
document.querySelector('.makeGIF').addEventListener('click', createImageGIF);
