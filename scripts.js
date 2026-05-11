/* ══════════════════════════════════════════════
   Nova Dashboard · macOS Edition — scripts.js
   ══════════════════════════════════════════════ */

const App = {
  quickLinks: [],
  settings: {
    theme: "light",
    searchEngine: "google",
    userName: "",
    weatherLocation: "",
    bgBlur: "0",
    bgDim: "18",
    glassPreset: "balanced",
    customBackground: null,
  },
  searchEngines: {
    google:     { name: "Google",     icon: "fab fa-google",    url: "https://google.com/search",   q: "q" },
    bing:       { name: "Bing",       icon: "fab fa-microsoft", url: "https://www.bing.com/search", q: "q" },
    duckduckgo: { name: "DuckDuckGo", icon: "fas fa-shield-alt",url: "https://duckduckgo.com/",     q: "q" },
  },
  defaultLinks: [
    { name: "ChatGPT", url: "https://chat.openai.com",      icon: "fas fa-robot",    color: "#10a37f" },
    { name: "GitHub",  url: "https://github.com",            icon: "fab fa-github",   color: "#6e40c9" },
    { name: "Gmail",   url: "https://mail.google.com",       icon: "fas fa-envelope", color: "#ea4335" },
    { name: "YouTube", url: "https://youtube.com",           icon: "fab fa-youtube",  color: "#ff0000" },
    { name: "Gemini",  url: "https://gemini.google.com",     icon: "fas fa-gem",      color: "#8e24aa" },
    { name: "Figma",   url: "https://figma.com",             icon: "fab fa-figma",    color: "#f24e1e" },
  ],
  motivations: [
    "What are we accomplishing today?",
    "Make today count.",
    "Every moment is a fresh beginning.",
    "Focus. Create. Inspire.",
    "Great things take time — start now.",
    "Build something you're proud of.",
  ],
  dragged: null,
  refs: {},
};

// ─── DOM Cache ────────────────────────────────────────────
function cacheRefs() {
  App.refs = {
    html:                 document.documentElement,
    body:                 document.body,
    appContainer:         document.getElementById("app-container"),
    sidebar:              document.getElementById("sidebar"),
    sidebarOverlay:       document.getElementById("sidebar-overlay"),
    sidebarToggle:        document.getElementById("sidebar-toggle"),
    closeSidebar:         document.getElementById("close-sidebar"),
    clock:                document.getElementById("clock"),
    date:                 document.getElementById("date"),
    weatherEl:            document.getElementById("weather"),
    tempEl:               document.getElementById("temperature"),
    greeting:             document.getElementById("greeting"),
    motivation:           document.getElementById("motivation"),
    themeToggle:          document.getElementById("theme-toggle"),
    searchEngineBtn:      document.getElementById("search-engine-btn"),
    searchEngineIcon:     document.getElementById("search-engine-icon"),
    searchEngineDropdown: document.getElementById("search-engine-dropdown"),
    searchForm:           document.getElementById("search-form"),
    searchInput:          document.getElementById("search-input"),
    searchBtn:            document.getElementById("search-btn"),
    sendBtn:              document.getElementById("send-btn"),
    voiceBtn:             document.getElementById("voice-btn"),
    chatContainer:        document.getElementById("chat-container"),
    quickLinksGrid:       document.getElementById("quick-links-grid"),
    sidebarLinksList:     document.getElementById("sidebar-links-list"),
    addLinkModal:         document.getElementById("add-link-modal"),
    addLinkForm:          document.getElementById("add-link-form"),
    closeLinkModal:       document.getElementById("close-link-modal"),
    cancelLinkBtn:        document.getElementById("cancel-link-btn"),
    modalTitle:           document.getElementById("modal-title"),
    saveLinkBtn:          document.getElementById("save-link-btn"),
    linkName:             document.getElementById("link-name"),
    linkUrl:              document.getElementById("link-url"),
    iconSelect:           document.getElementById("icon-select"),
    iconPreview:          document.getElementById("icon-preview"),
    linkColor:            document.getElementById("link-color"),
    settingsBtn:          document.getElementById("settings-btn"),
    settingsModal:        document.getElementById("settings-modal"),
    closeSettingsModal:   document.getElementById("close-settings-modal"),
    customBgUpload:       document.getElementById("custom-bg-upload"),
    customBgBtn:          document.getElementById("custom-bg-btn"),
    resetBgBtn:           document.getElementById("reset-bg-btn"),
    blurAmount:           document.getElementById("blur-amount"),
    blurValue:            document.getElementById("blur-value"),
    dimAmount:            document.getElementById("dim-amount"),
    dimValue:             document.getElementById("dim-value"),
    glassPresets:         document.getElementById("glass-presets"),
    userNameInput:        document.getElementById("user-name"),
    weatherLocationInput: document.getElementById("weather-location"),
    resetSettingsBtn:     document.getElementById("reset-settings-btn"),
    saveSettingsBtn:      document.getElementById("save-settings-btn"),
  };
}

