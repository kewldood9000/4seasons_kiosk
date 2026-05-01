const STORAGE_KEY = "market-kiosk-state-v1";

// Edit these sample items to fit your stand's menu.
const DEFAULT_MENU_ITEMS = [
  { id: "lunch-combo", category: "Plates", name: "Lunch Combo", price: 17 },
  {
    id: "pad-thai",
    category: "Plates",
    name: "Pad Thai",
    price: 14,
    itemEditPresets: [
      { label: "Add Chicken", priceDelta: 3 },
      { label: "Add Shrimp", priceDelta: 5 },
      { label: "Add Salmon", priceDelta: 5 },
    ],
  },
  { id: "rice-and-chicken", category: "Plates", name: "Rice and Chicken", price: 17 },
  { id: "crab-rice", category: "Plates", name: "Crab Rice", price: 17 },
  { id: "banh-xeo", category: "Plates", name: "Banh Xeo", price: 17 },
  { id: "beef-plate", category: "Plates", name: "Beef Plate", price: 17 },
  {
    id: "bento-mixed-salad",
    category: "Plates",
    name: "Bento Mixed Salad",
    price: 14,
    itemEditPresets: [
      { label: "Add Chicken", priceDelta: 3 },
      { label: "Add Shrimp", priceDelta: 5 },
      { label: "Add Salmon", priceDelta: 5 },
    ],
  },
  {
    id: "pork-banh-mi",
    category: "Hot Handhelds",
    name: "Pork Banh Mi",
    price: 17,
    itemEditPresets: [{ label: "No Cilantro" }, { label: "Add Siracha" }],
  },
  {
    id: "chicken-banh-mi",
    category: "Hot Handhelds",
    name: "Chicken Banh Mi",
    price: 17,
    itemEditPresets: [{ label: "No Cilantro" }, { label: "Add Siracha" }],
  },
  {
    id: "beef-banh-mi",
    category: "Hot Handhelds",
    name: "Beef Banh Mi",
    price: 17,
    itemEditPresets: [{ label: "No Cilantro" }, { label: "Add Siracha" }],
  },
  {
    id: "summer-rolls",
    category: "Hot Handhelds",
    name: "Summer Rolls",
    price: 7,
    allowCustomEdits: false,
  },
  { id: "chicken-roll", category: "Hot Wraps", name: "Chicken Roll", price: 17 },
  { id: "salmon-roll", category: "Hot Wraps", name: "Salmon Roll", price: 17 },
  { id: "mushroom-roll", category: "Hot Wraps", name: "Mushroom Roll", price: 17 },
  { id: "crab-roll", category: "Hot Wraps", name: "Crab Roll", price: 17 },
  { id: "beef-roll", category: "Hot Wraps", name: "Beef Roll", price: 17 },
  { id: "veggie-roll", category: "Cold Wraps", name: "Veggie Roll", price: 8 },
  { id: "shrimp-fall-roll", category: "Cold Wraps", name: "Shrimp Fall Roll", price: 8 },
  {
    id: "spring-roll",
    category: "Cold Wraps",
    name: "Spring Roll",
    price: 8,
    itemEditPresets: [{ label: "No Shrimp" }, { label: "No Pork" }, { label: "No Cilantro" }],
  },
  { id: "winter-roll", category: "Cold Wraps", name: "Winter Roll", price: 8 },
  { id: "guava-juice", category: "Drinks", name: "Guava Juice", price: 6 },
  { id: "passion-fruit-juice", category: "Drinks", name: "Passion Fruit Juice", price: 6 },
  { id: "viet-coffee", category: "Drinks", name: "Viet Coffee", price: 5 },
  { id: "thai-tea", category: "Drinks", name: "Thai Tea", price: 6 },
  { id: "ginger-almond-milk-tea", category: "Drinks", name: "Ginger Almond Milk Tea", price: 6 },
];

const MENU_SECTIONS = ["Plates", "Hot Handhelds", "Hot Wraps", "Cold Wraps", "Drinks"];
const WRAP_CATEGORIES = new Set(["Hot Wraps", "Cold Wraps"]);
const SAUCE_OPTIONS = [
  { id: "peanut", label: "Peanut" },
  { id: "spicy-peanut", label: "Spicy Peanut" },
  { id: "sweet-chili", label: "Sweet Chili" },
  { id: "spicy-sweet-chili", label: "Spicy Sweet Chili" },
];
const CATEGORY_ITEM_EDIT_PRESETS = {
  "Hot Wraps": [{ label: "No Cilantro" }],
  "Cold Wraps": [{ label: "No Cilantro" }],
};

const PAYMENT_OPTIONS = [
  {
    id: "venmo-one",
    label: "Shoko Venmo",
    image: "./payments/venmo-1.svg",
    alt: "Venmo QR code 1",
  },
  {
    id: "venmo-two",
    label: "Family Venmo",
    image: "./payments/venmo-2.svg",
    alt: "Venmo QR code 2",
  },
  {
    id: "zelle",
    label: "Shoko Zelle",
    image: "./payments/zelle.svg",
    alt: "Zelle QR code",
  },
];

const state = loadState();

