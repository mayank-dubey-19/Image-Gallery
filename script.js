let input = document.querySelector(".search-bar");
let search_btn = document.querySelector(".search-btn");
let category = document.querySelector(".categorys");
let load_more_btn = document.querySelector(".load-more-btn");
let refresh_btn = document.querySelector(".refresh-btn");
let grid = document.querySelector(".grid");
let imgcounter = 12 ;

const api_key = "";

let currentQuery = null;
let currentPage = 1;

function showSkeleton(count = 12, append = false) {

    if (!append) {
        grid.innerHTML = "";
    }

    for (let i = 0; i < count; i++) {

        let skeleton = document.createElement("div");
        skeleton.classList.add("skeleton-card");

        skeleton.innerHTML = `
            <div class="skeleton-img"></div>

            <div class="skeleton-info">
                <div class="skeleton-name"></div>
                <div class="skeleton-buttons"></div>
                <div class="skeleton-buttons"></div>
            </div>
        `;

        grid.appendChild(skeleton);
    }
}


function removeSkeleton() {

    document.querySelectorAll(".skeleton-card").forEach(skeleton => {
        skeleton.remove();
    });

}

async function getphotos(images = null, page = 1, append = false) {

    showSkeleton(12, append);

    let url;

    if (images === null) {
        url = `https://api.pexels.com/v1/curated?per_page=12&page=${page}`;
    }
    else {
        url = `https://api.pexels.com/v1/search?query=${images}&per_page=12&page=${page}`;
    }

    let response = await fetch(url, {
        headers: {
            Authorization: api_key
        }
    });

    if (!response.ok) {

        removeSkeleton();
        alert("Something went wrong");
        return;

    }

    let data = await response.json();

    if (append) {
        removeSkeleton();
    }
    if (!append) {
        grid.innerHTML = "";
    }

    data.photos.forEach(card => {

        let card_div = document.createElement("div");
        card_div.classList.add("img-card");

        let img = document.createElement("img");
        img.classList.add("card-img");

        img.src = card.src.medium;
        img.alt = card.alt;

        let card_info = document.createElement("div");
        card_info.classList.add("card-info");

        let div1 = document.createElement("div");

        let span = document.createElement("span");
        span.innerText = card.photographer;

        let div2 = document.createElement("div");
        div2.classList.add("view");

        div2.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                style="width:15px;height:15px;">

                <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>

                <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
            </svg>
        `;

        div2.addEventListener("click", () => {
            window.open(card.url, "_blank");
        });

        let div3 = document.createElement("div");
        div3.classList.add("download");

        div3.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                style="width:15px;height:15px;">

                <path stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/>
            </svg>
        `;

        div3.addEventListener("click", async () => {

            try {

                let wantDownload = confirm(" Do you wnat to download ..? ");
                if (!wantDownload) {
                    return;
                }

                let response = await fetch(card.src.original);
                let blob = await response.blob();
                let link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `pexels-${card.id}.jpg`;
                link.click();
                URL.revokeObjectURL(link.href);

            }

            catch (error) {
                console.log(error);
                alert("Download failed");
            }

        });

        grid.appendChild(card_div);

        card_div.appendChild(img);
        card_div.appendChild(card_info);

        card_info.appendChild(div1);
        div1.appendChild(span);

        card_info.appendChild(div2);
        card_info.appendChild(div3);

    });

    currentPage = page;

}

search_btn.addEventListener("click", function () {

    let searchvalue = input.value.trim();

    if (searchvalue === "") {
        alert("Please enter something");
        return;
    }

    currentQuery = searchvalue;
    currentPage = 1;
    getphotos(currentQuery, currentPage, false);

    imgcounter = 12 ;
    let counter_text = document.querySelector(".img-counter");
    counter_text.innerText = `Straming ${imgcounter} out of 120+ imges`;

});

input.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        let searchvalue = input.value.trim();
        currentQuery = searchvalue;
        currentPage = 1;
        getphotos(currentQuery, currentPage, false);
    }

    imgcounter = 12 ;
    let counter_text = document.querySelector(".img-counter");
    counter_text.innerText = `Straming ${imgcounter} out of 120+ imges`;

});

category.addEventListener("change", () => {

    let selectedCategory = category.value;
    currentPage = 1;

    if (selectedCategory === "all") {
        currentQuery = null;
        getphotos(null, currentPage, false);
    }
    else {
        currentQuery = selectedCategory;
        getphotos(currentQuery, currentPage, false);
    }

    imgcounter = 12 ;
    let counter_text = document.querySelector(".img-counter");
    counter_text.innerText = `Straming ${imgcounter} out of 120+ imges`;

});

load_more_btn.addEventListener("click", () => {

    imgcounter = imgcounter + 12 ;
    let counter_text = document.querySelector(".img-counter")
    counter_text.innerText = `Straming ${imgcounter} out of 120+ imges`;

    let nextPage = currentPage + 1;
    getphotos(currentQuery, nextPage, true);

});

refresh_btn.addEventListener("click", () => {

    imgcounter = 12 ;
    let counter_text = document.querySelector(".img-counter");
    counter_text.innerText = `Straming ${imgcounter} out of 120+ imges`;

    currentQuery = null;
    currentPage = 1;
    category.value = "all";
    getphotos(null, 1, false);

});

getphotos(null, 1, false);