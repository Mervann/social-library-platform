import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Star, ArrowLeft, Calendar, Film, Book, Plus, Check, Clock, List } from 'lucide-react';

export default function ContentDetail() {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [userStatus, setUserStatus] = useState({ isRated: false, userRating: 0, listStatus: null });

  const fetchDetails = async () => {
    try {
      const decodedId = decodeURIComponent(id);
      const res = await api.get(`/media/details/${type}/${encodeURIComponent(decodedId)}`);
      setContent(res.data);
      if (res.data.userStatus) {
        setUserStatus(res.data.userStatus);
        if (res.data.userStatus.isRated) {
          setRating(res.data.userStatus.userRating);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [type, id]);

  const handleListAction = async (listName) => {
    try {
      await api.post('/activities', {
        type: 'ADD_TO_LIST',
        contentType: type.toUpperCase(),
        contentId: content.id,
        contentTitle: content.title,
        contentPoster: content.poster,
        rating: null,
        listName: listName
      });
      showToast(`Successfully added to ${listName}!`, 'success', 'List Updated');
      fetchDetails(); // Refresh status
    } catch (err) {
      console.error(err);
      showToast('Failed to update list. Please try again.', 'error', 'Error');
    }
  };

  const submitRating = async () => {
    if (rating === 0) {
      showToast("Please select a rating before submitting", 'warning', 'Rating Required');
      return;
    }
    
    try {
      await api.post('/activities', {
        type: reviewText ? 'REVIEW' : 'RATING',
        contentType: type.toUpperCase(),
        contentId: content.id,
        contentTitle: content.title,
        contentPoster: content.poster,
        rating: rating,
        reviewText: reviewText,
        listName: null
      });
      showToast('Rating & Review saved successfully!', 'success', 'Saved');
      fetchDetails(); // Refresh to show new review in list
      setReviewText(''); // Clear text box
    } catch (err) {
      console.error(err);
      showToast('Failed to save rating. Please try again.', 'error', 'Submission Failed');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );

  if (!content) return <div className="text-white text-center mt-20">Content not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Poster Section */}
        <div className="md:col-span-1">
          <div className="rounded-lg overflow-hidden shadow-2xl border border-gray-800 mb-6">
            <img 
              src={content.poster || 'https://via.placeholder.com/300x450'} 
              alt={content.title} 
              className="w-full h-auto object-cover"
            />
          </div>
          
          {/* Platform Stats */}
          <div className="bg-[#181818] p-4 rounded-lg border border-gray-800 mb-4">
            <h3 className="text-gray-400 text-sm font-bold uppercase mb-3">Platform Rating</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500 fill-yellow-500 mr-2" />
                <span className="text-3xl font-bold text-white">{content.platformRating || 'N/A'}</span>
                <span className="text-gray-500 text-sm ml-2">/ 10</span>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{content.totalVotes || 0}</div>
                <div className="text-xs text-gray-500">Votes</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-[#181818] p-4 rounded-lg border border-gray-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 flex items-center"><Calendar className="w-4 h-4 mr-2"/> Year</span>
              <span className="text-white font-bold">{content.year}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 flex items-center">
                {type === 'movie' ? <Film className="w-4 h-4 mr-2"/> : <Book className="w-4 h-4 mr-2"/>} Type
              </span>
              <span className="text-white font-bold uppercase">{type}</span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{content.title}</h1>
              <p className="text-xl text-gray-400">{content.year} • {type === 'movie' ? 'Movie' : 'Book'}</p>
            </div>
            
            {/* Library Actions */}
            <div className="flex gap-2">
              <button 
                onClick={() => handleListAction(type === 'movie' ? 'WATCHED' : 'READ')}
                className={`flex items-center px-4 py-2 rounded font-bold transition-colors ${userStatus.listStatus === (type === 'movie' ? 'WATCHED' : 'READ') ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <Check className="w-4 h-4 mr-2" />
                {type === 'movie' ? 'Watched' : 'Read'}
              </button>
              <button 
                onClick={() => handleListAction(type === 'movie' ? 'TO_WATCH' : 'TO_READ')}
                className={`flex items-center px-4 py-2 rounded font-bold transition-colors ${userStatus.listStatus === (type === 'movie' ? 'TO_WATCH' : 'TO_READ') ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <Clock className="w-4 h-4 mr-2" />
                {type === 'movie' ? 'Watchlist' : 'To Read'}
              </button>
              <button className="flex items-center px-4 py-2 rounded font-bold bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
                <List className="w-4 h-4 mr-2" />
                Add to List
              </button>
            </div>
          </div>

          <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-gray-700 pb-2">Overview</h3>
            <p className="text-gray-300 leading-relaxed text-lg mb-6">
              {content.description || "No description available."}
            </p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              {type === 'movie' ? (
                <>
                  <div>
                    <span className="block text-gray-500 mb-1">Director</span>
                    <span className="text-white font-medium text-lg">{content.director || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Cast</span>
                    <span className="text-white font-medium text-lg">
                      {Array.isArray(content.cast) ? content.cast.join(', ') : (content.cast || 'Unknown')}
                    </span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-gray-500 mb-1">Genres</span>
                    <div className="flex flex-wrap gap-2">
                      {content.genres && content.genres.map((g, i) => (
                        <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="block text-gray-500 mb-1">Author</span>
                    <span className="text-white font-medium text-lg">{content.author || 'Unknown'}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 mb-1">Page Count</span>
                    <span className="text-white font-medium text-lg">{content.pageCount || 'N/A'}</span>
                  </div>
                  <div className="md:col-span-2">
                    <span className="block text-gray-500 mb-1">Categories</span>
                    <div className="flex flex-wrap gap-2">
                      {content.genres && content.genres.map((g, i) => (
                        <span key={i} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-xs border border-gray-700">
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Rating & Review Input */}
          <div className="bg-[#181818] p-6 rounded-lg border border-gray-800 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
              {userStatus.isRated ? 'Update Your Rating' : 'Rate & Review'}
            </h3>
            
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
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
                      <Star className="w-6 h-6 text-gray-600" />
                      <div 
                        className="absolute top-1 left-1 overflow-hidden pointer-events-none" 
                        style={{ width: `${fillPercent}%` }}
                      >
                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                      </div>
                    </button>
                  );
                })}
                <span className="ml-4 text-2xl font-bold text-yellow-500">{hoverRating || rating || 0}</span>
              </div>

              <textarea
                className="w-full p-4 bg-[#0a0a0a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-colors placeholder-gray-600"
                rows="3"
                placeholder="Write your thoughts about this title..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              ></textarea>

              <button
                onClick={submitRating}
                disabled={rating === 0}
                className={`py-3 px-6 rounded font-bold text-white transition-colors self-end ${
                  rating === 0 
                    ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {userStatus.isRated ? 'Update Review' : 'Submit Review'}
              </button>
            </div>
          </div>

          {/* User Reviews List */}
          <div className="bg-[#181818] p-6 rounded-lg border border-gray-800">
            <h3 className="text-xl font-bold text-white mb-6 border-b border-gray-700 pb-2">
              User Reviews ({content.reviews ? content.reviews.length : 0})
            </h3>
            
            <div className="space-y-6">
              {content.reviews && content.reviews.length > 0 ? (
                content.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-800 pb-6 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <img 
                          src={review.User.avatar || 'https://via.placeholder.com/40'} 
                          alt={review.User.username} 
                          className="w-10 h-10 rounded-full mr-3 border border-gray-700"
                        />
                        <div>
                          <p className="font-bold text-white">{review.User.username}</p>
                          <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center bg-gray-900 px-2 py-1 rounded border border-gray-800">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                        <span className="font-bold text-white">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

