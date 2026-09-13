/* ============================================================
   MYDINERS × DAYBREAK — DB-MYD-001
   Data layer. No price, hour count or date is typed into the HTML.
   ============================================================ */

document.documentElement.classList.add("js");

const proposalData = {
  clientName:   "MYDiners",
  projectName:  "MYDiners Digital Growth Foundation",
  branchOne:    "Rosebank",
  branchTwo:    "Cape Town / Claremont",
  reference:    "DB-MYD-001 · V1",
  proposalDate: "13 September 2026",
  proposalValidityDays: 14,
  currency:     "ZAR",
  companyName:  "Daybreak",
  email:        "contact@daybreaktechinnovations.com",
  website:      "daybreaktech.agency",
  location:     "Cape Town, South Africa",
  buildWeeks:   6,
};

const buildRate = 500;          // every fee in this deck = hours × this rate

/* Care & Growth retainer. Priced off the same rate as the build so the two
   numbers can never drift apart; ad-hoc work carries a premium. */
const retainer = { hoursPerMonth: 8, cateringHoursPerMonth: 9, adHocRate: 650, noticeDays: 30 };

/* Monthly third-party platform costs, the same on both packages. */
const thirdPartyMonthly = 3500;

/* Today-only saving on the project fee, when approved on the day it is presented. */
const todayDiscount = 0.10;

/* --- Phase One work allocation. [name, hours, description, group, cateringOnly] ---
   Foundation = every line without the flag. Foundation + Catering = every line. */
const lineItems = [
  ["Discovery & Strategy",              6,  "Business and project discovery. Customer journey planning. Technical and integration planning.", "design"],
  ["UX + Website Architecture",         6,  "Page structure. Navigation. Branch journey. Menu, booking and signup flows.",                     "design"],
  ["Visual Design",                    12,  "Custom website visual direction. Desktop design. Mobile design. Key UI components.",              "design"],
  ["Front-End Development",            16,  "Responsive website development. Rosebank experience. Cape Town experience. Core interactions.",   "build"],
  ["Live Menu + CMS",                   8,  "Searchable menu structure. Categories. Menu management functionality. Mobile optimisation.",      "build"],
  ["Online Booking Integration",        6,  "Website booking flow. Reservation platform connection and configuration within available integration capabilities. Testing.", "systems"],
  ["Guest List + Promotions",           4,  "Newsletter signup. Booking opt-in. Consent capture. Guest list set up for specials and promotions.", "systems"],
  ["Catering & Functions Funnel",       8,  "Enquiry form. Qualification fields. Lead routing. Customer confirmation. Pipeline stages.",       "systems", true],
  ["Feedback + Review System",          4,  "QR feedback journey. Complaint and feedback capture. Google review pathway.",                     "systems"],
  ["SEO + Analytics",                   4,  "Local SEO foundations. Analytics installation. Conversion and event tracking setup.",             "systems"],
  ["QA + Responsive Testing",           4,  "Mobile. Desktop. Forms. Links. Booking journey. Browser checks.",                                 "launch"],
  ["Training + Documentation + Launch", 4,  "CMS guidance. Documentation. Handover. Launch support.",                                          "launch"],
];

const groups = [
  ["design",  "Strategy & Design",       "a"],
  ["build",   "Build",                   "b"],
  ["systems", "Integrations & Systems",  "c"],
  ["launch",  "Quality & Launch",        "d"],
];

/* --- illustrative revenue model (slide 11) --- */
const revenueModel = { tablesPerDay:[2,3,5], coversPerTable:3, averageSpend:250, tradingDays:30 };

/* --- illustrative measurement funnel (slide 12) --- */
/* [label, value, note, index of the stage this is measured against] */
const funnelStages = [
  ["Visitors",          5000, "Google, Instagram, Masala Bhai, direct",   null],
  ["Menu views",        2000, "The strongest intent signal on the site",  0],
  ["Booking actions",    220, "Online reservations + booking clicks",     1],
  ["Catering enquiries",  25, "Qualified functions leads with a value",   0],
];

