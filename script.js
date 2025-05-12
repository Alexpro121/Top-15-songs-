document.addEventListener('DOMContentLoaded', function() {
    const playButtons = document.querySelectorAll('.play-btn');
    const audioPlayer = document.getElementById('audio-player');
    let currentTrack = null;

    // Налаштування кнопок відтворення
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackNumber = this.getAttribute('data-track');
            
            if (currentTrack === trackNumber) {
                // Якщо натиснута кнопка поточної пісні
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    this.innerHTML = '<i class="fas fa-pause"></i> Відтворити';
                } else {
                    audioPlayer.pause();
                    this.innerHTML = '<i class="fas fa-play"></i> Відтворити';
                }
            } else {
                // Якщо натиснута кнопка нової пісні
                if (currentTrack) {
                    const prevButton = document.querySelector(`[data-track="${currentTrack}"]`);
                    prevButton.innerHTML = '<i class="fas fa-play"></i> Відтворити';
                }
                
                audioPlayer.src = `tracks/${trackNumber}.mp3`;
                audioPlayer.play();
                this.innerHTML = '<i class="fas fa-pause"></i> Відтворити';
                currentTrack = trackNumber;
            }
        });
    });

    // Скидання кнопки після завершення відтворення
    audioPlayer.addEventListener('ended', function() {
        const currentButton = document.querySelector(`[data-track="${currentTrack}"]`);
        if (currentButton) {
            currentButton.innerHTML = '<i class="fas fa-play"></i> Відтворити';
        }
        currentTrack = null;
    });

    // Анімація появи секцій при прокрутці
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.song-section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(section);
    });
}); 