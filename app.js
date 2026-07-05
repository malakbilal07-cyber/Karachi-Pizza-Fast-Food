/* ==========================================================
   KARACHI PIZZA & FAST FOOD — POS APP LOGIC
   All data persisted to localStorage. No backend required —
   works entirely as a static site (GitHub Pages compatible).
   ========================================================== */

const STORAGE_KEYS = {
  menu: "kp_menu",
  categories: "kp_categories",
  orders: "kp_orders",
  settings: "kp_settings",
  pin: "kp_pin",
  session: "kp_session"
};

/* ---------------- State ---------------- */
let state = {
  menu: [],
  categories: [],
  orders: [],
  settings: { name: "Karachi Pizza & Fast Food", address: "", phone: "0310-0004829" },
  heldOrders: [],    // parked orders for "Hold / Resume" feature
  cart: [],          // {itemId, name, category, size, unitPrice, qty, note}
  activeCategory: "All",
  pendingItem: null, // item being configured in modal
  editingMenuId: null
};

/* ---------------- Persistence ---------------- */
function loadState() {
  state.menu = JSON.parse(localStorage.getItem(STORAGE_KEYS.menu) || "null") || DEFAULT_MENU;
  state.categories = JSON.parse(localStorage.getItem(STORAGE_KEYS.categories) || "null") || DEFAULT_CATEGORIES;
  state.orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || "[]");
  state.settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || "null") || state.settings;
  if (!localStorage.getItem(STORAGE_KEYS.pin)) localStorage.setItem(STORAGE_KEYS.pin, "1234");
  saveMenu(); saveCategories();
}
function saveMenu(){ localStorage.setItem(STORAGE_KEYS.menu, JSON.stringify(state.menu)); }
function saveCategories(){ localStorage.setItem(STORAGE_KEYS.categories, JSON.stringify(state.categories)); }
function saveOrders(){ localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders)); }
function saveSettings(){ localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings)); }

/* ---------------- Helpers ---------------- */
function money(n){ return "Rs " + Math.round(n).toLocaleString("en-PK"); }
function todayStr(d = new Date()){ return d.toISOString().slice(0,10); }
function monthStr(d = new Date()){ return d.toISOString().slice(0,7); }
function toast(msg){
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.remove("hidden");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(()=>t.classList.add("hidden"), 2400);
}
function genOrderNumber(){
  const n = state.orders.length + 1;
  return "KP" + String(n).padStart(5, "0");
}

/* ==========================================================
   LOGIN
   ========================================================== */
document.getElementById("loginForm").addEventListener("submit", e=>{
  e.preventDefault();
  const pin = document.getElementById("pinInput").value.trim();
  const stored = localStorage.getItem(STORAGE_KEYS.pin) || "1234";
  if (pin === stored){
    sessionStorage.setItem(STORAGE_KEYS.session, "1");
    enterApp();
  } else {
    toast("Incorrect PIN");
  }
});
document.getElementById("logoutBtn").addEventListener("click", ()=>{
  sessionStorage.removeItem(STORAGE_KEYS.session);
  document.getElementById("app").classList.add("hidden");
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("pinInput").value = "";
});

function enterApp(){
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("app").classList.remove("hidden");
  renderAll();
}

/* ==========================================================
   NAVIGATION
   ========================================================== */
document.querySelectorAll(".nav-btn").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    document.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const view = btn.dataset.view;
    document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
    document.getElementById("view-"+view).classList.add("active");
    document.querySelector(".sidebar").classList.remove("open");
    if (view === "bills") renderBills();
    if (view === "daily") renderDaily();
    if (view === "monthly") renderMonthly();
    if (view === "menu-manager") renderMenuManager();
    if (view === "settings") renderSettings();
  });
});
document.getElementById("mobileMenuBtn").addEventListener("click", ()=>{
  document.querySelector(".sidebar").classList.toggle("open");
});

/* ==========================================================
   NEW ORDER VIEW
   ========================================================== */
function renderCategoryTabs(){
  const wrap = document.getElementById("categoryTabs");
  const cats = ["All", "🔥 Popular", ...state.categories];
  wrap.innerHTML = cats.map(c =>
    `<button class="cat-tab ${c===state.activeCategory?'active':''}" data-cat="${c}">${c}</button>`
  ).join("");
  wrap.querySelectorAll(".cat-tab").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      state.activeCategory = btn.dataset.cat;
      renderCategoryTabs();
      renderMenuGrid();
    });
  });
}