const elements = {
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  screens: Array.from(document.querySelectorAll(".screen")),
  nextOrderNumber: document.getElementById("nextOrderNumber"),
  customerName: document.getElementById("customerName"),
  orderNotes: document.getElementById("orderNotes"),
  submitTotal: document.getElementById("submitTotal"),
  reviewOrderButton: document.getElementById("reviewOrderButton"),
  submitOrderButton: document.getElementById("submitOrderButton"),
  menuJumpBar: document.getElementById("menuJumpBar"),
  menuSections: document.getElementById("menuSections"),
  queueList: document.getElementById("queueList"),
  activeOrderCount: document.getElementById("activeOrderCount"),
  totalsToggleButton: document.getElementById("totalsToggleButton"),
  totalsDropdown: document.getElementById("totalsDropdown"),
  paymentButtons: document.getElementById("paymentButtons"),
  paymentDisplay: document.getElementById("paymentDisplay"),
  toast: document.getElementById("toast"),
  menuItemTemplate: document.getElementById("menuItemTemplate"),
  orderCardTemplate: document.getElementById("orderCardTemplate"),
  reviewSheet: document.getElementById("reviewSheet"),
  reviewSheetBackdrop: document.getElementById("reviewSheetBackdrop"),
  closeReviewButton: document.getElementById("closeReviewButton"),
  reviewMeta: document.getElementById("reviewMeta"),
  reviewItemList: document.getElementById("reviewItemList"),
  reviewTotal: document.getElementById("reviewTotal"),
};

let selectedPaymentId = null;
let isTotalsExpanded = false;
let activeMenuSection = null;
let isReviewSheetOpen = false;
let toastTimer = null;
let pendingSentOutOrderId = null;

bootstrap();

function bootstrap() {
  bindEvents();
  renderAll();
  registerServiceWorker();
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return createInitialState();
    }

    const parsed = JSON.parse(stored);
    return {
      menuItems: DEFAULT_MENU_ITEMS,
      activeOrders: normalizeOrders(parsed.activeOrders),
      completedOrders: normalizeOrders(parsed.completedOrders),
      nextOrderNumber: Number.isFinite(parsed.nextOrderNumber) ? parsed.nextOrderNumber : 101,
      lastSentOutOrder: parsed.lastSentOutOrder ? normalizeOrder(parsed.lastSentOutOrder) : null,
      draft: {
        customerName: "",
        notes: "",
        quantities: buildEmptyQuantities(DEFAULT_MENU_ITEMS),
      },
    };
  } catch (error) {
    console.warn("Failed to load saved kiosk state. Starting fresh.", error);
    return createInitialState();
  }
}

function createInitialState() {
  return {
    menuItems: DEFAULT_MENU_ITEMS,
    activeOrders: [],
    completedOrders: [],
    nextOrderNumber: 101,
    lastSentOutOrder: null,
    draft: {
      customerName: "",
      notes: "",
      quantities: buildEmptyQuantities(DEFAULT_MENU_ITEMS),
    },
  };
}

function normalizeOrders(orders) {
  if (!Array.isArray(orders)) {
    return [];
  }

  return orders.map((order) => normalizeOrder(order));
}

function normalizeOrder(order) {
  const normalizedOrder = {
    ...order,
    items: Array.isArray(order.items)
      ? order.items.map((item) => ({
          ...item,
          sauceIds: normalizeSelectionList(item.sauceIds ?? item.sauceId),
          sauceLabels: normalizeSelectionList(item.sauceLabels ?? item.sauceLabel),
          modifiers: normalizeSelectionList(item.modifiers ?? item.modifier),
          modifierPriceDelta: Number(item.modifierPriceDelta || 0),
          completed: Boolean(item.completed),
        }))
      : [],
  };

  syncOrderStatus(normalizedOrder);
  return normalizedOrder;
}

function buildEmptyQuantities(menuItems) {
  return menuItems.reduce((accumulator, item) => {
    return accumulator;
  }, {});
}

function bindEvents() {
  elements.tabButtons.forEach((button) => {
    button.addEventListener("click", () => setActiveScreen(button.dataset.screen));
  });

  document.addEventListener("click", handleGlobalClick);

  elements.customerName.addEventListener("input", (event) => {
    state.draft.customerName = event.target.value;
  });

  elements.orderNotes.addEventListener("input", (event) => {
    state.draft.notes = event.target.value;
  });

  elements.reviewOrderButton.addEventListener("click", openReviewSheet);
  elements.submitOrderButton.addEventListener("click", submitOrder);
  elements.totalsToggleButton.addEventListener("click", toggleTotalsDropdown);
  elements.closeReviewButton.addEventListener("click", closeReviewSheet);
  elements.reviewSheetBackdrop.addEventListener("click", closeReviewSheet);
}

function setActiveScreen(screenId) {
  if (isReviewSheetOpen && screenId !== "order-entry") {
    closeReviewSheet();
  }

  elements.tabButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.screen === screenId);
  });

  elements.screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === screenId);
  });
}

function renderAll() {
  renderDraft();
  renderMenu();
  renderQueue();
  renderSummary();
  renderReviewSheet();
  renderPayments();
}

