// ---------- DATA ----------
const products = [
  { id: 1, name: "Queen Bed", cat: "Beds", icon: "🛏️", price: 850000, size: "160 x 200 cm", stock: true, image: "./images/poltrona-frau-archibald-bed.webp"},
  { id: 2, name: "Single Bed", cat: "Beds", icon: "🛏️", price: 450000, size: "90 x 190 cm", stock: true, image: "./images/naobim-bedroom-4138509_1920(1).jpg" },
  { id: 3, name: "3-Seater Sofa", cat: "Sofas", icon: "🛋️", price: 1200000, size: "210 x 90 cm", stock: true, image: "./images/G.jpg" },
  { id: 4, name: "L-Shaped Sofa", cat: "Sofas", icon: "🛋️", price: 2200000, size: "280 x 180 cm", stock: false, image: "./images/istockphoto-2169200951-1024x1024.jpg" },
  { id: 5, name: "6-Seater Dining Table", cat: "Tables", icon: "🍽️", price: 1500000, size: "180 x 90 cm", stock: true, image: "./images/DINNING.jpg" },
  { id: 6, name: "Coffee Table", cat: "Tables", icon: "☕", price: 350000, size: "100 x 50 cm", stock: true, image: "./images/D2.jpg" },
  { id: 7, name: "3-Door Wardrobe", cat: "Wardrobes", icon: "🚪", price: 1100000, size: "150 x 55 x 200 cm", stock: true, image: "./images/W.jpg" },
  { id: 8, name: "Office Desk", cat: "Desks", icon: "🖥️", price: 600000, size: "140 x 70 cm", stock: true, image: "./images/desk.jpg" },
  { id: 9, name: "Executive Desk", cat: "Desks", icon: "🖥️", price: 1300000, size: "180 x 80 cm", stock: false, image: "./images/desk1.jpg" },
  { id: 10, name: "Dining Chair", cat: "Chairs", icon: "🪑", price: 120000, size: "45 x 50 x 95 cm", stock: true, image: "./images/Untitled.jpg" },
  { id: 11, name: "Office Chair", cat: "Chairs", icon: "💺", price: 280000, size: "60 x 60 x 110 cm", stock: true, image: "./images/W1.jpg" }
];



// basket is saved in localStorage so it works on every page
let basket = JSON.parse(localStorage.getItem("basket"));

function saveBasket() {
  localStorage.setItem("basket",JSON.stringify(basket));
  updateCount();
}

function updateCount() {
  let total = 0;
  for (let i = 0; i < basket.length; i++) total += basket[i].qty;
  document.getElementById("count").textContent = total;
}

function money(n) { return "UGX " + n.toLocaleString(); }

function getProduct(id) { return products.filter(function (x) { return x.id === id; })[0]; }

// ---------- PRODUCT CARDS ----------
function cardHTML(p) {
  let status = p.stock ? '<span class="in">In stock</span>' : '<span class="out">Out of stock</span>';
  let disabled = p.stock ? "" : "disabled";
  return '<div class="card"><div class="pic">' + '<image src="' + p.image +'">' + '</div>' +
    '<h3>' + p.name + '</h3><p>' + p.cat + '</p>' +
    '<p class="price">' + money(p.price) + '</p><p>' + status + '</p>' +
    '<button class="btn" onclick="showDetails(' + p.id + ')">Details</button> ' +
    '<button class="btn" ' + disabled + ' onclick="addToBasket(' + p.id + ')">Add to basket</button></div>';
}

function showProducts() {
  let box = document.getElementById("products");
  let text = document.getElementById("search").value.toLowerCase();
  let cat = document.getElementById("category").value;
  let html = "";
  for (var i = 0; i < products.length; i++) {
    let p = products[i];
    if (p.name.toLowerCase().indexOf(text) !== -1 && (cat === "All" || p.cat === cat)) html += cardHTML(p);
  }
  box.innerHTML = html || "<p>No furniture found.</p>";
}

function showDetails(id) {
  let p = getProduct(id);
  let m = document.getElementById("modal");
  if (!m) { window.location = "catalogue.html"; return; }
  m.innerHTML = '<h3>' + p.name + '</h3><p style="font-size:4rem">' +'</p>' + '<image src="' + p.image + 'class="detail-image"'> +
    '<p>Category: ' + p.cat + '</p><p>Size: ' + p.size + '</p><p>Price: ' + money(p.price) + '</p>' +
    '<p>' + (p.stock ? "Available" : "Out of stock") + '</p>' +
    '<button class="btn" onclick="this.parentNode.classList.add(\'hidden\')">Close</button>';
  m.classList.remove("hidden");
  m.scrollIntoView();
}

