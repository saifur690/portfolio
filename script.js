// ==================== SELECT ELEMENTS ====================

const menuToggle = document.getElementById("menu-toggle");
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const header = document.querySelector(".header");
const sections = document.querySelectorAll("section[id]");
const revealElements = document.querySelectorAll(".reveal");

const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

// ==================== HERO LETTER REVEAL ====================

const heroTitle = document.querySelector(".hero-content h2");

if (heroTitle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const titleText = heroTitle.textContent;
    const letters = document.createDocumentFragment();
    let letterIndex = 0;

    heroTitle.setAttribute("aria-label", titleText);
    for (const character of titleText) {
        if (character === " ") {
            letters.append(document.createTextNode(" "));
            continue;
        }

        const letter = document.createElement("span");
        letter.className = "hero-title-letter";
        letter.textContent = character;
        letter.setAttribute("aria-hidden", "true");
        letter.style.animationDelay = `${450 + letterIndex * 200}ms`;
        letters.append(letter);
        letterIndex++;
    }
    heroTitle.replaceChildren(letters);
}


// ==================== SHARED POINTER TILT ====================

// A stationary wrapper keeps pointer coordinates stable while each surface rotates.
document.querySelectorAll(".info-card, .skill-card, .project-card, .service-card, .contact-form-wrapper").forEach((surface) => {
    const wrapper = document.createElement("div");
    wrapper.className = "card-tilt";
    surface.before(wrapper);
    wrapper.append(surface);
    surface.classList.add("tilt-surface");
});

document.querySelectorAll(".profile-tilt, .card-tilt").forEach((tiltTarget) => {
    const tiltMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const tiltPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let tiltFrame = 0;
    let pointerX = 0;
    let pointerY = 0;

    function resetTilt() {
        cancelAnimationFrame(tiltFrame);
        tiltFrame = 0;
        tiltTarget.classList.remove("is-tilting");
        tiltTarget.style.removeProperty("--tilt-x");
        tiltTarget.style.removeProperty("--tilt-y");
    }

    function updateTilt(event) {
        if (event.pointerType === "touch" || tiltMotion.matches || !tiltPointer.matches) return;
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (tiltFrame) return;

        tiltFrame = requestAnimationFrame(() => {
            tiltFrame = 0;
            const bounds = tiltTarget.getBoundingClientRect();
            if (!bounds.width || !bounds.height) return;
            const x = Math.max(-1, Math.min(1, (pointerX - bounds.left) / bounds.width * 2 - 1));
            const y = Math.max(-1, Math.min(1, (pointerY - bounds.top) / bounds.height * 2 - 1));
            tiltTarget.classList.add("is-tilting");
            tiltTarget.style.setProperty("--tilt-x", `${-y * 8}deg`);
            tiltTarget.style.setProperty("--tilt-y", `${x * 8}deg`);
        });
    }

    tiltTarget.addEventListener("pointerenter", updateTilt);
    tiltTarget.addEventListener("pointermove", updateTilt);
    tiltTarget.addEventListener("pointerleave", resetTilt);
    tiltTarget.addEventListener("pointercancel", resetTilt);
    window.addEventListener("blur", resetTilt);
    window.addEventListener("resize", resetTilt);
    window.addEventListener("scroll", resetTilt, { passive: true });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) resetTilt();
    });
    tiltMotion.addEventListener("change", resetTilt);
    tiltPointer.addEventListener("change", resetTilt);
});

// ==================== MOBILE MENU ====================

// Open and close the mobile navigation.
menuToggle.addEventListener("click", function () {
    navbar.classList.toggle("active");
    menuToggle.classList.toggle("active");

    const isOpen = navbar.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
});


// Close mobile menu after clicking a navigation link.
navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        navbar.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});


// ==================== HEADER ON SCROLL ====================

window.addEventListener("scroll", function () {
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


// ==================== ACTIVE NAVIGATION ====================

// Detect which section is currently visible.
window.addEventListener("scroll", function () {
    let currentSection = "";

    sections.forEach(function (section) {
        const sectionTop = section.offsetTop - 150;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(function (link) {
        link.classList.remove("active");

        const linkTarget = link.getAttribute("href");

        if (linkTarget === "#" + currentSection) {
            link.classList.add("active");
        }
    });
});


// ==================== SCROLL REVEAL ====================

// IntersectionObserver shows elements when they enter the screen.
const observer = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(function (element) {
    observer.observe(element);
});


// ==================== CONTACT FORM ====================

contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    formSuccess.textContent = "";

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    let isValid = true;

    if (name.value.trim() === "") {
        showError(name, "Please enter your name.");
        isValid = false;
    } else {
        clearError(name);
    }

    if (email.value.trim() === "") {
        showError(email, "Please enter your email.");
        isValid = false;
    } else if (!isValidEmail(email.value.trim())) {
        showError(email, "Please enter a valid email.");
        isValid = false;
    } else {
        clearError(email);
    }

    if (subject.value.trim() === "") {
        showError(subject, "Please enter a subject.");
        isValid = false;
    } else {
        clearError(subject);
    }

    if (message.value.trim() === "") {
        showError(message, "Please enter your message.");
        isValid = false;
    } else {
        clearError(message);
    }

    if (isValid) {
        formSuccess.textContent =
            "Your message is valid. Connect a backend or email service to send it.";

        contactForm.reset();
    }
});


// ==================== FORM ERROR ====================

function showError(input, message) {
    input.classList.add("error");

    const errorMessage =
        input.parentElement.querySelector(".error-message");

    errorMessage.textContent = message;
}


function clearError(input) {
    input.classList.remove("error");

    const errorMessage =
        input.parentElement.querySelector(".error-message");

    errorMessage.textContent = "";
}


// ==================== EMAIL CHECK ====================

function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}


// ==================== SMOOTH SCROLLING ====================

// CSS handles most smooth scrolling.
// This also handles internal links consistently.
const allInternalLinks = document.querySelectorAll('a[href^="#"]');

allInternalLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (targetId === "#") {
            return;
        }

        // The home header is fixed, so scrolling it into view does not move the page.
        if (targetId === "#home") {
            event.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                    ? "instant"
                    : "smooth"
            });
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ==================== END ====================