function renderMenuGrid(){
  const grid = document.getElementById("menuGrid");
  const search = document.getElementById("menuSearch").value.trim().toLowerCase();
  let items = state.menu;
  if (state.activeCategory === "🔥 Popular") items = items.filter(i=>i.popular);
  else if (state.activeCategory !== "All") items = items.filter(i=>i.category===state.activeCategory);
  if (search) items = items.filter(i=>i.name.toLowerCase().includes(search));

  if (!items.length){
    grid.innerHTML = `<p class="empty-hint">No items found.</p>`;
    return;
  }

  grid.innerHTML = items.map(item=>{
    const priceLabel = item.medium || item.large
      ? `${money(item.small)} – ${money(item.large || item.medium)}`
      : money(item.small);
    return `
      <div class="menu-item-card" data-id="${item.id}">
        <span class="item-cat">${item.category}</span>
        <span class="item-name">${item.name}</span>
        <span class="item-price">${priceLabel}</span>
      </div>`;
  }).join("");

  grid.querySelectorAll(".menu-item-card").forEach(card=>{
    card.addEventListener("click", ()=>openItemModal(card.dataset.id));
  });
}
document.getElementById("menuSearch").addEventListener("input", renderMenuGrid);

/* ---------------- Item Modal (size + qty) ---------------- */
let modalQty = 1, modalSize = "small";

function openItemModal(itemId){
  const item = state.menu.find(i=>i.id===itemId);
  if (!item) return;
  state.pendingItem = item;
  modalQty = 1;

  document.getElementById("itemModalTitle").textContent = item.name;
  document.getElementById("itemNote").value = "";
  document.getElementById("qtyValue").textContent = "1";

  const sizesWrap = document.getElementById("itemModalSizes");
  const sizes = [];
  if (item.small != null) sizes.push({ key:"small", label:"Regular", price:item.small });
  if (item.medium != null) sizes.push({ key:"medium", label:"Medium", price:item.medium });
  if (item.large != null) sizes.push({ key:"large", label:"Large", price:item.large });

  modalSize = sizes[0]?.key || "small";
  sizesWrap.innerHTML = sizes.map(s=>
    `<div class="size-opt ${s.key===modalSize?'active':''}" data-size="${s.key}">
       <span class="sz-label">${s.label}</span>
       <span class="sz-price">${money(s.price)}</span>
     </div>`
  ).join("");
  sizesWrap.querySelectorAll(".size-opt").forEach(el=>{
    el.addEventListener("click", ()=>{
      modalSize = el.dataset.size;
      sizesWrap.querySelectorAll(".size-opt").forEach(x=>x.classList.remove("active"));
      el.classList.add("active");
    });
  });

  document.getElementById("itemModal").classList.remove("hidden");
}
document.getElementById("qtyMinus").addEventListener("click", ()=>{
  modalQty = Math.max(1, modalQty-1);
  document.getElementById("qtyValue").textContent = modalQty;
});
document.getElementById("qtyPlus").addEventListener("click", ()=>{
  modalQty += 1;
  document.getElementById("qtyValue").textContent = modalQty;
});
document.getElementById("itemModalCancel").addEventListener("click", ()=>{
  document.getElementById("itemModal").classList.add("hidden");
});
document.getElementById("itemModalAdd").addEventListener("click", ()=>{
  const item = state.pendingItem;
  if (!item) return;
  const price = item[modalSize] ?? item.small;
  const note = document.getElementById("itemNote").value.trim();
  const sizeLabel = modalSize === "small" ? (item.medium||item.large ? "Regular" : "") : (modalSize==="medium"?"Medium":"Large");

  state.cart.push({
    itemId: item.id, name: item.name, category: item.category,
    size: sizeLabel, unitPrice: price, qty: modalQty, note
  });
  document.getElementById("itemModal").classList.add("hidden");
  renderCart();
  toast(`Added ${item.name} ×${modalQty}`);
});

/* ---------------- Cart ---------------- */
function renderCart(){
  const wrap = document.getElementById("cartItems");
  if (!state.cart.length){
    wrap.innerHTML = `<p class="empty-hint">No items added yet.</p>`;
  } else {
    wrap.innerHTML = state.cart.map((ci, idx)=>`
      <div class="cart-item">
        <div>
          <div class="ci-name">${ci.name} ${ci.size ? `<span style="color:var(--cream-dim);font-weight:500">(${ci.size})</span>` : ""}</div>
          <div class="ci-meta">${ci.qty} × ${money(ci.unitPrice)}${ci.note ? " • " + ci.note : ""}</div>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="ci-price">${money(ci.unitPrice*ci.qty)}</span>
          <button class="ci-remove" data-idx="${idx}" title="Remove">×</button>
        </div>
      </div>
    `).join("");
    wrap.querySelectorAll(".ci-remove").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        state.cart.splice(Number(btn.dataset.idx), 1);
        renderCart();
      });
    });
  }
  updateTotals();
}