function renderDraft() {
  elements.nextOrderNumber.textContent = `#${state.nextOrderNumber}`;
  elements.customerName.value = state.draft.customerName;
  elements.orderNotes.value = state.draft.notes;

  const total = getDraftTotal();
  if (total <= 0 && isReviewSheetOpen) {
    isReviewSheetOpen = false;
  }
  const formattedTotal = formatCurrency(total);

  elements.submitTotal.textContent = formattedTotal;
  elements.reviewOrderButton.disabled = total <= 0;
  elements.submitOrderButton.disabled = total <= 0;
}

function renderMenu() {
  const jumpFragment = document.createDocumentFragment();
  const sectionFragment = document.createDocumentFragment();

  MENU_SECTIONS.forEach((sectionName) => {
    const items = state.menuItems.filter((item) => item.category === sectionName);
    if (items.length === 0) {
      return;
    }

    const jumpButton = document.createElement("button");
    jumpButton.type = "button";
    jumpButton.className = `menu-jump-button${activeMenuSection === sectionName ? " is-selected" : ""}`;
    jumpButton.textContent = sectionName;
    jumpButton.addEventListener("click", () => {
      activeMenuSection = activeMenuSection === sectionName ? null : sectionName;
      renderMenu();
    });
    jumpFragment.appendChild(jumpButton);

    if (activeMenuSection !== sectionName) {
      return;
    }

    const section = document.createElement("section");
    section.className = "menu-section";
    section.id = `menu-section-${toSlug(sectionName)}`;

    const header = document.createElement("div");
    header.className = "menu-section-header";
    header.innerHTML = `
      <h3>${sectionName}</h3>
      <span class="hint-text">${items.length} item${items.length === 1 ? "" : "s"}</span>
    `;

    const grid = document.createElement("div");
    grid.className = "menu-section-grid";

    items.forEach((item) => {
      const template = elements.menuItemTemplate.content.cloneNode(true);
      const card = template.querySelector(".menu-card");
      const decrementButton = template.querySelector(".decrement-button");
      const quantityValue = template.querySelector(".quantity-value");

      template.querySelector(".menu-item-name").textContent = item.name;
      template.querySelector(".menu-item-price").textContent = formatCurrency(item.price);
      quantityValue.textContent = String(getDisplayedDraftQuantity(item.id));

      decrementButton.addEventListener("click", (event) => {
        event.stopPropagation();
        updateDraftQuantity(item.id, -1);
      });

      card.addEventListener("pointerup", (event) => {
        if (event.pointerType === "mouse" && event.button !== 0) {
          return;
        }

        updateDraftQuantity(item.id, 1);
      });
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          updateDraftQuantity(item.id, 1);
        }
      });

      card.dataset.itemId = item.id;
      grid.appendChild(template);
    });

    section.append(header, grid);
    sectionFragment.appendChild(section);
  });

  elements.menuJumpBar.replaceChildren(jumpFragment);

  if (!activeMenuSection) {
    const emptyState = document.createElement("div");
    emptyState.className = "menu-empty-state";
    emptyState.innerHTML = `
      <p>Choose a category above to show items.</p>
    `;
    elements.menuSections.replaceChildren(emptyState);
    return;
  }

  elements.menuSections.replaceChildren(sectionFragment);
}

function updateDraftQuantity(itemId, delta) {
  const item = state.menuItems.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  let draftKey = buildDraftKey(itemId, [], []);

  if (delta < 0 && isWrapItem(item) && (state.draft.quantities[draftKey] ?? 0) === 0) {
    const existingVariantKey = Object.keys(state.draft.quantities).find((key) => {
      const parsed = parseDraftKey(key);
      return parsed.itemId === itemId && (state.draft.quantities[key] ?? 0) > 0;
    });

    if (existingVariantKey) {
      draftKey = existingVariantKey;
    }
  }

  const currentQuantity = state.draft.quantities[draftKey] ?? 0;
  const nextQuantity = Math.max(0, currentQuantity + delta);

  if (nextQuantity === 0) {
    delete state.draft.quantities[draftKey];
  } else {
    state.draft.quantities[draftKey] = nextQuantity;
  }

  renderDraft();
  renderMenu();
  renderReviewSheet();
}

function getDraftItems() {
  const menuItemMap = new Map(state.menuItems.map((item) => [item.id, item]));

  return Object.entries(state.draft.quantities)
    .filter(([, quantity]) => quantity > 0)
    .map(([draftKey, quantity]) => {
      const { itemId, sauceIds, modifiers } = parseDraftKey(draftKey);
      const item = menuItemMap.get(itemId);
      if (!item) {
        return null;
      }

      const sauceLabels = sauceIds
        .map((sauceId) => SAUCE_OPTIONS.find((entry) => entry.id === sauceId)?.label ?? "")
        .filter(Boolean);
      const modifierDetails = getModifierDetails(item, modifiers);
      const modifierPriceDelta = modifierDetails.reduce(
        (sum, modifierDetail) => sum + modifierDetail.priceDelta,
        0,
      );

      return {
        id: draftKey,
        menuItemId: item.id,
        category: item.category,
        name: item.name,
        sauceIds,
        sauceLabels,
        modifiers,
        modifierDetails,
        modifierPriceDelta,
        price: item.price,
        quantity,
        completed: false,
      };
    })
    .filter(Boolean);
}

