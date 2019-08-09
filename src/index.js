import "sanitize.css"; // normalize browser default styles
import "./scss/app.scss";
import UI from "./js/ui";

if (process.env.NODE_ENV !== "production") {
  console.log(
    "%c App running in development mode",
    "background: red; color: white; font-weight: bold"
  );
}

document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI
  UI.init();
});

// Shopping cart interactions
// attach event to parent (event delegation) for plus minus quantity events
document
  .querySelector("#products-list")
  .addEventListener("click", UI.updateCart);

// Pincode Interactions
// change link event
document
  .querySelector(".pincode-matcher > a")
  .addEventListener("click", UI.resetPincode);

// pincode input validation
document
  .querySelector(".pincode-matcher > input")
  .addEventListener("input", UI.updatePincode);
