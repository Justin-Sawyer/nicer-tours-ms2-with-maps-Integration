let map;
let markers;

function createMap() {
    let options = {
        center: { lat: 43.69572, lng: 7.27528 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), options);

    //Seach input box
    let input = document.getElementById("search");
    let searchBox = new google.maps.places.SearchBox(input);

    let clearSearchBox = document.getElementById("clearSearchButton");
    clearSearchBox.addEventListener("click", function() {
        document.getElementById("search").value = "";
    })

    //sets search to boundary of map
    map.addListener("bounds_changed", function() {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];

    searchBox.addListener("places_changed", function() {
        let places = searchBox.getPlaces();

        if (places.length === 0) 
            return;
        
        markers.forEach(function(m) {m.setMap(null);});
        markers = [];

        let bounds = new google.maps.LatLngBounds();

        places.forEach(function(p) {
            if (!p.geometry)
                return;
            document.getElementById("attraction").innerHTML = `<div class="row">
                    
                <div class="col-12 order-1 poi-title">
                    <h2 id="poi-title-name"></h2>
                </div>

                <div class="col-12 order-2" id="attraction-image"></div>

                <div class="col-12 order-12 buttons-and-links">
                    <div class="row">
                        <div class="col-xl-4 col-sm-6 order-xl-1 order-1 more-info" style="text-align:left">
                        </div>
                        <div class="col-xl-4 col-sm-12 order-xl-2 order-3 add-to-itin">
                            <button class="btn btn-light btn-block add-to-itin-button" onclick="addToItin()">Add To Itinerary</button>
                        </div>
                        <div class="col-xl-4 col-sm-6 order-xl-3 order-2 back-to-map" style="text-align:right">
                            <button class="btn btn-light btn-block back-to-mapbutton" onclick="backToMap()">Back To Map</button>
                        </div>
                    </div>
                </div>
            </div>`;

            let placeName = p.name;
            console.log(placeName);
            document.getElementById("poi-title-name").append(placeName)

            let photoUrl = p.photos[0].getUrl();
            let img = document.createElement("img");
            img.setAttribute("src", photoUrl);
            img.setAttribute("class", "img")
            document.getElementById("attraction-image").appendChild(img);

            let placeReviews = p.reviews;
            placeReviews.forEach(function(item) {
                //console.log(item);
                document.getElementById("attraction-image").innerHTML += `<p style="margin-bottom:0">${item.text}</p>
                <p style="text-align:right"><strong>${item.author_name}: </strong> 
                <span style="color:red; font-size:x-large">${item.rating}</span>/5</p><hr>`;
            });

            let placeWebsite = p.website;
            //console.log(placeWebsite);
            if (p.hasOwnProperty("website") == true) {
                console.log(placeWebsite);
                $(".more-info").append(`<a class="btn btn-light btn-block more-info" role="button" href="${placeWebsite}" target="_blank">Find Out More</a>
                        `)

            } else if (p.hasOwnProperty("website") == false){
                console.log("No website");
                $(".more-info").append(`<p>Sorry, no website available for this place.</p>`)
            }

            markers.push(new google.maps.Marker({
                map: map,
                title: p.name,
                position: p.geometry.location
            }));

            if (p.geometry.viewport)
                bounds.union(p.geometry.viewport);
            else 
                bounds.extend(p.geometry.location);

            $(".back-to-map").on("click", function() {
                markers.forEach(function(m) {m.setMap(null);});
            markers = [];
            });

            $("#attraction").get(0).scrollIntoView();
        });
        map.fitBounds(bounds)
    });

}

//------------------------------------------------------------------------------------------------------- Close all Info boxes and reset map zoom
    //Go back to top of map on click
    function backToMap() {
        document.getElementById("search").value = "";
        map.setZoom(12);
        $(".input-div").get(0).scrollIntoView();
    }

    // Makes sure to choose from dropdown menu
    function search(searchbox) {
        if(event.key === 'Enter') {
            alert("Please select from the dropdown menu");        
        }
    }

    //SessionStorage to add item to Tour Itinerary
    // Thanks to mentor Aaron for guidance
    function addToItin() {
        var getValue = $('#search').val();

        if (localStorage.getItem("place") === null) {
            sessionStorage.setItem("place", "");
        }
        
        sessionStorage.setItem("place", sessionStorage.getItem("place") + "\n" + getValue)

        sessionStorage.getItem('place');
        let placeAddedToItinerary = sessionStorage.getItem('place');
        console.log(placeAddedToItinerary)
        alert(`You have added 
    ${placeAddedToItinerary} 
to your itinerary`)
        document.getElementById("message").innerHTML += placeAddedToItinerary;
        $(".btn-cta-presonalised-tour").css("display", "block");
    }


    