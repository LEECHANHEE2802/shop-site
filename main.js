(function () {
  const root = document.documentElement;

  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Theme persist
  const themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    root.setAttribute("data-theme", savedTheme);
  } else {
    root.setAttribute("data-theme", "dark");
  }

  themeToggle?.addEventListener("click", () => {
    const cur = root.getAttribute("data-theme") === "light" ? "light" : "dark";
    const next = cur === "light" ? "dark" : "light";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });

  // Mobile menu
  const mobileBtn = document.getElementById("mobileMenuBtn");
  const mobileNav = document.getElementById("mobileNav");

  function closeMobile() {
    mobileNav?.classList.remove("show");
    mobileNav?.setAttribute("aria-hidden", "true");
  }

  mobileBtn?.addEventListener("click", () => {
    if (!mobileNav) return;
    const isOpen = mobileNav.classList.contains("show");
    if (isOpen) closeMobile();
    else {
      mobileNav.classList.add("show");
      mobileNav.setAttribute("aria-hidden", "false");
    }
  });

  mobileNav?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", closeMobile);
  });

  // Copy template
  const copyBtn = document.getElementById("copyTemplateBtn");
  const templateText = document.getElementById("templateText");
  const toast = document.getElementById("toast");

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    toast.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      toast.classList.remove("show");
      toast.setAttribute("aria-hidden", "true");
    }, 1400);
  }

  copyBtn?.addEventListener("click", async () => {
    try {
      const text = templateText?.textContent || "";
      await navigator.clipboard.writeText(text.trim());
      showToast();
    } catch (e) {
      // fallback
      const range = document.createRange();
      range.selectNodeContents(templateText);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
      document.execCommand("copy");
      sel?.removeAllRanges();
      showToast();
    }
  });

  // Scroll progress
  const bar = document.getElementById("progressBar");
  function updateProgress() {
    if (!bar) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, p))}%`;
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Accordion: only one open at a time
  const accordion = document.getElementById("accordion");
  if (accordion) {
    const items = Array.from(accordion.querySelectorAll("details"));
    items.forEach((d) => {
      d.addEventListener("toggle", () => {
        if (!d.open) return;
        items.forEach((other) => {
          if (other !== d) other.open = false;
        });
      });
    });
  }

  // Image modal (click to zoom)
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const modalBg = document.getElementById("modalBg");

  function openModal(src) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    if (modalImg) modalImg.src = "";
  }

  // Any element with data-src opens modal
  document.querySelectorAll("[data-src]").forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-src");
      if (src) openModal(src);
    });
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const src = el.getAttribute("data-src");
        if (src) openModal(src);
      }
    });
  });

  modalBg?.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
})();