// ─── Storage ─────────────────────────────────────────────
function loadData() {
  try {
    const links = localStorage.getItem("nova_links");
    App.quickLinks = links ? JSON.parse(links) : [...App.defaultLinks];
  } catch { App.quickLinks = [...App.defaultLinks]; }

  try {
    const saved = localStorage.getItem("nova_settings");
    if (saved) App.settings = { ...App.settings, ...JSON.parse(saved) };
  } catch {}
}

function save(key = "all") {
  try {
    if (key === "all" || key === "links")
      localStorage.setItem("nova_links", JSON.stringify(App.quickLinks));
    if (key === "all" || key === "settings")
      localStorage.setItem("nova_settings", JSON.stringify(App.settings));
  } catch (e) { console.warn("Save failed:", e); }
}

// ─── Sidebar ─────────────────────────────────────────────
function setupSidebar() {
  const { sidebar, sidebarOverlay, sidebarToggle, closeSidebar, appContainer } = App.refs;

  function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
    appContainer.classList.add("sidebar-open");
    sidebarToggle?.setAttribute("aria-expanded", "true");
  }

  function closeSidebarFn() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
    appContainer.classList.remove("sidebar-open");
    sidebarToggle?.setAttribute("aria-expanded", "false");
  }

  sidebarToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    sidebar.classList.contains("open") ? closeSidebarFn() : openSidebar();
  });

  closeSidebar?.addEventListener("click", closeSidebarFn);
  sidebarOverlay?.addEventListener("click", closeSidebarFn);

  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !sidebarToggle?.contains(e.target)
    ) closeSidebarFn();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebarFn();
  });
}

// ─── Theme ───────────────────────────────────────────────
const THEME_CYCLE = ["light", "dark", "midnight", "purple", "rose", "green"];
const GLASS_PRESETS = {
  soft: { blur: 8, dim: 10 },
  balanced: { blur: 14, dim: 18 },
  frosted: { blur: 18, dim: 28 },
  crystal: { blur: 20, dim: 8 },
};

function applyTheme(name) {
  App.refs.html.setAttribute("data-theme", name);
  App.settings.theme = name;
  save("settings");

  // Update swatch active state
  document.querySelectorAll(".theme-swatch").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === name);
  });

  // Update theme toggle icon
  const isDark = ["dark", "midnight"].includes(name);
  const icon = App.refs.themeToggle?.querySelector("i");
  if (icon) icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
}

function setupTheme() {
  applyTheme(App.settings.theme || "light");

  // Swatch clicks
  document.querySelectorAll(".theme-swatch").forEach((btn) => {
    btn.addEventListener("click", () => applyTheme(btn.dataset.theme));
  });

  // Filter tabs
  document.querySelectorAll(".tab-btn").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const cat = tab.dataset.category;
      document.querySelectorAll(".theme-swatch").forEach((s) => {
        s.style.display = (cat === "all" || s.dataset.category === cat) ? "" : "none";
      });
    });
  });

  // Cycle button (menubar)
  App.refs.themeToggle?.addEventListener("click", () => {
    const idx = THEME_CYCLE.indexOf(App.settings.theme);
    applyTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  });
}

// ─── Clock & Date ─────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const hh = now.getHours().toString().padStart(2, "0");
  const mm = now.getMinutes().toString().padStart(2, "0");

  if (App.refs.clock) App.refs.clock.textContent = `${hh}:${mm}`;
  if (App.refs.date) {
    App.refs.date.textContent = now.toLocaleDateString(undefined, {
      weekday: "short", month: "short", day: "numeric",
    });
  }

  // Greeting
  const h = now.getHours();
  let g = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  if (App.settings.userName) g += `, ${App.settings.userName}`;
  if (App.refs.greeting) App.refs.greeting.textContent = g;
}

