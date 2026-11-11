    document.body.classList.add("js-motion");
    const topbar = document.querySelector(".topbar");
    const scrollProgress = document.getElementById("scrollProgress");
    const backToTop = document.getElementById("backToTop");
    const sections = [...document.querySelectorAll("#profile, #expertise, #projects, #memo")];
    const navLinks = [...document.querySelectorAll('.topbar nav a[href^="#"]')];

    function updateScrollUI() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      scrollProgress.style.width = `${Math.min(progress, 100)}%`;
      topbar.classList.toggle("is-scrolled", window.scrollY > 24);
      backToTop.classList.toggle("is-visible", window.scrollY > 420);
    }

    window.addEventListener("scroll", updateScrollUI, { passive: true });
    updateScrollUI();
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    const revealTargets = document.querySelectorAll(".project-card, .main-column .card, .side-column .card");
    revealTargets.forEach((card, index) => {
      card.classList.add("reveal");
      card.style.transitionDelay = `${(index % 3) * 70}ms`;
    });
    if ("IntersectionObserver" in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealTargets.forEach((card) => revealObserver.observe(card));
      const navObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            navLinks.forEach((link) => {
              if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
        });
      }, { rootMargin: "-25% 0px -65% 0px" });
      sections.forEach((section) => navObserver.observe(section));
    } else {
      revealTargets.forEach((card) => card.classList.add("is-visible"));
    }

    document.querySelectorAll("[data-dialog]").forEach((button) => {
      button.addEventListener("click", () => {
        const dialog = document.getElementById(button.dataset.dialog);
        if (dialog) dialog.showModal();
      });
    });
    document.querySelectorAll(".project-dialog").forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
      });
    });

    const photoInput = document.getElementById("photoInput");
    const profilePhoto = document.getElementById("profilePhoto");
    const photoFrame = document.getElementById("photoFrame");

    photoInput.addEventListener("change", () => {
      const file = photoInput.files && photoInput.files[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        photoInput.value = "";
        return;
      }
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (typeof reader.result === "string") {
          profilePhoto.src = reader.result;
          photoFrame.classList.add("has-photo");
        }
      });
      reader.readAsDataURL(file);
    });

    const memoForm = document.getElementById("memoForm");
    const memoNotice = document.getElementById("memoNotice");

    memoForm.addEventListener("submit", (event) => {
      event.preventDefault();
      memoNotice.textContent = "";
      const name = document.getElementById("memoName").value.trim();
      const subject = document.getElementById("memoSubject").value.trim();
      const phone = document.getElementById("memoPhone").value.trim();
      const email = document.getElementById("memoEmail").value.trim();
      const message = document.getElementById("memoMessage").value.trim();
      if (!name || !subject || !message) {
        memoNotice.textContent = "이름, 제목, 메시지를 모두 입력해 주세요.";
        document.getElementById(!name ? "memoName" : !subject ? "memoSubject" : "memoMessage").focus();
        return;
      }
      if (!email && !phone) {
        memoNotice.textContent = "연락 가능한 이메일 또는 전화번호를 입력해 주세요.";
        document.getElementById("memoEmail").focus();
        return;
      }
      const body = [
        `이름: ${name}`,
        `제목: ${subject}`,
        `이메일: ${email || "미입력"}`,
        `전화번호: ${phone || "미입력"}`,
        "",
        "메시지:",
        message
      ].join("\n");
      window.location.href = `mailto:winho2@naver.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
