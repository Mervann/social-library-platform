const { Activity, User } = require('../models');
const axios = require('axios');

// Mock Data for Showcase - Using IMDB poster URLs (SX300 format - reliable)
const MOCK_MOVIES = [
  { 
    id: '1', 
    title: 'Inception', 
    year: '2010', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg', 
    rating: 8.8, 
    genre: 'Sci-Fi',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.'
  },
  { 
    id: '2', 
    title: 'The Matrix', 
    year: '1999', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 8.7, 
    genre: 'Sci-Fi',
    director: 'Lana Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    description: 'When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.'
  },
  { 
    id: '3', 
    title: 'Interstellar', 
    year: '2014', 
    poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg', 
    rating: 8.6, 
    genre: 'Sci-Fi',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.'
  },
  { 
    id: '4', 
    title: 'The Dark Knight', 
    year: '2008', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg', 
    rating: 9.0, 
    genre: 'Action',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.'
  },
  { 
    id: '5', 
    title: 'Avengers: Endgame', 
    year: '2019', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg', 
    rating: 8.4, 
    genre: 'Action',
    director: 'Anthony Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo'],
    description: 'After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.'
  },
  { 
    id: '6', 
    title: 'Avatar', 
    year: '2009', 
    poster: 'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg', 
    rating: 7.8, 
    genre: 'Sci-Fi',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.'
  },
  { 
    id: '7', 
    title: 'Pulp Fiction', 
    year: '1994', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 8.9, 
    genre: 'Crime',
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    description: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.'
  },
  { 
    id: '8', 
    title: 'Fight Club', 
    year: '1999', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 8.8, 
    genre: 'Drama',
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Edward Norton', 'Meat Loaf'],
    description: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into much more.'
  },
  { 
    id: '9', 
    title: 'Forrest Gump', 
    year: '1994', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg', 
    rating: 8.8, 
    genre: 'Drama',
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    description: 'The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate and other historical events unfold from the perspective of an Alabama man with an IQ of 75, whose only desire is to be reunited with his childhood sweetheart.'
  },
  { 
    id: '10', 
    title: 'The Godfather', 
    year: '1972', 
    poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 9.2, 
    genre: 'Crime',
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    description: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.'
  },
  { 
    id: '11', 
    title: 'Star Wars', 
    year: '1977', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 8.6, 
    genre: 'Sci-Fi',
    director: 'George Lucas',
    cast: ['Mark Hamill', 'Harrison Ford', 'Carrie Fisher'],
    description: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.'
  },
  { 
    id: '12', 
    title: 'LOTR: Return of the King', 
    year: '2003', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 9.0, 
    genre: 'Fantasy',
    director: 'Peter Jackson',
    cast: ['Elijah Wood', 'Viggo Mortensen', 'Ian McKellen'],
    description: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.'
  },
  { 
    id: '13', 
    title: 'Shawshank Redemption', 
    year: '1994', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg', 
    rating: 9.3, 
    genre: 'Drama',
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman', 'Bob Gunton'],
    description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.'
  },
  { 
    id: '14', 
    title: 'Joker', 
    year: '2019', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_SX300.jpg', 
    rating: 8.4, 
    genre: 'Crime',
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Robert De Niro', 'Zazie Beetz'],
    description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime. This path brings him face-to-face with his alter-ego: the Joker.'
  },
  { 
    id: '15', 
    title: 'Spider-Verse', 
    year: '2018', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMjMwNDkxMTgzOF5BMl5BanBnXkFtZTgwNTkwNTQ3NjM@._V1_SX300.jpg', 
    rating: 8.4, 
    genre: 'Animation',
    director: 'Bob Persichetti',
    cast: ['Shameik Moore', 'Jake Johnson', 'Hailee Steinfeld'],
    description: 'Teen Miles Morales becomes the Spider-Man of his universe, and must join with five spider-powered individuals from other dimensions to stop a threat for all realities.'
  },
  { 
    id: '16', 
    title: 'Scarface', 
    year: '1983', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNjdjNGQ4NDEtNTEwYS00MTgxLTliYzQtYzE2ZDRiZjFhZmNlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 8.3, 
    genre: 'Crime',
    director: 'Brian De Palma',
    cast: ['Al Pacino', 'Michelle Pfeiffer', 'Steven Bauer'],
    description: 'In 1980 Miami, a determined Cuban immigrant takes over a drug cartel and succumbs to greed.'
  },
  { 
    id: '17', 
    title: 'Goodfellas', 
    year: '1990', 
    poster: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg', 
    rating: 8.7, 
    genre: 'Crime',
    director: 'Martin Scorsese',
    cast: ['Robert De Niro', 'Ray Liotta', 'Joe Pesci'],
    description: 'The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen Hill and his mob partners Jimmy Conway and Tommy DeVito.'
  },
  { 
    id: '18', 
    title: 'Silence of the Lambs', 
    year: '1991', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNjNhZTk0ZmEtNjJhMi00YzFlLWE1MmEtYzM1M2ZmMGMwMTU4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 8.6, 
    genre: 'Horror',
    director: 'Jonathan Demme',
    cast: ['Jodie Foster', 'Anthony Hopkins', 'Scott Glenn'],
    description: 'A young F.B.I. cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer.'
  },
  { 
    id: '19', 
    title: 'Gladiator', 
    year: '2000', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMDliMmNhNDEtODUyOS00MjNlLTgxODEtN2U3NzIxMGVkZTA1L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 8.5, 
    genre: 'Action',
    director: 'Ridley Scott',
    cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
    description: 'A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.'
  },
  { 
    id: '20', 
    title: 'Titanic', 
    year: '1997', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg', 
    rating: 7.9, 
    genre: 'Drama',
    director: 'James Cameron',
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.'
  },
  { 
    id: '21', 
    title: 'Schindler\'s List', 
    year: '1993', 
    poster: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 9.0, 
    genre: 'Drama',
    director: 'Steven Spielberg',
    cast: ['Liam Neeson', 'Ralph Fiennes', 'Ben Kingsley'],
    description: 'In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.'
  },
  { 
    id: '22', 
    title: 'The Lion King', 
    year: '1994', 
    poster: 'https://m.media-amazon.com/images/M/MV5BYTYxNGMyZTYtMjE3MS00MzNjLWFjNmYtMDk3N2FmM2JiM2M1XkEyXkFqcGdeQXVyNjY5NDU4NzI@._V1_SX300.jpg', 
    rating: 8.5, 
    genre: 'Animation',
    director: 'Roger Allers',
    cast: ['Matthew Broderick', 'Jeremy Irons', 'James Earl Jones'],
    description: 'Lion prince Simba and his father are targeted by his bitter uncle, who wants to ascend the throne himself.'
  },
  { 
    id: '23', 
    title: 'Se7en', 
    year: '1995', 
    poster: 'https://m.media-amazon.com/images/M/MV5BOTUwODM5MTctZjczMi00OTk4LTg3NWUtNmVhMTAzNTNjYjcyXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg', 
    rating: 8.6, 
    genre: 'Crime',
    director: 'David Fincher',
    cast: ['Brad Pitt', 'Morgan Freeman', 'Kevin Spacey'],
    description: 'Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives.'
  },
  { 
    id: '24', 
    title: 'The Departed', 
    year: '2006', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMTI1MTY2OTIxNV5BMl5BanBnXkFtZTYwNjQ4NjY3._V1_SX300.jpg', 
    rating: 8.5, 
    genre: 'Crime',
    director: 'Martin Scorsese',
    cast: ['Leonardo DiCaprio', 'Matt Damon', 'Jack Nicholson'],
    description: 'An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston.'
  },
  { 
    id: '25', 
    title: 'Django Unchained', 
    year: '2012', 
    poster: 'https://m.media-amazon.com/images/M/MV5BMjIyNTQ5NjQ1OV5BMl5BanBnXkFtZTcwODg1MDU4OA@@._V1_SX300.jpg', 
    rating: 8.4, 
    genre: 'Action',
    director: 'Quentin Tarantino',
    cast: ['Jamie Foxx', 'Christoph Waltz', 'Leonardo DiCaprio'],
    description: 'With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in Mississippi.'
  }
];