// ─── Motivation ───────────────────────────────────────────
function setMotivation() {
  if (App.refs.motivation) {
    const list = App.motivations;
    App.refs.motivation.textContent = list[Math.floor(Math.random() * list.length)];
  }
}

// ─── Weather ─────────────────────────────────────────────
async function fetchWeather() {
  const apiKey = localStorage.getItem("weatherApiKey");
  if (!apiKey || !App.refs.tempEl) return;

  try {
    const loc = App.settings.weatherLocation || "auto:ip";
    const url = loc !== "auto:ip"
      ? `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(loc)}&units=metric&appid=${apiKey}`
      : null;

    if (!url && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const r = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&units=metric&appid=${apiKey}`
        );
        renderWeather(await r.json());
      });
    } else if (url) {
      const r = await fetch(url);
      renderWeather(await r.json());
    }
  } catch {}
}

function renderWeather(data) {
  if (!data?.main) return;
  if (App.refs.tempEl) App.refs.tempEl.textContent = `${Math.round(data.main.temp)}°C`;
  const wi = App.refs.weatherEl?.querySelector("i");
  if (!wi) return;
  const id = data.weather?.[0]?.id ?? 800;
  wi.className =
    id >= 200 && id < 300 ? "fas fa-bolt" :
    id >= 500 && id < 600 ? "fas fa-cloud-showers-heavy" :
    id >= 600 && id < 700 ? "fas fa-snowflake" :
    id === 800             ? "fas fa-sun" :
                             "fas fa-cloud-sun";
}

// ─── Search ──────────────────────────────────────────────
function setupSearch() {
  const { searchEngineBtn, searchEngineDropdown, searchForm, searchBtn, sendBtn, voiceBtn } = App.refs;
  updateEngineDisplay();

  searchEngineBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchEngineDropdown.classList.toggle("open");
  });
  document.addEventListener("click", () => searchEngineDropdown?.classList.remove("open"));

  document.querySelectorAll(".engine-option").forEach((opt) => {
    opt.addEventListener("click", () => {
      App.settings.searchEngine = opt.dataset.engine;
      save("settings");
      updateEngineDisplay();
      searchEngineDropdown.classList.remove("open");
    });
  });

  searchForm?.addEventListener("submit", (e) => { e.preventDefault(); performSearch(); });
  searchBtn?.addEventListener("click",   (e) => { e.preventDefault(); performSearch(); });
  sendBtn?.addEventListener("click",     (e) => { e.preventDefault(); handleAI(); });
  voiceBtn?.addEventListener("click",    (e) => {
    e.preventDefault();
    startVoiceInput();
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      App.refs.searchInput?.focus();
    }

    if (e.altKey && e.key.toLowerCase() === "s") {
      e.preventDefault();
      App.refs.sidebarToggle?.click();
    }

    if (e.altKey && e.key.toLowerCase() === "t") {
      e.preventDefault();
      App.refs.themeToggle?.click();
    }

    if (e.altKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      document.getElementById("add-quick-link-main")?.click();
    }
  });
}

function updateEngineDisplay() {
  const eng = App.searchEngines[App.settings.searchEngine];
  if (!eng || !App.refs.searchEngineIcon) return;
  App.refs.searchEngineIcon.className = eng.icon;
  document.querySelectorAll(".engine-option").forEach((o) => {
    o.classList.toggle("active", o.dataset.engine === App.settings.searchEngine);
  });
}

function performSearch() {
  const q = App.refs.searchInput?.value.trim();
  if (!q) return;
  const eng = App.searchEngines[App.settings.searchEngine];
  window.open(`${eng.url}?${eng.q}=${encodeURIComponent(q)}`, "_blank");
}

function startVoiceInput() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast("Voice input is not supported in this browser", 3200, "warning");
    return;
  }

  const btn = App.refs.voiceBtn;
  const recognition = new SpeechRecognition();
  recognition.lang = navigator.language || "en-US";
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  btn?.classList.add("is-listening");
  if (App.refs.searchInput) {
    App.refs.searchInput.placeholder = "Listening…";
    App.refs.searchInput.focus();
  }

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results).map((result) => result[0].transcript).join("");
    if (App.refs.searchInput) App.refs.searchInput.value = transcript.trimStart();
  };

  recognition.onerror = () => {
    showToast("Voice input could not start", 2800, "warning");
  };

  recognition.onend = () => {
    btn?.classList.remove("is-listening");
    if (App.refs.searchInput) App.refs.searchInput.placeholder = "Search or ask AI…";
  };

  recognition.start();
}

// ─── AI Chat ─────────────────────────────────────────────
async function handleAI() {
  const q = App.refs.searchInput?.value.trim();
  if (!q || !App.refs.chatContainer) return;
  App.refs.searchInput.value = "";

  App.refs.chatContainer.querySelector(".chat-welcome")?.remove();
  appendMessage("user", escapeHtml(q));
  const aiEl = appendMessage("ai", `<div class="typing-dots"><span></span><span></span><span></span></div>`);

  try {
    await new Promise((r) => setTimeout(r, 900));
    aiEl.querySelector(".message-content").innerHTML =
      `<p>I'd need an API key to respond. Configure it in Settings.</p>`;
  } catch (err) {
    aiEl.querySelector(".message-content").innerHTML =
      `<p style="color:var(--danger)"><i class="fas fa-exclamation-triangle"></i> ${escapeHtml(err.message)}</p>`;
  }

  App.refs.chatContainer.scrollTop = App.refs.chatContainer.scrollHeight;
}

function appendMessage(role, html) {
  const div = document.createElement("div");
  div.className = `chat-msg ${role}-msg`;
  div.innerHTML = `
    <div class="msg-avatar"><i class="${role === "user" ? "fas fa-user" : "fas fa-sparkles"}"></i></div>
    <div class="message-content">${html}</div>
  `;
  App.refs.chatContainer.appendChild(div);
  App.refs.chatContainer.scrollTop = App.refs.chatContainer.scrollHeight;
  return div;
}

// ─── Quick Links ─────────────────────────────────────────
function renderQuickLinks() {
  const grid = App.refs.quickLinksGrid;
  const list = App.refs.sidebarLinksList;
  if (!grid) return;

  grid.innerHTML = "";
  if (list) list.innerHTML = "";

  App.quickLinks.forEach((link, idx) => {
    const color = link.color || "var(--accent)";

    // ── Grid Card ──
    const card = document.createElement("a");
    card.className = "ql-card";
    card.href = link.url;
    card.target = "_blank";
    card.rel = "noopener noreferrer";
    card.draggable = true;
    card.dataset.idx = idx;
    card.innerHTML = `
      <div class="ql-card-icon" style="color:${color};background:${color}22">
        <i class="${link.icon || "fas fa-link"}"></i>
      </div>
      <span class="ql-card-name">${escapeHtml(link.name)}</span>
      <div class="ql-card-actions">
        <button class="ql-action edit-btn" data-idx="${idx}" title="Edit" aria-label="Edit">
          <i class="fas fa-pen"></i>
        </button>
        <button class="ql-action del-btn" data-idx="${idx}" title="Delete" aria-label="Delete">
          <i class="fas fa-xmark"></i>
        </button>
      </div>`;

    // Action buttons (prevent link navigation)
    card.querySelectorAll(".ql-action").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault(); e.stopPropagation();
        const i = +btn.dataset.idx;
        if (btn.classList.contains("del-btn")) deleteLink(i);
        else openModal(App.quickLinks[i], i);
      });
    });

    // Drag & drop reorder
    card.addEventListener("dragstart", (e) => {
      App.dragged = idx;
      card.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
    });
    card.addEventListener("dragend",  () => card.classList.remove("dragging"));
    card.addEventListener("dragover", (e) => { e.preventDefault(); card.classList.add("drag-over"); });
    card.addEventListener("dragleave",() => card.classList.remove("drag-over"));
    card.addEventListener("drop", (e) => {
      e.preventDefault();
      card.classList.remove("drag-over");
      if (App.dragged !== null && App.dragged !== idx) {
        const arr = [...App.quickLinks];
        const [moved] = arr.splice(App.dragged, 1);
        arr.splice(idx, 0, moved);
        App.quickLinks = arr;
        save("links");
        renderQuickLinks();
      }
    });

    grid.appendChild(card);

    // ── Sidebar Item ──
    if (list) {
      const item = document.createElement("a");
      item.className = "sidebar-link-item";
      item.href = link.url;
      item.target = "_blank";
      item.rel = "noopener noreferrer";
      item.innerHTML = `
        <span class="sli-icon" style="color:${color}">
          <i class="${link.icon || "fas fa-link"}"></i>
        </span>
        <span class="sli-name">${escapeHtml(link.name)}</span>
        <i class="fas fa-arrow-up-right-from-square sli-ext"></i>`;
      list.appendChild(item);
    }
  });
}

