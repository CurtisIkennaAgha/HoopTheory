// Fetch drills data
document.addEventListener("DOMContentLoaded", () => {
    fetch("drills.json")
      .then((response) => response.json())
      .then((data) => {
        const container = document.getElementsByClassName("drills-container");
        if (!container) {
          console.error("Container not found in the DOM");
          return;
        }
  
        data.categories.forEach((category) => {
          const section = document.createElement("div");
          section.className = "category";
          section.innerHTML = `<h2>${category.name}</h2>`;
          const drillsGrid = document.createElement("div");
          drillsGrid.className = "drills-grid";
  
          for (let i = 1; i <= category.drills; i++) {
            const drill = document.createElement("div");
            drill.className = "drill";
            drill.innerHTML = `
              <img src="${category.path}/${i}.png" alt="${category.name} Drill ${i}">
            `;
            drillsGrid.appendChild(drill);
          }
  
          section.appendChild(drillsGrid);
          container.appendChild(section);
        });
      })
      .catch((error) => {
        console.error("Error fetching or processing drills.json:", error);
      });
  });
  