const TMDB_GENRES = {
  'action': 28,
  'adventure': 12,
  'animation': 16,
  'comedy': 35,
  'crime': 80,
  'documentary': 99,
  'drama': 18,
  'family': 10751,
  'fantasy': 14,
  'history': 36,
  'horror': 27,
  'music': 10402,
  'mystery': 9648,
  'romance': 10749,
  'sci-fi': 878,
  'science fiction': 878,
  'thriller': 53,
  'tv movie': 10770,
  'war': 10752,
  'western': 37
};

exports.searchMedia = async (req, res) => {
  try {
    let { query, type, year, genre } = req.query;
    
    if (query) query = query.trim();
    console.log(`Search Request - Query: "${query || 'ALL'}", Type: ${type}, Year: ${year}, Genre: ${genre}`);

    let results = [];
    const tmdbKey = process.env.TMDB_API_KEY;

    // Helper to check if key is valid
    const isValidKey = (key) => key && key !== 'your_tmdb_key_here' && key !== 'your_google_books_key_here' && !key.startsWith('http');

    try {
      if (type === 'movie') {
        let fetchedFromApi = false;
        if (isValidKey(tmdbKey)) {
          try {
            let apiUrl;
            let params = { api_key: tmdbKey, language: 'en-US' };

            // If query exists, use search endpoint
            if (query) {
              apiUrl = 'https://api.themoviedb.org/3/search/movie';
              params.query = query;
              if (year) params.year = year;
            } else {
              // If no query, use discover endpoint for browsing/filtering
              apiUrl = 'https://api.themoviedb.org/3/discover/movie';
              params.sort_by = 'popularity.desc';
              if (year) params.primary_release_year = year;
              if (genre && TMDB_GENRES[genre.toLowerCase()]) {
                params.with_genres = TMDB_GENRES[genre.toLowerCase()];
              }
            }

            console.log(`TMDb API Call: ${apiUrl}`, params);
            const response = await axios.get(apiUrl, { params });

            let movies = response.data.results;

            // If using search endpoint, filter by genre client-side
            if (query && genre && TMDB_GENRES[genre.toLowerCase()]) {
              const genreId = TMDB_GENRES[genre.toLowerCase()];
              movies = movies.filter(m => m.genre_ids && m.genre_ids.includes(genreId));
            }

            results = movies.map(movie => ({
              id: movie.id.toString(),
              title: movie.title,
              poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
              year: movie.release_date ? movie.release_date.split('-')[0] : 'Unknown',
              type: 'MOVIE',
              rating: movie.vote_average,
              genre_ids: movie.genre_ids
            }));
            
            console.log(`TMDb returned ${results.length} movies`);
            fetchedFromApi = true;
          } catch (e) {
            console.log('TMDB Search failed:', e.message);
          }
        } 
        
        if (!fetchedFromApi) {
          // MOCK DATA FOR MOVIES
          console.log('Using Mock Data for Movies');
          results = MOCK_MOVIES.map(m => ({...m, type: 'MOVIE'}));
          
          // Filter by Query
          if (query) {
             results = results.filter(m => m.title.toLowerCase().includes(query.toLowerCase()));
          }
          // Filter by Year
          if (year) {
            results = results.filter(m => m.year === year);
          }
          // Filter by Genre
          if (genre) {
            results = results.filter(m => m.genre && m.genre.toLowerCase() === genre.toLowerCase());
          }
          console.log(`Mock Search Results: ${results.length} items found`);
        }
      } else if (type === 'book') {
        // Try Google Books API first (Better data)
        try {
          const googleBooksKey = process.env.GOOGLE_BOOKS_API_KEY;
          
          // Build Google Books query with filters
          let searchQuery = query || '';
          
          // If no query but genre exists, search by subject
          if (!searchQuery && genre) {
            searchQuery = `subject:${genre}`;
          } else if (searchQuery && genre) {
            searchQuery += `+subject:${genre}`;
          }
          
          // If still no query, use a generic term to get popular books
          if (!searchQuery) {
            searchQuery = 'bestseller';
          }
          
          let url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=40&orderBy=relevance`;
          if (googleBooksKey && googleBooksKey !== 'your_google_books_key_here') {
            url += `&key=${googleBooksKey}`;
          }
          
          console.log(`Fetching from Google Books: ${url}`);
          const response = await axios.get(url);
          
          if (response.data.items) {
             let books = response.data.items.map(item => {
               const info = item.volumeInfo;
               return {
                 id: item.id,
                 title: info.title,
                 poster: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
                 year: info.publishedDate ? info.publishedDate.split('-')[0] : 'Unknown',
                 type: 'BOOK',
                 author: info.authors ? info.authors.join(', ') : 'Unknown',
                 categories: info.categories || []
               };
             });

             // Filter by Year
             if (year) {
               books = books.filter(b => b.year === year);
             }

             // Filter by Genre (Category) - more precise filtering
             if (genre) {
                const searchGenre = genre.toLowerCase();
                books = books.filter(b => {
                  if (!b.categories || b.categories.length === 0) return false;
                  return b.categories.some(c => c.toLowerCase().includes(searchGenre));
                });
             }

             results = books.slice(0, 20);
             console.log(`Google Books returned ${results.length} books`);
          }
        } catch (gbError) {
          console.log('Google Books failed, falling back to Open Library', gbError.message);
          
          // Fallback to Open Library
          let searchQuery = query || '*';
          let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&limit=40`;
          if (year) url += `&first_publish_year=${year}`;
          if (genre) url += `&subject=${encodeURIComponent(genre)}`;
          
          const response = await axios.get(url);
          if (response.data && response.data.docs) {
            let books = response.data.docs;
            
            // Additional genre filtering for Open Library
            if (genre) {
              const searchGenre = genre.toLowerCase();
              books = books.filter(b => {
                if (!b.subject) return false;
                return b.subject.some(s => s.toLowerCase().includes(searchGenre));
              });
            }

            results = books.slice(0, 20).map(book => ({
              id: book.key,
              title: book.title,
              poster: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
              year: book.first_publish_year ? book.first_publish_year.toString() : 'Unknown',
              type: 'BOOK',
              author: book.author_name ? book.author_name.join(', ') : 'Unknown'
            }));
            console.log(`Open Library returned ${results.length} books`);
          }
        }
      }
    } catch (apiError) {
      console.error('External API Error:', apiError.message);
      results = [];
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ message: 'Search failed', error: error.message });
  }
};

