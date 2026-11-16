"use strict";
const topbar = document.querySelector(".topbar");
const progress = document.getElementById("scrollProgress");
const backToTop = document.getElementById("backToTop");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let scrollQueued = false;
function updateScrollUI() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${total > 0 ? Math.min(100, window.scrollY / total * 100) : 0}%`;
  topbar.classList.toggle("is-scrolled", window.scrollY > 20);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
  scrollQueued = false;
}
window.addEventListener("scroll", () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateScrollUI); }
}, { passive: true });
window.addEventListener("resize", updateScrollUI);
updateScrollUI();
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "instant" : "smooth" }));
document.getElementById("year").textContent = new Date().getFullYear();
const navLinks = [...document.querySelectorAll("nav a")];
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          if (link.hash === `#${entry.target.id}`) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
    });
  }, { rootMargin: "-15% 0px -45% 0px", threshold: 0 });
  document.querySelectorAll("main > section").forEach(section => navObserver.observe(section));
}
const copyButton = document.getElementById("copyEmail");
const copyNotice = document.getElementById("copyNotice");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("winho2@naver.com");
    copyNotice.textContent = "\uc774\uba54\uc77c \uc8fc\uc18c\ub97c \ubcf5\uc0ac\ud588\uc2b5\ub2c8\ub2e4.";
  } catch {
    copyNotice.textContent = "\ubcf5\uc0ac\uac00 \uc9c0\uc6d0\ub418\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4. winho2@naver.com\uc744 \uc9c1\uc811 \ubcf5\uc0ac\ud574 \uc8fc\uc138\uc694.";
  }
});

const memoForm = document.getElementById("memoForm");
const memoNotice = document.getElementById("memoNotice");
memoForm.addEventListener("submit", event => {
  event.preventDefault();
  memoNotice.textContent = "";
  const name = document.getElementById("memoName").value.trim();
  const subject = document.getElementById("memoSubject").value.trim();
  const email = document.getElementById("memoEmail").value.trim();
  const phone = document.getElementById("memoPhone").value.trim();
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
  const body = [`이름: ${name}`, `제목: ${subject}`, `이메일: ${email || "미입력"}`, `전화번호: ${phone || "미입력"}`, "", "메시지:", message].join("\n");
  window.location.href = `mailto:winho2@naver.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  memoNotice.textContent = "메일 앱에서 내용을 확인하고 전송해 주세요.";
});
