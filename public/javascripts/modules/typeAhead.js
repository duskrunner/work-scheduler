import axios from 'axios';
import dompurify from 'dompurify';

function searchResultsHTML(sites) {
    return sites.map(site => {
        return  `
                <div class="result"><a href="/site/${site.slug}">
                <strong>${site.name}</strong>
                </a></div>
                `;
    }).join('');
}

function typeAhead(search) {
    if (!search) return;
    const searchInput = search.querySelector('input[name="search"]');
    const searchResults = search.querySelector('.results');

    searchInput.addEventListener('input', function() {
        if(!this.value) {
            searchResults.style.display = 'none';
            return;
        }
        searchResults.style.display = 'block';


        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if(res.data.length) {
                    searchResults.innerHTML = dompurify.sanitize(searchResultsHTML(res.data));
                } else {
                    searchResults.innerHTML = dompurify.sanitize(`<div class="result">Не найдено результатов для ${this.value}</div>`);
                }
            })
            .catch(err => {
                console.log(err);
            });
    });
    searchInput.addEventListener('keyup', (event) => {
        if (event.keyCode === 13) {
            console.log(searchResults);
            searchResults.firstChild.firstChild.click()
        }

    })
}

export default typeAhead;