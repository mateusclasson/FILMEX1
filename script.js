// ======================================================
// FILMEX
// TMDB API
// ======================================================


// ======================================================
// TOKEN DO TMDB
// ======================================================

const ACCESS_TOKEN =
"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMjJiNzFkMDQ1ODlmNDkxMWNlMGU2ZjVjNGZiM2FlMSIsIm5iZiI6MTc5MDcxOTY1NS4wMDcsInN1YiI6IjZhYmMzNmE2MzNhZGY5YzIzNmUwYTVkOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ptMfRPaTxOHqcir_ng1FHngHjVvOFlPabwyeJHgmwCw";


// ======================================================
// CONFIGURAÇÕES
// ======================================================

const API_URL =
    "https://api.themoviedb.org/3";

const IMAGE_URL =
    "https://image.tmdb.org/t/p/w500";

const BACKDROP_URL =
    "https://image.tmdb.org/t/p/original";


const requestOptions = {

    method: "GET",

    headers: {

        accept: "application/json",

        Authorization:
            `Bearer ${ACCESS_TOKEN}`

    }

};


// ======================================================
// ELEMENTOS HTML
// ======================================================

const featuredMovies =
    document.getElementById("featuredMovies");

const popularMovies =
    document.getElementById("popularMovies");

const popularPagination =
    document.getElementById("popularPagination");

const carouselInner =
    document.getElementById("carouselInner");

const carouselIndicators =
    document.getElementById("carouselIndicators");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");

const searchResultsSection =
    document.getElementById("searchResultsSection");

const searchResults =
    document.getElementById("searchResults");

const searchTitle =
    document.getElementById("searchTitle");

const searchPagination =
    document.getElementById("searchPagination");

const categorySection =
    document.getElementById("categorySection");

const categoryTitle =
    document.getElementById("categoryTitle");

const categoryMovies =
    document.getElementById("categoryMovies");

const categoryPagination =
    document.getElementById("categoryPagination");

const movieModal =
    document.getElementById("movieModal");

const movieDetails =
    document.getElementById("movieDetails");

const closeModal =
    document.getElementById("closeModal");


// ======================================================
// ELEMENTOS DO TRAILER
// ======================================================

const trailerModal =
    document.getElementById("trailerModal");

const trailerPlayer =
    document.getElementById("trailerPlayer");

const closeTrailer =
    document.getElementById("closeTrailer");


// ======================================================
// VARIÁVEIS
// ======================================================

let currentSearch = "";

let currentCategoryId = null;

let currentCategoryName = "";


// ======================================================
// FUNÇÃO PRINCIPAL DA API
// ======================================================

async function fetchTMDB(endpoint) {

    try {

        const response =
            await fetch(
                API_URL + endpoint,
                requestOptions
            );


        if (!response.ok) {

            console.error(
                "Erro TMDB:",
                response.status,
                response.statusText
            );

            throw new Error(
                `Erro HTTP ${response.status}`
            );

        }


        return await response.json();

    } catch (error) {

        console.error(
            "Erro ao acessar TMDB:",
            error
        );

        return null;

    }

}


// ======================================================
// ESCAPAR HTML
// ======================================================

