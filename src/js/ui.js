import {
  createMobileProductTemplate,
  createTableHeaderTemplate,
  createTabletProductTemplate
} from "./templates";

export default class UI {
  static init() {
    // disable all links with href='#'
    const links = document.querySelectorAll("a[href='#']");
    Array.from(links).forEach(link => {
      link.addEventListener("click", e => {
        console.log("%cAnchor links disabled", "color: purple");
        e.preventDefault();
      });
    });
  }

  // render products
  static displayProducts(products, device) {
    //   Reset product list
    const list = document.querySelector("#products-list");
    list.innerHTML = "";
    switch (device) {
      case "mobile": {
        console.log("<<< mobile device >>>");
        products.forEach(product => createMobileProductTemplate(product));
        break;
      }
      case "tablet": {
        console.log("<<< tablet/desktop device >>>");

        // Render product table header
        const tableHeader = createTableHeaderTemplate();
        list.innerHTML = tableHeader;

        products.forEach(product => createTabletProductTemplate(product));
        break;
      }
    }
  }

  //   Quantity :: minus icon change when quantity is zero
  static updateDisplay(element, isQuantity, isMobile) {
    //   Also toggle the gift item
    let giftRow;
    if (isMobile) {
      giftRow =
        element.parentNode.parentNode.parentNode.parentNode.parentNode
          .nextElementSibling;
    } else {
      giftRow = element.parentNode.parentNode.parentNode.nextElementSibling;
    }

    if (isQuantity) {
      if (giftRow) {
        giftRow.classList.remove("hide");
        giftRow.classList.add("show");
      }
      element.classList.add("icon-minus-active");
      return;
    }
    // else
    if (giftRow) {
      giftRow.classList.remove("show");
      giftRow.classList.add("hide");
    }
    element.classList.remove("icon-minus-active");
  }

  static updateCartSubtotal(element, price, quantity) {
    element.textContent = `${parseInt(price) * parseInt(quantity)} $`;
  }

  //   Delivery Component
  // display pincode value
  static displayPincode(pincode) {
    const input = document.querySelector(".pincode-matcher > input");
    input.value = pincode;
  }

  static displayDeliveryOptions(pincodes, userPincode) {
    const pincodesAvailable = Object.keys(pincodes);
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
      parent.appendChild(createDeliverableOptionHTML(`Free \n Delivery`));
    }
    if (cashOnDelivery) {
      parent.appendChild(createDeliverableOptionHTML(`Cash on \n Delivery`));
    }

    parent.appendChild(
      createDeliverableOptionHTML(
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

  // Update order-summary
  static updateOrderSummary(products, discount, pincodes, userPincode) {
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
    const { minTotal, discountPercentage } = discount;
    const discountElement = document.querySelector(".order-discount");
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
    this.checkoutToggle(isDeliverable);
  }

  static checkoutToggle(bool) {
    const checkout = document.querySelector(".checkout");
    if (!bool) {
      checkout.setAttribute("disabled", "disabled");
    } else {
      checkout.removeAttribute("disabled");
    }
  }
}

// Utility func to create divs for delivery options
function createDeliverableOptionHTML(text) {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div;
}
