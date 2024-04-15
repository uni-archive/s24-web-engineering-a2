const search_text_elem = document.getElementById("search");
const text_elem = document.getElementById("search-info");

const galleryItemTemplate = document.getElementById("gallery-entry");
const gallery_elem = document.getElementById("gallery");

search_text_elem.value = (new URL(window.location.href)).searchParams.get("q");

if (search_text_elem.value.trim().length === 0)
    (async () => {
        const highlights = await fetch("./highlights.json");
        await show_items((await highlights.json()).highlights);
        //text_elem.innerText = `Found ${results.total} artwork${results.total != 1 ? "s" : ""} for “${q}“`
    })();
else
    perform_search();

function generateGalleryEntry(obj) {
    const clone = galleryItemTemplate.content.cloneNode(true);
    const img = clone.querySelector("img");
    const a = clone.querySelector("a");
    a.href = "/framing.html?objectID=" + obj.objectID;
    img.src = obj.primaryImageSmall;
    clone.querySelector(".title").innerText = obj.title;
    clone.querySelector(".artist").innerText = obj.artistDisplayName;
    clone.querySelector(".date").innerText = obj.objectDate;
    return clone;
}

async function perform_search() {
    const q = search_text_elem.value;
    text_elem.innerHTML = `Searching for &ldquo;${q}&rdquo;...`
    console.log(q)
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    //window.location.href = url.href;
    //location.replace(url.href);
    const results = await met_search(q);

    if (results.objectIDs)
        await show_items(results.objectIDs);
    text_elem.innerHTML =  `Found ${results.total} artwork${results.total != 1 ? "s" : ""} for &ldquo;${q}&rdquo;`
}

async function show_items(object_ids) {
    const detailResults = await Promise.all(object_ids.slice(0, 100).map(id => met_get_info(id)));

    const fragment = document.createDocumentFragment();

    console.log(detailResults)
    detailResults.filter(o => o.objectID !== undefined)
        .map(generateGalleryEntry)
        .forEach(o => fragment.append(o));

    gallery_elem.innerHTML = "";
    console.log(fragment)
    gallery_elem.appendChild(fragment)
}