function getDraftTotal() {
  return getDraftItems().reduce(
    (sum, item) => sum + (item.price + item.modifierPriceDelta) * item.quantity,
    0,
  );
}

function submitOrder() {
  const items = getDraftItems();
  if (items.length === 0) {
    return;
  }

  const newOrder = {
    id: createOrderId(),
    orderNumber: state.nextOrderNumber,
    timestamp: new Date().toISOString(),
    customerName: state.draft.customerName.trim(),
    notes: state.draft.notes.trim(),
    items,
    total: items.reduce((sum, item) => sum + (item.price + item.modifierPriceDelta) * item.quantity, 0),
    status: "new",
  };

  syncOrderStatus(newOrder);
  state.activeOrders.push(newOrder);
  state.activeOrders.sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
  state.nextOrderNumber += 1;
  resetDraft();
  closeReviewSheet();
  persistState();
  renderAll();
  showToast(`Order #${newOrder.orderNumber} saved`);
}

function resetDraft() {
  state.draft.customerName = "";
  state.draft.notes = "";
  state.draft.quantities = buildEmptyQuantities(state.menuItems);
}

function renderQueue() {
  if (state.activeOrders.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.innerHTML = `
      <h3>No active orders</h3>
      <p>New orders will appear here as soon as they are submitted.</p>
    `;
    elements.queueList.replaceChildren(emptyState);
    return;
  }

  const fragment = document.createDocumentFragment();

  state.activeOrders.forEach((order) => {
    const template = elements.orderCardTemplate.content.cloneNode(true);
    const article = template.querySelector(".order-card");
    const notesBlock = template.querySelector(".customer-note-block");
    const orderItemList = template.querySelector(".order-item-list");
    const sentOutButton = template.querySelector(".sent-out-button");

    template.querySelector(".order-number").textContent = `Order #${order.orderNumber}`;
    template.querySelector(".order-title").textContent = order.customerName || "Walk-up Customer";
    template.querySelector(".timestamp-chip").textContent = formatTime(order.timestamp);
    template.querySelector(".order-total-minimal").textContent = `Total ${formatCurrency(order.total)}`;

    const noteParts = [];
    if (order.customerName) {
      noteParts.push(`<p><strong>Customer:</strong> ${escapeHtml(order.customerName)}</p>`);
    }
    if (order.notes) {
      noteParts.push(`<p><strong>Notes:</strong> ${escapeHtml(order.notes)}</p>`);
    }
    notesBlock.innerHTML = noteParts.join("");
    notesBlock.hidden = noteParts.length === 0;

    order.items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.className = `order-item-row${item.completed ? " is-complete" : ""}`;

      const itemCopy = document.createElement("div");
      itemCopy.className = "item-copy";
      const sauceLabels = getItemSauceLabels(item);
      const modifierDetails = getModifierDetails(item);
      itemCopy.innerHTML = `
        <strong>${item.quantity} x ${escapeHtml(item.name)}</strong>
        ${sauceLabels.length ? `<span class="item-meta">with ${escapeHtml(sauceLabels.join(", "))}</span>` : ""}
        ${modifierDetails
          .map(
            (modifierDetail) =>
              `<span class="item-meta item-modifier-meta">${escapeHtml(
                buildModifierLabel(modifierDetail.label, modifierDetail.priceDelta),
              )}</span>`,
          )
          .join("")}
      `;

      const itemButton = document.createElement("button");
      itemButton.className = "item-complete-button";
      itemButton.type = "button";
      itemButton.textContent = item.completed ? "Completed" : "Mark Done";
      itemButton.addEventListener("click", () => toggleItemComplete(order.id, item.id));

      listItem.append(itemCopy, itemButton);
      orderItemList.appendChild(listItem);
    });

    sentOutButton.addEventListener("click", (event) => {
      event.stopPropagation();
      markOrderSentOut(order.id);
    });
    if (pendingSentOutOrderId === order.id) {
      sentOutButton.textContent = "Confirm Sent Out";
      sentOutButton.classList.add("is-confirming");
    }

    article.dataset.orderId = order.id;
    fragment.appendChild(template);
  });

  elements.queueList.replaceChildren(fragment);
}

function toggleItemComplete(orderId, itemId) {
  const order = state.activeOrders.find((entry) => entry.id === orderId);
  if (!order) {
    return;
  }

  const item = order.items.find((entry) => entry.id === itemId);
  if (!item) {
    return;
  }

  item.completed = !item.completed;
  syncOrderStatus(order);
  persistState();
  renderQueue();
  renderSummary();
}

function markOrderSentOut(orderId) {
  const order = state.activeOrders.find((entry) => entry.id === orderId);
  if (!order) {
    return;
  }

  if (pendingSentOutOrderId !== orderId) {
    pendingSentOutOrderId = orderId;
    renderQueue();
    showToast(`Tap again to send out Order #${order.orderNumber}`);
    return;
  }

  state.activeOrders = state.activeOrders.filter((entry) => entry.id !== orderId);
  state.lastSentOutOrder = {
    ...cloneOrder(order),
    sentOutAt: new Date().toISOString(),
    status: "sent_out",
  };
  state.completedOrders.push(state.lastSentOutOrder);
  pendingSentOutOrderId = null;
  persistState();
  renderQueue();
  renderSummary();
  showToast(`Order #${order.orderNumber} sent out`);
}

