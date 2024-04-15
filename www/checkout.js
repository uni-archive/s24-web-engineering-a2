import * as Frame from './frame.js';

const items = get_cart_items();
if (items.length === 0)
    location.replace("cart.html")

const price = items.map(i => Frame.calculatePrice(i.printSize, i.frameStyle, i.frameWidth, i.matWidth)).reduce((a, b) => a + b, 0);
document.getElementById("price-subtotal").innerText = (price / 100).toFixed(2);

const shipping = await (await fetch("./shipping.json")).json();
const shipping_map = shipping.countries.reduce((a, b) => ({...a, [b.isoCode]: b}), {});
console.log(shipping_map)

const country_elem = document.getElementById("country");
shipping.countries.forEach(c => {
    const option = document.createElement("option");
    option.innerText = c.displayName;
    option.value = c.isoCode;
    country_elem.append(option);
});

window.calculateTotal = function calculateTotal() {
    const price_total = document.getElementById("price-total")
    const price_shipping = document.getElementById("price-shipping")
    const free_ship_thresh = document.getElementById("free-shipping-threshold")
    const free_shipping_from = document.getElementById("free-shipping-from")

    const selected_country = shipping_map[country_elem.value];

    free_ship_thresh.innerText = (selected_country.freeShippingThreshold / 100).toFixed(2);

    if (selected_country.freeShippingPossible) {
        free_shipping_from.style.display = null;
    } else {
        free_shipping_from.style.display = "none";
    }

    if (selected_country.freeShippingPossible && selected_country.freeShippingThreshold <= price) {
        price_shipping.innerText = "Free";
        price_total.innerText = ((price) / 100).toFixed(2);
    } else {
        price_shipping.innerText = "€ " + (selected_country.price / 100).toFixed(2);
        price_total.innerText = ((price + selected_country.price) / 100).toFixed(2);
    }
}

calculateTotal();

