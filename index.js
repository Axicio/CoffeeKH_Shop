const KHR_PER_USD = 4100;
const CART_KEY = "coffeeshopkh-cart-v2";
const LANG_KEY = "coffeeshopkh-lang";
const RECORDS_KEY = "coffeeshopkh-records";
const DEMO_PAYMENT_MS = 1500;
const SLIDE_MS = 4000;
const OPEN_MINUTES = 6 * 60 + 30;
const CLOSE_MINUTES = 20 * 60;
const LARGE_UPCHARGE = 0.5;

const CATEGORIES = [
  { id: "all", label: "catAll" },
  { id: "hot", label: "catHot" },
  { id: "iced", label: "catIced" },
  { id: "other", label: "catOther" },
  { id: "food", label: "catFood" },
];

const MENU = [
  { id: "khmer-iced", name: "Khmer Iced Coffee", khmer: "កាហ្វេទឹកដោះគោទឹកកក", price: 1.75, category: "iced", color: "#a9744a", best: true },
  { id: "iced-black", name: "Iced Black Coffee", khmer: "កាហ្វេខ្មៅទឹកកក", price: 1.5, category: "iced", color: "#3a2115" },
  { id: "palm-latte", name: "Palm Sugar Latte", khmer: "ឡាតេស្ករត្នោត", price: 2.75, category: "iced", color: "#c08a58", best: true },
  { id: "caramel-mac", name: "Caramel Macchiato", khmer: "ការ៉ាមែលម៉ាគីយ៉ាតូ", price: 3, category: "iced", color: "#b67b45" },
  { id: "americano", name: "Americano", khmer: "អាមេរិកាណូ", price: 2, category: "hot", color: "#2f1a10", photo: "Images/black-coffee-stock.jpg" },
  { id: "latte", name: "Latte", khmer: "ឡាតេ", price: 2.5, category: "hot", color: "#c9a27a" },
  { id: "cappuccino", name: "Cappuccino", khmer: "កាពូឈីណូ", price: 2.5, category: "hot", color: "#b98d63", photo: "Images/Cappuccino_at_Sightglass_Coffee.jpg" },
  { id: "flat-white", name: "Flat White", khmer: "ហ្វ្លាតវ៉ាយ", price: 2.75, category: "hot", color: "#b98d63", photo: "Images/flat-white-Coffee.jpg" },
  { id: "matcha", name: "Matcha Latte", khmer: "ម៉ាច់ឆាឡាតេ", price: 3, category: "other", color: "#8fae5d" },
  { id: "bubble-tea", name: "Bubble Milk Tea", khmer: "តែគុជ", price: 2.75, category: "other", color: "#b98d63", best: true },
  { id: "croissant", name: "Butter Croissant", khmer: "នំក្រូសង់", price: 2, category: "food", color: "#d99c4f" },
  { id: "banana-cake", name: "Banana Cake", khmer: "នំចេក", price: 1.5, category: "food", color: "#e3bd6d" },
];

const SIZES = [
  { id: "regular", label: "sizeRegular" },
  { id: "large", label: "sizeLarge" },
];
const SUGAR_LEVELS = [0, 25, 50, 75, 100];
const ICE_LEVELS = [
  { id: "none", label: "iceNone" },
  { id: "less", label: "iceLess" },
  { id: "normal", label: "iceNormal" },
];
const TOPPINGS = [
  { id: "shot", label: "toppingShot", price: 0.5, categories: ["hot", "iced"] },
  { id: "boba", label: "toppingBoba", price: 0.5, categories: ["iced", "other"] },
];

const money = (usd) => `$${usd.toFixed(2)}`;
const riel = (usd) => `${(Math.round((usd * KHR_PER_USD) / 100) * 100).toLocaleString("en-US")}៛`;

/* ---------- Language ---------- */

let lang = localStorage.getItem(LANG_KEY) === "km" ? "km" : "en";

