document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('background-music');
    const video = document.querySelector(".aside.left video");
    const muteButton = document.getElementById('mute-button');
    const icon = muteButton.querySelector("i"); // Get the icon inside the button

    // Set default volume and loop
    audio.volume = 1;
    video.volume = 1;
    audio.loop = true;
    video.loop = false;

    audio.play().catch(error => {
        console.log('Autoplay was prevented. User interaction needed.');
    });

    // Mute/Unmute both background music and video
    muteButton.addEventListener("click", function () {
        let isMuted = !audio.muted; // Toggle mute state

        audio.muted = isMuted;
        video.muted = isMuted;

        // Change mute icon dynamically
        icon.className = isMuted ? "fa fa-volume-off" : "fa fa-volume-up";
    });
});