function deleteLink(idx) {
  if (!confirm(`Remove "${App.quickLinks[idx].name}"?`)) return;
  App.quickLinks.splice(idx, 1);
  save("links");
  renderQuickLinks();
  showToast("Link removed");
}

// ─── Link Modal ───────────────────────────────────────────
function openModal(link = null, editIdx = null) {
  const { addLinkModal, addLinkForm, modalTitle, saveLinkBtn,
          linkName, linkUrl, iconSelect, iconPreview, linkColor } = App.refs;

  addLinkForm.reset();
  delete addLinkForm.dataset.editIdx;

  if (link !== null && editIdx !== null) {
    modalTitle.textContent  = "Edit Link";
    saveLinkBtn.textContent = "Save Changes";
    linkName.value = link.name;
    linkUrl.value  = link.url;
    const opt = [...iconSelect.options].find((o) => o.value === link.icon);
    if (opt) opt.selected = true;
    if (link.color) linkColor.value = link.color;
    iconPreview.innerHTML  = `<i class="${link.icon || "fas fa-link"}"></i>`;
    iconPreview.style.color = link.color || "";
    addLinkForm.dataset.editIdx = editIdx;
  } else {
    modalTitle.textContent  = "Add Quick Link";
    saveLinkBtn.textContent = "Add Link";
    iconPreview.innerHTML   = `<i class="fas fa-link"></i>`;
    iconPreview.style.color = "#007aff";
  }

  addLinkModal.classList.add("open");
  addLinkModal.setAttribute("aria-hidden", "false");
  linkName.focus();
}

