const audioConfig = {
  mainBg: {
    src: './src/assets/music/mainBg.mp3',
    volume: 0.1,
    loop: true
  },
  poetBg: {
    src: './src/assets/music/poetBg.mp3',
    volume: 0.22,
    loop: true
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

// Lógica para el modal de música
function showMusicModal() {
  const modal = document.getElementById('music-modal');
  if (modal) modal.style.display = 'flex';
}
function hideMusicModal() {
  const modal = document.getElementById('music-modal');
  if (modal) modal.style.display = 'none';
}
function enableMusic() {
  // Iniciar la primera canción del sidebar como música de fondo
  sidebarCurrent = 0;
  sidebarPlayCurrent();
  hideMusicModal();
}
function disableMusic() {
  hideMusicModal();
}
$(function() {
    setTimeout(() => {
      showMusicModal();
    }, 7000);
    setTimeout(() => {
      const yesBtn = document.getElementById('music-yes');
      const noBtn = document.getElementById('music-no');
      if (yesBtn) yesBtn.onclick = enableMusic;
      if (noBtn) noBtn.onclick = disableMusic;
    }, 0);
});
// window.onload = function() {
//   // Botones del modal
//   setTimeout(() => {
//     showMusicModal();
//   }, 5000);
//   setTimeout(() => {
//     const yesBtn = document.getElementById('music-yes');
//     const noBtn = document.getElementById('music-no');
//     if (yesBtn) yesBtn.onclick = enableMusic;
//     if (noBtn) noBtn.onclick = disableMusic;
//   }, 0);
// };

const pauseAllExcept = (...exceptions) => {
  Object.entries(audios).forEach(([key, audio]) => {
    if (!exceptions.includes(key)) {
      audio.pause();
    }
  });
};

// --- Cambios para que la música de fondo sea solo la del sidebar ---
// Eliminar lógica de audios.mainBg como música de fondo
// Al abrir/interactuar con un slide, pausar la música del sidebar
const handleSlideAudio = (poetAudio) => {
  sidebarPauseCurrent(); // Pausar música de fondo (sidebar)
  pauseAllExcept('poetBg', poetAudio);
  audios.poetBg.play();
  audios[poetAudio].play();
};
// Al cerrar el slide, reanudar la música del sidebar
$(document).ready(() => {
  // Eliminar el click original de #audioBtn que pausaba/reanudaba música
  $("#audioBtn").off("click").on("click", () => {
    openMusicSidebar();
  });

  $(".stop").click(() => {
    Object.entries(audios).forEach(([key, audio]) => {
      audio.pause();
      audio.currentTime = 0;
    });
    sidebarResumeCurrent(); // Reanudar música de fondo (sidebar)
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
// --- FIN SIDEBAR SOUNDCLOUD ---

// --- PLAYLIST DE MÚSICA DE FONDO (SIDEBAR SOUNDCLOUD STYLE) ---
const sidebarPlaylistConfig = [
  { title: "Can't Help Falling In Love", sub: 'Elvis Presley', src: './src/assets/music/playlist/1.mp3', volume: 0.2 },
  { title: 'Pasos de cero', sub: 'Pablo Alborán', src: './src/assets/music/playlist/2.mp3', volume: 0.1 },
  { title: '2 Much', sub: 'Justin Bieber', src: './src/assets/music/playlist/3.mp3', volume: 0.1 },
  { title: 'Deja Que Te Bese', sub: 'Alejandro Sanz Ft. Marc Anthony', src: './src/assets/music/playlist/4.mp3', volume: 0.05 },
  { title: 'Shinunoga E-Wa', sub: 'Fujii Kaze', src: './src/assets/music/playlist/5.mp3', volume: 0.1 },
  { title: 'Ordinary', sub: 'Alex Warren', src: './src/assets/music/playlist/6.mp3', volume: 0.1 },
  { title: 'Up', sub: 'Olly Murs Ft. Demi Lovato', src: './src/assets/music/playlist/7.mp3', volume: 0.1 },
  { title: 'Tus besos', sub: 'Juan Luis Guerra', src: './src/assets/music/playlist/8.mp3', volume: 0.1 },
  { title: 'The First Time', sub: 'Damiano David', src: './src/assets/music/playlist/9.mp3', volume: 0.1 },
  { title: 'I Wanna Be Yours', sub: 'Arctic Monkeys', src: './src/assets/music/playlist/10.mp3', volume: 0.1 },
  { title: 'Daylight', sub: 'David Kushner', src: './src/assets/music/playlist/11.mp3', volume: 0.1 }
];
let sidebarAudios = sidebarPlaylistConfig.map(track => {
  const audio = new Audio(track.src);
  audio.volume = typeof track.volume === 'number' ? track.volume : 1;
  return audio;
});
let sidebarCurrent = 0;
let sidebarIsPlaying = false;
let sidebarProgressDragging = false;

function openMusicSidebar() {
  document.getElementById('music-overlay').style.display = 'block';
  const sidebar = document.getElementById('music-sidebar');
  sidebar.style.display = 'flex';
  setTimeout(() => sidebar.classList.add('open'), 10);
  updateSidebarUI();
  updateSidebarProgress();
}
function closeMusicSidebar() {
  document.getElementById('music-overlay').style.display = 'none';
  const sidebar = document.getElementById('music-sidebar');
  sidebar.classList.remove('open');
  setTimeout(() => sidebar.style.display = 'none', 350);
}
function updateSidebarUI() {
  const track = sidebarPlaylistConfig[sidebarCurrent];
  document.getElementById('sidebar-song-title').textContent = track.title;
  document.getElementById('sidebar-song-sub').textContent = track.sub;
  document.getElementById('sidebar-current-title').textContent = 'Reproduciendo';
  document.getElementById('sidebar-playpause').innerHTML = sidebarIsPlaying ? '❚❚' : '▶';
  // Lista
  const playlistEl = document.getElementById('sidebar-playlist');
  playlistEl.innerHTML = '';
  sidebarPlaylistConfig.forEach((t, idx) => {
    const li = document.createElement('li');
    li.className = idx === sidebarCurrent ? 'active' : '';
    const title = document.createElement('span');
    title.className = 'sidebar-list-title';
    title.textContent = t.title;
    const sub = document.createElement('span');
    sub.className = 'sidebar-list-sub';
    sub.textContent = t.sub;
    li.appendChild(title);
    li.appendChild(sub);
    li.onclick = () => sidebarSelectSong(idx);
    playlistEl.appendChild(li);
  });
}
function sidebarSelectSong(idx) {
  sidebarPauseCurrent();
  sidebarCurrent = idx;
  sidebarPlayCurrent();
}
function sidebarPlayCurrent() {
  sidebarAudios[sidebarCurrent].currentTime = 0;
  sidebarAudios[sidebarCurrent].play();
  sidebarIsPlaying = true;
  updateSidebarUI();
}
function sidebarPauseCurrent() {
  sidebarAudios[sidebarCurrent].pause();
  sidebarIsPlaying = false;
  updateSidebarUI();
}
function sidebarResumeCurrent() {
  sidebarAudios[sidebarCurrent].play();
  sidebarIsPlaying = true;
  updateSidebarUI();
}
function sidebarNextSong() {
  sidebarPauseCurrent();
  sidebarCurrent = (sidebarCurrent + 1) % sidebarPlaylistConfig.length;
  sidebarPlayCurrent();
}
function sidebarPrevSong() {
  sidebarPauseCurrent();
  sidebarCurrent = (sidebarCurrent - 1 + sidebarPlaylistConfig.length) % sidebarPlaylistConfig.length;
  sidebarPlayCurrent();
}
function updateSidebarProgress() {
  const audio = sidebarAudios[sidebarCurrent];
  const progress = document.getElementById('sidebar-progress');
  const currentTime = document.getElementById('sidebar-current-time');
  const duration = document.getElementById('sidebar-duration');
  if (!audio.duration) {
    progress.style.width = '0%';
    currentTime.textContent = '0:00';
    duration.textContent = '0:00';
    return;
  }
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = percent + '%';
  currentTime.textContent = formatTime(audio.currentTime);
  duration.textContent = formatTime(audio.duration);
}
function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m + ':' + (s < 10 ? '0' : '') + s;
}
// Barra de progreso interactiva
const progressBar = document.getElementById('sidebar-progress-bar');
progressBar.addEventListener('mousedown', function(e) {
  sidebarProgressDragging = true;
  seekSidebarAudio(e);
});
progressBar.addEventListener('mousemove', function(e) {
  if (sidebarProgressDragging) seekSidebarAudio(e);
});
document.addEventListener('mouseup', function() {
  sidebarProgressDragging = false;
});
progressBar.addEventListener('touchstart', function(e) {
  sidebarProgressDragging = true;
  seekSidebarAudio(e.touches[0]);
});
progressBar.addEventListener('touchmove', function(e) {
  if (sidebarProgressDragging) seekSidebarAudio(e.touches[0]);
});
document.addEventListener('touchend', function() {
  sidebarProgressDragging = false;
});
function seekSidebarAudio(e) {
  const audio = sidebarAudios[sidebarCurrent];
  const rect = progressBar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const percent = Math.max(0, Math.min(1, x / rect.width));
  audio.currentTime = percent * audio.duration;
  updateSidebarProgress();
}
// Actualizar barra de progreso en tiempo real
sidebarAudios.forEach((audio, idx) => {
  audio.ontimeupdate = function() {
    if (idx === sidebarCurrent && !sidebarProgressDragging) updateSidebarProgress();
  };
  audio.onended = function() {
    sidebarNextSong();
  };
});
// Controles y apertura/cierre
setTimeout(() => {
  const audioBtn = document.getElementById('audioBtn');
  if (audioBtn) audioBtn.onclick = openMusicSidebar;
  document.getElementById('sidebar-close').onclick = closeMusicSidebar;
  document.getElementById('music-overlay').onclick = closeMusicSidebar;
  document.getElementById('sidebar-playpause').onclick = function() {
    if (sidebarIsPlaying) sidebarPauseCurrent();
    else sidebarResumeCurrent();
  };
}, 0);
// --- FIN SIDEBAR SOUNDCLOUD ---
