const BASE_URL = "https://collectionapi.metmuseum.org";

async function met_search(query, hasImages = true) {
    const url = new URL(BASE_URL + "/public/collection/v1/search");
    url.searchParams.set("q", query);
    url.searchParams.set("hasImages", hasImages);
    const request = new Request(url.href, {
        method: "GET"
    });
    return await (await fetch(request)).json();
}


async function met_get_info(objectId) {
    const cached = get_cache(objectId);
    if (!! cached) return cached;
    const url = BASE_URL + "/public/collection/v1/objects/" + objectId;
    const request = new Request(url, {
        method: "GET"
    });
    const data = await (await fetch(request)).json();
    update_cache(objectId, data)
    return data;
}

function get_cache(objectId) {
    const cache_string = localStorage.getItem("met_cache");
    const cache_obj = cache_string === null ? {} : JSON.parse(cache_string);
    return cache_obj[objectId];
}

function update_cache(objectId, data) {
    const cache_string = localStorage.getItem("met_cache");
    const cache_obj = cache_string === null ? {} : JSON.parse(cache_string);
    cache_obj[objectId] = data;
    localStorage.setItem("met_cache", JSON.stringify(cache_obj));
}

function get_cart_items() {
    const saved = localStorage.getItem("cart");
    return saved !== null ? JSON.parse(saved) : [];
}

function set_cart_items(items = []) {
    return localStorage.setItem("cart", JSON.stringify(items));
}
const update_cart_text = () => {
    const cart_elem = document.getElementById("cart-link");
    if (!cart_elem) return;

    const items_in_cart = get_cart_items();
    cart_elem.innerText = "Cart" + (items_in_cart.length > 0 ? ` (${items_in_cart.length})` : '');
};
update_cart_text();