function closeModal() {
  App.refs.addLinkModal.classList.remove("open");
  App.refs.addLinkModal.setAttribute("aria-hidden", "true");
}

function saveLink(e) {
  e.preventDefault();
  const { linkName, linkUrl, iconSelect, linkColor, addLinkForm } = App.refs;
  let name = linkName.value.trim();
  let url  = linkUrl.value.trim();
  if (!name || !url) return;
  if (!url.startsWith("http://") && !url.startsWith("https://")) url = "https://" + url;

  const data     = { name, url, icon: iconSelect.value, color: linkColor.value };
  const editIdx  = addLinkForm.dataset.editIdx;

  if (editIdx !== undefined) App.quickLinks[+editIdx] = data;
  else App.quickLinks.push(data);

  save("links");
  renderQuickLinks();
  closeModal();
  showToast(editIdx !== undefined ? "Link updated" : "Link added");
}

function setupQuickLinks() {
  renderQuickLinks();

  document.getElementById("add-quick-link-main")?.addEventListener("click", () => openModal());
  document.getElementById("add-quick-link-sidebar")?.addEventListener("click", () => openModal());

  App.refs.closeLinkModal?.addEventListener("click", closeModal);
  App.refs.cancelLinkBtn?.addEventListener("click",  closeModal);
  App.refs.addLinkModal?.addEventListener("click", (e) => {
    if (e.target === App.refs.addLinkModal) closeModal();
  });
  App.refs.addLinkForm?.addEventListener("submit", saveLink);

  App.refs.iconSelect?.addEventListener("change", () => {
    App.refs.iconPreview.innerHTML   = `<i class="${App.refs.iconSelect.value}"></i>`;
    App.refs.iconPreview.style.color = App.refs.linkColor.value;
  });
  App.refs.linkColor?.addEventListener("input", () => {
    App.refs.iconPreview.style.color = App.refs.linkColor.value;
  });
}