function addToBasket(id) {
  for (let i = 0; i < basket.length; i++) {
    if (basket[i].id === id) { basket[i].qty++; saveBasket(); alert("Quantity updated."); return; }
  }
  basket.push({ id: id, qty: 1 });
  saveBasket();
  alert("Added to basket.");
}

// ---------- BASKET PAGE ----------
function showBasket() {
  let area = document.getElementById("basketArea");
  if (basket.length === 0) {
    area.innerHTML = '<p>Your basket is empty. <a href="catalogue.html">Browse furniture</a></p>';
    document.getElementById("formArea").classList.add("hidden");
    return;
  }
  let total = 0;
  let rows = "";
  for (let i = 0; i < basket.length; i++) {
    let p = getProduct(basket[i].id);
    let sub = p.price * basket[i].qty;
    total += sub;
    rows += "<tr><td>" + p.name + "</td><td>" + money(p.price) + "</td>" +
      '<td class="qty"><button onclick="changeQty(' + i + ',-1)">-</button> ' + basket[i].qty +
      ' <button onclick="changeQty(' + i + ',1)">+</button></td>' +
      "<td>" + money(sub) + '</td><td><button onclick="removeItem(' + i + ')">Remove</button></td></tr>';
  }
  area.innerHTML = "<table><tr><th>Item</th><th>Price</th><th>Qty</th><th>Subtotal</th><th></th></tr>" +
    rows + "</table><h3>Estimated total: " + money(total) + "</h3>";
}

function changeQty(i, change) {
  basket[i].qty += change;
  if (basket[i].qty < 1) basket.splice(i, 1);
  saveBasket(); showBasket();
}

function removeItem(i) { basket.splice(i, 1); saveBasket(); showBasket(); }

// ---------- FORM VALIDATION ----------
function validateForm() {
  let ok = true;
  let name = document.getElementById("name").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let email = document.getElementById("email").value.trim();
  let address = document.getElementById("address").value.trim();

  document.getElementById("nameErr").textContent = "";
  document.getElementById("phoneErr").textContent = "";
  document.getElementById("emailErr").textContent = "";
  document.getElementById("addressErr").textContent = "";

  if (name.length < 3) { document.getElementById("nameErr").textContent = "Enter your full name."; ok = false; }
  if (!/^(0|\+256)[0-9]{9}$/.test(phone)) { document.getElementById("phoneErr").textContent = "Enter a valid phone number."; ok = false; }
  if (email.indexOf("@") < 1 || email.indexOf(".") < 0) { document.getElementById("emailErr").textContent = "Enter a valid email."; ok = false; }
  if (address.length < 5) { document.getElementById("addressErr").textContent = "Enter your delivery address."; ok = false; }
  return ok;
}

function submitOrder(e) {
  e.preventDefault();
  if (!validateForm()) return;
  let orderNo = "KFH" + Math.floor(1000 + Math.random() * 9000);
  let name = document.getElementById("name").value;
  document.getElementById("basketArea").classList.add("hidden");
  document.getElementById("formArea").classList.add("hidden");
  let c = document.getElementById("confirm");
  c.classList.remove("hidden");
  c.innerHTML = "<h3>✅ Thank you, " + name + "!</h3><p>Your order number is <b>" + orderNo + "</b>.</p>" +
    '<p>Status: <b id="status">Received</b></p>';
  basket = []; saveBasket();
  // simulate order processing
  setTimeout(function () { document.getElementById("status").textContent = "Processing"; }, 3000);
  setTimeout(function () { document.getElementById("status").textContent = "Ready for delivery"; }, 6000);
}

// ---------- RUN ON EACH PAGE ----------
updateCount();

if (document.getElementById("products")) {
  showProducts();
  document.getElementById("search").addEventListener("input", showProducts);
  document.getElementById("category").addEventListener("change", showProducts);
}
if (document.getElementById("featured")) {
  let f = "";
  for (let k = 0; k < 3; k++) f += cardHTML(products[k * 2]);
  document.getElementById("featured").innerHTML = f;
}
if (document.getElementById("basketArea")) {
  showBasket();
  document.getElementById("orderForm").addEventListener("submit", submitOrder);
}