/* --- illustrative guest list promotion (slide 07): extra tables one message fills --- */
const promoExample = { tables: 5 };

/* --- illustrative catering pipeline (slide 10) --- */
const pipeline = [
  ["New enquiry",     18000, "80-guest function · Rosebank"],
  ["Quote sent",      28000, "Corporate lunch · Cape Town"],
  ["Awaiting deposit",42000, "Wedding reception · off-site"],
  ["Confirmed",       25000, "Birthday function · Rosebank"],
];

/* ============================================================
   DERIVED — nothing below is hand-typed
   ============================================================ */
const sumHours      = items => items.reduce((s, l) => s + l[1], 0);
const totalHours    = sumHours(lineItems);                    // full scope, drives the workload bar
const coreHours     = sumHours(lineItems.filter(l => !l[4]));
const cateringHours = totalHours;
const coreFee       = coreHours * buildRate;
const cateringFee   = cateringHours * buildRate;
const today = fee => fee * (1 - todayDiscount);

const money = n => "R" + Math.round(n).toLocaleString("en-ZA").replace(/ /g, ",");
const groupHours = g => lineItems.filter(l => l[3] === g).reduce((s, l) => s + l[1], 0);
const rev = t => t * revenueModel.coversPerTable * revenueModel.averageSpend * revenueModel.tradingDays;
const short = n => n >= 1000 ? "R" + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + "K" : money(n);

const retainerCore     = retainer.hoursPerMonth * buildRate;
const retainerCatering = retainer.cateringHoursPerMonth * buildRate;
const promoTurnover    = promoExample.tables * revenueModel.coversPerTable * revenueModel.averageSpend;

const fills = {
  "client-name":   proposalData.clientName,
  "project-name":  proposalData.projectName,
  "branch-one":    proposalData.branchOne,
  "branch-two":    proposalData.branchTwo,
  "reference":     proposalData.reference,
  "date":          proposalData.proposalDate,
  "validity":      proposalData.proposalValidityDays + " days",
  "company":       proposalData.companyName,
  "email":         proposalData.email,
  "website":       proposalData.website,
  "location":      proposalData.location,
  "currency":      proposalData.currency,
  "build-weeks":   proposalData.buildWeeks + " weeks",

  "core-fee":          money(coreFee),
  "catering-fee":      money(cateringFee),
  "core-today":        money(today(coreFee)),
  "catering-today":    money(today(cateringFee)),
  "core-save":         money(coreFee - today(coreFee)),
  "catering-save":     money(cateringFee - today(cateringFee)),
  "discount":          Math.round(todayDiscount * 100) + "%",
  "core-hours":        coreHours + " hours",
  "catering-hours":    cateringHours + " hours",
  "core-half":         money(today(coreFee) / 2),
  "catering-half":     money(today(cateringFee) / 2),
  "core-half-std":     money(coreFee / 2),
  "catering-half-std": money(cateringFee / 2),

  "retainer-core":           money(retainerCore),
  "retainer-catering":       money(retainerCatering),
  "retainer-hours-core":     retainer.hoursPerMonth + " hours",
  "retainer-hours-catering": retainer.cateringHoursPerMonth + " hours",
  "third-party":             money(thirdPartyMonthly),
  "monthly-core":            money(retainerCore + thirdPartyMonthly),
  "monthly-catering":        money(retainerCatering + thirdPartyMonthly),
  "retainer-rate":  money(buildRate),
  "adhoc-rate":     money(retainer.adHocRate),
  "retainer-notice": retainer.noticeDays + " days",

  "grp-design":    groupHours("design") + "h",
  "grp-build":     groupHours("build") + "h",
  "grp-systems":   groupHours("systems") + "h",
  "grp-launch":    groupHours("launch") + "h",

  "rev-covers":    String(revenueModel.coversPerTable),
  "rev-spend":     money(revenueModel.averageSpend),
  "rev-days":      String(revenueModel.tradingDays),
  "rev-low":       short(rev(revenueModel.tablesPerDay[0])),
  "rev-mid":       short(rev(revenueModel.tablesPerDay[1])),
  "rev-high":      short(rev(revenueModel.tablesPerDay[2])),

  "promo-tables":   String(promoExample.tables),
  "promo-turnover": money(promoTurnover),
};

