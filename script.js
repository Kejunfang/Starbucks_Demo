const body = document.body;
const header = document.querySelector(".site-header");
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelectorAll(".site-nav a, .nav-actions a");
const revealItems = document.querySelectorAll(".reveal");

const orderForm = document.querySelector("#order-form");
const selectedDrinkInput = document.querySelector("#selected-drink");
const drinkButtons = document.querySelectorAll(".drink-option");
const quantityInput = document.querySelector("#quantity");
const stepperButtons = document.querySelectorAll(".stepper-button");
const extrasInputs = document.querySelectorAll('input[name="extras"]');

const summaryDrink = document.querySelector("#summary-drink");
const summaryDescription = document.querySelector("#summary-description");
const summaryTemperature = document.querySelector("#summary-temperature");
const summarySize = document.querySelector("#summary-size");
const summaryMilk = document.querySelector("#summary-milk");
const summaryPickup = document.querySelector("#summary-pickup");
const summaryTime = document.querySelector("#summary-time");
const summaryQuantity = document.querySelector("#summary-quantity");
const summaryReady = document.querySelector("#summary-ready");
const summaryExtras = document.querySelector("#summary-extras");
const summarySubtotal = document.querySelector("#summary-subtotal");
const summaryFee = document.querySelector("#summary-fee");
const summaryTotal = document.querySelector("#summary-total");
const summaryStars = document.querySelector("#summary-stars");
const ticketSubmit = document.querySelector("#ticket-submit");
const formStatus = document.querySelector("#form-status");

const confirmationCard = document.querySelector("#confirmation-card");
const confirmationHeading = document.querySelector("#confirmation-heading");
const confirmationText = document.querySelector("#confirmation-text");
const confirmationNumber = document.querySelector("#confirmation-number");
const confirmationPickup = document.querySelector("#confirmation-pickup");
const hasOrderBuilder = Boolean(
  orderForm &&
    selectedDrinkInput &&
    quantityInput &&
    summaryDrink &&
    summaryDescription &&
    summaryTemperature &&
    summarySize &&
    summaryMilk &&
    summaryPickup &&
    summaryTime &&
    summaryQuantity &&
    summaryReady &&
    summaryExtras &&
    summarySubtotal &&
    summaryFee &&
    summaryTotal &&
    summaryStars &&
    ticketSubmit &&
    formStatus &&
    confirmationCard &&
    confirmationHeading &&
    confirmationText &&
    confirmationNumber &&
    confirmationPickup
);

const STORAGE_KEY = "starbucks-order-draft-v2";
const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const drinks = {
  "velvet-oat": {
    name: "Velvet Oat Shaken Espresso",
    description: "Blonde espresso, brown sugar, oat milk, and cinnamon.",
    basePrice: 6.4,
    defaultMilk: "oat",
    defaultTemperature: "iced",
  },
  "pistachio-coldbrew": {
    name: "Pistachio Cream Cold Brew",
    description: "Cold brew base, pistachio cream, and a vanilla foam finish.",
    basePrice: 6.85,
    defaultMilk: "whole",
    defaultTemperature: "iced",
  },
  "matcha-cloud": {
    name: "Matcha Cloud Latte",
    description: "Bright matcha, milk of choice, and a soft sweet cream top.",
    basePrice: 5.95,
    defaultMilk: "whole",
    defaultTemperature: "iced",
  },
  "reserve-mocha": {
    name: "Reserve Dark Mocha",
    description: "Deep roast mocha with bittersweet cocoa and a velvet texture.",
    basePrice: 6.65,
    defaultMilk: "whole",
    defaultTemperature: "hot",
  },
};

const sizeOptions = {
  tall: { label: "Tall", price: 0, ounces: "12 oz" },
  grande: { label: "Grande", price: 0.8, ounces: "16 oz" },
  venti: { label: "Venti", price: 1.55, ounces: "20 oz" },
};

const milkOptions = {
  whole: { label: "Whole milk", price: 0 },
  oat: { label: "Oat milk", price: 0.6 },
  almond: { label: "Almond milk", price: 0.65 },
  coconut: { label: "Coconut milk", price: 0.7 },
};

const temperatureOptions = {
  iced: { label: "Iced" },
  hot: { label: "Hot" },
  blended: { label: "Blended" },
};

const extraOptions = {
  "extra-shot": { label: "Extra espresso shot", price: 1.2 },
  "sweet-foam": { label: "Vanilla sweet foam", price: 1.1 },
  "caramel-drizzle": { label: "Caramel drizzle", price: 0.75 },
  "protein-foam": { label: "Protein soft top", price: 1.35 },
};