// ─── Dock Viewer ─────────────────────────────────────────
function setupDockViewer() {
  const viewer      = document.getElementById("dock-viewer");
  const iframe      = document.getElementById("dock-iframe");
  const titleEl     = document.getElementById("dock-viewer-title");
  const urlEl       = document.getElementById("dock-viewer-url");
  const closeBtn    = document.getElementById("dock-viewer-close");
  const reloadBtn   = document.getElementById("dock-viewer-reload");
  const popoutBtn   = document.getElementById("dock-viewer-popout");
  const placeholder = document.getElementById("dock-viewer-placeholder");
  const openNewBtn  = document.getElementById("dock-viewer-open-new");

  let currentUrl  = "";
  let currentName = "";

  function openViewer(url, name) {
    // If same site is clicked again → toggle close
    if (viewer.classList.contains("open") && currentUrl === url) {
      closeViewer();
      return;
    }

    currentUrl  = url;
    currentName = name;

    titleEl.textContent = name;
    urlEl.textContent   = url;

    // Reset
    placeholder.style.display = "none";
    iframe.style.display      = "block";
    iframe.src = "";

    // Small delay for animation
    requestAnimationFrame(() => {
      iframe.src = url;
    });

    viewer.classList.add("open");

    // Mark active dock item
    document.querySelectorAll(".dock-item").forEach((d) => {
      d.classList.toggle("active", d.dataset.url === url);
    });

    // Detect iframe block (X-Frame-Options) after load attempt
    iframe.onload = () => {
      // Can't directly detect X-Frame-Options, but we can try accessing contentWindow
      try {
        // If this throws, the site blocked embedding
        void iframe.contentWindow.location.href;
        placeholder.style.display = "none";
        iframe.style.display = "block";
      } catch (e) {
        iframe.style.display = "none";
        placeholder.style.display = "flex";
        openNewBtn.onclick = () => window.open(currentUrl, "_blank");
      }
    };

    // Fallback timeout — if iframe doesn't load in 4s, show placeholder
    const fallbackTimer = setTimeout(() => {
      try { void iframe.contentWindow.location.href; }
      catch (e) {
        iframe.style.display = "none";
        placeholder.style.display = "flex";
        openNewBtn.onclick = () => window.open(currentUrl, "_blank");
      }
    }, 4000);

    iframe.onload = () => {
      clearTimeout(fallbackTimer);
      try {
        void iframe.contentWindow.location.href;
        placeholder.style.display = "none";
        iframe.style.display = "block";
      } catch (e) {
        iframe.style.display = "none";
        placeholder.style.display = "flex";
        openNewBtn.onclick = () => window.open(currentUrl, "_blank");
      }
    };
  }

  function closeViewer() {
    viewer.classList.remove("open");
    iframe.src = "";
    currentUrl = "";
    document.querySelectorAll(".dock-item").forEach((d) => d.classList.remove("active"));
  }

  // Dock item clicks
  document.querySelectorAll(".dock-item[data-url]").forEach((item) => {
    item.addEventListener("click", () => {
      openViewer(item.dataset.url, item.dataset.name || item.title);
    });
  });

  closeBtn?.addEventListener("click",  closeViewer);
  reloadBtn?.addEventListener("click", () => { if (currentUrl) iframe.src = currentUrl; });
  popoutBtn?.addEventListener("click", () => { if (currentUrl) window.open(currentUrl, "_blank"); });

  // Close when clicking outside viewer + dock
  document.addEventListener("click", (e) => {
    const dock = document.getElementById("mac-dock");
    if (
      viewer.classList.contains("open") &&
      !viewer.contains(e.target) &&
      !dock?.contains(e.target)
    ) closeViewer();
  });

  // ESC closes viewer
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && viewer.classList.contains("open")) closeViewer();
  });
}

