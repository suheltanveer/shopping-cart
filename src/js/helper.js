export function disableLinks() {
  const links = document.querySelectorAll("a[href='#']");
  Array.from(links).forEach(link => {
    link.addEventListener("click", e => {
      console.log("%cAnchor links disabled", "color: purple");
      e.preventDefault();
    });
  });
}

// Identify mobile & tablet/desktop devices
export function identifyDevice(x) {
  if (x.matches) {
    return "mobile";
  } else {
    return "tablet";
  }
}

export function divCreator(text) {
  const div = document.createElement("div");
  div.innerHTML = text;
  return div;
}
