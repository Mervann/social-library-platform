import { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Search as SearchIcon, User, Star, X, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Search() {
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [type, setType] = useState('movie'); // 'movie', 'book', 'user'
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showcase, setShowcase] = useState({ topRated: [], popular: [] });

  // Rating Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  // Type değiştiğinde filtreleri sıfırla
  useEffect(() => {
    setYear('');
    setGenre('');
    setResults([]);
  }, [type]);

  useEffect(() => {
    // Fetch showcase data on mount
    const fetchShowcase = async () => {
      try {
        const res = await api.get('/media/showcase');
        setShowcase(res.data);
      } catch (err) {
        console.error('Failed to fetch showcase', err);
      }
    };
    fetchShowcase();
  }, []);

  const performSearch = async () => {
    // Allow empty query for media filtering, but require it for user search
    if (!query && type === 'user') return;
    
    // For books/movies, allow search with just filters
    if (!query && !year && !genre && type !== 'user') return;

    setLoading(true);
    try {
      console.log(`Searching for "${query}" type: ${type}, year: ${year}, genre: ${genre}`);
      let res;
      if (type === 'user') {
        res = await api.get(`/users/search?query=${query}`);
      } else {
        // Send empty query if undefined
        res = await api.get(`/media/search?query=${query || ''}&type=${type}&year=${year}&genre=${genre}`);
      }
      console.log('Search results:', res.data);
      setResults(res.data);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Filtre değişikliklerinde otomatik arama yap
  useEffect(() => {
    if (type !== 'user' && (genre || year)) {
      performSearch();
    } else if (!genre && !year && !query) {
      setResults([]);
    }
  }, [genre, year, type]);

  const handleSearch = (e) => {
    e.preventDefault();
    performSearch();
  };

  const openRatingModal = (item) => {
    setSelectedItem(item);
    setRating(0);
    setHoverRating(0);
    setReviewText('');
    setIsModalOpen(true);
  };

  const submitRating = async () => {
    if (!selectedItem || rating === 0) {
      showToast("Please select a rating score before submitting", 'warning', 'Rating Required');
      return;
    }
    
    try {
      await api.post('/activities', {
        type: reviewText ? 'REVIEW' : 'RATING',
        contentType: type.toUpperCase(),
        contentId: selectedItem.id,
        contentTitle: selectedItem.title,
        contentPoster: selectedItem.poster,
        rating: rating,
        reviewText: reviewText,
        listName: null
      });
      showToast('Rating & Review saved successfully!', 'success', 'Saved');
      setIsModalOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add rating';
      showToast(`Error: ${errorMessage}`, 'error', 'Action Failed');
    }
  };

  const handleAddActivity = async (item, activityType) => {
    if (activityType === 'RATING') {
      openRatingModal(item);
      return;
    }

    try {
      await api.post('/activities', {
        type: activityType, // 'REVIEW', 'ADD_TO_LIST'
        contentType: type.toUpperCase(),
        contentId: item.id,
        contentTitle: item.title,
        contentPoster: item.poster,
        rating: null,
        listName: activityType === 'ADD_TO_LIST' ? 'Favorites' : null
      });
      showToast('Successfully added to your library activity!', 'success', 'Activity Added');
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to add activity';
      showToast(`Error: ${errorMessage}`, 'error', 'Error');
    }
  };

  const renderCard = (item) => (
    <div key={item.id} className="bg-[#181818] rounded-lg border border-gray-800 overflow-hidden hover:border-gray-600 transition-colors group relative">
      <Link to={`/content/${type}/${encodeURIComponent(item.id)}`} className="block relative aspect-[2/3] overflow-hidden">
        <img 
          src={item.poster || 'https://via.placeholder.com/300x450'} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
          <div className="flex flex-col gap-2">
            <button 
              onClick={(e) => { e.preventDefault(); handleAddActivity(item, 'ADD_TO_LIST'); }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm py-2 px-3 rounded font-bold transition-colors"
            >
              + Add to List
            </button>
            <button 
              onClick={(e) => { e.preventDefault(); handleAddActivity(item, 'RATING'); }}
              className="bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded font-bold flex items-center justify-center transition-colors"
            >
              <Star className="w-4 h-4 mr-1 fill-current" /> Rate
            </button>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/content/${type}/${encodeURIComponent(item.id)}`} className="hover:text-red-500 transition-colors">
          <h3 className="font-bold text-lg mb-1 truncate text-white" title={item.title}>{item.title}</h3>
        </Link>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-400">{item.year}</p>
          {item.rating && (
            <div className="flex items-center text-yellow-500 text-sm font-bold">
              <Star className="w-3 h-3 mr-1 fill-current" /> {item.rating}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4 relative max-w-6xl">
      <div className="mb-8 bg-[#181818] p-6 rounded-lg border border-gray-800">
        <form onSubmit={handleSearch} className="flex flex-col gap-4">
          <div className="flex gap-2">
            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="p-3 border border-gray-700 rounded bg-[#0a0a0a] text-white focus:outline-none focus:border-red-600 min-w-[120px]"
            >
              <option value="movie">Movies</option>
              <option value="book">Books</option>
              <option value="user">Users</option>
            </select>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles, people, genres..."
              className="flex-1 p-3 border border-gray-700 rounded bg-[#0a0a0a] text-white placeholder-gray-500 focus:outline-none focus:border-red-600"
            />
            <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded font-bold flex items-center transition-colors">
              <SearchIcon className="w-5 h-5 mr-2" /> Search
            </button>
          </div>
          
          {/* Advanced Filters */}
          {type !== 'user' && (
            <div className="flex gap-4 items-center text-sm text-gray-400 flex-wrap">
              <Filter className="w-4 h-4" />
              <span>Filters:</span>
              <input 
                type="number" 
                placeholder="Year" 
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-1 text-white w-24 focus:outline-none focus:border-red-600"
              />
              {type === 'movie' ? (
                <select 
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-1 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="">All Genres</option>
                  <option value="action">Action</option>
                  <option value="adventure">Adventure</option>
                  <option value="animation">Animation</option>
                  <option value="comedy">Comedy</option>
                  <option value="crime">Crime</option>
                  <option value="documentary">Documentary</option>
                  <option value="drama">Drama</option>
                  <option value="family">Family</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="history">History</option>
                  <option value="horror">Horror</option>
                  <option value="music">Music</option>
                  <option value="mystery">Mystery</option>
                  <option value="romance">Romance</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="thriller">Thriller</option>
                  <option value="war">War</option>
                  <option value="western">Western</option>
                </select>
              ) : (
                <select 
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="bg-[#0a0a0a] border border-gray-700 rounded px-3 py-1 text-white focus:outline-none focus:border-red-600"
                >
                  <option value="">All Categories</option>
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="mystery">Mystery</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="science fiction">Science Fiction</option>
                  <option value="horror">Horror</option>
                  <option value="biography">Biography</option>
                  <option value="history">History</option>
                  <option value="self-help">Self-Help</option>
                  <option value="business">Business</option>
                  <option value="children">Children</option>
                  <option value="young adult">Young Adult</option>
                  <option value="poetry">Poetry</option>
                  <option value="comics">Comics & Graphic Novels</option>
                </select>
              )}
              {(year || genre) && (
                <button 
                  type="button"
                  onClick={() => { setYear(''); setGenre(''); }}
                  className="text-red-500 hover:text-red-400 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>
          )}
        </form>
      </div>

      {loading ? (
        <div className="text-center text-white py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p>Searching...</p>
        </div>
      ) : (
        <>
          {/* Search Results */}
          {results.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-white mb-6">Search Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((item) => (
                  type === 'user' ? (
                    <div key={item.id} className="bg-[#181818] rounded-lg border border-gray-800 p-6 flex flex-col items-center hover:border-gray-600 transition-colors">
                      <img src={item.avatar || 'https://via.placeholder.com/150'} alt={item.username} className="w-24 h-24 rounded-full mb-4 border-2 border-gray-700 object-cover" />
                      <h3 className="font-bold text-lg mb-4 text-white">{item.username}</h3>
                      <Link to={`/profile/${item.id}`} className="bg-red-600 text-white px-6 py-2 rounded font-bold hover:bg-red-700 transition-colors w-full text-center">
                        View Profile
                      </Link>
                    </div>
                  ) : renderCard(item)
                ))}
              </div>
            </div>
          )}

          {/* Showcase Modules (Only show if no search results yet) */}
          {results.length === 0 && !query && (
            <div className="space-y-12">
              {/* Top Rated Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-4">Top Rated Movies</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {showcase.topRated.map(item => renderCard(item))}
                </div>
              </section>

              {/* Popular Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white border-l-4 border-red-600 pl-4">Most Popular</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {showcase.popular.map(item => renderCard(item))}
                </div>
              </section>
            </div>
          )}
        </>
      )}

      {/* Rating Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] border border-gray-700 p-8 rounded-lg shadow-2xl w-full max-w-lg relative text-white">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h3 className="text-2xl font-bold mb-6 text-center">Rate "{selectedItem.title}"</h3>
            
            <div className="flex flex-col items-center gap-4 mb-8">
              <div className="flex justify-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
                  const currentVal = hoverRating || rating;
                  let fillPercent = 0;
                  if (currentVal >= star) fillPercent = 100;
                  else if (currentVal >= star - 0.5) fillPercent = 50;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(hoverRating)}
                      onMouseMove={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const isHalf = (e.clientX - rect.left) < (rect.width / 2);
                        setHoverRating(isHalf ? star - 0.5 : star);
                      }}
                      onMouseLeave={() => setHoverRating(0)}
                      className="relative focus:outline-none transition-transform hover:scale-110 p-1"
                    >
                      {/* Background Star (Dark Gray) */}
                      <Star className="w-8 h-8 text-gray-600" />
                      
                      {/* Foreground Star (Red/Gold) */}
                      <div 
                        className="absolute top-1 left-1 overflow-hidden pointer-events-none" 
                        style={{ width: `${fillPercent}%` }}
                      >
                        <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className="text-center font-bold text-3xl text-yellow-500 mt-2">
                {hoverRating || rating || 0} <span className="text-lg text-gray-500">/ 10</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold mb-2 text-gray-400">Review (Optional)</label>
              <textarea
                className="w-full p-4 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors placeholder-gray-600"
                rows="4"
                placeholder="Write your thoughts about this title..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>
            </div>

            <button
              onClick={submitRating}
              disabled={rating === 0}
              className={`w-full py-3 rounded font-bold text-white transition-colors text-lg ${
                rating === 0 
                  ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              Submit Rating & Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