const t = (key, language = lang) => TRANSLATIONS[language][key];
const itemName = (item) => (lang === "km" ? item.khmer : item.name);
const itemSubName = (item) => (lang === "km" ? item.name : item.khmer);

function applyLanguage() {
  document.documentElement.lang = lang;
  document.title = t("pageTitle");
  document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = t(el.dataset.i18n)));
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  document.querySelectorAll("[data-i18n-label]").forEach((el) => el.setAttribute("aria-label", t(el.dataset.i18nLabel)));
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => (el.alt = t(el.dataset.i18nAlt)));
  renderMenu();
  saveAndRenderCart();
  renderHours();
}

/* ---------- Opening hours ---------- */

function isOpenNow() {
  // Always Phnom Penh time, wherever the visitor's device is set.
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Phnom_Penh",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const part = (type) => Number(parts.find((p) => p.type === type).value);
  const minutes = part("hour") * 60 + part("minute");
  return minutes >= OPEN_MINUTES && minutes < CLOSE_MINUTES;
}

function renderHours() {
  const open = isOpenNow();
  const status = document.getElementById("hoursStatus");
  status.textContent = t(open ? "openNow" : "closedNow");
  status.classList.toggle("is-open", open);
  document.getElementById("closedAlert").classList.toggle("d-none", open);
}

/* ---------- Artwork ---------- */

function cupSvg(color, category) {
  if (category === "food") {
    return `<svg viewBox="0 0 120 120" role="img" aria-hidden="true">
      <ellipse cx="60" cy="96" rx="50" ry="9" fill="#fff"/>
      <path d="M18 88c0-30 18-48 42-48s42 18 42 48c-10 6-74 6-84 0z" fill="${color}"/>
      <path d="M42 46c-6 12-8 26-6 44M60 40v50M78 46c6 12 8 26 6 44" stroke="#8a5a2b" stroke-width="3" fill="none" opacity=".5"/>
    </svg>`;
  }
  if (category === "hot") {
    return `<svg viewBox="0 0 120 120" role="img" aria-hidden="true">
      <path d="M44 28c-6-8 6-10 0-18M62 28c-6-8 6-10 0-18" stroke="#a58a74" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cx="56" cy="104" rx="46" ry="8" fill="#fff"/>
      <path d="M92 52h6a12 12 0 0 1 0 28h-10" stroke="#fff" stroke-width="7" fill="none"/>
      <path d="M18 38h76l-6 50a14 14 0 0 1-14 12H38a14 14 0 0 1-14-12z" fill="#fff"/>
      <ellipse cx="56" cy="38" rx="38" ry="8" fill="${color}"/>
    </svg>`;
  }
  return `<svg viewBox="0 0 120 120" role="img" aria-hidden="true">
    <path d="M70 4 62 30" stroke="#6f4328" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 30h60l-8 80a8 8 0 0 1-8 7H46a8 8 0 0 1-8-7z" fill="#ffffff" opacity=".85"/>
    <path d="M34 44h52l-6.600 64a6 6 0 0 1-6 5H46.600a6 6 0 0 1-6-5z" fill="${color}"/>
    <rect x="44" y="50" width="14" height="14" rx="3" fill="#fff" opacity=".45"/>
    <rect x="62" y="58" width="14" height="14" rx="3" fill="#fff" opacity=".35"/>
    <rect x="24" y="24" width="72" height="8" rx="4" fill="#fff"/>
  </svg>`;
}

function menuArt(m) {
  const svg = cupSvg(m.color, m.category);
  const tag = m.best ? `<span class="best-tag">${t("bestSeller")}</span>` : "";
  if (!m.photo) return `<div class="menu-art">${tag}${svg}</div>`;
  return `<div class="menu-art">
    ${tag}
    <img class="menu-photo" src="${m.photo}" alt="${itemName(m)}" loading="lazy" />
    <span class="menu-badge">${svg}</span>
  </div>`;
}

/* ---------- Drink options ---------- */