function undoLastSentOrder() {
  const lastSent = state.lastSentOutOrder;
  if (!lastSent) {
    showToast("No sent order to restore");
    return;
  }

  state.completedOrders = state.completedOrders.filter((order) => order.id !== lastSent.id);
  const restoredOrder = cloneOrder(lastSent);
  delete restoredOrder.sentOutAt;
  syncOrderStatus(restoredOrder);
  state.activeOrders.push(restoredOrder);
  state.activeOrders.sort((left, right) => new Date(left.timestamp) - new Date(right.timestamp));
  state.lastSentOutOrder = null;
  persistState();
  renderQueue();
  renderSummary();
  showToast(`Order #${restoredOrder.orderNumber} restored`);
}

function clearAllOrders() {
  if (state.activeOrders.length === 0 && state.completedOrders.length === 0) {
    showToast("There are no orders to clear");
    return;
  }

  const confirmed = window.confirm(
    "Clear all active and sent-out orders? This cannot be undone.",
  );
  if (!confirmed) {
    return;
  }

  state.activeOrders = [];
  state.completedOrders = [];
  state.lastSentOutOrder = null;
  state.nextOrderNumber = 101;
  resetDraft();
  persistState();
  renderAll();
  showToast("All orders cleared");
}

function handleGlobalClick(event) {
  if (!pendingSentOutOrderId) {
    return;
  }

  if (event.target.closest(".sent-out-button.is-confirming")) {
    return;
  }

  pendingSentOutOrderId = null;
  renderQueue();
}

function renderSummary() {
  elements.activeOrderCount.textContent = String(state.activeOrders.length);
  renderOutstandingTotals();
}

function renderReviewSheet() {
  const items = getDraftItems();
  const total = getDraftTotal();

  elements.reviewSheet.hidden = !isReviewSheetOpen;
  elements.reviewTotal.textContent = formatCurrency(total);

  const metaRows = [];
  if (state.draft.customerName.trim()) {
    metaRows.push(`<p><strong>Customer:</strong> ${escapeHtml(state.draft.customerName.trim())}</p>`);
  }
  if (state.draft.notes.trim()) {
    metaRows.push(`<p><strong>Notes:</strong> ${escapeHtml(state.draft.notes.trim())}</p>`);
  }
  elements.reviewMeta.innerHTML = metaRows.join("");
  elements.reviewMeta.hidden = metaRows.length === 0;

  const fragment = document.createDocumentFragment();
  items.forEach((item) => {
    const listItem = document.createElement("li");
    listItem.className = "review-item-row";
    const itemCopy = document.createElement("div");
    itemCopy.className = "review-item-copy";
    const sauceLabels = getItemSauceLabels(item);
    const modifierDetails = getModifierDetails(item);
    itemCopy.innerHTML = `
      <strong>${item.quantity} x ${escapeHtml(item.name)}</strong>
      ${sauceLabels.length ? `<span>with ${escapeHtml(sauceLabels.join(", "))}</span>` : ""}
      ${modifierDetails
        .map(
          (modifierDetail) =>
            `<span class="review-item-modifier">${escapeHtml(
              buildModifierLabel(modifierDetail.label, modifierDetail.priceDelta),
            )}</span>`,
        )
        .join("")}
    `;

    const itemPrice = document.createElement("span");
    itemPrice.className = "review-item-price";
    itemPrice.textContent = formatCurrency((item.price + item.modifierPriceDelta) * item.quantity);

    const itemPriceWrap = document.createElement("div");
    itemPriceWrap.className = "review-item-side";
    itemPriceWrap.appendChild(itemPrice);

    const topRow = document.createElement("div");
    topRow.className = "review-item-top";
    topRow.append(itemCopy, itemPriceWrap);
    listItem.appendChild(topRow);

    const editor = buildItemEditEditor(item);
    if (editor) {
      listItem.appendChild(editor);
    }

    fragment.appendChild(listItem);
  });
  elements.reviewItemList.replaceChildren(fragment);
}

