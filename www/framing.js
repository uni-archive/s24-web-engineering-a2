(async () => {
    const current_url = new URL(window.location.href);
    const object_id = current_url.searchParams.get("objectID");
    if (! object_id) {
        window.location.href = "/search.html";
    }
    const data = await met_get_info(object_id);
    console.log(data)
    if (! data.objectID) {
        window.location.href = "/search.html";
    }

    document.getElementById("preview-image").onload = window.render;

    document.getElementById("preview-image").src = data.primaryImageSmall;
    document.querySelector("#image-label .title").innerText = data.title;
    document.querySelector("#image-label .artist").innerText = data.artistDisplayName;
    document.querySelector("#image-label .date").innerText = data.objectDate;

    if (current_url.searchParams.has("printSize")) {
        document.querySelector('input[name="printSize"]:checked').checked = false;
        document.querySelector('input[name="printSize"][value="' + current_url.searchParams.get("printSize") + '"]').checked = true;
    }

    if (current_url.searchParams.has("frameStyle")) {
        document.querySelector('input[name="frameStyle"]:checked').checked = false;
        document.querySelector('input[name="frameStyle"][value="' + current_url.searchParams.get("frameStyle") + '"]').checked = true;
    }

    if (current_url.searchParams.has("matColor")) {
        document.querySelector('input[name="matColor"]:checked').checked = false;
        document.querySelector('input[name="matColor"][value="' + current_url.searchParams.get("matColor") + '"]').checked = true;
    }

    if (current_url.searchParams.has("frameWidth")) {
        document.querySelector('input[name="frameWidth"]').value = Number(current_url.searchParams.get("frameWidth")) / 10;
        document.querySelector('input[name="frameWidthR"]').value = Number(current_url.searchParams.get("frameWidth")) / 10;
    }

    if (current_url.searchParams.has("matWidth")) {
        document.querySelector('input[name="matWidth"]').value = Number(current_url.searchParams.get("matWidth")) / 10;
        document.querySelector('input[name="matWidthR"]').value = Number(current_url.searchParams.get("matWidth")) / 10;
    }
})();
