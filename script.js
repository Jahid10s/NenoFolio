/*
  NENOFOLIO CONTENT SETTINGS
  1. Put MP4/WebM files inside assets/videos/.
  2. Add each video to the videos list below.
  3. Add YouTube or Instagram URLs to the embeds list.
  4. Add an ambient audio file inside assets/audio/ and set ambientAudio.
  All audio is opt-in. Nothing plays automatically. No click sound effects are used.
*/

const SITE_CONTENT = {
  videos: [
    {
      title: "AMV Short",
      category: "AMV",
      platform: "youtube",
      url: "https://youtube.com/shorts/TVXkdr8sctA?si=l1bpxglZranUin38",
      description: "Featured YouTube Short."
    },
    {
      title: "AMV Reel",
      category: "AMV",
      platform: "instagram",
      url: "https://www.instagram.com/reel/Db0dxN8z5hd/",
      description: "Featured Instagram Reel."
    },
    {
      title: "Typography Reel",
      category: "TYPOGRAPHY",
      platform: "instagram",
      url: "https://www.instagram.com/reel/Dfg_liLKi2v/",
      description: "Featured Instagram Reel."
    }
  ],
  embeds: [],
  socials: {
    github: "https://github.com/Jahid10s",
    youtube: "",
    instagram: "https://www.instagram.com/nenovex.gaming?exln=b2tvZWt3cHhwaHVw",
    email: "jahidben83@gmail.com"
  },
  ambientAudio: "assets/audio/ambient.mp3"
};

const gallery = document.getElementById("videoGallery");
const filters = document.getElementById("galleryFilters");
const embedGallery = document.getElementById("embedGallery");
const audio = document.getElementById("ambientAudio");
const audioToggle = document.getElementById("audioToggle");
const audioLabel = document.getElementById("audioLabel");
const toast = document.getElementById("siteToast");
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

function renderFilters(items) {
  const categories = ["all", ...new Set(items.map(item => item.category).filter(Boolean))];
  filters.replaceChildren();
  categories.forEach(category => {
    const button = makeElement("button", "filter-button" + (category === "all" ? " active" : ""), category === "all" ? "All work" : category);
    button.type = "button";
    button.dataset.filter = category;
    button.addEventListener("click", () => {
      filters.querySelectorAll(".filter-button").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderVideos(items, category);
    });
    filters.append(button);
  });
}

function renderVideos(items, selectedCategory = "all") {
  const visibleItems = selectedCategory === "all" ? items : items.filter(item => item.category === selectedCategory);
  gallery.replaceChildren();

  if (!visibleItems.length) {
    const empty = makeElement("div", "empty-state");
    empty.append(
      makeElement("span", "empty-icon", "＋"),
      makeElement("h3", "", items.length ? "No projects in this category yet." : "Your next project goes here."),
      makeElement("p", "", items.length ? "Choose another filter to see more work." : "Add MP4 or WebM videos in the assets folder, then list them in script.js.")
    );
    gallery.append(empty);
    return;
  }

  visibleItems.forEach(item => {
    const card = makeElement("article", "video-card");
    const frame = makeElement("div", "video-frame" + (item.platform === "youtube" ? " video-frame-short" : ""));

    if (item.platform === "youtube") {
      const iframe = document.createElement("iframe");
      iframe.src = youtubeEmbedUrl(item.url);
      iframe.title = item.title || "YouTube video";
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      frame.append(iframe);
    } else if (item.platform === "instagram") {
      frame.classList.add("video-frame-short", "video-frame-instagram");
      const link = document.createElement("a");
      link.className = "instagram-card-link";
      link.href = item.url;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.setAttribute("aria-label", "Open " + (item.title || "Instagram Reel") + " on Instagram");
      link.append(
        makeElement("span", "instagram-card-brand", "INSTAGRAM REEL"),
        makeElement("span", "instagram-card-play", "▶"),
        makeElement("span", "instagram-card-open", "WATCH REEL ↗")
      );
      frame.append(link);
    } else {
      const video = document.createElement("video");
      video.controls = true;
      video.preload = "metadata";
      video.playsInline = true;
      if (item.poster) video.poster = item.poster;
      const source = document.createElement("source");
      source.src = item.src;
      source.type = item.src.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
      video.append(source);
      frame.append(video);
    }

    const info = makeElement("div", "video-info");
    info.append(
      makeElement("span", "video-category", item.category || "PROJECT"),
      makeElement("h3", "", item.title || "Untitled project"),
      makeElement("p", "", item.description || "")
    );
    card.append(frame, info);
    gallery.append(card);
  });
}