function buildItemEditEditor(item) {
  const editor = document.createElement("div");
  editor.className = "review-item-editor";
  const allowsCustomEdits = supportsCustomEdits(item);

  if (isWrapCategory(item.category)) {
    const sauceGroup = document.createElement("div");
    sauceGroup.className = "review-editor-group";
    sauceGroup.innerHTML = `<span class="review-editor-label">Sauce</span>`;

    const sauceRow = document.createElement("div");
    sauceRow.className = "review-chip-row";

    SAUCE_OPTIONS.forEach((sauce) => {
      const sauceButton = document.createElement("button");
      sauceButton.type = "button";
      sauceButton.className = `review-chip${item.sauceIds.includes(sauce.id) ? " is-selected" : ""}`;
      sauceButton.textContent = sauce.label;
      sauceButton.addEventListener("click", () => toggleDraftItemSauce(item.id, sauce.id));
      sauceRow.appendChild(sauceButton);
    });

    const clearSauceButton = document.createElement("button");
    clearSauceButton.type = "button";
    clearSauceButton.className = "review-chip review-chip-clear";
    clearSauceButton.textContent = "Clear Sauces";
    clearSauceButton.addEventListener("click", () => clearDraftItemSauces(item.id));
    sauceRow.appendChild(clearSauceButton);

    sauceGroup.appendChild(sauceRow);
    editor.appendChild(sauceGroup);
  }

  const presets = getItemEditPresets(item);
  if (presets.length > 0) {
    const presetRow = document.createElement("div");
    presetRow.className = "review-chip-row";
    const modifierGroup = document.createElement("div");
    modifierGroup.className = "review-editor-group";
    modifierGroup.innerHTML = `<span class="review-editor-label">Item Edit</span>`;

    presets.forEach((preset) => {
      const presetButton = document.createElement("button");
      presetButton.type = "button";
      presetButton.className = `review-chip${item.modifiers.includes(preset.label) ? " is-selected" : ""}`;
      presetButton.textContent = buildModifierLabel(preset.label, preset.priceDelta ?? 0);
      presetButton.addEventListener("click", () => toggleDraftItemModifier(item.id, preset.label));
      presetRow.appendChild(presetButton);
    });

    const clearButton = document.createElement("button");
    clearButton.type = "button";
    clearButton.className = "review-chip review-chip-clear";
    clearButton.textContent = "Clear Edits";
    clearButton.addEventListener("click", () => clearDraftItemModifiers(item.id));
    presetRow.appendChild(clearButton);

    modifierGroup.appendChild(presetRow);
    editor.appendChild(modifierGroup);
  }

  const customModifiers = item.modifiers.filter(
    (modifier) => !getItemEditPresets(item).some((preset) => preset.label === modifier),
  );
  if (allowsCustomEdits && customModifiers.length > 0) {
    const customGroup = document.createElement("div");
    customGroup.className = "review-editor-group";
    customGroup.innerHTML = `<span class="review-editor-label">Custom Edits</span>`;

    const customChipRow = document.createElement("div");
    customChipRow.className = "review-chip-row";

    customModifiers.forEach((modifier) => {
      const customChip = document.createElement("button");
      customChip.type = "button";
      customChip.className = "review-chip is-selected";
      customChip.textContent = modifier;
      customChip.addEventListener("click", () => toggleDraftItemModifier(item.id, modifier));
      customChipRow.appendChild(customChip);
    });

    customGroup.appendChild(customChipRow);
    editor.appendChild(customGroup);
  }

  if (allowsCustomEdits) {
    const customRow = document.createElement("div");
    customRow.className = "review-custom-row";

    const customInput = document.createElement("input");
    customInput.type = "text";
    customInput.className = "review-custom-input";
    customInput.maxLength = 60;
    customInput.placeholder = "Add custom item edit";

    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.className = "secondary-button review-apply-button";
    applyButton.textContent = "Add";
    applyButton.addEventListener("click", () => addDraftItemModifier(item.id, customInput.value));

    customInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        addDraftItemModifier(item.id, customInput.value);
      }
    });

    customRow.append(customInput, applyButton);
    editor.appendChild(customRow);
  }

  if (!editor.children.length) {
    return null;
  }

  return editor;
}

function toggleDraftItemModifier(draftKey, modifierLabel) {
  const quantity = state.draft.quantities[draftKey] ?? 0;
  if (quantity <= 0) {
    return;
  }

  const { itemId, sauceIds, modifiers } = parseDraftKey(draftKey);
  const normalizedModifier = normalizeItemModifier(modifierLabel);
  if (!normalizedModifier) {
    return;
  }

  const nextModifiers = modifiers.includes(normalizedModifier)
    ? modifiers.filter((modifier) => modifier !== normalizedModifier)
    : [...modifiers, normalizedModifier];
  moveDraftQuantity(draftKey, buildDraftKey(itemId, sauceIds, nextModifiers));
}

function addDraftItemModifier(draftKey, modifierLabel) {
  const quantity = state.draft.quantities[draftKey] ?? 0;
  if (quantity <= 0) {
    return;
  }

  const { itemId, sauceIds, modifiers } = parseDraftKey(draftKey);
  const normalizedModifier = normalizeItemModifier(modifierLabel);
  if (!normalizedModifier || modifiers.includes(normalizedModifier)) {
    return;
  }

  moveDraftQuantity(draftKey, buildDraftKey(itemId, sauceIds, [...modifiers, normalizedModifier]));
}

function clearDraftItemModifiers(draftKey) {
  const quantity = state.draft.quantities[draftKey] ?? 0;
  if (quantity <= 0) {
    return;
  }

  const { itemId, sauceIds } = parseDraftKey(draftKey);
  moveDraftQuantity(draftKey, buildDraftKey(itemId, sauceIds, []));
}

