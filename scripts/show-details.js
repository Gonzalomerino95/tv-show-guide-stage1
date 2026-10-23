let searchParams = new URLSearchParams(window.location.search);
let id = searchParams.get("id");

function fetchJSON(url) {
  return fetch(url).then((response) => {
    if (response.ok === true) {
      return response.json();
    } else {
      throw new Error(
        `There has been an error fetching data from the API: ${response.status}`,
      );
    }
  });
}

if (id) {
  const showURL = `https://api.tvmaze.com/shows/${encodeURIComponent(id)}`;

  Promise.all([fetchJSON(showURL), fetchJSON(`${showURL}/episodes`)])
    .then(([show, episodes]) => {
      renderShowDetails(show, episodes);
    })
    .catch((error) => {
      console.error(`Could not load show details: ${error}`);
    });
}



let renderShowDetails = (show, episodes) => {
  console.log("Show Details:", show);
  console.log("Episode list:", episodes);
  let showContainer = document.getElementById("showContainer");

  //Build the Show's description
  if (show) {
    if (show.name) {
      let heading = document.createElement("h1");
      heading.textContent = show.name;
      heading.classList.add("showHeading");
      showContainer.appendChild(heading);
    }

    if (show.image.original) {
      let poster = document.createElement("img");
      poster.src = show.image.original;
      poster.alt = "Show's promotional poster";
      poster.classList.add("showPoster");
      showContainer.appendChild(poster);
    }

    if (show.type) {
      let type = document.createElement("p");
      type.textContent = `Category: ${show.type}`;
      type.classList.add("showType");
      showContainer.appendChild(type);
    }

    if (show.averageRuntime) {
      let avgRuntime = document.createElement("p");
      avgRuntime.textContent = `Average episode length: ${show.averageRuntime}`;
      avgRuntime.classList.add("avgRuntime");
      showContainer.appendChild(avgRuntime);
    }

    if (show.premiered) {
      let releaseDate = document.createElement("p");
      releaseDate.textContent = `Premiered: ${show.premiered}`;
      releaseDate.classList.add("releaseDate");
      showContainer.appendChild(releaseDate);
    }

    if (show.status) {
      let status = document.createElement("p");
      status.textContent = `Current status: ${show.status}`;
      status.classList.add("showStatus");
      showContainer.appendChild(status);
    }

    if(show.summary){
        const parsedSummary = new DOMParser().parseFromString(show.summary, "text/html");

        let summary = document.createElement("p");
        summary.textContent = `Synopsis: ${parsedSummary.body.textContent}`;
        summary.classList.add("summary");
        showContainer.appendChild(summary)
    }
  }
  //Build the episode list (MAke it colapsable)
  let episodeListContainer = document.getElementById("episodeListContainer");

  const episodesBySeason = {};
  episodes.forEach(episode => {
        const season = episode.season;

        if(!episodesBySeason[season]){
            episodesBySeason[season] = [];
        }

        episodesBySeason[season].push(episode);
  });

  const seasonCount = Object.keys(episodesBySeason).length;

  Object.entries(episodesBySeason).forEach(([season, seasonEpisodes]) => {
    const seasonDetails = document.createElement("details");
    const seasonLabel = document.createElement("summary");

    seasonLabel.textContent =
        `Season ${season} (${seasonEpisodes.length} episodes)`;

    seasonDetails.appendChild(seasonLabel);

    seasonEpisodes.forEach(episode => {
        const episodeDetails = document.createElement("details");
        const episodeLabel = document.createElement("summary");

        episodeLabel.textContent =
            `Episode ${episode.number ?? "—"}: ${episode.name}`;

        episodeDetails.appendChild(episodeLabel);

        const description = document.createElement("p");

        if (episode.summary) {
            const parsedSummary = new DOMParser().parseFromString(
                episode.summary,
                "text/html"
            );

            description.textContent = parsedSummary.body.textContent;
        } else {
            description.textContent = "No summary available.";
        }

        episodeDetails.appendChild(description);
        seasonDetails.appendChild(episodeDetails);
    });

    episodeListContainer.appendChild(seasonDetails);
});
};