const isDrink = (item) => item.category !== "food";
const hasIce = (item) => item.category === "iced" || item.category === "other";
const toppingsFor = (item) => TOPPINGS.filter((top) => top.categories.includes(item.category));

function unitPrice(line) {
  const item = MENU.find((m) => m.id === line.id);
  const toppings = line.toppings.reduce((sum, id) => sum + TOPPINGS.find((top) => top.id === id).price, 0);
  return item.price + (line.size === "large" ? LARGE_UPCHARGE : 0) + toppings;
}

function lineOptions(line, language = lang) {
  const item = MENU.find((m) => m.id === line.id);
  if (!isDrink(item)) return [];
  const options = [t(SIZES.find((s) => s.id === line.size).label, language), `${t("sugar", language)} ${line.sugar}%`];
  if (hasIce(item)) options.push(t(ICE_LEVELS.find((i) => i.id === line.ice).label, language));
  line.toppings.forEach((id) => options.push(`+ ${t(TOPPINGS.find((top) => top.id === id).label, language)}`));
  return options;
}

function radioGroup(name, title, options, checked) {
  const inputs = options
    .map(
      (o) => `
      <input type="radio" class="btn-check" name="${name}" id="${name}-${o.id}" value="${o.id}" ${String(o.id) === String(checked) ? "checked" : ""} />
      <label class="btn btn-outline-coffee" for="${name}-${o.id}">${o.label}</label>`
    )
    .join("");
  return `<fieldset class="mb-3">
    <legend class="form-label fs-6">${title}</legend>
    <div class="option-group">${inputs}</div>
  </fieldset>`;
}

let optionsItem = null;

function readOptions() {
  const data = new FormData(document.getElementById("optionsForm"));
  return {
    id: optionsItem.id,
    size: data.get("size"),
    sugar: Number(data.get("sugar")),
    ice: hasIce(optionsItem) ? data.get("ice") : null,
    toppings: data.getAll("toppings"),
  };
}

function updateOptionsPrice() {
  document.getElementById("optionsPrice").textContent = money(unitPrice(readOptions()));
}

function openOptions(item) {
  optionsItem = item;
  document.getElementById("optionsTitle").textContent = itemName(item);

  const sizes = SIZES.map((s) => ({
    id: s.id,
    label: s.id === "large" ? `${t(s.label)} +${money(LARGE_UPCHARGE)}` : t(s.label),
  }));
  const sugars = SUGAR_LEVELS.map((level) => ({ id: level, label: `${level}%` }));
  const ices = ICE_LEVELS.map((i) => ({ id: i.id, label: t(i.label) }));
  const toppings = toppingsFor(item)
    .map(
      (top) => `
      <div class="form-check">
        <input class="form-check-input" type="checkbox" name="toppings" id="top-${top.id}" value="${top.id}" />
        <label class="form-check-label" for="top-${top.id}">${t(top.label)} +${money(top.price)}</label>
      </div>`
    )
    .join("");

  document.getElementById("optionsBody").innerHTML = [
    radioGroup("size", t("size"), sizes, "regular"),
    radioGroup("sugar", t("sugar"), sugars, 100),
    hasIce(item) ? radioGroup("ice", t("ice"), ices, "normal") : "",
    toppings ? `<fieldset><legend class="form-label fs-6">${t("toppings")}</legend>${toppings}</fieldset>` : "",
  ].join("");

  updateOptionsPrice();
  bootstrap.Modal.getOrCreateInstance("#optionsModal").show();
}

/* ---------- Cart ---------- */

function isValidLine(line) {
  const item = MENU.find((m) => m.id === line?.id);
  if (!item || !Number.isInteger(line.qty) || line.qty < 1 || !Array.isArray(line.toppings)) return false;
  if (!line.toppings.every((id) => toppingsFor(item).some((top) => top.id === id))) return false;
  if (!isDrink(item)) return true;
  return (
    SIZES.some((s) => s.id === line.size) &&
    SUGAR_LEVELS.includes(line.sugar) &&
    (!hasIce(item) || ICE_LEVELS.some((i) => i.id === line.ice))
  );
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem(CART_KEY));
    // Drop anything that has since left the menu or was edited by hand.
    return Array.isArray(saved) ? saved.filter(isValidLine) : [];
  } catch {
    return [];
  }
}