function toggleDraftItemSauce(draftKey, sauceId) {
  const quantity = state.draft.quantities[draftKey] ?? 0;
  if (quantity <= 0) {
    return;
  }

  const { itemId, sauceIds, modifiers } = parseDraftKey(draftKey);
  const normalizedSauceId = SAUCE_OPTIONS.some((option) => option.id === sauceId) ? sauceId : "";
  if (!normalizedSauceId) {
    return;
  }

  const nextSauceIds = sauceIds.includes(normalizedSauceId)
    ? sauceIds.filter((existingSauceId) => existingSauceId !== normalizedSauceId)
    : [...sauceIds, normalizedSauceId];
  moveDraftQuantity(draftKey, buildDraftKey(itemId, nextSauceIds, modifiers));
}

function clearDraftItemSauces(draftKey) {
  const quantity = state.draft.quantities[draftKey] ?? 0;
  if (quantity <= 0) {
    return;
  }

  const { itemId, modifiers } = parseDraftKey(draftKey);
  moveDraftQuantity(draftKey, buildDraftKey(itemId, [], modifiers));
}

function moveDraftQuantity(currentKey, nextKey) {
  const quantity = state.draft.quantities[currentKey] ?? 0;
  if (quantity <= 0 || currentKey === nextKey) {
    return;
  }

  delete state.draft.quantities[currentKey];
  state.draft.quantities[nextKey] = (state.draft.quantities[nextKey] ?? 0) + quantity;
  renderDraft();
  renderMenu();
  renderReviewSheet();
}

function openReviewSheet() {
  if (getDraftTotal() <= 0) {
    return;
  }

  isReviewSheetOpen = true;
  renderReviewSheet();
}

function closeReviewSheet() {
  isReviewSheetOpen = false;
  renderReviewSheet();
}

function renderOutstandingTotals() {
  const totals = getOutstandingItemTotals();
  elements.totalsToggleButton.textContent = isTotalsExpanded
    ? "Hide Total Item Counts"
    : "Show Total Item Counts";
  elements.totalsToggleButton.disabled = totals.length === 0;

  if (!isTotalsExpanded || totals.length === 0) {
    elements.totalsDropdown.hidden = true;
    elements.totalsDropdown.replaceChildren();
    return;
  }

  const list = document.createElement("ul");
  list.className = "totals-list";

  totals.forEach((item) => {
    const row = document.createElement("li");
    row.className = "totals-row";
    row.innerHTML = `
      <span class="totals-item-name">${escapeHtml(item.name)}</span>
      <strong class="totals-item-count">${item.quantity}</strong>
    `;
    list.appendChild(row);
  });

  elements.totalsDropdown.hidden = false;
  elements.totalsDropdown.replaceChildren(list);
}

function getOutstandingItemTotals() {
  const totals = new Map();

  state.activeOrders.forEach((order) => {
    order.items.forEach((item) => {
      if (item.completed) {
        return;
      }

      const itemLabel = buildPrepLabel(item);
      const existingForLabel = totals.get(itemLabel) ?? 0;
      totals.set(itemLabel, existingForLabel + item.quantity);
    });
  });

  return Array.from(totals.entries())
    .map(([name, quantity]) => ({ name, quantity }))
    .sort((left, right) => {
      if (right.quantity !== left.quantity) {
        return right.quantity - left.quantity;
      }

      return left.name.localeCompare(right.name);
    });
}

function toggleTotalsDropdown() {
  const totals = getOutstandingItemTotals();
  if (totals.length === 0) {
    return;
  }

  isTotalsExpanded = !isTotalsExpanded;
  renderOutstandingTotals();
}

function renderPayments() {
  const buttonFragment = document.createDocumentFragment();

  PAYMENT_OPTIONS.forEach((option) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `payment-method-button${selectedPaymentId === option.id ? " is-selected" : ""}`;
    button.textContent = option.label;
    button.addEventListener("click", () => {
      selectedPaymentId = selectedPaymentId === option.id ? null : option.id;
      renderPayments();
    });
    buttonFragment.appendChild(button);
  });

  elements.paymentButtons.replaceChildren(buttonFragment);

  if (!selectedPaymentId) {
    const emptyState = document.createElement("div");
    emptyState.className = "payment-empty";
    elements.paymentDisplay.replaceChildren(emptyState);
    return;
  }

  const selected = PAYMENT_OPTIONS.find((option) => option.id === selectedPaymentId);
  if (!selected) {
    return;
  }

  const card = document.createElement("div");
  card.className = "payment-card";
  card.innerHTML = `
    <img src="${selected.image}" alt="${selected.alt}" />
  `;
  elements.paymentDisplay.replaceChildren(card);
}

