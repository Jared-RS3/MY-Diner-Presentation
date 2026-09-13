/* ============================================================
   DAYBREAK TERMS & CONDITIONS — MYDINERS × DAYBREAK (DB-MYD-001)
   Data layer + A4 sheet paginator.
   Keep termsData in step with proposalData in script.js.
   ============================================================ */

document.documentElement.classList.add("js");

const termsData = {
  clientName:   "MYDiners",
  projectName:  "MYDiners Digital Growth Foundation",
  reference:    "DB-MYD-001 · TERMS V1",
  proposalRef:  "DB-MYD-001 · V1",
  date:         "13 September 2026",
  companyName:  "Daybreak",
  email:        "contact@daybreaktechinnovations.com",
  retainerNoticeDays: 30,
};

/* Clause numbers marked ◆ are read from the markup, so the notice and the
   signature acknowledgement always list the clauses that actually carry initials. */
const markedClauses = [...document.querySelectorAll(".clause[data-initial] .cl-n")]
  .map(n => String(parseInt(n.textContent, 10)));
const listJoin = a => a.length < 2 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

const fills = {
  "client-name":     termsData.clientName,
  "project-name":    termsData.projectName,
  "reference":       termsData.reference,
  "proposal-ref":    termsData.proposalRef,
  "date":            termsData.date,
  "company":         termsData.companyName,
  "email":           termsData.email,
  "retainer-notice": termsData.retainerNoticeDays + " days'",
  "marked-list":     listJoin(markedClauses),
};

function applyFills(){
  document.querySelectorAll("[data-fill]").forEach(el => {
    const v = fills[el.dataset.fill];
    if (v !== undefined) el.textContent = v;
  });
  document.querySelectorAll("input[data-default]").forEach(el => {
    const v = fills[el.dataset.default];
    if (v !== undefined && !el.value) el.value = v;
  });
}

/* ---------- fields: remembered in this browser only ---------- */
const STORE = "daybreak-terms:" + termsData.reference;

function initFields(){
  const inputs = [...document.querySelectorAll(".doc input[name]")];
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STORE) || "null"); } catch (e) {}
  if (saved) inputs.forEach(el => {
    if (!(el.name in saved)) return;
    if (el.type === "radio") el.checked = saved[el.name] === el.value;
    else el.value = saved[el.name];
  });
  const save = () => {
    const out = {};
    inputs.forEach(el => {
      if (el.type === "radio"){ if (el.checked) out[el.name] = el.value; }
      else out[el.name] = el.value;
    });
    try { localStorage.setItem(STORE, JSON.stringify(out)); } catch (e) {}
  };
  document.querySelector(".doc").addEventListener("input", save);
  document.querySelector(".doc").addEventListener("change", save);
}

/* ============================================================
   PAGINATION
   Each .region is poured into fixed A4 sheets. "cols" regions fill
   the left column, then the right, then a new sheet. Clauses split
   between sub-clauses; a heading is never left alone at the foot.
   ============================================================ */
function makeSheet(layout, head){
  const sheet = document.createElement("section");
  sheet.className = "sheet light";
  sheet.innerHTML =
    '<header class="sh-head"><span class="sh-brand">DAYBREAK</span>' +
    '<span class="sh-tag">TERMS &amp; CONDITIONS<i></i><b>' + termsData.reference + '</b></span></header>' +
    '<div class="sh-body"></div>' +
    '<footer class="sh-foot"><span>MYDINERS × DAYBREAK</span>' +
    '<span class="sh-init">Initials <em>Client</em><i></i><em>Daybreak</em><i></i></span>' +
    '<span class="sh-num"></span></footer>';
  const body = sheet.querySelector(".sh-body");
  if (head) body.appendChild(head);
  const wrap = document.createElement("div");
  if (layout === "cols"){
    wrap.className = "sh-cols";
    wrap.innerHTML = '<div class="sh-col"></div><div class="sh-col"></div>';
  } else {
    wrap.className = "sh-full";
  }
  body.appendChild(wrap);
  return { sheet, boxes: layout === "cols" ? [...wrap.children] : [wrap] };
}

