import Store from "./store";
import * as Helper from "./helper";
import { mobileDimensions } from "./mediaQueries";

import {
  createMobileProductTemplate,
  createTableHeaderTemplate,
  createTabletProductTemplate
} from "./templates";

export default class UI {
  static init() {
    // disable all links with href='#'
    Helper.disableLinks();

    // Display products in cart
    // Different templates for mobile and tablet/desktop devices
    deviceRenderer(mobileDimensions);
    //   addListener for change in dimenions
    mobileDimensions.addListener(deviceRenderer);

    function deviceRenderer(x) {
      if (x.matches) {
        UI.displayProducts("mobile");
      } else {
        UI.displayProducts("tablet");
      }
    }
    // UI.displayProducts(device);

    // Fetch pincode and display
    UI.displayPincode();

    // Update order-summary
    UI.updateOrderSummary();

    //   Hide notification if no discount
    if (!Store.getDiscount()) {
      document.querySelector(".notification").style.display = "none";
    }
  }

  static getDevice() {
    return Helper.identifyDevice(mobileDimensions);
  }

  static displayProducts(device) {
    const products = Store.getProducts();
    const list = document.querySelector("#products-list");
    //   Reset product list
    list.innerHTML = "";

    if (device === "mobile") {
      console.log("<<< mobile device >>>");
      products.forEach(product => createMobileProductTemplate(product));
    } else {
      console.log("<<< tablet/desktop device >>>");
      // Render product table header
      list.innerHTML = createTableHeaderTemplate();
      products.forEach(product => createTabletProductTemplate(product));
    }
  }

  //   Remove product from list
  static deleteProduct(element, id) {
    Store.deleteProduct(id);
    element.parentNode.parentNode.parentNode.remove();
    UI.updateOrderSummary();
  }

  // Display pincode value
  static displayPincode() {
    // Change event fires only when element loses focus - not suitable
    // HTML5 input event works, but not when value is changed by JS

    // if pincode && matches the available set
    // then -> render delivery options because input elements can't detect change event when value is changed by js
    const pincode = Store.getPincode();
    if (!pincode) {
      return;
    }
    const input = document.querySelector(".pincode-matcher input");
    input.value = pincode;
    UI.displayDeliveryOptions();
  }

  static displayDeliveryOptions() {
    const pincodes = Store.getPincodes();
    const pincodesAvailable = Object.keys(pincodes);
    const userPincode = Store.getPincode();
    // exit early if pincode doesnt match the availale set
    if (!pincodesAvailable.includes(userPincode)) {
      return;
    }

    const { deliveryPrice, cashOnDelivery, estimatedDays } = pincodes[
      userPincode
    ];
    const { min, max } = estimatedDays;
    const parent = document.querySelector(".delivery-options");

    if (deliveryPrice === 0) {
      parent.appendChild(Helper.divCreator(`Free \n Delivery`));
    }
    if (cashOnDelivery) {
      parent.appendChild(Helper.divCreator(`Cash on \n Delivery`));
    }

    parent.appendChild(
      Helper.divCreator(
        `Estimated delivery \n time is ${
          min === max ? `${min}` : `${min} - ${max}`
        } days`
      )
    );
  }

  // Remove delivery options
  static removeDeliveryOptions() {
    const parent = document.querySelector(".delivery-options");
    parent.innerHTML = "";
  }

  static resetPincode(event) {
    const input = event.target.previousElementSibling;
    input.value = "";
    input.focus();
    const options = document.querySelector(".delivery-options");
    options.innerHTML = "";
    Store.resetPincode();
    UI.updateOrderSummary();
  }

  static updatePincode(event) {
    // only allow numerical values
    if (isNaN(event.target.value)) {
      console.log("%cPincode must be an number", "color: red");
      event.target.value = "";
      return;
    }

    if (event.target.value.length === 6) {
      Store.updatePincode(event.target.value);
      UI.displayDeliveryOptions();
    } else {
      Store.resetPincode();
      UI.removeDeliveryOptions();
    }

    UI.updateOrderSummary();
  }