function persistState() {
  const persistedState = {
    activeOrders: state.activeOrders,
    completedOrders: state.completedOrders,
    nextOrderNumber: state.nextOrderNumber,
    lastSentOutOrder: state.lastSentOutOrder,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(persistedState));
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");

  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 1800);
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  const isSecure = window.location.protocol === "https:";
  if (!isLocalhost && !isSecure) {
    return;
  }

  navigator.serviceWorker.register("./sw.js").catch((error) => {
    console.warn("Service worker registration failed.", error);
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function humanizeStatus(status) {
  return status
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cloneOrder(order) {
  return JSON.parse(JSON.stringify(order));
}

function createOrderId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `order-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
}

function isWrapItem(item) {
  return WRAP_CATEGORIES.has(item.category);
}

function isWrapCategory(category) {
  return WRAP_CATEGORIES.has(category);
}

function getItemEditPresets(item) {
  const menuItem = state.menuItems.find((entry) => entry.id === (item.menuItemId ?? item.id)) ?? item;
  const categoryPresets = CATEGORY_ITEM_EDIT_PRESETS[menuItem?.category ?? item.category] ?? [];
  const itemPresets = menuItem?.itemEditPresets ?? [];
  return [...categoryPresets, ...itemPresets];
}

function supportsCustomEdits(item) {
  const menuItem = state.menuItems.find((entry) => entry.id === (item.menuItemId ?? item.id)) ?? item;
  return menuItem?.allowCustomEdits !== false;
}

function getDisplayedDraftQuantity(itemId) {
  return Object.entries(state.draft.quantities).reduce((sum, [draftKey, quantity]) => {
    const parsed = parseDraftKey(draftKey);
    return parsed.itemId === itemId ? sum + quantity : sum;
  }, 0);
}

function buildDraftKey(itemId, sauceIds = [], modifiers = []) {
  const normalizedSauceIds = normalizeSauceIds(sauceIds);
  const normalizedModifiers = normalizeModifiers(modifiers);
  if (normalizedSauceIds.length === 0 && normalizedModifiers.length === 0) {
    return itemId;
  }

  return `${itemId}::${encodeListSegment(normalizedSauceIds)}::${encodeListSegment(normalizedModifiers)}`;
}

function parseDraftKey(draftKey) {
  const parts = draftKey.split("::");
  const itemId = parts[0] ?? "";
  const encodedSauceSegment = parts[1] ?? "";
  const encodedModifierSegment = parts.slice(2).join("::");
  return {
    itemId,
    sauceIds: decodeListSegment(encodedSauceSegment, "sauce"),
    modifiers: decodeListSegment(encodedModifierSegment, "modifier"),
  };
}

function normalizeItemModifier(value) {
  return value.trim().replace(/\s+/g, " ");
}

function buildPrepLabel(item) {
  const parts = [item.name];
  const sauceLabels = getItemSauceLabels(item);
  const modifierDetails = getModifierDetails(item);
  if (sauceLabels.length) {
    parts.push(`with ${sauceLabels.join(", ")}`);
  }
  modifierDetails.forEach((modifierDetail) => {
    parts.push(buildModifierLabel(modifierDetail.label, modifierDetail.priceDelta));
  });
  return parts.join(" - ");
}

function getModifierDetails(item, modifiers = item.modifiers ?? item.modifier) {
  return normalizeModifiers(modifiers).map((modifier) => ({
    label: modifier,
    priceDelta: getModifierPriceDelta(item, modifier),
  }));
}

function getModifierPriceDelta(item, modifier) {
  if (!modifier) {
    return 0;
  }

  const match = getItemEditPresets(item).find((preset) => preset.label === modifier);
  return Number(match?.priceDelta || 0);
}

function getItemSauceLabels(item) {
  const labels = item.sauceLabels ?? item.sauceLabel;
  const normalizedLabels = normalizeSelectionList(labels);
  if (normalizedLabels.length > 0) {
    return normalizedLabels;
  }

  return normalizeSauceIds(item.sauceIds ?? item.sauceId)
    .map((sauceId) => SAUCE_OPTIONS.find((option) => option.id === sauceId)?.label ?? "")
    .filter(Boolean);
}

function buildModifierLabel(modifier, modifierPriceDelta = 0) {
  if (!modifier) {
    return "";
  }

  if (!modifierPriceDelta) {
    return modifier;
  }

  return `${modifier} +${formatCurrency(modifierPriceDelta)}`;
}

function normalizeSelectionList(value) {
  if (Array.isArray(value)) {
    return value
      .map((entry) => String(entry ?? "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed ? [trimmed] : [];
  }

  return [];
}

function normalizeSauceIds(values) {
  const uniqueSauceIds = Array.from(
    new Set(
      normalizeSelectionList(values).filter((value) =>
        SAUCE_OPTIONS.some((option) => option.id === value),
      ),
    ),
  );

  return uniqueSauceIds.sort(
    (left, right) =>
      SAUCE_OPTIONS.findIndex((option) => option.id === left) -
      SAUCE_OPTIONS.findIndex((option) => option.id === right),
  );
}

function normalizeModifiers(values) {
  return Array.from(new Set(normalizeSelectionList(values).map(normalizeItemModifier).filter(Boolean))).sort(
    (left, right) => left.localeCompare(right),
  );
}

function encodeListSegment(values) {
  return values.map((value) => encodeURIComponent(value)).join("|");
}

function decodeListSegment(segment, kind) {
  if (!segment) {
    return [];
  }

  const decodedValues = segment.split("|").map((value) => decodeURIComponent(value)).filter(Boolean);
  return kind === "sauce" ? normalizeSauceIds(decodedValues) : normalizeModifiers(decodedValues);
}

function syncOrderStatus(order) {
  const totalItems = order.items.length;
  const completedItems = order.items.filter((item) => item.completed).length;

  if (totalItems > 0 && completedItems === totalItems) {
    order.status = "ready";
    return;
  }

  if (completedItems > 0) {
    order.status = "in_progress";
    return;
  }

  order.status = "new";
}

function toSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