function escapeHTML(text) {

    if (!text) {
        return "";
    }

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


// ======================================================
// IMAGEM DO POSTER
// ======================================================

function getPoster(movie) {

    if (movie.poster_path) {

        return IMAGE_URL +
            movie.poster_path;

    }

    return "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='750'%3E%3Crect width='100%25' height='100%25' fill='%2315151b'/%3E%3Ctext x='50%25' y='50%25' fill='%23e5ff00' font-family='Arial' font-size='48' text-anchor='middle'%3EFILMEX%3C/text%3E%3C/svg%3E";

}


// ======================================================
// CARREGAR FILMES POPULARES
// ======================================================

async function loadPopularMovies(page = 1) {

    popularMovies.innerHTML =
        `<p class="loading">
            Carregando filmes...
        </p>`;


    const data =
        await fetchTMDB(
            `/movie/popular?language=pt-BR&page=${page}`
        );


    if (!data) {

        popularMovies.innerHTML =
            `<p class="error-message">
                Não foi possível carregar os filmes.
            </p>`;

        return;

    }


    displayMovies(
        data.results,
        popularMovies
    );


    createPagination(
        data.page,
        data.total_pages,
        popularPagination,
        loadPopularMovies
    );

}


// ======================================================
// CARREGAR DESTAQUES
// ======================================================

async function loadFeaturedMovies() {

    featuredMovies.innerHTML =
        `<p class="loading">
            Carregando...
        </p>`;


    const data =
        await fetchTMDB(
            "/movie/now_playing?language=pt-BR&page=1"
        );


    if (!data) {

        featuredMovies.innerHTML =
            `<p class="error-message">
                Não foi possível carregar os destaques.
            </p>`;

        return;

    }


    displayMovies(
        data.results.slice(0, 10),
        featuredMovies
    );

}


// ======================================================
// CARREGAR CAROUSEL
// ======================================================

async function loadCarousel() {

    const data =
        await fetchTMDB(
            "/movie/popular?language=pt-BR&page=1"
        );


    if (!data) {

        carouselInner.innerHTML =
            `
            <div class="carousel-item active">

                <div class="carousel-caption">

                    <h2>
                        FILMEX
                    </h2>

                    <p>
                        Não foi possível carregar os filmes.
                    </p>

                </div>

            </div>
            `;

        return;

    }


    const movies =
        data.results.slice(0, 5);


    carouselInner.innerHTML = "";

    carouselIndicators.innerHTML = "";


    movies.forEach(
        (movie, index) => {

            const active =
                index === 0
                    ? "active"
                    : "";


            const backdrop =
                movie.backdrop_path
                    ? BACKDROP_URL +
                      movie.backdrop_path
                    : getPoster(movie);


            carouselIndicators.innerHTML +=
                `
                <button
                    type="button"
                    data-bs-target="#filmexCarousel"
                    data-bs-slide-to="${index}"
                    class="${active}"
                    aria-label="Slide ${index + 1}">
                </button>
                `;


            carouselInner.innerHTML +=
                `
                <div
                    class="carousel-item ${active}">

                    <img
                        src="${backdrop}"
                        alt="${escapeHTML(movie.title)}"
                    >

                    <div class="carousel-caption">

                        <h2>
                            ${escapeHTML(movie.title)}
                        </h2>

                        <p>
                            ${
                                escapeHTML(
                                    movie.overview ||
                                    "Descrição não disponível."
                                )
                            }
                        </p>

                        <button
                            type="button"
                            class="trailer-button"
                            onclick="openTrailer(${movie.id})">

                            ▶ Assistir Trailer

                        </button>

                    </div>

                </div>
                `;

        }
    );

}


// ======================================================
// MOSTRAR FILMES NOS CARDS
// ======================================================

function displayMovies(
    movies,
    container
) {

    container.innerHTML = "";


    if (
        !movies ||
        movies.length === 0
    ) {

        container.innerHTML =
            `
            <p>
                Nenhum filme encontrado.
            </p>
            `;

        return;

    }


    movies.forEach(
        movie => {

            const card =
                document.createElement("div");


            card.className =
                "movie-card";


            const poster =
                getPoster(movie);


            card.innerHTML =
                `
                <img
                    src="${poster}"
                    alt="${escapeHTML(movie.title)}"
                >

                <div class="movie-card-info">

                    <div class="movie-card-title">

                        ${escapeHTML(movie.title)}

                    </div>

                    <div class="movie-card-date">

                        ${
                            movie.release_date
                                ? movie.release_date.substring(0, 4)
                                : "Ano desconhecido"
                        }

                    </div>

                </div>
                `;


            card.addEventListener(
                "click",
                function () {

                    getMovieDetails(
                        movie.id
                    );

                }
            );


            container.appendChild(card);

        }
    );

}


// ======================================================
// DETALHES DO FILME
// ======================================================

async function getMovieDetails(movieId) {

    movieModal.classList.add("active");

    document.body.style.overflow =
        "hidden";


    movieDetails.innerHTML =
        `
        <div class="movie-details-content">

            <p class="loading">
                Carregando informações...
            </p>

        </div>
        `;


    const movie =
        await fetchTMDB(
            `/movie/${movieId}?language=pt-BR`
        );


    if (!movie) {

        movieDetails.innerHTML =
            `
            <p class="error-message">
                Não foi possível carregar as informações.
            </p>
            `;

        return;

    }


    movieDetails.innerHTML =
        `
        <div class="details">

            <img
                src="${getPoster(movie)}"
                alt="${escapeHTML(movie.title)}"
            >

            <div class="details-info">

                <h2>
                    ${escapeHTML(movie.title)}
                </h2>

                <p>
                    <strong>
                        Data:
                    </strong>

                    ${
                        movie.release_date ||
                        "Não informado"
                    }
                </p>

                <p>
                    <strong>
                        Nota:
                    </strong>

                    ${
                        movie.vote_average
                            ? movie.vote_average.toFixed(1)
                            : "N/A"
                    }
                </p>

                <p>
                    ${
                        escapeHTML(
                            movie.overview ||
                            "Descrição não disponível."
                        )
                    }
                </p>

                <button
                    type="button"
                    class="trailer-button"
                    onclick="openTrailer(${movie.id})">

                    ▶ Assistir Trailer

                </button>

            </div>

        </div>
        `;

}


// ======================================================
// BUSCAR TRAILER NO TMDB
// ======================================================

async function getTrailerKey(movieId) {

    // Primeiro português

    let data =
        await fetchTMDB(
            `/movie/${movieId}/videos?language=pt-BR`
        );


    let videos =
        data && data.results
            ? data.results
            : [];


    // Se não encontrar, inglês

    if (videos.length === 0) {

        data =
            await fetchTMDB(
                `/movie/${movieId}/videos?language=en-US`
            );


        videos =
            data && data.results
                ? data.results
                : [];

    }


    // Somente YouTube

    const youtubeVideos =
        videos.filter(
            video =>
                video.site === "YouTube" &&
                video.key
        );


    if (
        youtubeVideos.length === 0
    ) {

        return null;

    }


    // Trailer oficial

    let trailer =
        youtubeVideos.find(
            video =>
                video.type === "Trailer" &&
                video.official === true
        );


    // Qualquer trailer

    if (!trailer) {

        trailer =
            youtubeVideos.find(
                video =>
                    video.type === "Trailer"
            );

    }


    // Teaser como último recurso

    if (!trailer) {

        trailer =
            youtubeVideos.find(
                video =>
                    video.type === "Teaser"
            );

    }


    if (!trailer) {

        return null;

    }


    return trailer.key;

}


// ======================================================
// ABRIR TRAILER DENTRO DO FILMEX
// ======================================================

async function openTrailer(movieId) {

    try {

        // Abre o modal do trailer

        trailerModal.classList.add("active");

        document.body.style.overflow =
            "hidden";


        // Mostra carregamento

        trailerPlayer.src = "";


        const trailerVideo =
            document.querySelector(
                ".trailer-video"
            );


        trailerVideo.innerHTML =
            `
            <div
                class="loading"
                style="text-align:center;">
                
                Procurando trailer...

            </div>
            `;


        const trailerKey =
            await getTrailerKey(movieId);


        // ==================================================
        // TRAILER ENCONTRADO
        // ==================================================

        if (trailerKey) {

            trailerVideo.innerHTML =
                `
                <iframe
                    id="trailerPlayer"
                    src="https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0"
                    title="Trailer do filme"
                    frameborder="0"
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowfullscreen>
                </iframe>
                `;

            return;

        }


        // ==================================================
        // SEM TRAILER
        // ==================================================

        trailerVideo.innerHTML =
            `
            <div
                class="trailer-not-found">

                <h3>
                    Trailer não encontrado
                </h3>

                <p>
                    O TMDB não possui um trailer disponível
                    para este filme.
                </p>

                <button
                    type="button"
                    class="trailer-button"
                    onclick="closeTrailerModal()">

                    Fechar

                </button>

            </div>
            `;

    } catch (error) {

        console.error(
            "Erro ao abrir trailer:",
            error
        );


        const trailerVideo =
            document.querySelector(
                ".trailer-video"
            );


        trailerVideo.innerHTML =
            `
            <div class="trailer-not-found">

                <h3>
                    Erro ao carregar trailer
                </h3>

                <p>
                    Não foi possível carregar o trailer.
                </p>

            </div>
            `;

    }

}


// ======================================================
// FECHAR TRAILER
// ======================================================

function closeTrailerModal() {

    trailerModal.classList.remove(
        "active"
    );


    // IMPORTANTE:
    // limpar o iframe para parar o vídeo

    const trailerVideo =
        document.querySelector(
            ".trailer-video"
        );


    trailerVideo.innerHTML =
        `
        <iframe
            id="trailerPlayer"
            src=""
            title="Trailer"
            frameborder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen>
        </iframe>
        `;


    document.body.style.overflow =
        "";

}


// ======================================================
// BOTÃO FECHAR TRAILER
// ======================================================

closeTrailer.addEventListener(
    "click",
    function () {

        closeTrailerModal();

    }
);


// ======================================================
// CLICAR FORA DO TRAILER
// ======================================================

trailerModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            trailerModal
        ) {

            closeTrailerModal();

        }

    }
);


