import "sanitize.css"; // normalize browser default styles
import "./scss/app.scss";
import Data from "./data.json";
import Store from "./js/store";
import UI from "./js/ui";
import { mobileDimensions } from "./js/mediaQueries";

if (process.env.NODE_ENV !== "production") {
  console.log(
    "%c App running in development mode",
    "background: red; color: white; font-weight: bold"
  );
}

let store;

// device identifier flag
let isMobile;

document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI - disabling all anchor links**
  UI.init();

  // initialize store
  const localStorageData = JSON.parse(localStorage.getItem("data"));
  if (localStorageData == null) {
    store = new Store(Data);
    store.saveProducts();
  } else {
    store = new Store(JSON.parse(localStorage.getItem("data")));
  }

  // fetch pincode and display
  UI.displayPincode(store.getPincode());

  // Change event fires only when element loses focus - not suitable
  // HTML5 input event works, but not when value is changed by JS

  // if pincode && matches the available set
  // then -> render delivery options because input elements can't detect change event when value is changed by js
  const pincodeInput = document.querySelector(".pincode-matcher input");
  // we only save valid 6 digit pincodes
  // hence check for empty value
  if (pincodeInput.value) {
    UI.displayDeliveryOptions(store.getPincodes(), pincodeInput.value);
  }

  // Update order-summary
  updateCartSummary(true);

  // Display products in cart
  // Different templates for mobile and tablet/desktop devices
  deviceRenderer(mobileDimensions);

  //   addListener for change in dimenions
  mobileDimensions.addListener(deviceRenderer);
});

// Shopping cart interactions
// attach event to parent (event delegation) for plus minus quantity events
document
  .querySelector("#products-list")
  .addEventListener("click", productListClickHandler);

// Quantity plus minus event handler
// TODO - refactor this function
function productListClickHandler(e) {
  const target = e.target.parentElement;
  const isMinus = target.classList.contains("minus");
  const isPlus = target.classList.contains("plus");

  // delete product row
  if (target.classList.contains("delete")) {
    const productId = target.dataset.productId;
    store.removeProduct(productId);
    target.parentNode.parentNode.parentNode.remove();
    // Modify order summary after removing the respective row :: Temporary :: Does not affect store
    updateCartSummary();
  }

  let input;
  if (isPlus) {
    input = target.previousElementSibling;
    const productId = input.dataset.productId;
    input.value = parseInt(input.value) + 1;

    // Update cart subtotal for non mobile screens
    if (!isMobile) {
      UI.updateCartSubtotal(
        input.parentNode.nextElementSibling,
        store.getProductPrice(productId),
        input.value
      );
    }

    // Change minus icon - active
    if (input.value == 1) {
      UI.updateDisplay(
        input.previousElementSibling.querySelector(".icon-minus"),
        true,
        isMobile
      );
    }

    store.updateStore(productId, parseInt(input.value));
    updateCartSummary();
  } else if (isMinus) {
    input = target.nextElementSibling;
    if (parseInt(input.value) !== 0) {
      const productId = input.dataset.productId;
      input.value = parseInt(input.value) - 1;

      // Update cart subtotal for non mobile screens
      if (!isMobile) {
        UI.updateCartSubtotal(
          input.parentNode.nextElementSibling,
          store.getProductPrice(productId),
          input.value
        );
      }

      // change minus icon - inactive
      if (input.value == 0) {
        UI.updateDisplay(
          input.previousElementSibling.querySelector(".icon-minus"),
          false,
          isMobile
        );
      }

      store.updateStore(productId, parseInt(input.value));
      updateCartSummary();
    }
  }
}

// Pincode Interactions
// change link event
document
  .querySelector(".pincode-matcher > a")
  .addEventListener("click", changeClickHandler);

function changeClickHandler(event) {
  const input = event.target.previousElementSibling;
  input.value = "";
  input.focus();
  const options = document.querySelector(".delivery-options");
  options.innerHTML = "";
  store.deletePincode();
  updateCartSummary();
}

// pincode input validation
document
  .querySelector(".pincode-matcher > input")
  .addEventListener("input", pincodeChangeHandler);

function pincodeChangeHandler(event) {
  // only allow numerical values
  if (isNaN(event.target.value)) {
    console.log("%cPincode must be an number", "color: red");
    event.target.value = "";
    return;
  }

  if (event.target.value.length === 6) {
    store.updatePincode(event.target.value);
    UI.displayDeliveryOptions(store.getPincodes(), event.target.value);
  } else {
    store.deletePincode();
    UI.removeDeliveryOptions();
  }

  updateCartSummary();
}

// product table renderer for mobile & tablet/desktop devices
function deviceRenderer(x) {
  if (x.matches) {
    isMobile = true;
    UI.displayProducts(store.getProducts(), "mobile");
  } else {
    isMobile = false;
    UI.displayProducts(store.getProducts(), "tablet");
  }
}

// Uitility func to shorten this func call
function updateCartSummary(isOriginal = false) {
  if (!isOriginal) {
    UI.updateOrderSummary(
      store.getTempProducts(),
      store.getDiscount(),
      store.getPincodes(),
      store.getPincode()
    );
  } else {
    UI.updateOrderSummary(
      store.getProducts(),
      store.getDiscount(),
      store.getPincodes(),
      store.getPincode()
    );
  }
}