function updateTotals(){
  const subtotal = state.cart.reduce((s,ci)=>s+ci.unitPrice*ci.qty, 0);
  const discVal = Number(document.getElementById("discountInput").value) || 0;
  const discType = document.getElementById("discountType").value;
  const discount = discType === "pct" ? subtotal*discVal/100 : discVal;
  const total = Math.max(0, subtotal - discount);

  document.getElementById("cartSubtotal").textContent = money(subtotal);
  document.getElementById("cartDiscount").textContent = "-" + money(discount);
  document.getElementById("cartTotal").textContent = money(total);
}
document.getElementById("discountInput").addEventListener("input", updateTotals);
document.getElementById("discountType").addEventListener("change", updateTotals);

document.getElementById("clearCartBtn").addEventListener("click", ()=>{
  state.cart = [];
  document.getElementById("discountInput").value = 0;
  renderCart();
});

document.getElementById("chargeBtn").addEventListener("click", ()=>{
  if (!state.cart.length){ toast("Cart is empty"); return; }

  const subtotal = state.cart.reduce((s,ci)=>s+ci.unitPrice*ci.qty, 0);
  const discVal = Number(document.getElementById("discountInput").value) || 0;
  const discType = document.getElementById("discountType").value;
  const discount = discType === "pct" ? subtotal*discVal/100 : discVal;
  const total = Math.max(0, subtotal - discount);

  const order = {
    id: genOrderNumber(),
    datetime: new Date().toISOString(),
    type: document.getElementById("orderType").value,
    customer: document.getElementById("orderCustomer").value.trim() || "—",
    payment: document.getElementById("paymentMethod").value,
    items: JSON.parse(JSON.stringify(state.cart)),
    subtotal, discount, total
  };
  state.orders.push(order);
  saveOrders();

  showReceipt(order);

  state.cart = [];
  document.getElementById("discountInput").value = 0;
  document.getElementById("orderCustomer").value = "";
  renderCart();
  toast("Order completed: " + order.id);
});

/* ---------------- Receipt ---------------- */
function showReceipt(order){
  const s = state.settings;
  const content = document.getElementById("receiptContent");
  content.innerHTML = `
    <div class="r-head">
      <div class="r-name">${s.name}</div>
      <div class="r-sub">${s.address || ""}</div>
      <div class="r-sub">${s.phone || ""}</div>
    </div>
    <div class="r-line"></div>
    <div class="r-row"><span>Order #</span><span>${order.id}</span></div>
    <div class="r-row"><span>Date</span><span>${new Date(order.datetime).toLocaleString()}</span></div>
    <div class="r-row"><span>Type</span><span>${order.type}</span></div>
    <div class="r-row"><span>Customer</span><span>${order.customer}</span></div>
    <div class="r-line"></div>
    ${order.items.map(ci=>`
      <div class="r-row">
        <span>${ci.name}${ci.size?` (${ci.size})`:""} ×${ci.qty}</span>
        <span>${money(ci.unitPrice*ci.qty)}</span>
      </div>
    `).join("")}
    <div class="r-line"></div>
    <div class="r-row"><span>Subtotal</span><span>${money(order.subtotal)}</span></div>
    <div class="r-row"><span>Discount</span><span>-${money(order.discount)}</span></div>
    <div class="r-row r-total"><span>TOTAL</span><span>${money(order.total)}</span></div>
    <div class="r-row"><span>Payment</span><span>${order.payment}</span></div>
    <div class="r-line"></div>
    <div style="text-align:center;color:var(--cream-dim);font-size:11px">Thank you! Please visit again.</div>
  `;
  document.getElementById("receiptModal").classList.remove("hidden");
}
document.getElementById("receiptClose").addEventListener("click", ()=>{
  document.getElementById("receiptModal").classList.add("hidden");
});
document.getElementById("receiptPrint").addEventListener("click", ()=> window.print());

/* ==========================================================
   BILLS / ORDERS VIEW
   ========================================================== */
