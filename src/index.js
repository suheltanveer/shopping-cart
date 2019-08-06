import "sanitize.css"; // normalize browser default styles
import "./scss/app.scss";
// import Logo from "./images/logo.png";
import DATA from "./data.json";

if (process.env.NODE_ENV !== "production") {
  console.log(
    "%c App running in development mode",
    "background: red; color: white; font-weight: bold"
  );
}

console.log(DATA);

// webpack HMR component reset!
// if (module.hot) {
//   module.hot.accept("<filename>", () => {
//     console.log("Accepting the update printMe module");
//   });
// }
