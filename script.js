const API_KEY = "c56c181eaa19051154ff1688b656045d";
const BASE_URL = "http://api.mediastack.com/v1/news";

// Fetch news when the page loads
window.addEventListener("load", () => fetchNews("India"));

// Reload button
function reload() {
  window.location.reload();
}

// Main fetch function
async function fetchNews(query) {
  try {
    const res = await fetch(
      `${BASE_URL}?access_key=${API_KEY}&keywords=${query}&countries=in&languages=en&limit=12`
    );
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
      console.error("No articles found.");
      document.getElementById("cards-container").innerHTML =
        "<p>No news found for this topic.</p>";
      return;
    }

    console.log("Fetched Articles:", data.data); // debug
    bindData(data.data);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

// Populate news cards
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const template = document.getElementById("template-news-card");

  cardsContainer.innerHTML = ""; // clear previous cards

  articles.forEach((article) => {
    if (!article.image || !article.title || !article.description) return;

    const cardClone = template.content.cloneNode(true);

    cardClone.querySelector(".news-img").src = article.image;
    cardClone.querySelector("#news-title").textContent = article.title;
    cardClone.querySelector("#news-desc").textContent = article.description;

    const date = new Date(article.published_at).toLocaleDateString("en-US");
    cardClone.querySelector(
      "#news-source"
    ).textContent = `${article.source} - ${date}`;

    cardClone.querySelector(".card").addEventListener("click", () => {
      window.open(article.url, "_blank");
    });

    cardsContainer.appendChild(cardClone);
  });
}

// Navigation click
let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Search
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
