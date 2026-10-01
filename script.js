document.addEventListener("DOMContentLoaded", async function() {
    const projectsContainer = document.getElementById("projects");
    const hiddenProjectsContainer = document.getElementById("hidden-projects");
    const projectsData = "projects.json";
    const fitProjectTitle = projectElement => {
        const title = projectElement.querySelector("h2");
        const baseFontSize = Number(title.dataset.baseFontSize || parseFloat(getComputedStyle(title).fontSize));

        title.dataset.baseFontSize = baseFontSize;
        title.style.fontSize = `${baseFontSize}px`;

        const availableWidth = title.clientWidth;
        const textWidth = title.scrollWidth;

        if (availableWidth > 0 && textWidth > availableWidth) {
            title.style.fontSize = `${baseFontSize * availableWidth / textWidth * 0.98}px`;
        }
    };
    const titleResizeObserver = new ResizeObserver(entries => {
        entries.forEach(({ target }) => fitProjectTitle(target));
    });
    const addReadmeButton = (projectElement, repo, openCard) => {
        const readmeUrl = `https://raw.githubusercontent.com/${repo}/main/README.md`;

        fetch(readmeUrl, { method: "HEAD" })
            .then(response => {
                if (!response.ok) {
                    console.error(`Failed to fetch README for ${repo}: ${response.status}`);
                    return;
                }

                const bookbutton = document.createElement("button");
                bookbutton.classList.add("bookbutton");
                bookbutton.textContent = "🕮";
                bookbutton.addEventListener("click", event => {
                    event.stopPropagation();
                    window.open('/project.html?f=' + readmeUrl + '&from-main=true');
                });
                projectElement.appendChild(bookbutton);

                if (openCard) {
                    projectElement.addEventListener("click", () => {
                        window.open('/project.html?f=' + readmeUrl + '&from-main=true');
                    });
                }

                fitProjectTitle(projectElement);
            })
            .catch(error => console.error(`Failed to check README for ${repo}`, error));
    };

    fetch(projectsData)
        .then(response => response.json())
        .then(projects => {
            function createProjectElement(project) {
                const projectElement = document.createElement("div");
                projectElement.classList.add("project");

                const title = document.createElement("h2");
                title.textContent = project.title;
                projectElement.appendChild(title);

                if (project.link == false) {
                    const match = project.github.match(/github\.com\/([^/]+\/[^/?#]+)/);

                    if (match) {
                        addReadmeButton(projectElement, match[1], true);
                    }
                } else {
                    const arrow = document.createElement("p");
                    arrow.classList.add("arrow");

                    arrow.textContent = "↗";
                    projectElement.addEventListener("click", () => {
                        window.open(project.link)
                    });
                    projectElement.appendChild(arrow);

                    const match = project.github.match(/github\.com\/([^/]+\/[^/?#]+)/);

                    if (match) {
                        addReadmeButton(projectElement, match[1], false);
                    }
                    
                }

                titleResizeObserver.observe(projectElement);
                return projectElement;
            }

            projects['shown'].forEach(project => {
                projectsContainer.appendChild(createProjectElement(project));
            });
            projects['hidden'].forEach(project => {
                hiddenProjectsContainer.appendChild(createProjectElement(project));
            });

            document.fonts.ready.then(() => {
                document.querySelectorAll(".project").forEach(fitProjectTitle);
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