function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    let id = "";
    if (parsed.hostname.includes("youtu.be")) id = parsed.pathname.slice(1);
    if (parsed.hostname.includes("youtube.com")) {
      id = parsed.searchParams.get("v") || "";
      if (!id && parsed.pathname.includes("/embed/")) id = parsed.pathname.split("/embed/")[1];
      if (!id && parsed.pathname.includes("/shorts/")) id = parsed.pathname.split("/shorts/")[1];
    }
    id = id.split("/")[0].split("?")[0];
    return id ? "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) : "";
  } catch (_) {
    return "";
  }
}

function instagramEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("instagram.com")) return "";
    const parts = parsed.pathname.split("/").filter(Boolean);
    const kind = parts[0];
    const shortcode = parts[1];
    if (!["p", "reel", "tv"].includes(kind) || !shortcode) return "";
    return "https://www.instagram.com/" + kind + "/" + encodeURIComponent(shortcode) + "/embed/";
  } catch (_) {
    return "";
  }
}

function renderEmbeds(items) {
  embedGallery.replaceChildren();
  if (!items.length) {
    const empty = makeElement("div", "embed-empty");
    empty.append(
      makeElement("div", "embed-empty-icon", "▶"),
      makeElement("h3", "", "Connect your platforms."),
      makeElement("p", "", "Add YouTube video URLs or individual public Instagram Reel URLs to the embeds list in script.js.")
    );
    embedGallery.append(empty);
    return;
  }

  items.forEach(item => {
    const source = item.platform === "youtube" ? youtubeEmbedUrl(item.url) :
      item.platform === "instagram" ? instagramEmbedUrl(item.url) : "";
    if (!source) return;

    const card = makeElement("article", "embed-card");
    const isInstagramReel = item.platform === "instagram" && /\/reel\//i.test(item.url);
    const media = makeElement("div", "embed-media" + (isInstagramReel ? " embed-media-reel" : ""));
    const iframe = document.createElement("iframe");
    iframe.src = source;
    iframe.title = item.title || (item.platform + " embed");
    iframe.loading = "lazy";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    media.append(iframe);

    const caption = makeElement("div", "embed-caption");
    const textBlock = document.createElement("div");
    textBlock.append(makeElement("span", "video-category", item.category || item.platform.toUpperCase()), makeElement("h3", "", item.title || "Featured post"));
    const external = document.createElement("a");
    external.href = item.url;
    external.target = "_blank";
    external.rel = "noopener noreferrer";
    external.textContent = "OPEN ↗";
    external.className = "video-category";
    caption.append(textBlock, external);
    card.append(media, caption);
    embedGallery.append(card);
  });

  if (!embedGallery.children.length) {
    const empty = makeElement("div", "embed-empty");
    empty.append(makeElement("h3", "", "No valid embeds found."), makeElement("p", "", "Check the YouTube or Instagram URLs in script.js."));
    embedGallery.append(empty);
  }
}

function renderSocials() {
  const container = document.getElementById("socialLinks");
  container.replaceChildren();
  const links = [
    ["GitHub", SITE_CONTENT.socials.github],
    ["YouTube", SITE_CONTENT.socials.youtube],
    ["Instagram", SITE_CONTENT.socials.instagram],
    ["Email", SITE_CONTENT.socials.email ? "mailto:" + SITE_CONTENT.socials.email : ""]
  ];
  links.forEach(([label, url]) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label + " ↗";
    if (!url.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    container.append(link);
  });
}

function setupAmbientAudio() {
  if (SITE_CONTENT.ambientAudio) audio.src = SITE_CONTENT.ambientAudio;
  audio.volume = 0.22;

  audioToggle.addEventListener("click", async () => {
    if (!SITE_CONTENT.ambientAudio) {
      showToast("Add an audio file path in script.js first.");
      return;
    }
    if (audio.paused) {
      try {
        await audio.play();
        audioToggle.setAttribute("aria-pressed", "true");
        audioLabel.textContent = "Ambient audio: on";
      } catch (_) {
        showToast("Audio could not play. Check the file path in script.js.");
      }
    } else {
      audio.pause();
      audioToggle.setAttribute("aria-pressed", "false");
      audioLabel.textContent = "Ambient audio: off";
    }
  });

  audio.addEventListener("ended", () => {
    audioToggle.setAttribute("aria-pressed", "false");
    audioLabel.textContent = "Ambient audio: off";
  });
}

function setupNavigation() {
  const toggle = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
  }));
}


renderFilters(SITE_CONTENT.videos);
renderVideos(SITE_CONTENT.videos);
renderEmbeds(SITE_CONTENT.embeds);
renderSocials();
setupAmbientAudio();
setupNavigation();
document.getElementById("currentYear").textContent = String(new Date().getFullYear());