function renderBills(){
  const dateFilter = document.getElementById("billsDateFilter").value;
  const search = document.getElementById("billsSearch").value.trim().toLowerCase();

  let orders = [...state.orders].reverse();
  if (dateFilter) orders = orders.filter(o=>todayStr(new Date(o.datetime))===dateFilter);
  if (search) orders = orders.filter(o=>
    o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search)
  );

  const body = document.getElementById("billsTableBody");
  if (!orders.length){
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:30px">No orders found.</td></tr>`;
    return;
  }
  body.innerHTML = orders.map(o=>`
    <tr>
      <td class="mono">${o.id}</td>
      <td>${new Date(o.datetime).toLocaleString()}</td>
      <td>${o.type}</td>
      <td>${o.customer}</td>
      <td>${o.items.reduce((s,i)=>s+i.qty,0)} items</td>
      <td>${o.payment}</td>
      <td class="mono">${money(o.total)}</td>
      <td><button data-id="${o.id}" class="view-receipt-btn">View</button></td>
    </tr>
  `).join("");
  body.querySelectorAll(".view-receipt-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const order = state.orders.find(o=>o.id===btn.dataset.id);
      if (order) showReceipt(order);
    });
  });
}
document.getElementById("billsDateFilter").addEventListener("change", renderBills);
document.getElementById("billsSearch").addEventListener("input", renderBills);
document.getElementById("billsExportCsv").addEventListener("click", ()=>{
  const rows = [["Order #","Date","Type","Customer","Items","Payment","Subtotal","Discount","Total"]];
  state.orders.forEach(o=>{
    rows.push([o.id, new Date(o.datetime).toLocaleString(), o.type, o.customer,
      o.items.map(i=>`${i.name} x${i.qty}`).join("; "), o.payment, o.subtotal, o.discount, o.total]);
  });
  const csv = rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([csv], {type:"text/csv"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "karachi-pizza-orders.csv";
  a.click();
});

/* ==========================================================
   DAILY SALES VIEW
   ========================================================== */
function renderDaily(){
  const dateInput = document.getElementById("dailyDate");
  if (!dateInput.value) dateInput.value = todayStr();
  const day = dateInput.value;

  const orders = state.orders.filter(o=>todayStr(new Date(o.datetime))===day);
  const totalSales = orders.reduce((s,o)=>s+o.total,0);
  const itemsSold = orders.reduce((s,o)=>s+o.items.reduce((x,i)=>x+i.qty,0),0);

  document.getElementById("dailyTotalSales").textContent = money(totalSales);
  document.getElementById("dailyOrderCount").textContent = orders.length;
  document.getElementById("dailyAvgOrder").textContent = money(orders.length ? totalSales/orders.length : 0);
  document.getElementById("dailyItemsSold").textContent = itemsSold;

  renderCategoryChart("dailyCategoryChart", orders);
  renderTopItems("dailyTopItems", orders);

  const body = document.getElementById("dailyOrdersBody");
  if (!orders.length){
    body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:24px">No orders on this day.</td></tr>`;
  } else {
    body.innerHTML = [...orders].reverse().map(o=>`
      <tr>
        <td class="mono">${o.id}</td>
        <td>${new Date(o.datetime).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</td>
        <td>${o.type}</td>
        <td>${o.payment}</td>
        <td class="mono">${money(o.total)}</td>
      </tr>
    `).join("");
  }
}
document.getElementById("dailyDate").addEventListener("change", renderDaily);

/* ==========================================================
   MONTHLY SALES VIEW
   ========================================================== */
function renderMonthly(){
  const monthInput = document.getElementById("monthlyMonth");
  if (!monthInput.value) monthInput.value = monthStr();
  const month = monthInput.value;

  const orders = state.orders.filter(o=>monthStr(new Date(o.datetime))===month);
  const totalSales = orders.reduce((s,o)=>s+o.total,0);

  document.getElementById("monthlyTotalSales").textContent = money(totalSales);
  document.getElementById("monthlyOrderCount").textContent = orders.length;
  document.getElementById("monthlyAvgOrder").textContent = money(orders.length ? totalSales/orders.length : 0);

  // Daily breakdown
  const byDay = {};
  orders.forEach(o=>{
    const d = todayStr(new Date(o.datetime));
    byDay[d] = (byDay[d]||0) + o.total;
  });
  const bestDay = Object.entries(byDay).sort((a,b)=>b[1]-a[1])[0];
  document.getElementById("monthlyBestDay").textContent = bestDay
    ? `${bestDay[0].slice(8)} (${money(bestDay[1])})` : "—";

  const [year, mo] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mo, 0).getDate();
  const maxVal = Math.max(1, ...Object.values(byDay));
  let chartHtml = "";
  for (let d=1; d<=daysInMonth; d++){
    const key = `${month}-${String(d).padStart(2,'0')}`;
    const val = byDay[key] || 0;
    chartHtml += `
      <div class="bar-row">
        <span class="bar-label">Day ${d}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${(val/maxVal*100).toFixed(1)}%"></div></div>
        <span class="bar-value">${val ? money(val) : "-"}</span>
      </div>`;
  }
  document.getElementById("monthlyDailyChart").innerHTML = chartHtml;

  renderCategoryChart("monthlyCategoryChart", orders);
  renderTopItems("monthlyTopItems", orders);
}
document.getElementById("monthlyMonth").addEventListener("change", renderMonthly);

/* ---------------- Shared chart helpers ---------------- */
function renderCategoryChart(elId, orders){
  const byCat = {};
  orders.forEach(o=>o.items.forEach(i=>{
    byCat[i.category] = (byCat[i.category]||0) + i.unitPrice*i.qty;
  }));
  const entries = Object.entries(byCat).sort((a,b)=>b[1]-a[1]);
  const max = Math.max(1, ...entries.map(e=>e[1]));
  const el = document.getElementById(elId);
  if (!entries.length){ el.innerHTML = `<p class="empty-hint">No sales data.</p>`; return; }
  el.innerHTML = entries.map(([cat,val])=>`
    <div class="bar-row">
      <span class="bar-label">${cat}</span>
      <div class="bar-track"><div class="bar-fill" style="width:${(val/max*100).toFixed(1)}%"></div></div>
      <span class="bar-value">${money(val)}</span>
    </div>
  `).join("");
}

function renderTopItems(elId, orders){
  const byItem = {};
  orders.forEach(o=>o.items.forEach(i=>{
    byItem[i.name] = (byItem[i.name]||0) + i.qty;
  }));
  const entries = Object.entries(byItem).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const el = document.getElementById(elId);
  if (!entries.length){ el.innerHTML = `<p class="empty-hint">No sales data.</p>`; return; }
  el.innerHTML = entries.map(([name,qty])=>`<li>${name} — <span class="qty">${qty} sold</span></li>`).join("");
}

/* ==========================================================
   MENU MANAGER VIEW
   ========================================================== */
function renderMenuManager(){
  const body = document.getElementById("menuManagerBody");
  body.innerHTML = state.menu.map(item=>`
    <tr>
      <td>${item.category}</td>
      <td>${item.name}</td>
      <td class="mono">${item.small!=null ? money(item.small) : "-"}</td>
      <td class="mono">${item.medium!=null ? money(item.medium) : "-"}</td>
      <td class="mono">${item.large!=null ? money(item.large) : "-"}</td>
      <td><button data-id="${item.id}" class="toggle-popular-btn" title="Toggle Popular">${item.popular ? "🔥" : "☆"}</button></td>
      <td>
        <button data-id="${item.id}" class="edit-item-btn">Edit</button>
        <button data-id="${item.id}" class="delete-item-btn">Delete</button>
      </td>
    </tr>
  `).join("");
  body.querySelectorAll(".edit-item-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>openEditItemModal(btn.dataset.id));
  });
  body.querySelectorAll(".delete-item-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      if (confirm("Delete this menu item?")){
        state.menu = state.menu.filter(i=>i.id!==btn.dataset.id);
        saveMenu();
        renderMenuManager();
        renderMenuGrid();
        toast("Item deleted");
      }
    });
  });
  body.querySelectorAll(".toggle-popular-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const item = state.menu.find(i=>i.id===btn.dataset.id);
      item.popular = !item.popular;
      saveMenu();
      renderMenuManager();
      renderMenuGrid();
    });
  });
}