// ======================================================
// TECLA ESC
// ======================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            if (
                trailerModal.classList.contains(
                    "active"
                )
            ) {

                closeTrailerModal();

            } else {

                closeMovieModal();

            }

        }

    }
);


// ======================================================
// FECHAR MODAL DO FILME
// ======================================================

function closeMovieModal() {

    movieModal.classList.remove(
        "active"
    );

    document.body.style.overflow =
        "";

}


// ======================================================
// BOTÃO FECHAR MODAL DO FILME
// ======================================================

closeModal.addEventListener(
    "click",
    function () {

        closeMovieModal();

    }
);


// ======================================================
// CLICAR FORA DO MODAL DO FILME
// ======================================================

movieModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            movieModal
        ) {

            closeMovieModal();

        }

    }
);


// ======================================================
// PESQUISAR FILMES
// ======================================================

async function searchMovies(
    page = 1
) {

    const query =
        searchInput.value.trim();


    if (!query) {

        alert(
            "Digite o nome de um filme."
        );

        return;

    }


    currentSearch =
        query;


    categorySection.style.display =
        "none";


    searchResultsSection.style.display =
        "block";


    searchTitle.textContent =
        `Resultados para: "${query}"`;


    searchResults.innerHTML =
        `
        <p class="loading">
            Pesquisando...
        </p>
        `;


    const data =
        await fetchTMDB(
            `/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`
        );


    if (!data) {

        searchResults.innerHTML =
            `
            <p class="error-message">
                Erro ao realizar a pesquisa.
            </p>
            `;

        return;

    }


    displayMovies(
        data.results,
        searchResults
    );


    createPagination(
        data.page,
        data.total_pages,
        searchPagination,
        searchMovies
    );


    searchResultsSection.scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================================
// BOTÃO PESQUISAR
// ======================================================

searchButton.addEventListener(
    "click",
    function () {

        searchMovies(1);

    }
);


// ======================================================
// ENTER NA PESQUISA
// ======================================================

searchInput.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Enter"
        ) {

            searchMovies(1);

        }

    }
);


