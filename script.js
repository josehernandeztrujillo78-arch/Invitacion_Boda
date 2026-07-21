/* ============================================
   Ana & Diego · Lógica de la invitación
   ============================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Cuenta regresiva ---------- */
  const weddingDate = new Date("2026-09-12T16:00:00").getTime();
  const el = {
    days: document.getElementById("days"),
    hours: document.getElementById("hours"),
    minutes: document.getElementById("minutes"),
    seconds: document.getElementById("seconds"),
  };

  const pad = (n) => String(n).padStart(2, "0");

  function updateCountdown() {
    const diff = weddingDate - Date.now();

    if (diff <= 0) {
      if (el.days) el.days.textContent = "00";
      if (el.hours) el.hours.textContent = "00";
      if (el.minutes) el.minutes.textContent = "00";
      if (el.seconds) el.seconds.textContent = "00";
      return false;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    if (el.days) el.days.textContent = pad(days);
    if (el.hours) el.hours.textContent = pad(hours);
    if (el.minutes) el.minutes.textContent = pad(minutes);
    if (el.seconds) el.seconds.textContent = pad(seconds);
    return true;
  }

  if (el.days) {
    updateCountdown();
    const timer = setInterval(() => {
      if (!updateCountdown()) clearInterval(timer);
    }, 1000);
  }

  /* ---------- Música de fondo ---------- */
  const music = document.getElementById("music");
  const musicBtn = document.getElementById("musicBtn");

  if (music && musicBtn) {
    musicBtn.addEventListener("click", async () => {
      try {
        if (music.paused) {
          await music.play();
          musicBtn.classList.add("playing");
          musicBtn.setAttribute("aria-pressed", "true");
          musicBtn.setAttribute("aria-label", "Pausar música de fondo");
        } else {
          music.pause();
          musicBtn.classList.remove("playing");
          musicBtn.setAttribute("aria-pressed", "false");
          musicBtn.setAttribute("aria-label", "Reproducir música de fondo");
        }
      } catch (err) {
        console.log("[v0] No se pudo reproducir el audio:", err.message);
      }
    });
  }

  /* ---------- Copiar CLABE ---------- */
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy") || "";
      try {
        await navigator.clipboard.writeText(value);
        const original = btn.textContent;
        btn.textContent = "¡Copiado!";
        setTimeout(() => (btn.textContent = original), 1800);
      } catch (err) {
        console.log("[v0] No se pudo copiar:", err.message);
      }
    });
  });

  /* ---------- Mesa de regalos (mostrar/ocultar lista) ---------- */
  const giftToggle = document.getElementById("giftToggle");
  const giftList = document.getElementById("giftList");

  if (giftToggle && giftList) {
    giftToggle.addEventListener("click", () => {
      const isOpen = !giftList.hasAttribute("hidden");
      if (isOpen) {
        giftList.setAttribute("hidden", "");
        giftToggle.setAttribute("aria-expanded", "false");
        giftToggle.textContent = "Ver Mesa de Regalos";
      } else {
        giftList.removeAttribute("hidden");
        giftToggle.setAttribute("aria-expanded", "true");
        giftToggle.textContent = "Ocultar Mesa de Regalos";
      }
    });
  }

  /* ---------- Formulario RSVP → WhatsApp ---------- */
  const form = document.getElementById("rsvpForm");
  const feedback = document.getElementById("rsvpFeedback");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("#name");
      const guests = form.querySelector("#guests");
      const message = form.querySelector("#message");

      if (!name.value.trim()) {
        if (feedback) feedback.textContent = "Por favor escribe tu nombre.";
        name.focus();
        return;
      }

      // Botón que envió el formulario (novia o novio)
      const submitter = e.submitter || form.querySelector("[data-wa]");
      const phone = submitter ? submitter.getAttribute("data-wa") : "";
      const family = submitter ? submitter.getAttribute("data-family") : "";

      if (!phone) {
        if (feedback) feedback.textContent = "Elige a qué familia confirmar.";
        return;
      }

      // Construir el mensaje de WhatsApp con los datos ingresados
      const lines = [
        "Hola! Confirmo mi asistencia a la boda de Ana y Diego.",
        `Nombre: ${name.value.trim()}`,
        `Numero de invitados: ${guests.value}`,
      ];
      if (message.value.trim()) {
        lines.push(`Mensaje: ${message.value.trim()}`);
      }
      const text = encodeURIComponent(lines.join("\n"));
      const waUrl = `https://wa.me/${phone}?text=${text}`;

      if (feedback) {
        feedback.textContent = `¡Gracias, ${name.value.trim()}! Abriendo WhatsApp de la ${family}...`;
      }

      launchConfetti();
      window.open(waUrl, "_blank", "noopener,noreferrer");
      form.reset();
    });
  }

  /* ---------- Confeti ---------- */
  function launchConfetti() {
    if (typeof confetti !== "function") return;
    const colors = ["#6b7255", "#b08d57", "#f7f2ea", "#fffdf9"];
    const end = Date.now() + 1200;

    (function frame() {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }
});


const musicBtn = document.getElementById("musicBtn");
const bgMusic = document.getElementById("bgMusic");

// Intentar reproducir automáticamente
window.addEventListener("load", () => {
  bgMusic.volume = 0.5; // Volumen (0.0 a 1.0)

  bgMusic.play().then(() => {
    musicBtn.setAttribute("aria-pressed", "true");
  }).catch(() => {
    console.log("El navegador requiere una interacción del usuario para reproducir el audio.");
  });
});

// Botón para pausar/reanudar
musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.play();
    musicBtn.setAttribute("aria-pressed", "true");
  } else {
    bgMusic.pause();
    musicBtn.setAttribute("aria-pressed", "false");
  }
});