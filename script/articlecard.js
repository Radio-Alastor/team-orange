document.addEventListener("DOMContentLoaded", (event) => {
    const articles = data; // from data.js
    const articleList = document.getElementById("articleList");

    articles.forEach((article) => {
        const articleCard = document.createElement("a");
        articleCard.classList.add("col", "text-decoration-none");
        articleCard.href = `article.html?id=${article.id}`
        articleCard.append(createCard(article));
        articleList.append(articleCard);
    });
});

function createCard(item) {
    // Create the card container
    const card = document.createElement("div");
    card.classList.add("card", "shadow-sm", "h-100", "border");

    // Create the image
    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.classList.add("card-img-top");
    img.alt = item.title;

    // Create the Card Body 
    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body", "d-flex", "flex-column");

    // Create the Card Title
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = item.title;

    // Create the card description
    const description = document.createElement("p");
    description.classList.add("card-text", "d-block");
    description.textContent = item.description;

    cardBody.append(title, description);
    card.append(img, cardBody);

    return card;
}