const pickupModes = {
  cafe: { label: "Cafe counter", fee: 0.75, eta: "Ready in 8-10 min" },
  drive: { label: "Drive-thru", fee: 1.1, eta: "Ready in 10-12 min" },
  curb: { label: "Curbside handoff", fee: 1.3, eta: "Ready in 12-15 min" },
};

const setActiveDrink = (drinkKey) => {
  drinkButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.drink === drinkKey);
  });
};

const getFormState = () => {
  const formData = new FormData(orderForm);
  const drinkKey = selectedDrinkInput.value;
  const quantity = sanitizeQuantity(quantityInput.value);
  const extras = Array.from(extrasInputs)
    .filter((input) => input.checked)
    .map((input) => input.value);

  return {
    drinkKey,
    size: formData.get("size") || "grande",
    milk: formData.get("milk") || drinks[drinkKey].defaultMilk,
    temperature: formData.get("temperature") || drinks[drinkKey].defaultTemperature,
    pickupMode: formData.get("pickupMode") || "cafe",
    pickupTime: formData.get("pickupTime") || "asap",
    customerName: (formData.get("customerName") || "").trim(),
    customerPhone: (formData.get("customerPhone") || "").trim(),
    notes: (formData.get("notes") || "").trim(),
    quantity,
    extras,
  };
};

const sanitizeQuantity = (value) => {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isFinite(parsed) || Number.isNaN(parsed)) {
    return 1;
  }

  return Math.min(6, Math.max(1, parsed));
};

const formatPickupTime = (value) => {
  if (value === "asap") {
    return "As soon as possible";
  }

  if (value.startsWith("In ")) {
    return value;
  }

  return value;
};

const buildPricing = (state) => {
  const drink = drinks[state.drinkKey];
  const sizePrice = sizeOptions[state.size].price;
  const milkPrice = milkOptions[state.milk].price;
  const extrasPrice = state.extras.reduce((total, key) => total + extraOptions[key].price, 0);
  const unitPrice = drink.basePrice + sizePrice + milkPrice + extrasPrice;
  const subtotal = unitPrice * state.quantity;
  const fee = pickupModes[state.pickupMode].fee;
  const total = subtotal + fee;
  const stars = Math.max(25, Math.round(subtotal * 12));

  return {
    unitPrice,
    subtotal,
    fee,
    total,
    stars,
  };
};

const renderExtras = (state) => {
  summaryExtras.replaceChildren();

  if (!state.extras.length) {
    const listItem = document.createElement("li");
    listItem.textContent = "No extras selected";
    summaryExtras.append(listItem);
    return;
  }

  state.extras.forEach((key) => {
    const listItem = document.createElement("li");
    listItem.textContent = extraOptions[key].label;
    summaryExtras.append(listItem);
  });
};

const updateSummary = () => {
  const state = getFormState();
  const drink = drinks[state.drinkKey];
  const pricing = buildPricing(state);
  const pickup = pickupModes[state.pickupMode];

  quantityInput.value = String(state.quantity);

  summaryDrink.textContent = drink.name;
  summaryDescription.textContent = drink.description;
  summaryTemperature.textContent = `${temperatureOptions[state.temperature].label} signature drink`;
  summarySize.textContent = `${sizeOptions[state.size].label} - ${sizeOptions[state.size].ounces}`;
  summaryMilk.textContent = milkOptions[state.milk].label;
  summaryPickup.textContent = pickup.label;
  summaryTime.textContent = formatPickupTime(state.pickupTime);
  summaryQuantity.textContent = String(state.quantity);
  summaryReady.textContent = pickup.eta;
  summarySubtotal.textContent = currency.format(pricing.subtotal);
  summaryFee.textContent = currency.format(pricing.fee);
  summaryTotal.textContent = currency.format(pricing.total);
  summaryStars.textContent = String(pricing.stars);
  ticketSubmit.textContent = `Place order - ${currency.format(pricing.total)}`;

  renderExtras(state);
  persistDraft(state);
};

const applyDefaultsForDrink = (drinkKey) => {
  const drink = drinks[drinkKey];
  const milkSelect = document.querySelector("#milk");
  const temperatureSelect = document.querySelector("#temperature");

  selectedDrinkInput.value = drinkKey;
  setActiveDrink(drinkKey);

  if (milkSelect) {
    milkSelect.value = drink.defaultMilk;
  }

  if (temperatureSelect) {
    temperatureSelect.value = drink.defaultTemperature;
  }

  if (confirmationCard) {
    confirmationCard.hidden = true;
  }
};