exports.getShowcase = async (req, res) => {
  try {
    const tmdbKey = process.env.TMDB_API_KEY;
    const isValidKey = (key) => key && key !== 'your_tmdb_key_here';

    if (isValidKey(tmdbKey)) {
      try {
        const [topRatedRes, popularRes] = await Promise.all([
          axios.get(`https://api.themoviedb.org/3/movie/top_rated?api_key=${tmdbKey}&language=en-US&page=1`),
          axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${tmdbKey}&language=en-US&page=1`)
        ]);

        const mapTMDB = (m) => ({
          id: m.id.toString(),
          title: m.title,
          poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
          year: m.release_date ? m.release_date.split('-')[0] : 'Unknown',
          rating: m.vote_average,
          type: 'MOVIE'
        });

        return res.json({
          topRated: topRatedRes.data.results.slice(0, 5).map(mapTMDB),
          popular: popularRes.data.results.slice(0, 5).map(mapTMDB)
        });
      } catch (apiError) {
        console.error('TMDB Showcase Error:', apiError.message);
        // Fallback to mock if API fails
      }
    }

    // Fallback Mock Data
    const topRated = MOCK_MOVIES.filter(m => m.rating >= 8.8).slice(0, 5).map(m => ({...m, type: 'MOVIE'}));
    const popular = MOCK_MOVIES.slice(5, 10).map(m => ({...m, type: 'MOVIE'}));
    
    res.json({
      topRated,
      popular
    });
  } catch (error) {
    res.status(500).json({ message: 'Showcase error', error: error.message });
  }
};

exports.getContentDetails = async (req, res) => {
  try {
    const { type, id } = req.params;
    let details = null;

    if (type === 'movie') {
      // Try TMDB if key exists
      const tmdbKey = process.env.TMDB_API_KEY;
      const isValidKey = (key) => key && key !== 'your_tmdb_key_here';

      if (isValidKey(tmdbKey)) {
          try {
            // Fetch details AND credits (cast/director)
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbKey}&append_to_response=credits`);
            const m = response.data;
            
            // Find Director
            const director = m.credits?.crew?.find(p => p.job === 'Director')?.name || 'Unknown';
            // Get top 3 cast members
            const cast = m.credits?.cast?.slice(0, 5).map(p => p.name) || [];
            // Get Genres
            const genres = m.genres?.map(g => g.name) || [];

            details = {
              id: m.id.toString(),
              title: m.title,
              poster: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : null,
              year: m.release_date ? m.release_date.split('-')[0] : 'Unknown',
              description: m.overview,
              rating: m.vote_average,
              director: director,
              cast: cast,
              genres: genres,
              type: 'MOVIE'
            };
          } catch (e) { console.log('TMDB fetch failed', e.message); }
      }

      // Fallback to Mock if TMDB failed or key missing
      if (!details) {
        const movie = MOCK_MOVIES.find(m => m.id === id);
        if (movie) {
          details = {
            ...movie,
            genres: [movie.genre], // Ensure genres is an array
            type: 'MOVIE'
          };
        }
      }

    } else if (type === 'book') {
       // Check if it's a Google Books ID (no slashes) or Open Library ID (has slashes like /works/...)
       if (!id.includes('/')) {
          // Google Books Fetch
          try {
            const url = `https://www.googleapis.com/books/v1/volumes/${id}`;
            const response = await axios.get(url);
            const info = response.data.volumeInfo;
            
            details = {
              id: response.data.id,
              title: info.title,
              description: info.description ? info.description.replace(/<[^>]*>/g, '') : 'No description available.', // Strip HTML
              poster: info.imageLinks?.thumbnail?.replace('http:', 'https:') || null,
              year: info.publishedDate ? info.publishedDate.split('-')[0] : 'Unknown',
              director: info.authors ? info.authors.join(', ') : 'Unknown', // Map Author to Director field for consistency
              author: info.authors ? info.authors.join(', ') : 'Unknown',
              cast: [], // Books don't have cast
              genres: info.categories || [],
              pageCount: info.pageCount,
              type: 'BOOK'
            };
          } catch (e) { console.log('Google Books detail fetch failed', e.message); }
       } 
       
       // If not found yet, try Open Library
       if (!details) {
         try {
           const workId = id.startsWith('/works/') ? id : `/works/${id}`;
           const response = await axios.get(`https://openlibrary.org${workId}.json`);
           const d = response.data;
           
           // Fetch Author Name (OpenLibrary returns author keys usually)
           let authorName = 'Unknown Author';
           if (d.authors && d.authors.length > 0) {
              try {
                const authorKey = d.authors[0].author.key;
                const authorRes = await axios.get(`https://openlibrary.org${authorKey}.json`);
                authorName = authorRes.data.name;
              } catch (err) { console.log('Author fetch failed'); }
           }

           details = {
             id: d.key,
             title: d.title,
             description: typeof d.description === 'string' ? d.description : d.description?.value || 'No description available.',
             poster: d.covers ? `https://covers.openlibrary.org/b/id/${d.covers[0]}-L.jpg` : null,
             year: d.created ? new Date(d.created.value).getFullYear() : 'Unknown',
             director: authorName, 
             author: authorName,
             cast: [],
             genres: d.subjects || [],
             pageCount: d.number_of_pages || 'N/A',
             type: 'BOOK'
           };
         } catch (e) { console.log('OpenLibrary fetch failed', e.message); }
       }
    }

    if (!details) {
      // Fallback generic detail
      details = {
        id,
        title: 'Content Title',
        description: 'Detailed description not available in mock mode.',
        poster: 'https://via.placeholder.com/300x450',
        year: '2024',
        type: type.toUpperCase()
      };
    }

    // --- FETCH LOCAL PLATFORM DATA ---
    
    // 1. Get Reviews
    const reviews = await Activity.findAll({
      where: {
        contentId: id,
        type: 'REVIEW'
      },
      include: [{ model: User, attributes: ['id', 'username', 'avatar'] }],
      order: [['createdAt', 'DESC']]
    });

    // 2. Calculate Average Rating
    const ratings = await Activity.findAll({
      where: {
        contentId: id,
        rating: { [require('sequelize').Op.ne]: null }
      },
      attributes: ['rating']
    });

    let platformRating = 0;
    let totalVotes = 0;
    if (ratings.length > 0) {
      const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
      platformRating = (sum / ratings.length).toFixed(1);
      totalVotes = ratings.length;
    }

    // 3. Check User Status (if logged in)
    let userStatus = {
      isRated: false,
      userRating: 0,
      listStatus: null // 'WATCHED', 'TO_WATCH', 'READ', 'TO_READ' etc.
    };

    if (req.user) {
      const userActivity = await Activity.findOne({
        where: {
          UserId: req.user.id,
          contentId: id,
          rating: { [require('sequelize').Op.ne]: null }
        }
      });
      if (userActivity) {
        userStatus.isRated = true;
        userStatus.userRating = userActivity.rating;
      }

      // Check for list status (This logic might need refinement based on how we store list adds)
      // For now, let's check if there is an ADD_TO_LIST activity
      const listActivity = await Activity.findOne({
        where: {
          UserId: req.user.id,
          contentId: id,
          type: 'ADD_TO_LIST'
        },
        order: [['createdAt', 'DESC']]
      });
      if (listActivity) {
        userStatus.listStatus = listActivity.listName; // e.g. 'Favorites', 'Watched'
      }
    }

    res.json({
      ...details,
      platformRating,
      totalVotes,
      reviews,
      userStatus
    });

  } catch (error) {
    res.status(500).json({ message: 'Detail error', error: error.message });
  }
};
