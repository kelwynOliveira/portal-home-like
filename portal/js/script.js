// Function to create the HTML for an application card
function createAppCard(app) {
  const statusText = {
    online: "Online",
    offline: "Offline",
    maintenance: "Manutenção",
  };

  const isOffline = app.status === "offline";
  const cardClass = `app-card ${isOffline ? "disabled" : ""}`;
  const linkTag = isOffline ? "div" : "a";
  const hrefAttr = isOffline ? "" : `href="${app.url}" target="_blank"`;

  return `
    <${linkTag} ${hrefAttr}
      class="${cardClass}"
      data-name="${app.name.toLowerCase()}"
      data-description="${app.description.toLowerCase()}"
      data-category="${app.category.toLowerCase()}"
      ${isOffline ? 'title="Aplicação offline"' : ""}
    >
      <div class="app-header">
        <div class="app-icon" style="background-color: ${app.color}">
          ${app.icon}
        </div>
        <div class="app-info">
          <h3>${app.name}</h3>
          <div class="app-category">${app.category}</div>
        </div>
      </div>
      <p class="app-description">${app.description}</p>
      <div class="app-status">
        <div class="status-dot ${app.status}"></div>
        <span>${statusText[app.status]}</span>
      </div>
    </${linkTag}>
  `;
}

// Function to render all applications
// function renderApplications(apps = applications) {
//   const grid = document.getElementById("applicationsGrid");
//   grid.innerHTML = apps.map(createAppCard).join("");
// }

function renderApplications(apps = applications) {
  const onlineGrid = document.getElementById("onlineAppsGrid");
  const offlineGrid = document.getElementById("offlineAppsGrid");

  const onlineApps = apps.filter((app) => app.status === "online");
  const offlineApps = apps.filter((app) => app.status !== "online");

  onlineGrid.innerHTML = onlineApps.map(createAppCard).join("");
  offlineGrid.innerHTML = offlineApps.map(createAppCard).join("");
}

// This function filters the applications based on the search term
function filterApplications(searchTerm) {
  const cards = document.querySelectorAll(".app-card");
  const term = searchTerm.toLowerCase();

  cards.forEach((card) => {
    const name = card.dataset.name;
    const description = card.dataset.description;
    const category = card.dataset.category;

    const matches =
      name.includes(term) ||
      description.includes(term) ||
      category.includes(term);

    if (matches || term === "") {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", async function () {
  try {
    const res = await fetch("./data/apps.json");
    const applications = await res.json();

    // Order applications by name in a case-insensitive manner
    applications.sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
    );

    renderApplications(applications);

    // Set up search functionality
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", function (e) {
      filterApplications(e.target.value);
    });

    // This adds a hover effect to the application cards
    document.addEventListener("mouseover", function (e) {
      if (e.target.closest(".app-card")) {
        e.target.closest(".app-card").style.transform = "translateY(-4px)";
      }
    });

    document.addEventListener("mouseout", function (e) {
      if (e.target.closest(".app-card")) {
        e.target.closest(".app-card").style.transform = "translateY(0)";
      }
    });

    console.log("LiKe Home Server Portal carregado com sucesso!");
    console.log(`${applications.length} aplicações disponíveis`);
  } catch (error) {
    console.error("Erro ao carregar aplicações:", error);
  }
});
