// Q3.2 — Module Pattern

// Utilities Module (IIFE): hides helper functions, exposes only formatDate
const Utils = (function() {
  function pad(num) { return num < 10 ? '0' + num : num; } // private
  function formatDate(date) { return `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()}`; }
  return { formatDate }; // public
})();

// Validation Module (IIFE): hides regex, exposes validateField
const Validation = (function() {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // private
  function validateField(field) {
    if(field.type === "email" && !emailRegex.test(field.value)) return "Invalid email";
    if(field.required && !field.value.trim()) return "This field is required";
    return null;
  }
  return { validateField }; // public
})();

// Q3.3 — Observer Pattern (Event Bus)

const EventBus = (function() {
  const events = {};
  return {
    subscribe(event, handler) {
      if(!events[event]) events[event] = [];
      events[event].push(handler);
    },
    publish(event, data) {
      if(events[event]) events[event].forEach(h => h(data));
    }
  };
})();

// Q3.4 — MVC Pattern

// Model: manages crop data
class CropModel {
  constructor() { this.crops = []; }
  addCrop(name) {
    const crop = { id: Date.now(), name, status: "Planted", yield: 0 };
    this.crops.push(crop);
    EventBus.publish("cropAdded", crop);
  }
  harvestCrop(id) {
    const crop = this.crops.find(c => c.id === id);
    if(crop) { crop.status = "Harvested"; crop.yield = Math.floor(Math.random()*100); }
    EventBus.publish("cropUpdated", crop);
  }
  removeCrop(id) {
    this.crops = this.crops.filter(c => c.id !== id);
    EventBus.publish("cropRemoved", id);
  }
}

// View: renders crops to DOM
class CropView {
  constructor() { this.list = document.getElementById("crop-list"); }
  render(crops) {
    this.list.innerHTML = "";
    crops.forEach(crop => {
      const div = document.createElement("div");
      div.innerHTML = `
        <strong>${crop.name}</strong> — ${crop.status} (Yield: ${crop.yield})
        <button data-action="harvest" data-id="${crop.id}">Harvest</button>
        <button data-action="remove" data-id="${crop.id}">Remove</button>
      `;
      this.list.appendChild(div);
    });
  }
}

// Controller: wires UI to Model
class CropController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    EventBus.subscribe("cropAdded", () => this.view.render(this.model.crops));
    EventBus.subscribe("cropUpdated", () => this.view.render(this.model.crops));
    EventBus.subscribe("cropRemoved", () => this.view.render(this.model.crops));

    document.getElementById("add-crop-form")?.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("crop-name").value;
      this.model.addCrop(name);
      e.target.reset();
    });

    document.getElementById("crop-list")?.addEventListener("click", e => {
      const id = Number(e.target.dataset.id);
      if(e.target.dataset.action === "harvest") this.model.harvestCrop(id);
      if(e.target.dataset.action === "remove") this.model.removeCrop(id);
    });
  }
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  const model = new CropModel();
  const view = new CropView();
  new CropController(model, view);
});

// Q3.5 — Form Validation (register.html)

document.getElementById("register-form")?.addEventListener("submit", e => {
  e.preventDefault();
  let valid = true;
  [...e.target.elements].forEach(field => {
    const error = Validation.validateField(field);
    let errorSpan = field.nextElementSibling;
    if(!errorSpan || !errorSpan.classList.contains("error")) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error";
      field.insertAdjacentElement("afterend", errorSpan);
    }
    if(error) { errorSpan.textContent = error; valid = false; }
    else { errorSpan.textContent = ""; }
  });
  if(valid) {
 
const farmData = {
fullname: document.getElementById("fullname")?.value,
email: document.getElementById("email")?.value,
phone: document.getElementById("phone")?.value,
nid: document.getElementById("nid")?.value,
farmname: document.getElementById("farmname")?.value,
farmsize: document.getElementById("farmsize")?.value,
province: document.getElementById("province")?.value,
district: document.getElementById("district")?.value,
irrigation: document.getElementById("irrigation")?.value,
notes: document.getElementById("notes")?.value,
registrationDate: Utils.formatDate(new Date())
};
 
StorageAPI.save(farmData);
 
alert("Registration successful! Data saved locally.");
 
e.target.reset();
}
});

// Blur validation for two fields
["email","crop-name"].forEach(id => {
  const field = document.getElementById(id);
  field?.addEventListener("blur", () => {
    const error = Validation.validateField(field);
    let errorSpan = field.nextElementSibling;
    if(!errorSpan || !errorSpan.classList.contains("error")) {
      errorSpan = document.createElement("span");
      errorSpan.className = "error";
      field.insertAdjacentElement("afterend", errorSpan);
    }
    errorSpan.textContent = error || "";
  });
});

// Q3.6 — Alerts interactive (index.html)

document.querySelectorAll(".alert button.dismiss")?.forEach(btn => {
  btn.addEventListener("click", e => {
    const card = e.target.closest(".alert");
    card.remove();
    EventBus.publish("alertDismissed", card.id);
  });
});

// Example subscriber to alertDismissed
EventBus.subscribe("alertDismissed", id => {
  console.log("Alert dismissed:", id);
});
