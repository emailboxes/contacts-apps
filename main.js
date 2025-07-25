
let db;
window.onload = () => {
  let request = indexedDB.open("ContactsDB", 1);
  request.onerror = () => console.error("DB failed");
  request.onsuccess = (e) => {
    db = e.target.result;
    showContacts();
  };
  request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("contacts", { keyPath: "email" });
  };
};

async function saveContact(contact) {
  let tx = db.transaction("contacts", "readwrite");
  let store = tx.objectStore("contacts");
  store.put(contact);

  // Sync to Google Sheet
  fetch("https://script.google.com/macros/s/AKfycbxq4j4f_sT75h9DNKgnmg_Xu7QkG3lCYIb_1TMB-4MmHTkF2TUufEvhzSlb_RVTqONB/exec", {
    method: "POST",
    body: JSON.stringify(contact),
    headers: { "Content-Type": "application/json" }
  }).then(r => console.log("Synced"))
    .catch(err => console.error("Sync error:", err));
}

async function showContacts() {
  let tx = db.transaction("contacts", "readonly");
  let store = tx.objectStore("contacts");
  let req = store.getAll();
  req.onsuccess = () => {
    let list = document.getElementById("contacts-list");
    list.innerHTML = "";
    req.result.forEach(c => {
      list.innerHTML += `<li><strong>${c.name}</strong> - ${c.email}</li>`;
    });
  };
}

document.getElementById("contact-form").onsubmit = async (e) => {
  e.preventDefault();
  const contact = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    status: document.getElementById("status").value,
    notes: document.getElementById("notes").value
  };
  await saveContact(contact);
  showContacts();
  e.target.reset();
};