let cart = loadCart();

const lineKey = ({ id, size, sugar, ice, toppings }) => JSON.stringify([id, size, sugar, ice, [...toppings].sort()]);
const cartTotal = () => cart.reduce((sum, line) => sum + unitPrice(line) * line.qty, 0);

function addToCart(line) {
  const existing = cart.find((l) => lineKey(l) === lineKey(line));
  if (existing) existing.qty += 1;
  else cart.push({ ...line, qty: 1 });
  saveAndRenderCart();
  showToast(`${itemName(MENU.find((m) => m.id === line.id))} ${t("added")}`);
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty < 1) cart.splice(index, 1);
  saveAndRenderCart();
}

function saveAndRenderCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  const total = cartTotal();

  document.getElementById("cartCount").textContent = cart.reduce((n, l) => n + l.qty, 0);
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("cartTotalKhr").textContent = riel(total);
  document.getElementById("orderTotal").textContent = money(total);
  document.getElementById("checkoutBtn").disabled = cart.length === 0;

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart
        .map((line, index) => {
          const item = MENU.find((m) => m.id === line.id);
          return `
        <div class="cart-line">
          <div class="cart-line-name">
            <div class="fw-medium">${itemName(item)}</div>
            <div class="small text-muted">${lineOptions(line).join(" · ")}</div>
            <div class="small text-muted">${money(unitPrice(line))} ${t("each")}</div>
          </div>
          <div class="btn-group btn-group-sm">
            <button class="btn btn-outline-secondary qty-btn" data-qty="-1" data-index="${index}" aria-label="− ${itemName(item)}">−</button>
            <span class="btn btn-outline-secondary disabled">${line.qty}</span>
            <button class="btn btn-outline-secondary qty-btn" data-qty="1" data-index="${index}" aria-label="+ ${itemName(item)}">+</button>
          </div>
        </div>`;
        })
        .join("")
    : `<div class="cart-empty"><i class="bi bi-cup"></i>${t("cartEmpty")}</div>`;
}

/* ---------- Menu ---------- */

let menuCategory = "all";
let menuQuery = "";

function renderMenu() {
  document.getElementById("menuFilters").innerHTML = CATEGORIES.map(
    (c) => `<button type="button" class="btn ${c.id === menuCategory ? "btn-coffee" : "btn-outline-coffee"}" data-category="${c.id}" aria-pressed="${c.id === menuCategory}">${t(c.label)}</button>`
  ).join("");

  const query = menuQuery.trim().toLowerCase();
  const items = MENU.filter(
    (m) =>
      (menuCategory === "all" || m.category === menuCategory) &&
      (m.name.toLowerCase().includes(query) || m.khmer.includes(query))
  );

  document.getElementById("menuEmpty").classList.toggle("d-none", items.length > 0);
  document.getElementById("menuGrid").innerHTML = items
    .map(
      (m) => `
      <div class="col-6 col-md-4 col-lg-3">
        <article class="menu-card">
          ${menuArt(m)}
          <div class="menu-body">
            <h3>${itemName(m)}</h3>
            <p class="khmer-name">${itemSubName(m)}</p>
            <div class="d-flex justify-content-between align-items-end mt-auto gap-2">
              <div class="price">${money(m.price)}<small>${riel(m.price)}</small></div>
              <button class="btn btn-coffee btn-sm" data-add="${m.id}" aria-label="${t("addToCart")}: ${itemName(m)}"><i class="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </article>
      </div>`
    )
    .join("");
}

/* ---------- Orders and bookings (saved in this browser only) ---------- */

// Customer text is rendered with innerHTML below, so it must be escaped.
const escapeHtml = (text) =>
  String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