function populateCategorySelect(){
  const sel = document.getElementById("editItemCategory");
  sel.innerHTML = state.categories.map(c=>`<option value="${c}">${c}</option>`).join("");
}

document.getElementById("addItemBtn").addEventListener("click", ()=>{
  state.editingMenuId = null;
  document.getElementById("editItemModalTitle").textContent = "Add Item";
  populateCategorySelect();
  document.getElementById("editItemName").value = "";
  document.getElementById("editItemPriceSmall").value = "";
  document.getElementById("editItemPriceMed").value = "";
  document.getElementById("editItemPriceLarge").value = "";
  document.getElementById("editItemPopular").checked = false;
  document.getElementById("editItemModal").classList.remove("hidden");
});

function openEditItemModal(id){
  const item = state.menu.find(i=>i.id===id);
  if (!item) return;
  state.editingMenuId = id;
  document.getElementById("editItemModalTitle").textContent = "Edit Item";
  populateCategorySelect();
  document.getElementById("editItemCategory").value = item.category;
  document.getElementById("editItemName").value = item.name;
  document.getElementById("editItemPriceSmall").value = item.small ?? "";
  document.getElementById("editItemPriceMed").value = item.medium ?? "";
  document.getElementById("editItemPriceLarge").value = item.large ?? "";
  document.getElementById("editItemPopular").checked = !!item.popular;
  document.getElementById("editItemModal").classList.remove("hidden");
}
document.getElementById("editItemCancel").addEventListener("click", ()=>{
  document.getElementById("editItemModal").classList.add("hidden");
});
document.getElementById("editItemSave").addEventListener("click", ()=>{
  const name = document.getElementById("editItemName").value.trim();
  const category = document.getElementById("editItemCategory").value;
  const small = document.getElementById("editItemPriceSmall").value;
  const medium = document.getElementById("editItemPriceMed").value;
  const large = document.getElementById("editItemPriceLarge").value;

  if (!name || small === ""){ toast("Name and price are required"); return; }

  const data = {
    name, category,
    small: Number(small),
    medium: medium === "" ? null : Number(medium),
    large: large === "" ? null : Number(large),
    popular: document.getElementById("editItemPopular").checked
  };

  if (state.editingMenuId){
    const item = state.menu.find(i=>i.id===state.editingMenuId);
    Object.assign(item, data);
  } else {
    state.menu.push({ id: uid("m"), ...data });
  }
  saveMenu();
  document.getElementById("editItemModal").classList.add("hidden");
  renderMenuManager();
  renderMenuGrid();
  toast("Menu item saved");
});

