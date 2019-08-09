import Data from "../data.json";

export default class Store {
  //   Get products
  static getProducts() {
    let products;
    const storedData = localStorage.getItem("products");
    if (localStorage.getItem("products") !== null) {
      products = JSON.parse(storedData);
    } else {
      products = Data.products;
      products.forEach(product => {
        product.selectedQuantity = 0;
      });
      localStorage.setItem("products", JSON.stringify(products));
    }
    return products;
  }

  // Get product price from id
  static getProductPrice(id) {
    const products = Store.getProducts();
    let price;
    products.find((o, i) => {
      if (o.id == id) {
        price = products[i].price;
        return true; // stop searching
      }
    });
    return price;
  }

  // Get product quantity selected
  static getProductQuantity(id) {
    const products = Store.getProducts();
    let quantity;
    products.find((o, i) => {
      if (o.id == id) {
        quantity = products[i].selectedQuantity;
        return true; // stop searching
      }
    });
    return quantity;
  }

  static deleteProduct(id) {
    const products = Store.getProducts();
    localStorage.setItem(
      "products",
      JSON.stringify(products.filter(o => o.id != id))
    );
  }

  //   Get available pincodes
  static getPincodes() {
    return Data.pincode;
  }

  // User Entered Pincodes
  static getPincode() {
    return JSON.parse(localStorage.getItem("pincode"));
  }
  static updatePincode(pincode) {
    localStorage.setItem("pincode", JSON.stringify(pincode));
  }
  static resetPincode() {
    localStorage.setItem("pincode", JSON.stringify(""));
  }

  static getDiscount() {
    return Data.discount;
  }

  static updateStore(id, selectedQuantity) {
    const products = Store.getProducts();
    products.find((o, i) => {
      if (o.id == id) {
        products[i].selectedQuantity = selectedQuantity;
        return true; // stop searching
      }
    });

    // Save new data
    localStorage.setItem("products", JSON.stringify(products));
  }
}