function loadRecords() {
  try {
    const saved = JSON.parse(localStorage.getItem(RECORDS_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter((r) => r && (r.kind === "booking" || (Array.isArray(r.lines) && r.lines.every(isValidLine))));
  } catch {
    return [];
  }
}

function saveRecord(record) {
  const saved = [{ ...record, number: `KH-${String(Date.now()).slice(-6)}`, createdAt: Date.now() }, ...loadRecords()];
  localStorage.setItem(RECORDS_KEY, JSON.stringify(saved));
  return saved[0];
}

const formatTime = (ms) => new Date(ms).toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh" });

function detailRow(label, value) {
  return `<div class="receipt-row"><span>${label}</span><span>${escapeHtml(value)}</span></div>`;
}

function recordHtml(r) {
  const rows = [
    detailRow(t(r.kind === "order" ? "orderNumber" : "bookingNumber"), r.number),
    detailRow(t("time"), formatTime(r.createdAt)),
    detailRow(t("name"), r.name),
    detailRow(t("phone"), r.phone),
  ];
  if (r.kind === "booking") {
    rows.push(detailRow(t("date"), `${r.date} ${r.time}`), detailRow(t("guests"), r.guests));
    if (r.note) rows.push(detailRow(t("note"), r.note));
    return rows.join("");
  }

  rows.push(detailRow(t("howWanted"), t(r.type === "Delivery" ? "delivery" : "pickup")));
  if (r.type === "Delivery") rows.push(detailRow(t("address"), r.address));
  rows.push(detailRow(t("payment"), t(r.payment === "card" ? "paidDemo" : "payLater")));
  if (r.note) rows.push(detailRow(t("note"), r.note));

  const items = r.lines
    .map((line) => {
      const options = lineOptions(line).join(" · ");
      return `<div class="receipt-item">
        <div>${line.qty} × ${itemName(MENU.find((m) => m.id === line.id))}<div class="small text-muted">${options}</div></div>
        <span>${money(unitPrice(line) * line.qty)}</span>
      </div>`;
    })
    .join("");
  return `${rows.join("")}<div class="receipt-items">${items}</div>${detailRow(t("total"), `${money(r.total)} (${riel(r.total)})`)}`;
}

function showReceipt(record) {
  document.getElementById("receiptTitle").textContent = t(record.kind === "order" ? "receiptOrder" : "receiptBooking");
  document.getElementById("receiptBody").innerHTML = recordHtml(record);
  bootstrap.Modal.getOrCreateInstance("#receiptModal").show();
}

function renderRecords() {
  const records = loadRecords();
  document.getElementById("clearOrders").disabled = records.length === 0;
  document.getElementById("ordersList").innerHTML = records.length
    ? records.map((r) => `<article class="record-card">${recordHtml(r)}</article>`).join("")
    : `<div class="cart-empty"><i class="bi bi-receipt"></i>${t("ordersEmpty")}</div>`;
}

/* ---------- Forms ---------- */

function showToast(message, isError = false) {
  const el = document.getElementById("toast");
  el.classList.toggle("text-bg-danger", isError);
  document.getElementById("toastBody").textContent = message;
  bootstrap.Toast.getOrCreateInstance(el).show();
}

function formValues(form) {
  return Object.fromEntries(
    [...new FormData(form).entries()].map(([key, value]) => [key, String(value).trim()])
  );
}

// Validates the form, runs the action, then clears the form.
async function submitForm(form, action) {
  // Spaces alone should not satisfy a required field.
  form.querySelectorAll("input, textarea").forEach((el) => {
    if (el.type !== "radio" && el.value.trim() === "" && el.required) el.value = "";
  });
  form.classList.add("was-validated");
  if (!form.checkValidity()) return;

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  await action(formValues(form));
  form.reset();
  form.classList.remove("was-validated");
  button.disabled = false;
}

function toggleDemoCard() {
  document.getElementById("demoCard").classList.toggle("d-none", !document.getElementById("payCard").checked);
}

// Pretends to contact a payment provider. Nothing leaves the browser.
async function placeOrder(values, checkoutModal) {
  if (values.payment === "card") {
    showToast(t("processing"));
    await new Promise((resolve) => setTimeout(resolve, DEMO_PAYMENT_MS));
  }
  const record = saveRecord({ kind: "order", ...values, lines: cart, total: cartTotal() });
  cart = [];
  saveAndRenderCart();
  checkoutModal.hide();
  bootstrap.Toast.getOrCreateInstance("#toast").hide();
  showReceipt(record);
}

function toggleAddress() {
  const isDelivery = document.getElementById("typeDelivery").checked;
  document.getElementById("addressGroup").classList.toggle("d-none", !isDelivery);
  document.getElementById("orderAddress").required = isDelivery;
}

function localToday() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

/* ---------- Wiring ---------- */

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("heroCup").innerHTML = cupSvg("#a9744a", "iced");
  document.getElementById("year").textContent = new Date().getFullYear();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  bootstrap.Carousel.getOrCreateInstance("#bannerCarousel", {
    interval: reduceMotion ? false : SLIDE_MS,
    ride: reduceMotion ? false : "carousel",
  });
  document.getElementById("bookDate").min = localToday();
  applyLanguage();
  setInterval(renderHours, 60000);

  document.getElementById("langToggle").addEventListener("click", () => {
    lang = lang === "en" ? "km" : "en";
    localStorage.setItem(LANG_KEY, lang);
    applyLanguage();
  });

  document.getElementById("menuSearch").addEventListener("input", (e) => {
    menuQuery = e.target.value;
    renderMenu();
  });

  document.getElementById("menuFilters").addEventListener("click", (e) => {
    const button = e.target.closest("[data-category]");
    if (!button) return;
    menuCategory = button.dataset.category;
    renderMenu();
  });

  document.getElementById("menuGrid").addEventListener("click", (e) => {
    const button = e.target.closest("[data-add]");
    if (!button) return;
    const item = MENU.find((m) => m.id === button.dataset.add);
    if (isDrink(item)) openOptions(item);
    else addToCart({ id: item.id, size: null, sugar: null, ice: null, toppings: [] });
  });

  const optionsForm = document.getElementById("optionsForm");
  optionsForm.addEventListener("change", updateOptionsPrice);
  optionsForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addToCart(readOptions());
    bootstrap.Modal.getOrCreateInstance("#optionsModal").hide();
  });

  document.getElementById("cartItems").addEventListener("click", (e) => {
    const button = e.target.closest("[data-qty]");
    if (button) changeQty(Number(button.dataset.index), Number(button.dataset.qty));
  });

  const cartPanel = bootstrap.Offcanvas.getOrCreateInstance("#cartPanel");
  const checkoutModal = bootstrap.Modal.getOrCreateInstance("#checkoutModal");

  document.getElementById("checkoutBtn").addEventListener("click", () => {
    cartPanel.hide();
    renderHours();
    checkoutModal.show();
  });

  document.querySelectorAll('input[name="type"]').forEach((el) => el.addEventListener("change", toggleAddress));

  document.querySelectorAll('input[name="payment"]').forEach((el) => el.addEventListener("change", toggleDemoCard));

  document.getElementById("orderForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    await submitForm(e.target, (values) => placeOrder(values, checkoutModal));
    toggleAddress();
    toggleDemoCard();
  });

  document.getElementById("bookingForm").addEventListener("submit", (e) => {
    e.preventDefault();
    submitForm(e.target, async (values) => showReceipt(saveRecord({ kind: "booking", ...values })));
  });

  document.getElementById("ordersBtn").addEventListener("click", () => {
    renderRecords();
    bootstrap.Modal.getOrCreateInstance("#ordersModal").show();
  });

  document.getElementById("clearOrders").addEventListener("click", () => {
    localStorage.removeItem(RECORDS_KEY);
    renderRecords();
  });
});
