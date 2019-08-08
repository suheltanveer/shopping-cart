import Earphone from "../images/Earphone.png";
import Phone from "../images/phone.png";
import SelfieStick from "../images/stick.png";

export function createMobileProductTemplate(product) {
  // Create each product row html
  //  Add respective images
  const list = document.getElementById("products-list");
  const li = document.createElement("li");

  li.innerHTML = `
          <ul class='row'>
              <li class="image"><div></div></li>
              <li class="desc">
              ${
                product.tagline
                  ? `<span class="offer">${product.tagline}</span>`
                  : ""
              }
              <span class="name">${product.name}</span>
              <span class="type"><pre>${product.desc}</pre></span>
              <div class="price-quantity">
                  <div class="price">${product.price} $</div>
                  <div class="quantity"></div>
              </div>
              </li>
          </ul>
          ${
            product.gift
              ? `
          <div class="toggle-gift ${
            product.selectedQuantity === 0 ? "hide" : "show"
          }">
          <div class="separator"><span class="icon icon-plus"></span></div>
          <ul class='row child-row'>
              <li class="image gift-image"><div></div></li>
              <li class="desc">
              <span class="offer">Gift</span>
              <span class="name">${product.gift.name}</span>
              <span class="type"><pre>${product.gift.desc}</pre></span>
              <div class="price-quantity">
                  <div class="price">${product.gift.price} $</div>
              </div>
              </li>
          </ul><div>`
              : ""
          }`;

  // Product Image
  const img = new Image();
  if (product.name === "Earphones") {
    img.src = Earphone;
  } else if (product.name.includes("Test")) {
    img.src = Phone;
  }
  // update image
  li.querySelector(".image div").appendChild(img);

  // Gift Image
  if (product.gift) {
    var img2 = new Image();
    img2.src = SelfieStick;
    // update image
    li.querySelector(".gift-image div").appendChild(img2);
  }

  // create quantity component
  const minus = document.createElement("a");
  minus.classList.add("minus");
  minus.innerHTML = `<span class="icon icon-minus ${
    product.selectedQuantity > 0 ? "icon-minus-active" : ""
  }"></span>`;

  const plus = document.createElement("a");
  plus.innerHTML = '<span class="icon icon-plus"></span>';
  plus.classList.add("plus");

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("value", product.selectedQuantity);
  // disable input box - beacause of validation - do not know the limit
  input.setAttribute("disabled", "disabled");
  input.dataset.productId = product.id;

  const quant = li.querySelector(".quantity");
  quant.appendChild(minus);
  quant.appendChild(input);
  quant.appendChild(plus);

  list.appendChild(li);
}

export function createTableHeaderTemplate() {
  return `
    <li>
    <ul class="row-header">
        <li class="cell-product">Product</li>
        <li class="cell-price">Price</li>
        <li class="cell-quantity">Quantity</li>
        <li class="cell-subtotal">Subtotal</li>
        <li class="cell-action"></li>
    </ul>
    </li>`;
}

export function createTabletProductTemplate(product) {
  // Create each product row html
  //  Add respective images
  const list = document.getElementById("products-list");
  const li = document.createElement("li");

  li.innerHTML = `
          <ul class='row'>
              <li class="cell-product">
                <div class="image">
                    <div></div>
                </div>
                <div class="desc">
                ${
                  product.tagline
                    ? `<span class="offer">${product.tagline}</span>`
                    : ""
                }
                  <span class="name">${product.name}</span>
                  <span class="type"><pre>${product.desc}</pre></span>
                </div>
              </li>
              <li class="cell-price">
                <div class="price">${product.price} $</div>
              </li>
              <li class="cell-quantity quantity"></li>
              <li class="cell-subtotal">${product.price *
                product.selectedQuantity} $</li>
              <li class="cell-action">
                <a class="delete" data-product-id="${
                  product.id
                }"><span class="icon icon-delete"></span></a>
              </li>
          </ul>
          ${
            product.gift
              ? `
          <div class="toggle-gift ${
            product.selectedQuantity === 0 ? "hide" : "show"
          }">
          
          <ul class='row child-row'>
              <li class="cell-product">
                <div class="image gift-image"><div></div></div>
                <div class="desc">
                    <span class="offer">Gift</span>
                    <span class="name">${product.gift.name}</span>
                    <span class="type"><pre>${product.gift.desc}</pre></span>
                </div>
              </li>
              <li class="cell-price price">${product.gift.price} $</li>
              <li class="cell-quantity"></li>
              <li class="cell-subtotal"></li>
              <li class="cell-action"></li>
          </ul><div>`
              : ""
          }`;

  // Product Image
  const img = new Image();
  if (product.name === "Earphones") {
    img.src = Earphone;
  } else if (product.name.includes("Test")) {
    img.src = Phone;
  }
  // update image
  li.querySelector(".image div").appendChild(img);

  // Gift Image
  if (product.gift) {
    var img2 = new Image();
    img2.src = SelfieStick;
    // update image
    li.querySelector(".gift-image div").appendChild(img2);
  }

  // create quantity component
  const minus = document.createElement("a");
  minus.classList.add("minus");
  minus.innerHTML = `<span class="icon icon-minus ${
    product.selectedQuantity > 0 ? "icon-minus-active" : ""
  }"></span>`;

  const plus = document.createElement("a");
  plus.innerHTML = '<span class="icon icon-plus"></span>';
  plus.classList.add("plus");

  const input = document.createElement("input");
  input.type = "text";
  input.setAttribute("value", product.selectedQuantity);
  // disable input box - beacause of validation - do not know the limit
  input.setAttribute("disabled", "disabled");
  input.dataset.productId = product.id;

  const quant = li.querySelector(".quantity");
  quant.appendChild(minus);
  quant.appendChild(input);
  quant.appendChild(plus);

  list.appendChild(li);
}
