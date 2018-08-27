import axios from 'axios';
import moment from 'moment'

const mapOptions = {
    center: {lat: 59.9594691, lng: 30.3235418},
    zoom: 10,
    gestureHandling: 'greedy',
    scaleControl: true,
};

function  loadPlaces(map, api, lat = 59.9594691, lng = 30.3235418) {
    axios.get(`${api}?lat=${lat}&lng=${lng}`)
        .then(res =>{
            const sites = res.data;
            if(!sites) {
                console.log(`no sites`)
            }
            const bounds = new google.maps.LatLngBounds();
            const infoWindow = new google.maps.InfoWindow();
            const markers = sites.map(site => {
                const [siteLng, siteLat] = site.location.coordinates;
                const position = {lat: siteLat, lng: siteLng};
                bounds.extend(position);
                let icon;
                site.todos.forEach((todo) => {
                    if (todo.groups.includes('Не срочно')) {
                        icon = {
                            url: "../../images/grey.png",
                        };
                    } else if(todo.groups.includes('ПТО-1')) {
                        icon = {
                            url: "../../images/pto1.png",
                        };
                    } else if(todo.groups.includes('ПТО-2')) {
                        icon = {
                            url: "../../images/pto2.png",
                        };
                    } else if(todo.groups.includes('ПТО-3')) {
                        icon = {
                            url: "../../images/pto3.png",
                        };
                    } else if(todo.groups.includes('ПТО-4')) {
                        icon = {
                            url: "../../images/pto4.png",
                        };
                    } else if(todo.groups.includes('ПТО-5')) {
                        icon = {
                            url: "../../images/pto5.png",
                        };
                    } else if(todo.groups.includes('ПТО-6')) {
                        icon = {
                            url: "../../images/pto6.png",
                        };
                    } else if(todo.groups.includes('ПТО-7')) {
                        icon = {
                            url: "../../images/pto7.png",
                        };
                    } else if(todo.groups.includes('ПТО-8')) {
                        icon = {
                            url: "../../images/pto8.png",
                        };
                    } else if(todo.groups.includes('ПТО-9')) {
                        icon = {
                            url: "../../images/pto9.png",
                        };
                    } else if(todo.groups.includes('ПТО-10')) {
                        icon = {
                            url: "../../images/pto10.png",
                        };
                    } else if(todo.groups.includes('ПТО-11')) {
                        icon = {
                            url: "../../images/pto11.png",
                        };
                    } else if(todo.groups.includes('ПТО-12')) {
                        icon = {
                            url: "../../images/pto12.png",
                        };
                    } else if(todo.groups.includes('DWDM')) {
                        icon = {
                            url: "../../images/orange.png",
                        }
                    } else if(todo.groups.includes('SDH')) {
                        icon = {
                            url: "../../images/orange.png",
                        }
                    } else if(todo.groups.includes('ВОЛС')) {
                        icon = {
                            url: "../../images/yellow.png",
                        }
                    } else if(todo.groups.includes('MBH')) {
                        icon = {
                            url: "../../images/pink.png",
                        }
                    } else if(todo.groups.includes('TE')) {
                        icon = {
                            url: "../../images/lawngreen.png",
                        }
                    } else if(todo.groups.includes('Авария')) {
                        icon = {
                            url: "../../images/red.png",
                        }
                    }
                });
                const marker = new google.maps.Marker({
                    map,
                    position,
                    icon,
                });
                marker.site = site;
                return marker;
            });
            markers.forEach((marker) => {
                marker.addListener('click', function() {
                    let todosHTML = ``;
                    let groupsHTML = ``;
                    this.site.todos.forEach((todo) => {
                        todo.groups.forEach((group) => {
                            if (group.startsWith('ПТО')) {
                            groupsHTML = groupsHTML + `<div class = "ui brown label">${group}</div>`
                            } else if (group === 'Авария') {
                                groupsHTML = groupsHTML + `<div class = "ui red label">${group}</div>`
                            } else if (group === 'MBH') {
                                groupsHTML = groupsHTML + `<div class = "ui pink label">${group}</div>`
                            } else if (group === 'SDH' || group === 'DWDM') {
                                groupsHTML = groupsHTML + `<div class = "ui orange label">${group}</div>`
                            } else if (group === 'ВОЛС') {
                                groupsHTML = groupsHTML + `<div class = "ui yellow label">${group}</div>`
                            } else if (group === 'TE') {
                                groupsHTML = groupsHTML + `<div class = "ui green label">${group}</div>`
                            } else if (group === 'Не срочно') {
                                groupsHTML = groupsHTML + `<div class = "ui teal label">${group}</div>`
                            } else if (group === 'Ожидание') {
                                groupsHTML = groupsHTML + `<div class = "ui grey label">${group}</div>`
                            } else {
                                groupsHTML = groupsHTML + `<div class = "ui label">${group}</div>`
                            }
                        });
                        if(todo.priority === 1){
                            todosHTML = todosHTML + `<hr>                            
                            <p><i class="warning sign icon" style="color: red;"></i>${todo.text}</p> <p>Автор: ${todo.author.name}</p>`
                        } else {
                            todosHTML = todosHTML + `<hr>                            
                            <p><b>${todo.text}</b></p> <p>Автор: ${todo.author.name}</p>`
                        }
                        if(todo.scheduled_date) {
                            todosHTML = todosHTML + `<p>План на: ${moment(todo.scheduled_date).locale('ru').format('LL')}</p>`
                        }
                        todosHTML = todosHTML + groupsHTML;
                        groupsHTML = ``;
                    });
                    const html = `
                    <a href="/site/${this.site.slug}">${this.site.name}</a>
                    <p>${this.site.location.address}</p>` +todosHTML;
                    infoWindow.setContent(html);
                    infoWindow.open(map, this);
                })
            });
            map.setCenter(bounds.getCenter());
            map.fitBounds(bounds);
        });

}

function queryString(p) {
    let query =location.search.substring(1);
    let params = query.split('&');
    for (let i = 0; i < params.length; i++) {
        let pair = params[i].split('=');
        if (pair[0] === p) {
            return pair[1];
        }
    }
}




function makeMap(mapDiv) {
    if(!mapDiv) return;
    const map = new google.maps.Map(mapDiv, mapOptions);
    if(mapDiv.id === "allmap") {
        loadPlaces(map, '/api/sites/');
    } else if (mapDiv.id === "map") {
        if(queryString("lat") && queryString("lng")){
            loadPlaces(map, '/api/sites/near', queryString("lat"), queryString("lng"));
        } else {
            loadPlaces(map, '/api/sites/near');
        }
        const input = document.querySelector('[name="geolocate"]');
        const autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            console.log(place.geometry.location.lat());
            console.log(place.geometry.location.lng());
            loadPlaces(map, '/api/sites/near', place.geometry.location.lat(), place.geometry.location.lng());
        })
    } else if (mapDiv.id === "todomap") {
        loadPlaces(map, '/api/sites/todo');
    }  else if (mapDiv.id === "prioritytodomap") {
        loadPlaces(map, '/api/sites/todo/priority');
    }

    let mapinput = document.getElementById('pac-input');
    let searchBox = new google.maps.places.SearchBox(mapinput);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(mapinput);
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        let places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }
        // Clear out the old markers.
        markers.forEach(function(marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        let bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            let icon = {
                url: place.icon,
                size: new google.maps.Size(71, 71),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(17, 34),
                scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));

            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

export default makeMap;