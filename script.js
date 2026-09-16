/* =========================================================
   Tony's On the Go — site interactions
   No framework, no build step — plain DOM APIs only.
   ========================================================= */

(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  document.addEventListener("DOMContentLoaded", function () {
    setFooterYear();
    initNavToggle();
    initSmoothScrollCleanup();
    initGallery();
    loadMenu();
    initQuoteForm();
  });

  /* -------------------- Footer year -------------------- */
  function setFooterYear() {
    var el = document.getElementById("year");
    if (el) {
      el.textContent = String(new Date().getFullYear());
    }
  }

  /* -------------------- Mobile nav toggle -------------------- */
  function initNavToggle() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (!toggle || !links) return;

    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      links.classList.remove("is-open");
    }

    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      links.classList.add("is-open");
    }

    toggle.addEventListener("click", function () {
      var isOpen = toggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the mobile menu after choosing a link, and let the browser
    // handle the actual scrolling via the native anchor + CSS smooth scroll.
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMenu();
      });
    });

    // Close on Escape for keyboard users.
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });

    // Close if resized back to desktop layout with menu open.
    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) {
        closeMenu();
      }
    });
  }

  /* -------------------- Smooth scroll -------------------- */
  // Scrolling itself is handled by CSS `scroll-behavior: smooth` (with a
  // prefers-reduced-motion override already in styles.css). This just makes
  // sure a hash link moves focus to the target section for keyboard/screen
  // reader users, since the browser doesn't always do that on its own.
  function initSmoothScrollCleanup() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function () {
        var id = a.getAttribute("href").slice(1);
        var target = id ? document.getElementById(id) : null;
        if (!target) return;
        window.setTimeout(function () {
          if (!target.hasAttribute("tabindex")) {
            target.setAttribute("tabindex", "-1");
          }
          target.focus({ preventScroll: true });
        }, prefersReducedMotion ? 0 : 350);
      });
    });
  }

  /* -------------------- Menu (coming soon / future live menu) -------------------- */
  function loadMenu() {
    var messageEl = document.getElementById("menu-message");
    var categoriesEl = document.getElementById("menu-categories");
    if (!categoriesEl) return;

    fetch("menu.json")
      .then(function (res) {
        if (!res.ok) throw new Error("menu.json request failed");
        return res.json();
      })
      .then(function (data) {
        renderMenu(data, messageEl, categoriesEl);
      })
      .catch(function () {
        // menu.json missing or malformed — the static "coming soon" copy
        // already in the HTML stands as-is, so fail quietly.
        categoriesEl.hidden = true;
      });
  }

  function renderMenu(data, messageEl, categoriesEl) {
    if (!data || typeof data !== "object") return;

    if (messageEl && typeof data.message === "string" && data.message.trim()) {
      messageEl.textContent = data.message;
    }

    var categories = Array.isArray(data.categories) ? data.categories : [];
    if (categories.length === 0) {
      categoriesEl.hidden = true;
      categoriesEl.innerHTML = "";
      return;
    }

    var frag = document.createDocumentFragment();

    categories.forEach(function (category) {
      if (!category || typeof category !== "object") return;
      var items = Array.isArray(category.items) ? category.items : [];

      var card = document.createElement("div");
      card.className = "menu-category";

      var heading = document.createElement("h3");
      heading.textContent = category.name || "Menu Category";
      card.appendChild(heading);

      items.forEach(function (item) {
        if (!item || typeof item !== "object") return;

        var row = document.createElement("div");
        row.className = "menu-item";

        var head = document.createElement("div");
        head.className = "menu-item-head";

        var name = document.createElement("span");
        name.textContent = item.name || "";
        head.appendChild(name);

        if (item.price !== null && item.price !== undefined && item.price !== "") {
          var price = document.createElement("span");
          price.textContent = String(item.price);
          head.appendChild(price);
        }

        row.appendChild(head);

        if (item.description) {
          var desc = document.createElement("p");
          desc.textContent = item.description;
          row.appendChild(desc);
        }

        card.appendChild(row);
      });

      frag.appendChild(card);
    });

    categoriesEl.innerHTML = "";
    categoriesEl.appendChild(frag);
    categoriesEl.hidden = false;
  }

  /* -------------------- Gallery lightbox -------------------- */
  function initGallery() {
    var grid = document.getElementById("galleryGrid");
    var lightbox = document.getElementById("lightbox");
    if (!grid || !lightbox) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll(".gallery-item"));
    if (items.length === 0) return;

    var img = document.getElementById("lightboxImg");
    var caption = document.getElementById("lightboxCaption");
    var closeBtn = document.getElementById("lightboxClose");
    var prevBtn = document.getElementById("lightboxPrev");
    var nextBtn = document.getElementById("lightboxNext");

    var currentIndex = 0;
    var lastFocused = null;

    function openAt(index) {
      currentIndex = (index + items.length) % items.length;
      var item = items[currentIndex];
      var full = item.getAttribute("data-full");
      var cap = item.getAttribute("data-caption") || "";
      var altSource = item.querySelector("img");

      img.src = full;
      img.alt = altSource ? altSource.alt : "";
      caption.textContent = cap;

      lastFocused = document.activeElement;
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function close() {
      lightbox.classList.remove("is-open");
      img.src = "";
      document.body.style.overflow = "";
      if (lastFocused && typeof lastFocused.focus === "function") {
        lastFocused.focus();
      }
    }

    function next() {
      openAt(currentIndex + 1);
    }

    function prev() {
      openAt(currentIndex - 1);
    }

    items.forEach(function (item, index) {
      item.addEventListener("click", function () {
        openAt(index);
      });
    });

    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Tab") trapFocus(e);
    });

    function trapFocus(e) {
      var focusable = lightbox.querySelectorAll("button");
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  /* -------------------- Quote form -------------------- */
  function initQuoteForm() {
    var form = document.getElementById("quoteForm");
    var statusEl = document.getElementById("formStatus");
    if (!form || !statusEl) return;

    var requiredFields = [
      { id: "qName", label: "your name" },
      { id: "qPhone", label: "a phone number" },
      { id: "qEmail", label: "a valid email address" },
      { id: "qDate", label: "an event date" },
      { id: "qEventType", label: "an event type" }
    ];

    // Mark fields as touched on blur so the CSS :invalid[data-touched] rule
    // only lights up after a real interaction, not on first render.
    requiredFields.forEach(function (f) {
      var el = document.getElementById(f.id);
      if (el) {
        el.addEventListener("blur", function () {
          el.setAttribute("data-touched", "true");
        });
      }
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      hideStatus();

      var errors = validate();
      if (Object.keys(errors).length > 0) {
        showErrors(errors);
        showStatus("Please fix the highlighted fields before sending.", "error");
        var firstErrorField = document.getElementById(Object.keys(errors)[0]);
        if (firstErrorField) firstErrorField.focus();
        return;
      }

      clearErrors();
      var mailtoUrl = buildMailto();
      window.location.href = mailtoUrl;
      showStatus(
        "Your email app should now be open with your quote request pre-filled to Tonysonthego24@gmail.com. Review it and hit send — nothing has been sent automatically, and no payment has been collected.",
        "success"
      );
    });

    function fieldValue(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : "";
    }

    function validate() {
      var errors = {};

      var name = fieldValue("qName");
      if (!name) errors.qName = "Please enter your name.";

      var phone = fieldValue("qPhone");
      var phoneDigits = phone.replace(/\D/g, "");
      if (!phone) {
        errors.qPhone = "Please enter a phone number.";
      } else if (phoneDigits.length < 10) {
        errors.qPhone = "Please enter a phone number with area code.";
      }

      var email = fieldValue("qEmail");
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email) {
        errors.qEmail = "Please enter your email address.";
      } else if (!emailPattern.test(email)) {
        errors.qEmail = "Please enter a valid email address.";
      }

      var date = fieldValue("qDate");
      if (!date) errors.qDate = "Please choose an event date.";

      var eventType = fieldValue("qEventType");
      if (!eventType) errors.qEventType = "Please choose an event type.";

      var guests = fieldValue("qGuests");
      if (guests && (isNaN(Number(guests)) || Number(guests) <= 0)) {
        errors.qGuests = "Guest count should be a positive number.";
      }

      return errors;
    }

    function showErrors(errors) {
      clearErrors();
      Object.keys(errors).forEach(function (id) {
        var errEl = document.getElementById("err-" + id);
        var inputEl = document.getElementById(id);
        if (errEl) errEl.textContent = errors[id];
        if (inputEl) inputEl.setAttribute("data-touched", "true");
      });
    }

    function clearErrors() {
      form.querySelectorAll(".field-error").forEach(function (el) {
        el.textContent = "";
      });
    }

    function showStatus(message, type) {
      statusEl.textContent = message;
      statusEl.className = "form-status is-visible " + type;
    }

    function hideStatus() {
      statusEl.textContent = "";
      statusEl.className = "form-status";
    }

    function buildMailto() {
      var serviceTypes = Array.prototype.slice
        .call(form.querySelectorAll('input[name="serviceType"]:checked'))
        .map(function (el) {
          return el.value;
        });

      var lines = [
        "New catering quote request from the website:",
        "",
        "Name: " + fieldValue("qName"),
        "Phone: " + fieldValue("qPhone"),
        "Email: " + fieldValue("qEmail"),
        "Event Date: " + fieldValue("qDate"),
        "Event Time: " + (fieldValue("qTime") || "Not specified"),
        "Event Location: " + (fieldValue("qLocation") || "Not specified"),
        "Event Type: " + fieldValue("qEventType"),
        "Estimated Guest Count: " + (fieldValue("qGuests") || "Not specified"),
        "Menu / Items of Interest: " + (fieldValue("qMenu") || "Not specified"),
        "Estimated Budget: " + (fieldValue("qBudget") || "Not specified"),
        "Service Type: " + (serviceTypes.length ? serviceTypes.join(", ") : "Not specified"),
        "Dietary Restrictions / Allergies: " + (fieldValue("qDietary") || "Not specified"),
        "Special Requests: " + (fieldValue("qNotes") || "Not specified")
      ];

      var subject = "Catering Quote Request — " + fieldValue("qName") + " — " + fieldValue("qEventType");
      var body = lines.join("\n");

      return (
        "mailto:Tonysonthego24@gmail.com" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body)
      );
    }
  }
})();