/* ---------- binding ---------- */
function applyFills(){
  document.querySelectorAll("[data-fill]").forEach(el => {
    const v = fills[el.dataset.fill];
    if (v !== undefined) el.textContent = v;
  });
}

/* ---------- ledger ---------- */
function renderLedger(){
  const host = document.querySelector("[data-lines]");
  if (!host) return;
  let html = '<div class="cost-row head"><span>Work Allocation</span>' +
             '<span class="cr-hrs">Hours</span><span class="cr-fee">Allocation</span></div>';
  lineItems.forEach(([name, hours, desc, , cateringOnly]) => {
    html += '<div class="cost-row' + (cateringOnly ? ' catering' : '') + '"><div class="cr-name">' + name +
            (cateringOnly ? '<span class="cr-tag">Catering package only</span>' : '') +
            '<span class="cr-desc">' + desc + '</span></div>' +
            '<div class="cr-hrs tnum">' + hours + '</div>' +
            '<div class="cr-fee tnum">' + money(hours * buildRate) + '</div></div>';
  });
  html += '<div class="cost-row total"><div class="cr-name">Foundation</div>' +
          '<div class="cr-hrs tnum">' + coreHours + '</div>' +
          '<div class="cr-fee tnum">' + money(coreFee) + '</div></div>' +
          '<div class="cost-row total"><div class="cr-name">Foundation + Catering</div>' +
          '<div class="cr-hrs tnum">' + cateringHours + '</div>' +
          '<div class="cr-fee tnum">' + money(cateringFee) + '</div></div>';
  host.innerHTML = html;
}

/* ---------- stacked workload bar (segments sized by share of hours) ---------- */
function renderStack(){
  const bar = document.querySelector("[data-stack]");
  const leg = document.querySelector("[data-stack-legend]");
  if (!bar) return;
  bar.innerHTML = groups.map(([key, , cls]) =>
    '<i class="ti-seg ' + cls + '" style="width:' + (groupHours(key) / totalHours * 100).toFixed(2) + '%"></i>'
  ).join("");
  if (leg) leg.innerHTML = groups.map(([key, label, cls]) =>
    '<span><i class="ti-seg ' + cls + '"></i>' + label + ' · <b class="tnum">' + groupHours(key) + 'h</b></span>'
  ).join("");
}

/* ---------- conversion funnel ---------- */
function renderFunnel(){
  const host = document.querySelector("[data-funnel]");
  if (!host) return;
  const max = funnelStages[0][1];
  let html = "";
  funnelStages.forEach(([label, value, note, basis], i) => {
    const w = Math.max(14, Math.pow(value / max, 0.42) * 100);
    let rate = "Entry point";
    if (basis !== null && basis !== undefined){
      const share = value / funnelStages[basis][1];
      rate = (share * 100).toFixed(share < 0.1 ? 1 : 0) + "% of " + funnelStages[basis][0].toLowerCase();
    }
    html += '<div class="fn-row"><div class="fn-bar" style="width:' + w.toFixed(1) + '%">' +
            '<b class="tnum">' + value.toLocaleString("en-ZA").replace(/ /g, ",") + '</b>' +
            '<span>' + label + '</span></div>' +
            '<div class="fn-meta"><b>' + rate + '</b>' + note + '</div></div>';
  });
  html += '<div class="fn-row"><div class="fn-bar" style="width:22%"><span>Customers</span></div>' +
          '<div class="fn-meta"><b>The only number that pays</b>Covers served and functions booked</div></div>';
  host.innerHTML = html;
}

