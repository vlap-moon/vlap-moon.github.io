const audioConfig = {
  mainBg: {
    src: './src/assets/music/mainBg.mp3',
    volume: 0.1,
    loop: true
  },
  poetBg: {
    src: './src/assets/music/poetBg.mp3',
    volume: 0.22
  },
  poetTanto: {
    src: './src/assets/music/tanto.mp3',
    volume: 0.2
  },
  poetDistancia: {
    src: './src/assets/music/distancia.mp3',
    volume: 0.2
  },
  poetDia: {
    src: './src/assets/music/dia.mp3',
    volume: 0.2
  },
  poetVida: {
    src: './src/assets/music/vida.mp3',
    volume: 0.2
  }
};

const audios = {};
Object.entries(audioConfig).forEach(([key, config]) => {
  audios[key] = new Audio(config.src);
  audios[key].volume = config.volume;
  if (config.loop) audios[key].loop = true;
});

window.onload = function() {
  setTimeout(() => audios.mainBg.play(), 5000);
};

const pauseAllExcept = (...exceptions) => {
  Object.entries(audios).forEach(([key, audio]) => {
    if (!exceptions.includes(key)) {
      audio.pause();
    }
  });
};

const handleSlideAudio = (poetAudio) => {
  pauseAllExcept('poetBg', poetAudio);
  audios.poetBg.play();
  audios[poetAudio].play();
};

$(document).ready(() => {
  $("#audioBtn").click(() => {
    audios.mainBg.paused ? audios.mainBg.play() : audios.mainBg.pause();
  });

  $(".stop").click(() => {
    Object.entries(audios).forEach(([key, audio]) => {
      if (key !== 'mainBg') {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    audios.mainBg.play();
  });

  const slides = [
    { selector: ['#slide1', '.overlay-img-1'], audio: 'poetTanto' },
    { selector: ['#slide2', '.overlay-img-2'], audio: 'poetDistancia' },
    { selector: ['#slide3', '.overlay-img-3'], audio: 'poetDia' },
    { selector: ['#slide4', '.overlay-img-4'], audio: 'poetVida' }
  ];

  slides.forEach(slide => {
    slide.selector.forEach(selector => {
      $(selector).click(() => handleSlideAudio(slide.audio));
    });
  });
});