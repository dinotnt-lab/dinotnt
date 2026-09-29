document.addEventListener("DOMContentLoaded", function() {
    const projectsContainer = document.getElementById("projects");
    const hiddenProjectsContainer = document.getElementById("hidden-projects");
    const projectsData = "projects.json";

    hiddenProjectsContainer.addEventListener("transitionend", event => {
        if (event.propertyName === "height" && hiddenProjectsContainer.classList.contains("is-open")) {
            hiddenProjectsContainer.style.height = "auto";
        }
    });

    fetch(projectsData)
        .then(response => response.json())
        .then(projects => {
            function createProjectElement(project) {
                const projectElement = document.createElement("div");
                projectElement.classList.add("project");

                const title = document.createElement("h2");
                title.textContent = project.title;
                projectElement.appendChild(title);

                const arrow = document.createElement("p");
                arrow.classList.add("arrow");
                if (project.link == undefined) {
                    arrow.textContent = "🕮";
                    projectElement.addEventListener("click", () => {
                        window.location.href = '/project.html?f=' + project.file;
                    });
                } else {
                    arrow.textContent = "↗";
                    projectElement.addEventListener("click", () => {
                        window.location.href = project.link;
                    });
                }

                projectElement.appendChild(arrow);
                return projectElement;
            }

            projects['shown'].forEach(project => {
                projectsContainer.appendChild(createProjectElement(project));
            });
            projects['hidden'].forEach(project => {
                hiddenProjectsContainer.appendChild(createProjectElement(project));
            });
        });
});

function toggleHiddenProjects() {
    const hiddenProjectsContainer = document.getElementById("hidden-projects");
    const toggleButton = document.getElementById("show-hidden");
    const isOpening = !hiddenProjectsContainer.classList.contains("is-open");

    if (isOpening) {
        hiddenProjectsContainer.classList.add("is-open");
        hiddenProjectsContainer.setAttribute("aria-hidden", "false");
        hiddenProjectsContainer.style.height = `${hiddenProjectsContainer.scrollHeight}px`;
    } else {
        hiddenProjectsContainer.style.height = `${hiddenProjectsContainer.getBoundingClientRect().height}px`;
        hiddenProjectsContainer.offsetHeight;
        hiddenProjectsContainer.classList.remove("is-open");
        hiddenProjectsContainer.setAttribute("aria-hidden", "true");
        hiddenProjectsContainer.style.height = "0px";
    }

    toggleButton.setAttribute("aria-expanded", String(isOpening));
    toggleButton.textContent = isOpening ? "- Less" : "+ More";
}

document.addEventListener("DOMContentLoaded", async function() {
    const gap = 10
    var x = 0
    var f = true
    while (true) {
        if (f) {
            x += 1;
        } else {
            x -= 1;
        }
        if (x >= 100) {
            f = false;
        }
        if (x <= 0) {
            f = true;
        }
        document.documentElement.style.setProperty('--bg-one', `${x}%`);
        document.documentElement.style.setProperty('--bg-two', `${x + gap}%`);
        await new Promise(resolve => setTimeout(resolve, 50));
    }
});