/* ---------- catering pipeline ---------- */
function renderPipeline(){
  const host = document.querySelector("[data-pipeline]");
  if (!host) return;
  host.innerHTML = pipeline.map(([stage, value, note], i) =>
    '<div class="pipe-col"><h6>' + stage + '</h6><div class="cnt">Stage 0' + (i + 1) + ' of 0' + pipeline.length + '</div>' +
    '<div class="pipe-card"><b class="tnum">' + money(value) + '</b><span>' + note + '</span></div></div>'
  ).join("");
}

/* ---------- revenue cards ---------- */
function renderRevenue(){
  const host = document.querySelector("[data-revenue]");
  if (!host) return;
  const { coversPerTable: c, averageSpend: s, tradingDays: d } = revenueModel;
  host.innerHTML = revenueModel.tablesPerDay.map((t, i) =>
    '<div class="figcard' + (i === 1 ? " hi" : "") + '">' +
    '<div class="fc-top">' + t + ' additional tables / day</div>' +
    '<b class="fc-fig">' + short(rev(t)) + '</b>' +
    '<div class="fc-per">Additional turnover / month</div>' +
    '<p class="fc-calc">' + t + ' tables × ' + c + ' guests × ' + money(s) + ' × ' + d + ' days<br>= ' +
    money(rev(t)) + ' per month</p></div>'
  ).join("");
}

/* ============================================================
   NAVIGATION
   ============================================================ */
function initDeck(){
  const pages = [...document.querySelectorAll(".proposal-page")];
  const total = pages.length;

  // footer page numbers
  pages.forEach((p, i) => {
    const n = p.querySelector(".page-num");
    if (n) n.textContent = String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  });

  // side index
  const side = document.querySelector(".sidenav");
  if (side){
    side.innerHTML = pages.map((p, i) =>
      '<button class="sn-item" data-go="' + i + '"><i class="sn-tick"></i>' +
      '<span class="sn-label">' + (p.dataset.num ? p.dataset.num + " · " : "") + (p.dataset.title || "") + '</span></button>'
    ).join("");
    side.addEventListener("click", e => {
      const b = e.target.closest("[data-go]");
      if (b) pages[+b.dataset.go].scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const tbTitle = document.querySelector(".tb-title");
  const tbCount = document.querySelector(".tb-count");
  const bar     = document.querySelector(".progress");
  const items   = [...document.querySelectorAll(".sn-item")];
  let current   = 0;

  const setActive = i => {
    current = i;
    items.forEach((it, k) => it.classList.toggle("active", k === i));
    if (tbTitle) tbTitle.textContent = pages[i].dataset.title || "";
    if (tbCount) tbCount.textContent = String(i + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0");
  };

  const spy = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) setActive(pages.indexOf(en.target)); });
  }, { rootMargin: "-45% 0px -45% 0px" });
  pages.forEach(p => spy.observe(p));

  const reveal = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (en.isIntersecting){
        const kids = en.target.querySelectorAll(".page-inner>*,.cover>*,.sp-dark>*,.sp-light>*");
        kids.forEach((k, i) => k.style.transitionDelay = (i * 55) + "ms");
        en.target.classList.add("revealed");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  pages.forEach(p => reveal.observe(p));

  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const go = d => {
    const i = Math.min(total - 1, Math.max(0, current + d));
    pages[i].scrollIntoView({ behavior: "smooth", block: "start" });
  };
  document.querySelector("[data-prev]")?.addEventListener("click", () => go(-1));
  document.querySelector("[data-next]")?.addEventListener("click", () => go(1));
  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  document.addEventListener("keydown", e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowRight" || k === "PageDown"){ e.preventDefault(); go(1); }
    else if (k === "ArrowUp" || k === "ArrowLeft" || k === "PageUp"){ e.preventDefault(); go(-1); }
    else if (k === "Home"){ e.preventDefault(); pages[0].scrollIntoView({ behavior: "smooth" }); }
    else if (k === "End"){ e.preventDefault(); pages[total - 1].scrollIntoView({ behavior: "smooth" }); }
  });

  setActive(0);
}

document.addEventListener("DOMContentLoaded", () => {
  applyFills();
  renderLedger();
  renderStack();
  renderFunnel();
  renderPipeline();
  renderRevenue();
  initDeck();
});