const buildOrderNumber = () => {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `Order #SBX-${randomPart}`;
};

const persistDraft = (state) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage failures so the order flow still works without persistence.
  }
};

const restoreDraft = () => {
  try {
    const rawDraft = window.localStorage.getItem(STORAGE_KEY);

    if (!rawDraft) {
      return;
    }

    const draft = JSON.parse(rawDraft);

    if (!draft || !drinks[draft.drinkKey]) {
      return;
    }

    selectedDrinkInput.value = draft.drinkKey;
    setActiveDrink(draft.drinkKey);

    const sizeInput = document.querySelector(`input[name="size"][value="${draft.size}"]`);
    const pickupInput = document.querySelector(
      `input[name="pickupMode"][value="${draft.pickupMode}"]`
    );
    const milkSelect = document.querySelector("#milk");
    const temperatureSelect = document.querySelector("#temperature");
    const pickupTimeSelect = document.querySelector("#pickup-time");
    const customerNameInput = document.querySelector("#customer-name");
    const customerPhoneInput = document.querySelector("#customer-phone");
    const notesInput = document.querySelector("#notes");

    if (sizeInput) {
      sizeInput.checked = true;
    }

    if (pickupInput) {
      pickupInput.checked = true;
    }

    if (milkSelect && draft.milk in milkOptions) {
      milkSelect.value = draft.milk;
    }

    if (temperatureSelect && draft.temperature in temperatureOptions) {
      temperatureSelect.value = draft.temperature;
    }

    if (pickupTimeSelect && draft.pickupTime) {
      pickupTimeSelect.value = draft.pickupTime;
    }

    quantityInput.value = String(sanitizeQuantity(draft.quantity));

    extrasInputs.forEach((input) => {
      input.checked = Array.isArray(draft.extras) && draft.extras.includes(input.value);
    });

    if (customerNameInput && typeof draft.customerName === "string") {
      customerNameInput.value = draft.customerName;
    }

    if (customerPhoneInput && typeof draft.customerPhone === "string") {
      customerPhoneInput.value = draft.customerPhone;
    }

    if (notesInput && typeof draft.notes === "string") {
      notesInput.value = draft.notes;
    }
  } catch {
    // Ignore invalid storage data and fall back to defaults.
  }
};

if (toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    body.classList.remove("nav-open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const updateHeaderState = () => {
  if (!header) {
    return;
  }

  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

if (hasOrderBuilder) {
  drinkButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyDefaultsForDrink(button.dataset.drink);
      formStatus.textContent = "";
      updateSummary();
    });
  });

  stepperButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextValue = sanitizeQuantity(Number(quantityInput.value) + Number(button.dataset.step));
      quantityInput.value = String(nextValue);
      formStatus.textContent = "";
      updateSummary();
    });
  });

  quantityInput.addEventListener("input", () => {
    quantityInput.value = String(sanitizeQuantity(quantityInput.value));
    formStatus.textContent = "";
    updateSummary();
  });

  orderForm.addEventListener("input", () => {
    confirmationCard.hidden = true;
    formStatus.textContent = "";
    updateSummary();
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!orderForm.reportValidity()) {
      return;
    }

    const state = getFormState();
    const drink = drinks[state.drinkKey];
    const pickup = pickupModes[state.pickupMode];
    const pricing = buildPricing(state);
    const customerName = state.customerName || "Guest";
    const pickupTime = formatPickupTime(state.pickupTime);

    confirmationCard.hidden = false;
    confirmationHeading.textContent = `${drink.name} for ${customerName} is confirmed.`;
    confirmationText.textContent = `${state.quantity} ${sizeOptions[state.size].label.toLowerCase()} ${temperatureOptions[state.temperature].label.toLowerCase()} drink${
      state.quantity > 1 ? "s" : ""
    } queued for ${pickup.label.toLowerCase()} with a total of ${currency.format(pricing.total)}.`;
    confirmationNumber.textContent = buildOrderNumber();
    confirmationPickup.textContent =
      pickupTime === "As soon as possible" ? pickup.eta : pickupTime;

    formStatus.textContent = `${customerName}, your order has been placed.`;
    confirmationCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  restoreDraft();
  updateSummary();
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