/* ==========================================================
   SETTINGS VIEW
   ========================================================== */
function renderSettings(){
  document.getElementById("setRestName").value = state.settings.name || "";
  document.getElementById("setRestAddress").value = state.settings.address || "";
  document.getElementById("setRestPhone").value = state.settings.phone || "";
}
document.getElementById("saveRestInfo").addEventListener("click", ()=>{
  state.settings.name = document.getElementById("setRestName").value.trim();
  state.settings.address = document.getElementById("setRestAddress").value.trim();
  state.settings.phone = document.getElementById("setRestPhone").value.trim();
  saveSettings();
  toast("Restaurant info saved");
});
document.getElementById("savePin").addEventListener("click", ()=>{
  const pin = document.getElementById("setNewPin").value.trim();
  if (pin.length < 4){ toast("PIN must be at least 4 digits"); return; }
  localStorage.setItem(STORAGE_KEYS.pin, pin);
  document.getElementById("setNewPin").value = "";
  toast("PIN updated");
});

document.getElementById("exportDataBtn").addEventListener("click", ()=>{
  const data = {
    menu: state.menu, categories: state.categories,
    orders: state.orders, settings: state.settings
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `karachi-pizza-backup-${todayStr()}.json`;
  a.click();
});
document.getElementById("importDataInput").addEventListener("change", e=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const data = JSON.parse(reader.result);
      if (data.menu) state.menu = data.menu;
      if (data.categories) state.categories = data.categories;
      if (data.orders) state.orders = data.orders;
      if (data.settings) state.settings = data.settings;
      saveMenu(); saveCategories(); saveOrders(); saveSettings();
      renderAll();
      toast("Data imported successfully");
    } catch(err){
      toast("Invalid file");
    }
  };
  reader.readAsText(file);
});
document.getElementById("resetDataBtn").addEventListener("click", ()=>{
  if (confirm("This will erase ALL orders and reset the menu to defaults. Continue?")){
    localStorage.removeItem(STORAGE_KEYS.menu);
    localStorage.removeItem(STORAGE_KEYS.categories);
    localStorage.removeItem(STORAGE_KEYS.orders);
    loadState();
    renderAll();
    toast("All data reset");
  }
});

/* ==========================================================
   INIT
   ========================================================== */
function renderAll(){
  renderCategoryTabs();
  renderMenuGrid();
  renderCart();
  document.getElementById("dailyDate").value = todayStr();
  document.getElementById("monthlyMonth").value = monthStr();
}

loadState();
if (sessionStorage.getItem(STORAGE_KEYS.session) === "1"){
  enterApp();
}
