let URLQueryValue = window.location.search;
let searchParams = new URLSearchParams(URLQueryValue);
let query = searchParams.get("query");

if(query){
    fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`)
        .then(APIResponse => {
            if(APIResponse.ok === true){
                return APIResponse.json()
            }else{
                throw new Error("There has been an error fetching data from the API");
            }
        })
        .then(parsedResponse =>{
            //console.log(parsedResponse)
            renderShows(parsedResponse);
        })
        .catch(error =>{
            console.error("There has been an error", error);
        })
}

let renderShows = (showsArr => {
    console.log(showsArr);
    let showsContainer = document.getElementById("show-results");
    //console.log(showsContainer)
    showsArr.forEach(show =>{
        let card = document.createElement("article");

        if(show.show.image){
            let cardImage = document.createElement("img");
            cardImage.src = show.show.image.medium;
            cardImage.classList.add("showCard");
            cardImage.alt = "Show's promotional poster"
            card.appendChild(cardImage);
        }else{
            let cardImage = document.createElement("div");
            cardImage.classList.add("showCard");
            card.appendChild(cardImage);
        }
        let heading = document.createElement("h2");
        heading.textContent = show.show.name;
        card.appendChild(heading);
        let rating = document.createElement("p");
        if(show.show.rating.average === null){
            card.appendChild(rating);
            rating.textContent = "N/A"
        }else{
            card.appendChild(rating);
            rating.textContent = show.show.rating.average
        }
        let link = document.createElement("a");
        link.textContent = "View details";
        link.href = `./tv-show-details.html?id=${show.show.id}`;
        card.appendChild(link);
       
        showsContainer.appendChild(card);
    })
})