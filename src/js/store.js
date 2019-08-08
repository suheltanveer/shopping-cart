// import Data from "../data.json";

// handles data storage
export default class Store {
  constructor(data) {
    this.data = data;
    this.tempProducts = this.data.products;
  }

  // save products in localstorage
  saveProducts() {
    this.data.products.forEach(product => {
      product.selectedQuantity = 0;
    });
    this.tempProducts = this.data.products;
    localStorage.setItem(
      "data",
      JSON.stringify(Object.assign(this.data, this.tempProducts))
    );
  }

  // fetch products from localstorage
  getProducts() {
    return this.data.products;
  }

  getTempProducts() {
    return this.tempProducts;
  }

  removeProduct(id) {
    this.tempProducts = this.tempProducts.filter(o => o.id != id);
  }

  //   pincode options
  getPincodes() {
    return this.data.pincode;
  }

  //   Get discount data
  getDiscount() {
    return this.data.discount;
  }

  // Get user entered pincode
  getPincode() {
    return JSON.parse(localStorage.getItem("pincode"));
  }

  // Get product price from id
  getProductPrice(id) {
    const products = this.getProducts();
    let price;
    products.find((o, i) => {
      if (o.id == id) {
        price = products[i].price;
        return;
      }
    });
    return price;
  }

  updateStore(id, selectedQuantity) {
    const products = this.getTempProducts();
    products.find((o, i) => {
      if (o.id == id) {
        products[i].selectedQuantity = selectedQuantity;
        return true; // stop searching
      }
    });

    // Save new data
    this.tempProducts = products;
    localStorage.setItem(
      "data",
      JSON.stringify(Object.assign(this.data, products))
    );
  }

  deletePincode() {
    localStorage.setItem("pincode", JSON.stringify(""));
  }

  updatePincode(pincode) {
    localStorage.setItem("pincode", JSON.stringify(pincode));
  }
}