// ─── Settings ────────────────────────────────────────────
function setupSettings() {
  const {
    settingsBtn, settingsModal, closeSettingsModal,
    customBgBtn, customBgUpload, resetBgBtn,
    blurAmount, blurValue, dimAmount, dimValue, glassPresets,
    userNameInput, weatherLocationInput,
    resetSettingsBtn, saveSettingsBtn,
  } = App.refs;

  // Pre-fill
  if (userNameInput)        userNameInput.value        = App.settings.userName || "";
  if (weatherLocationInput) weatherLocationInput.value = App.settings.weatherLocation || "";
  if (blurAmount) {
    blurAmount.value = App.settings.bgBlur || "0";
    if (blurValue) blurValue.textContent = `${blurAmount.value}px`;
  }
  if (dimAmount) {
    dimAmount.value = App.settings.bgDim || "18";
    if (dimValue) dimValue.textContent = `${dimAmount.value}%`;
  }
  updateGlassPresetUI(App.settings.glassPreset || "balanced");

  const openSettings  = () => { settingsModal.classList.add("open");    settingsModal.setAttribute("aria-hidden", "false"); };
  const closeSettings = () => { settingsModal.classList.remove("open"); settingsModal.setAttribute("aria-hidden", "true"); };

  settingsBtn?.addEventListener("click", openSettings);
  document.getElementById("dock-settings")?.addEventListener("click", openSettings);
  closeSettingsModal?.addEventListener("click", closeSettings);
  settingsModal?.addEventListener("click", (e) => { if (e.target === settingsModal) closeSettings(); });

  blurAmount?.addEventListener("input", () => {
    if (blurValue) blurValue.textContent = `${blurAmount.value}px`;
    App.settings.bgBlur = blurAmount.value;
    App.settings.glassPreset = "custom";
    applyBackground();
    updateGlassPresetUI("custom");
  });

  dimAmount?.addEventListener("input", () => {
    if (dimValue) dimValue.textContent = `${dimAmount.value}%`;
    App.settings.bgDim = dimAmount.value;
    App.settings.glassPreset = "custom";
    applyBackground();
    updateGlassPresetUI("custom");
  });

  glassPresets?.querySelectorAll(".glass-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const preset = GLASS_PRESETS[btn.dataset.preset];
      if (!preset) return;
      App.settings.glassPreset = btn.dataset.preset;
      App.settings.bgBlur = String(preset.blur);
      App.settings.bgDim = String(preset.dim);
      if (blurAmount) blurAmount.value = App.settings.bgBlur;
      if (blurValue) blurValue.textContent = `${App.settings.bgBlur}px`;
      if (dimAmount) dimAmount.value = App.settings.bgDim;
      if (dimValue) dimValue.textContent = `${App.settings.bgDim}%`;
      applyBackground();
      updateGlassPresetUI(btn.dataset.preset);
    });
  });

  customBgBtn?.addEventListener("click", () => customBgUpload.click());
  customBgUpload?.addEventListener("change", () => {
    const file = customBgUpload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      App.settings.customBackground = ev.target.result;
      applyBackground();
    };
    reader.readAsDataURL(file);
  });

  resetBgBtn?.addEventListener("click", () => {
    App.settings.customBackground = null;
    applyBackground();
  });

  saveSettingsBtn?.addEventListener("click", () => {
    App.settings.userName        = userNameInput?.value.trim() || "";
    App.settings.weatherLocation = weatherLocationInput?.value.trim() || "";
    App.settings.bgBlur          = blurAmount?.value || "0";
    App.settings.bgDim           = dimAmount?.value || "18";
    save("settings");
    updateClock();
    applyBackground();
    closeSettings();
    showToast("Settings saved");
  });

  resetSettingsBtn?.addEventListener("click", () => {
    if (!confirm("Reset all settings to defaults?")) return;
    localStorage.removeItem("nova_links");
    localStorage.removeItem("nova_settings");
    location.reload();
  });
}

function applyBackground() {
  const bg = App.settings.customBackground;
  const blur = Number(App.settings.bgBlur || 0);
  const dim = Number(App.settings.bgDim || 0) / 100;

  App.refs.html?.style.setProperty("--bg-blur-amount", `${blur}px`);
  App.refs.html?.style.setProperty("--bg-dim-opacity", dim.toFixed(2));

  if (bg) {
    App.refs.body.style.setProperty("--custom-bg-image", `url(${bg})`);
    App.refs.body.classList.add("has-custom-bg");
  } else {
    App.refs.body.style.removeProperty("--custom-bg-image");
    App.refs.body.classList.remove("has-custom-bg");
  }
}

function updateGlassPresetUI(activePreset) {
  document.querySelectorAll(".glass-preset").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.preset === activePreset);
  });
}

// ─── Toast ───────────────────────────────────────────────
function showToast(msg, duration = 2500, type = "success") {
  const t = document.createElement("div");
  t.className = `toast toast-${type}`;
  const icon = type === "warning" ? "fas fa-exclamation-circle" : "fas fa-check-circle";
  t.innerHTML = `<i class="${icon} toast-icon"></i><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add("hiding");
    setTimeout(() => t.remove(), 300);
  }, duration);
}

// ─── Utils ───────────────────────────────────────────────
function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str;
  return d.innerHTML;
}

// ─── Init ────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  cacheRefs();
  loadData();
  setupSidebar();
  setupTheme();
  setupSearch();
  setupQuickLinks();
  setupSettings();
  setupDockViewer();
  applyBackground();
  updateClock();
  setMotivation();
  fetchWeather();
  setInterval(updateClock, 1000);
});