// ======================================================
// CARREGAR CATEGORIA
// ======================================================

async function loadCategory(
    categoryId,
    categoryName,
    page = 1
) {

    currentCategoryId =
        categoryId;

    currentCategoryName =
        categoryName;


    categorySection.style.display =
        "block";


    searchResultsSection.style.display =
        "none";


    categoryTitle.textContent =
        categoryName;


    categoryMovies.innerHTML =
        `
        <p class="loading">
            Carregando filmes de ${escapeHTML(categoryName)}...
        </p>
        `;


    const data =
        await fetchTMDB(
            `/discover/movie?with_genres=${categoryId}&language=pt-BR&page=${page}&sort_by=popularity.desc`
        );


    if (!data) {

        categoryMovies.innerHTML =
            `
            <p class="error-message">
                Não foi possível carregar esta categoria.
            </p>
            `;

        return;

    }


    displayMovies(
        data.results,
        categoryMovies
    );


    createPagination(
        data.page,
        data.total_pages,
        categoryPagination,
        function(newPage) {

            loadCategory(
                categoryId,
                categoryName,
                newPage
            );

        }
    );


    categorySection.scrollIntoView({
        behavior: "smooth"
    });

}


// ======================================================
// PAGINAÇÃO
// ======================================================

function createPagination(
    currentPage,
    totalPages,
    container,
    callback
) {

    container.innerHTML = "";


    if (
        !totalPages ||
        totalPages <= 1
    ) {

        return;

    }


    const maxPages =
        Math.min(
            totalPages,
            10
        );


    for (
        let page = 1;
        page <= maxPages;
        page++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.textContent =
            page;


        if (
            page === currentPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                callback(page);

            }
        );


        container.appendChild(
            button
        );

    }

}


// ======================================================
// INICIALIZAÇÃO
// ======================================================

async function init() {

    console.log(
        "FILMEX iniciando..."
    );


    if (
        !ACCESS_TOKEN ||
        ACCESS_TOKEN === "COLE_SEU_NOVO_TOKEN_AQUI"
    ) {

        console.error(
            "Token do TMDB não configurado."
        );

        return;

    }


    await loadCarousel();

    await loadFeaturedMovies();

    await loadPopularMovies(1);


    console.log(
        "FILMEX carregado com sucesso!"
    );

}


// ======================================================
// INICIAR
// ======================================================

init();