  // Update order-summary
  static updateOrderSummary() {
    const products = Store.getProducts();
    const discount = Store.getDiscount();
    const pincodes = Store.getPincodes();
    const userPincode = Store.getPincode();

    // Total item count
    const totalItemsCount = products.reduce(
      (acc, item) => acc + item.selectedQuantity,
      0
    );
    const totalItemsCountElement = document.querySelector(".order-items");
    totalItemsCountElement.textContent = totalItemsCount;

    // Subtotal
    const subtotal = products.reduce(
      (acc, item) => acc + item.price * item.selectedQuantity,
      0
    );
    const subtotalElement = document.querySelector(".order-subtotal");
    subtotalElement.textContent = subtotal;

    // Discount
    const discountElement = document.querySelector(".order-discount");
    let minTotal = 0;
    let discountPercentage = 0;
    if (Store.getDiscount()) {
      minTotal = discount.minTotal;
      discountPercentage = discount.discountPercentage;
    }
    let discountValue = 0;
    if (subtotal >= minTotal) {
      discountValue = subtotal * (discountPercentage / 100);
    }
    discountElement.textContent = discountValue;

    // Calculate shipping charges
    let shippingCharge = 0;
    const shipingChargeElement = document.querySelector(".order-shipping");

    // Is deliverable
    const isDeliverable =
      userPincode &&
      Object.keys(pincodes).includes(userPincode) &&
      totalItemsCount > 0;
    if (isDeliverable) {
      const { deliveryPrice } = pincodes[userPincode];
      shippingCharge = deliveryPrice;
    }
    shipingChargeElement.textContent =
      shippingCharge !== 0 ? `${shippingCharge} $` : "Free";

    // Calculate Grand Total
    const grandTotal = subtotal - discountValue + shippingCharge;
    const grandTotalElement = document.querySelector(".order-total");
    grandTotalElement.textContent = grandTotal;

    // Toggle checkout button
    UI.checkoutToggle(isDeliverable);
  }

  static checkoutToggle(bool) {
    const checkout = document.querySelector(".checkout");
    if (!bool) {
      checkout.setAttribute("disabled", "disabled");
    } else {
      checkout.removeAttribute("disabled");
    }
  }

  //   Quantity :: minus icon change when quantity is zero
  static updateProductRowDisplay(element, productId) {
    const isMobile = Helper.identifyDevice(mobileDimensions) === "mobile";
    const quantity = parseInt(element.value);
    const removeElement = element.previousElementSibling.querySelector(
      ".icon-minus"
    );

    if (!isMobile) {
      const subtotalElement = element.parentNode.nextElementSibling;
      const price = Store.getProductPrice(productId);
      subtotalElement.textContent = `${parseInt(price) * parseInt(quantity)} $`;
    }

    // Toggle the gift item
    // Different html structure for mobile and non mobile devices
    let giftRow;
    if (isMobile) {
      giftRow =
        removeElement.parentNode.parentNode.parentNode.parentNode.parentNode
          .nextElementSibling;
    } else {
      giftRow =
        removeElement.parentNode.parentNode.parentNode.nextElementSibling;
    }

    if (quantity === 0) {
      if (giftRow) {
        giftRow.classList.remove("show");
        giftRow.classList.add("hide");
      }
      removeElement.classList.remove("icon-minus-active");
    } else if (quantity === 1) {
      if (giftRow) {
        giftRow.classList.remove("hide");
        giftRow.classList.add("show");
      }
      removeElement.classList.add("icon-minus-active");
    }
  }

  //   Add or remove quantity
  static updateQuantity(productId, element) {
    const quantity = parseInt(element.value);
    UI.updateProductRowDisplay(element, productId);
    Store.updateStore(productId, quantity);
    UI.updateOrderSummary();
  }

  static updateCart(e) {
    const target = e.target.parentElement;
    const isDelete = target.classList.contains("delete");

    // delete product row
    if (isDelete) {
      const productId = target.dataset.productId;
      UI.deleteProduct(target, productId);
      return;
    }

    const isRemove = target.classList.contains("minus");
    const isAdd = target.classList.contains("plus");

    if (!isAdd && !isRemove) {
      return; // exit early if not targeted elements
    }

    const input = isAdd
      ? target.previousElementSibling
      : target.nextElementSibling;
    const productId = input.dataset.productId;

    if (isAdd) {
      input.value = parseInt(input.value) + 1;
      UI.updateQuantity(productId, input);
    } else if (isRemove && parseInt(input.value) !== 0) {
      input.value = parseInt(input.value) - 1;
      UI.updateQuantity(productId, input);
    }
  }
}
