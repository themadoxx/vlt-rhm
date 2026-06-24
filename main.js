document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById('background-music');
    const muteButton = document.getElementById('mute-button');
    const icon = muteButton.querySelector("i");
    const videoPanel = document.querySelector(".video-aside-wrapper");
    const videoCard = document.querySelector(".aside.left"); // Video card
    const video = videoCard.querySelector("video"); // Get video element
    const clickButton = document.querySelector(".click-box button");
    const choiceBox = document.querySelector(".choice-box");
    const threedBox = document.querySelector(".threed-box");
    const questionText = document.querySelector(".question-box h1");
    const yesButton = document.querySelector(".choice-box button:first-child");
    const noButton = document.querySelector(".choice-box button:last-child");

    let partnerName = "Rihame"; // Replace with dynamic value
    let noClickCount = 0; // Counter for No button clicks
    let noButtonHasFled = false;
    const compactLayoutMedia = window.matchMedia("(max-width: 900px)");

    // Function to create typewriter effect
    function typeWriterEffect(element, text, speed = 100) {
        element.innerHTML = ""; // Clear previous text
        let i = 0;
        function typing() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                element.innerHTML += `<span class="typewriter"></span>`; // Cursor effect
            }
        }
        typing();
    }

    // Function to handle the click event
    function revealChoices() {
        audio.pause(); // Stop background music
        audio.currentTime = 0; // Reset music

        if (!compactLayoutMedia.matches) {
            videoPanel.classList.remove("hide"); // Show video column on desktop only
            video.play(); // Play the funny video
        }

        clickButton.style.display = "none"; // Hide the button
        choiceBox.classList.remove("hide"); // Show Yes/No options

        // Show partner name instantly
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="typed-text"></span>`;

        // Start typewriter effect for the second line
        const typedTextElement = document.querySelector(".typed-text");
        setTimeout(() => {
            typeWriterEffect(typedTextElement, "Est ce que tu m'aimeeeees ?");
        }, 500); // Delay to allow smooth transition
    }

    function createHearts() {
        const heartContainer = document.createElement("div");
        heartContainer.classList.add("heart-container");
        document.body.appendChild(heartContainer);
    
        for (let i = 0; i < 30; i++) {
            let heart = document.createElement("div");
            heart.classList.add("heart");
            
            // Random positioning and animation speed
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.animationDuration = Math.random() * 2 + 3 + "s";
            
            heartContainer.appendChild(heart);
        }
    
        // Remove hearts after animation ends
        setTimeout(() => {
            heartContainer.remove();
        }, 5000);
    }

    function expandRect(rect, margin) {
        return {
            left: rect.left - margin,
            right: rect.right + margin,
            top: rect.top - margin,
            bottom: rect.bottom + margin
        };
    }

    function rectsOverlap(first, second) {
        return !(
            first.right < second.left ||
            first.left > second.right ||
            first.bottom < second.top ||
            first.top > second.bottom
        );
    }

    function getDistanceToRect(point, rect) {
        const closestX = Math.max(rect.left, Math.min(point.x, rect.right));
        const closestY = Math.max(rect.top, Math.min(point.y, rect.bottom));
        return Math.hypot(point.x - closestX, point.y - closestY);
    }

    function getProtectedRects() {
        return [
            document.querySelector(".question-box"),
            yesButton,
            muteButton,
            document.querySelector(".video-card"),
            threedBox
        ].filter((element) => {
            if (!element || element === noButton) {
                return false;
            }

            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0;
        }).map((element) => expandRect(element.getBoundingClientRect(), 18));
    }

    function getSafeNoButtonPosition(origin, mode = "far") {
        const buttonRect = noButton.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const edgePadding = 14;
        const maxX = Math.max(edgePadding, viewportWidth - buttonRect.width - edgePadding);
        const maxY = Math.max(edgePadding, viewportHeight - buttonRect.height - edgePadding);
        const protectedRects = getProtectedRects();
        const candidates = [];
        const currentCenter = {
            x: buttonRect.left + buttonRect.width / 2,
            y: buttonRect.top + buttonRect.height / 2
        };

        if (mode === "nudge") {
            const awayAngle = Math.atan2(currentCenter.y - origin.y, currentCenter.x - origin.x);
            const angleOffsets = [0, -0.35, 0.35, -0.7, 0.7, -1, 1];

            [32, 42, 52, 62].forEach((distance) => {
                angleOffsets.forEach((offset) => {
                    const angle = awayAngle + offset;
                    candidates.push({
                        x: Math.min(maxX, Math.max(edgePadding, buttonRect.left + Math.cos(angle) * distance)),
                        y: Math.min(maxY, Math.max(edgePadding, buttonRect.top + Math.sin(angle) * distance))
                    });
                });
            });
        } else if (mode === "bottom") {
            const bottomMinY = Math.max(edgePadding, viewportHeight * 0.68);
            const bottomMaxY = maxY;

            [70, 105, 140, 175].forEach((horizontalDistance) => {
                [-1, 1].forEach((direction) => {
                    [-28, 0, 28, 56].forEach((verticalOffset) => {
                        candidates.push({
                            x: Math.min(maxX, Math.max(edgePadding, buttonRect.left + direction * horizontalDistance)),
                            y: Math.min(bottomMaxY, Math.max(bottomMinY, buttonRect.top + verticalOffset))
                        });
                    });
                });
            });

            for (let i = 0; i < 40; i++) {
                candidates.push({
                    x: edgePadding + Math.random() * (maxX - edgePadding),
                    y: bottomMinY + Math.random() * Math.max(1, bottomMaxY - bottomMinY)
                });
            }
        } else {
            [120, 180, 240, 300, 360, 420].forEach((distance) => {
                for (let step = 0; step < 12; step++) {
                    const angle = (Math.PI * 2 * step) / 12;
                    candidates.push({
                        x: Math.min(maxX, Math.max(edgePadding, origin.x + Math.cos(angle) * distance - buttonRect.width / 2)),
                        y: Math.min(maxY, Math.max(edgePadding, origin.y + Math.sin(angle) * distance - buttonRect.height / 2))
                    });
                }
            });

            for (let i = 0; i < 50; i++) {
                candidates.push({
                    x: edgePadding + Math.random() * (maxX - edgePadding),
                    y: edgePadding + Math.random() * (maxY - edgePadding)
                });
            }
        }

        return candidates
            .filter((candidate) => {
                const candidateRect = {
                    left: candidate.x,
                    right: candidate.x + buttonRect.width,
                    top: candidate.y,
                    bottom: candidate.y + buttonRect.height
                };

                return !protectedRects.some((rect) => rectsOverlap(candidateRect, rect));
            })
            .sort((first, second) => {
                const firstCenter = {
                    x: first.x + buttonRect.width / 2,
                    y: first.y + buttonRect.height / 2
                };
                const secondCenter = {
                    x: second.x + buttonRect.width / 2,
                    y: second.y + buttonRect.height / 2
                };
                const firstProtectionDistance = protectedRects.length
                    ? Math.min(...protectedRects.map((rect) => getDistanceToRect(firstCenter, rect)))
                    : 0;
                const secondProtectionDistance = protectedRects.length
                    ? Math.min(...protectedRects.map((rect) => getDistanceToRect(secondCenter, rect)))
                    : 0;
                const firstDistance = Math.hypot(firstCenter.x - origin.x, firstCenter.y - origin.y);
                const secondDistance = Math.hypot(secondCenter.x - origin.x, secondCenter.y - origin.y);
                const firstMoveDistance = Math.hypot(first.x - buttonRect.left, first.y - buttonRect.top);
                const secondMoveDistance = Math.hypot(second.x - buttonRect.left, second.y - buttonRect.top);
                const firstScore = mode === "nudge"
                    ? firstProtectionDistance - Math.abs(firstMoveDistance - 42) * 1.4
                    : mode === "bottom"
                        ? firstProtectionDistance + firstCenter.y * 0.4 - firstMoveDistance * 0.15
                        : firstDistance + firstProtectionDistance;
                const secondScore = mode === "nudge"
                    ? secondProtectionDistance - Math.abs(secondMoveDistance - 42) * 1.4
                    : mode === "bottom"
                        ? secondProtectionDistance + secondCenter.y * 0.4 - secondMoveDistance * 0.15
                        : secondDistance + secondProtectionDistance;

                return secondScore - firstScore;
            })[0];
    }

    function moveNoButtonAway(origin, mode = "far") {
        const buttonRect = noButton.getBoundingClientRect();

        choiceBox.classList.add("mobile-choice-game");
        noButton.classList.add("roaming-no");
        noButton.style.left = `${buttonRect.left}px`;
        noButton.style.top = `${buttonRect.top}px`;
        noButton.getBoundingClientRect();

        const nextPosition = getSafeNoButtonPosition(origin, mode);

        if (!nextPosition) {
            return;
        }

        requestAnimationFrame(() => {
            noButton.style.left = `${nextPosition.x}px`;
            noButton.style.top = `${nextPosition.y}px`;
        });
    }
    
    yesButton.addEventListener("click", function () {
        questionText.innerHTML = `<span class="partner-name">${partnerName}</span><br><span class="love-text">Je t'aimeeee baby ❤️</span>`;
        choiceBox.style.display = "none"; // Hide choices
        threedBox.classList.remove("hide");

        createHearts();
    });

    noButton.addEventListener("pointerenter", function (event) {
        if (event.pointerType !== "mouse" || noButtonHasFled) {
            return;
        }

        noButtonHasFled = true;
        moveNoButtonAway({
            x: event.clientX,
            y: event.clientY
        }, "nudge");
    });

      // Handle "No" button click
    noButton.addEventListener("click", function () {
        noClickCount++; // Increment No click count

        if (noClickCount < 8) {
            const newNoSize = Math.max(8, 16 - noClickCount * 1.6); // Reduce No button size
            const newYesSize = Math.min(72, 18 + noClickCount * 9); // Increase Yes button size

            noButton.style.fontSize = `${newNoSize}px`;
            noButton.style.padding = `${Math.max(4, newNoSize / 2)}px ${Math.max(8, newNoSize)}px`;

            yesButton.style.fontSize = `${newYesSize}px`;
            yesButton.style.padding = `${Math.max(10, newYesSize / 2.4)}px ${Math.max(18, newYesSize / 1.2)}px`;

            const noButtonRect = noButton.getBoundingClientRect();
            moveNoButtonAway({
                x: noButtonRect.left + noButtonRect.width / 2,
                y: noButtonRect.top + noButtonRect.height / 2
            }, "bottom");
        } else {
            noButton.style.display = "none"; // Hide No button after repeated clicks
            questionText.innerHTML += `<br><span class="no-choice-text">T'as vraiment cru que t'avais le choix ? 🤣</span>`;
        }
    });

    clickButton.addEventListener("click", revealChoices);
});
