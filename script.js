/* Personal portfolio interactions.
   This file uses plain JavaScript; no framework is required. */

// 1. Mobile navigation menu
const menuToggle = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
const navItems = document.querySelectorAll(".nav-link");

function closeMenu() {
  navLinks.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
}

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navItems.forEach((item) => {
  item.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

// 2. Light/dark theme toggle. The preference is saved in this browser.
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const savedTheme = localStorage.getItem("jeslin-portfolio-theme");

function setTheme(isDark) {
  document.body.classList.toggle("dark-theme", isDark);
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeIcon.textContent = isDark ? "☀" : "☾";
  localStorage.setItem("jeslin-portfolio-theme", isDark ? "dark" : "light");
}

if (savedTheme === "dark") {
  document.body.classList.add("dark-theme");
  themeToggle.setAttribute("aria-pressed", "true");
  themeToggle.setAttribute("aria-label", "Switch to light mode");
  themeIcon.textContent = "☀";
}

themeToggle.addEventListener("click", () => {
  setTheme(!document.body.classList.contains("dark-theme"));
});

// 3. Filter project cards by category
const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.querySelector("#filter-status");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    let visibleCount = 0;

    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach((card) => {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });

    const categoryLabel = button.textContent.trim();
    filterStatus.textContent = selectedFilter === "all"
      ? `Showing all ${visibleCount} projects.`
      : `Showing ${visibleCount} ${categoryLabel} project${visibleCount === 1 ? "" : "s"}.`;
  });
});

// 4. Contact form validation (front-end demo only; it does not send messages)
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const fields = {
  name: document.querySelector("#name"),
  email: document.querySelector("#email"),
  message: document.querySelector("#message")
};
const errors = {
  name: document.querySelector("#name-error"),
  email: document.querySelector("#email-error"),
  message: document.querySelector("#message-error")
};

function setFieldError(fieldName, message) {
  fields[fieldName].setAttribute("aria-invalid", message ? "true" : "false");
  errors[fieldName].textContent = message;
}

function validateContactForm() {
  let isValid = true;
  const nameValue = fields.name.value.trim();
  const emailValue = fields.email.value.trim();
  const messageValue = fields.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  setFieldError("name", "");
  setFieldError("email", "");
  setFieldError("message", "");

  if (nameValue.length < 2) {
    setFieldError("name", "Please enter your name (at least 2 characters).");
    isValid = false;
  }
  if (!emailPattern.test(emailValue)) {
    setFieldError("email", "Please enter a valid email address.");
    isValid = false;
  }
  if (messageValue.length < 10) {
    setFieldError("message", "Please enter a message with at least 10 characters.");
    isValid = false;
  }

  return isValid;
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formStatus.textContent = "";

  if (!validateContactForm()) {
    formStatus.textContent = "Please correct the highlighted fields.";
    const firstInvalidField = contactForm.querySelector('[aria-invalid="true"]');
    if (firstInvalidField) firstInvalidField.focus();
    return;
  }

  formStatus.textContent = "The form looks good! This demo does not send messages; please use the email link to contact me.";
  contactForm.reset();
  Object.keys(fields).forEach((fieldName) => setFieldError(fieldName, ""));
});

// Clear a field's error when the visitor edits it.
Object.keys(fields).forEach((fieldName) => {
  fields[fieldName].addEventListener("input", () => {
    if (fields[fieldName].getAttribute("aria-invalid") === "true") {
      setFieldError(fieldName, "");
    }
  });
});

// 5. Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((item) => {
        const isActive = item.getAttribute("href") === `#${entry.target.id}`;
        item.classList.toggle("active", isActive);
      });
    });
  }, {
    root: null,
    rootMargin: "-25% 0px -60% 0px",
    threshold: 0
  });

  sections.forEach((section) => sectionObserver.observe(section));
}

// 6. Show the back-to-top button after scrolling down.
const backToTopButton = document.querySelector("#back-to-top");

function updateBackToTopButton() {
  backToTopButton.classList.toggle("visible", window.scrollY > 420);
}

window.addEventListener("scroll", updateBackToTopButton, { passive: true });
updateBackToTopButton();

backToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
});

// Keep the footer's year current automatically.
document.querySelector("#current-year").textContent = new Date().getFullYear();