function paginateRegion(region){
  const layout = region.dataset.layout;
  const head = region.querySelector(":scope > .region-head");
  const children = [...region.children].filter(el => el !== head);
  const blocks = children.filter(el => !el.hasAttribute("data-tail"));
  const tail = children.filter(el => el.hasAttribute("data-tail"));
  let queue = [];
  let box;

  const addSheet = withHead => {
    const { sheet, boxes } = makeSheet(layout, withHead ? head : null);
    region.before(sheet);
    queue.push(...boxes);
  };
  const next = () => { if (!queue.length) addSheet(false); box = queue.shift(); };
  const fits = () => box.scrollHeight <= box.clientHeight + 1;

  addSheet(true);
  box = queue.shift();

  const shell = (clause, heading, list) => {
    const el = clause.cloneNode(false);
    el.appendChild(heading);
    const ol = list.cloneNode(false);
    el.appendChild(ol);
    return { el, ol };
  };

  const placeClause = clause => {
    const heading = clause.querySelector(":scope > h3");
    const list = clause.querySelector(":scope > ol");
    const items = [...list.children];
    const contHeading = () => {
      const h = heading.cloneNode(true);
      h.classList.add("cont");
      return h;
    };

    let part = shell(clause, heading, list);
    box.appendChild(part.el);
    let placed = 0;

    // a sub-clause with an (a), (b), (c) list may break between those items
    const splitItem = item => {
      const alpha = item.querySelector(".alpha");
      if (!alpha || alpha.children.length < 2) return null;
      part.ol.appendChild(item);
      const moved = [];
      while (!fits() && alpha.children.length > 1){
        const last = alpha.lastElementChild;
        moved.unshift(last);
        last.remove();
      }
      if (!fits() || !moved.length){
        moved.forEach(m => alpha.appendChild(m));
        item.remove();
        return null;
      }
      const rest = document.createElement("li");
      rest.innerHTML = '<span class="sn"></span><div><ol class="alpha"></ol></div>';
      moved.forEach(m => rest.querySelector(".alpha").appendChild(m));
      return rest;
    };

    for (const item of items){
      part.ol.appendChild(item);
      if (fits()){ placed++; continue; }
      item.remove();

      const rest = splitItem(item);
      if (rest){
        next();
        part = shell(clause, contHeading(), list);
        box.appendChild(part.el);
        part.ol.appendChild(rest);
        placed = 1;
        continue;
      }

      if (placed === 0){
        // heading would be stranded: carry the heading to the next box with this item
        part.el.remove();
        if (box.childElementCount === 0){ part.ol.appendChild(item); box.appendChild(part.el); placed = 1; continue; }
        next();
        box.appendChild(part.el);
        part.ol.appendChild(item);
        placed = 1;
        continue;
      }

      next();
      part = shell(clause, contHeading(), list);
      box.appendChild(part.el);
      part.ol.appendChild(item);
      placed = 1;
    }
  };

  for (const block of blocks){
    box.appendChild(block);
    if (fits()) continue;
    block.remove();
    if (block.matches(".clause")){ placeClause(block); continue; }
    if (box.childElementCount) next();
    box.appendChild(block);
  }

  if (tail.length) finishWithTail(box.closest(".sheet"), tail);
  region.remove();
}

/* The final sheet of a column region is rebalanced into two even columns
   so a full-width tail (the signatures) can sit beneath the last clause.
   If the tail does not fit there, it takes a sheet of its own. */
function finishWithTail(sheet, tail){
  const cols = sheet.querySelector(".sh-cols");
  const tailBox = document.createElement("div");
  tailBox.className = "sh-tail";
  tail.forEach(t => tailBox.appendChild(t));

  if (cols){
    const [left, right] = cols.children;
    const lastLeft = left.lastElementChild, firstRight = right.firstElementChild;
    if (lastLeft && firstRight && firstRight.querySelector(":scope > h3.cont")){
      const ol = lastLeft.querySelector(":scope > ol");
      [...firstRight.querySelector(":scope > ol").children].forEach(li => ol.appendChild(li));
      firstRight.remove();
    }
    const balanced = document.createElement("div");
    balanced.className = "sh-balanced";
    [...left.children, ...right.children].forEach(el => balanced.appendChild(el));
    cols.replaceWith(balanced);
    balanced.after(tailBox);
  } else {
    sheet.querySelector(".sh-full").after(tailBox);
  }

  const body = sheet.querySelector(".sh-body");
  if (body.scrollHeight > body.clientHeight + 1){
    const { sheet: own, boxes } = makeSheet("full", null);
    sheet.after(own);
    boxes[0].appendChild(tailBox);
  }
}

function renderContents(){
  const host = document.querySelector("[data-contents]");
  if (!host) return;
  const sheets = [...document.querySelectorAll(".doc > .sheet")];
  const pageOf = el => String(sheets.indexOf(el.closest(".sheet")) + 1).padStart(2, "0");
  host.innerHTML = [...document.querySelectorAll("[data-toc], .clause > h3:not(.cont)")].map(el => {
    const num = el.matches("h3") ? el.querySelector(".cl-n").textContent : "";
    const title = el.matches("h3") ? el.querySelector(".cl-t").textContent : el.dataset.toc;
    return '<li' + (num ? "" : ' class="part"') + '><i>' + (num || "·") + '</i><span>' + title +
           '</span><b>' + pageOf(el) + '</b></li>';
  }).join("");
}

function paginate(){
  document.querySelectorAll(".doc > .region").forEach(paginateRegion);
  const sheets = [...document.querySelectorAll(".doc > .sheet")];
  const total = String(sheets.length).padStart(2, "0");
  sheets.forEach((s, i) => {
    const n = s.querySelector(".sh-num");
    if (n) n.textContent = String(i + 1).padStart(2, "0") + " / " + total;
  });
  renderContents();
}

/* ---------- phones: shrink the sheets to fit, never on paper ---------- */
function fitToScreen(){
  const doc = document.querySelector(".doc");
  const sheet = doc.querySelector(".sheet");
  if (!sheet) return;
  doc.style.zoom = "";
  const z = Math.min(1, (window.innerWidth - 32) / sheet.offsetWidth);
  if (z < 1) doc.style.zoom = z.toFixed(3);
}

/* Pagination measures real text, so wait for Inter (or give up after 3s
   and paginate with the fallback face, which the print will then match). */
function fontsReady(){
  if (!document.fonts) return Promise.resolve();
  const want = ["300 11px Inter", "400 11px Inter", "500 11px Inter", "600 11px Inter"]
    .map(f => document.fonts.load(f).catch(() => {}));
  const timeout = new Promise(r => setTimeout(r, 3000));
  return Promise.race([Promise.all(want).then(() => document.fonts.ready), timeout]);
}

document.addEventListener("DOMContentLoaded", () => {
  applyFills();
  initFields();
  document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

  fontsReady().then(() => {
    paginate();
    fitToScreen();
    window.addEventListener("resize", fitToScreen);
    document.documentElement.classList.add("paginated");
  });
});
