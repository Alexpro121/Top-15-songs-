document.addEventListener('DOMContentLoaded', function() {
    // Отримуємо всі кнопки відтворення та аудіоплеєр
    const playButtons = document.querySelectorAll('.play-btn');
    const audioPlayer = document.getElementById('audio-player');
    let currentTrack = null; // Змінна для відстеження номера поточного треку
    let currentButtonElement = null; // Змінна для відстеження елемента поточної активної кнопки

    // Функція для скидання всіх кнопок до стану "Відтворити"
    function resetAllButtons() {
        playButtons.forEach(btn => {
            // Перевіряємо, чи це дійсно кнопка для треку (має data-track)
            if (btn.getAttribute('data-track')) {
               btn.innerHTML = '<i class="fas fa-play"></i> Відтворити';
            }
        });
    }

    // Додаємо обробник подій для кожної кнопки відтворення
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const trackNumber = this.getAttribute('data-track'); // Отримуємо номер треку з атрибута data-track

            // --- Сценарій 1: Натиснута та сама кнопка ---
            if (currentTrack === trackNumber) {
                if (audioPlayer.paused) {
                    // Якщо плеєр на паузі - відтворюємо і змінюємо іконку/текст на "Пауза"
                    audioPlayer.play().catch(error => {
                        console.error("Помилка відтворення аудіо:", error);
                        // Якщо не вдалося відтворити, скидаємо кнопку
                        this.innerHTML = '<i class="fas fa-play"></i> Відтворити';
                        currentTrack = null;
                        currentButtonElement = null;
                    });
                    this.innerHTML = '<i class="fas fa-pause"></i> Пауза'; // Оновлюємо текст/іконку кнопки
                } else {
                    // Якщо плеєр грає - ставимо на паузу і змінюємо іконку/текст на "Відтворити"
                    audioPlayer.pause();
                    this.innerHTML = '<i class="fas fa-play"></i> Відтворити'; // Оновлюємо текст/іконку кнопки
                }
            }
            // --- Сценарій 2: Натиснута нова кнопка ---
            else {
                // Спочатку скидаємо стан попередньої активної кнопки (якщо вона була)
                if (currentButtonElement) {
                    currentButtonElement.innerHTML = '<i class="fas fa-play"></i> Відтворити';
                }

                // Встановлюємо нове джерело аудіо (ВИПРАВЛЕНИЙ ШЛЯХ: без 'tracks/')
                audioPlayer.src = `${trackNumber}.mp3`;

                // Намагаємося відтворити новий трек
                audioPlayer.play().then(() => {
                    // Якщо відтворення почалося успішно:
                    this.innerHTML = '<i class="fas fa-pause"></i> Пауза'; // Оновлюємо натиснуту кнопку на "Пауза"
                    currentTrack = trackNumber;       // Оновлюємо номер поточного треку
                    currentButtonElement = this;      // Запам'ятовуємо поточну кнопку
                }).catch(error => {
                    // Якщо сталася помилка при спробі відтворення:
                    console.error("Помилка відтворення аудіо:", error);
                    alert(`Не вдалося відтворити трек ${trackNumber}.mp3. Перевірте файл.`);
                    // Скидаємо все
                    resetAllButtons();
                    currentTrack = null;
                    currentButtonElement = null;
                    audioPlayer.src = ""; // Очищаємо джерело, щоб уникнути подальших проблем
                });
            }
        });
    });

    // Обробник події: коли трек закінчив грати
    audioPlayer.addEventListener('ended', function() {
        if (currentButtonElement) {
            // Скидаємо кнопку поточного треку на "Відтворити"
            currentButtonElement.innerHTML = '<i class="fas fa-play"></i> Відтворити';
        }
        // Скидаємо інформацію про поточний трек
        currentTrack = null;
        currentButtonElement = null;
    });

    // Обробник події: помилка завантаження/відтворення аудіофайлу
    audioPlayer.addEventListener('error', function(e) {
        console.error("Помилка аудіо елемента:", e);
        // Якщо помилка сталася під час спроби завантажити/відтворити конкретний трек
        if (currentButtonElement && currentTrack) {
             alert(`Помилка завантаження файлу ${currentTrack}.mp3. Можливо, файл пошкоджено або відсутній за вказаним шляхом.`);
             currentButtonElement.innerHTML = '<i class="fas fa-play"></i> Відтворити'; // Скидаємо кнопку
        } else {
             // Загальна помилка аудіо елемента
             alert("Сталася помилка з аудіоплеєром.");
        }
        // Скидаємо стан
        currentTrack = null;
        currentButtonElement = null;
        audioPlayer.src = ""; // Очищаємо src при помилці
    });


    // --- Intersection Observer для анімації появи секцій при прокрутці ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Коли елемент стає видимим
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
            // Можна додати, щоб елемент знову ставав невидимим, коли виходить з поля зору
            // else {
            //     entry.target.style.opacity = '0';
            //     entry.target.style.transform = 'translateY(20px)';
            // }
        });
    }, {
        threshold: 0.1 // Анімація спрацює, коли видно хоча б 10% елемента
    });

    // Застосовуємо Observer до кожної секції з піснею
    document.querySelectorAll('.song-section').forEach(section => {
        // Початковий стан для анімації (невидимий та трохи зміщений)
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'; // Плавний перехід
        observer.observe(section); // Починаємо спостерігати за секцією
    });
});
