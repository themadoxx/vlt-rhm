document.addEventListener("DOMContentLoaded", () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const questionEffect = {
        selector: ".question-box",
        tilt: 4,
        scale: 1.025,
        shadow: 14
    };

    const getOrCreateGlare = (item) => {
        let glare = item.querySelector(":scope > .glare");

        if (!glare) {
            glare = document.createElement("span");
            glare.className = "glare";
            item.appendChild(glare);
        }

        return glare;
    };

    const applyFollowEffect = (item, options) => {
        const glare = getOrCreateGlare(item);
        let frame = null;

        item.classList.add("tilt-follow");

        item.addEventListener("mousemove", (event) => {
            event.stopPropagation();

            if (frame) {
                cancelAnimationFrame(frame);
            }

            frame = requestAnimationFrame(() => {
                const rect = item.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const relativeX = (x / rect.width - 0.5) * 2;
                const relativeY = (y / rect.height - 0.5) * 2;
                const rotateY = relativeX * options.tilt;
                const rotateX = relativeY * -options.tilt;
                const shadowX = relativeX * -options.shadow;
                const shadowY = relativeY * -options.shadow;
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;

                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.12) 30%, transparent 62%)`;
                glare.style.opacity = "1";

                item.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${options.scale})`;
                item.style.filter = `drop-shadow(${shadowX}px ${shadowY}px 18px rgba(0, 0, 0, 0.22))`;
            });
        });

        item.addEventListener("mouseleave", () => {
            if (frame) {
                cancelAnimationFrame(frame);
                frame = null;
            }

            glare.style.opacity = "0";
            item.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
            item.style.filter = "";
        });
    };

    document.querySelectorAll(questionEffect.selector).forEach((item) => {
        applyFollowEffect(item, questionEffect);
    });
});
