import { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Star, Send } from 'lucide-react';

// Film poster listesi - Yüksek kaliteli posterler (UX1000 formatı)
const MOVIE_POSTERS = [
  'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Pulp Fiction
  'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_FMjpg_UX1000_.jpg', // Inception
  'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', // Matrix
  'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_FMjpg_UX1000_.jpg', // Interstellar
  'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_FMjpg_UX1000_.jpg', // Dark Knight
  'https://m.media-amazon.com/images/M/MV5BMmEzNTkxYjQtZTc0MC00YTVjLTg5ZTEtZWMwOWVlYzY0NWIwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Fight Club
  'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_FMjpg_UX1000_.jpg', // Forrest Gump
  'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Godfather
  'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_FMjpg_UX1000_.jpg', // Shawshank
  'https://m.media-amazon.com/images/M/MV5BNzA5ZDNlZWMtM2NhNS00NDJjLTk4NDItYTRmY2EwMWZlMTY3XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // LOTR
  'https://m.media-amazon.com/images/M/MV5BNzVlY2MwMjktM2E4OS00Y2Y3LWE3ZjctYzhkZGM3YzA1ZWM2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Star Wars
  'https://m.media-amazon.com/images/M/MV5BNGVjNWI4ZGUtNzE0MS00YTJmLWE0ZDctN2ZiYTk2YmI3NTYyXkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_FMjpg_UX1000_.jpg', // Joker
  'https://m.media-amazon.com/images/M/MV5BZDA0OGQxNTItMDZkMC00N2UyLTg3MzMtYTJmNjg3Nzk5MzRiXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_FMjpg_UX1000_.jpg', // Avatar
  'https://m.media-amazon.com/images/M/MV5BNjdjNGQ4NDEtNTEwYS00MTgxLTliYzQtYzE2ZDRiZjFhZmNlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_FMjpg_UX1000_.jpg', // Scarface
  'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_FMjpg_UX1000_.jpg', // Goodfellas
];

// Rastgele bir poster seç
const getRandomPoster = () => {
  const randomIndex = Math.floor(Math.random() * MOVIE_POSTERS.length);
  return MOVIE_POSTERS[randomIndex];
};

function timeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Feed() {
  const [activities, setActivities] = useState([]);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [backgroundImage] = useState(getRandomPoster);

  const fetchFeed = async (currentOffset) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await api.get(`/activities/feed?offset=${currentOffset}`);
      if (res.data.length === 0) {
        setHasMore(false);
      } else {
        setActivities(prev => currentOffset === 0 ? res.data : [...prev, ...res.data]);
        if (res.data.length < 15) setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed(0);
  }, []);

  const loadMore = () => {
    const newOffset = offset + 15;
    setOffset(newOffset);
    fetchFeed(newOffset);
  };

  const handleLike = async (activityId) => {
    try {
      const res = await api.post(`/activities/${activityId}/like`);
      setActivities(prev => prev.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            isLiked: res.data.liked,
            likeCount: res.data.liked ? act.likeCount + 1 : act.likeCount - 1
          };
        }
        return act;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCommentBox = (activityId) => {
    if (activeCommentId === activityId) {
      setActiveCommentId(null);
      setCommentText('');
    } else {
      setActiveCommentId(activityId);
      setCommentText('');
    }
  };

  const handleCommentSubmit = async (activityId) => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`/activities/${activityId}/comment`, { text: commentText });
      setActivities(prev => prev.map(act => {
        if (act.id === activityId) {
          return {
            ...act,
            commentCount: act.commentCount + 1,
            Comments: [...(act.Comments || []), res.data]
          };
        }
        return act;
      }));
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {/* Random Movie Background Image - High Quality */}
      <div 
        className="fixed inset-0 w-full h-full"
        style={{ 
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          opacity: 0.5
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/30 z-0"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto p-4 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-white tracking-tight">Feed</h1>
            <p className="text-gray-400 text-sm mt-1">See what your friends are watching</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-600 to-pink-600 flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Activity Cards */}
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div 
              key={activity.id} 
              className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/10 hover:-translate-y-1"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Activity Type Badge */}
              <div className="absolute top-4 right-4 z-20">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm ${
                  activity.type === 'RATING' 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : activity.type === 'REVIEW' 
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}>
                  {activity.type === 'RATING' ? '⭐ Rated' : activity.type === 'REVIEW' ? '📝 Review' : '📚 Listed'}
                </span>
              </div>

              {/* Header */}
              <div className="p-5 flex items-center gap-4">
                <Link to={`/profile/${activity.User.id}`} className="relative group/avatar">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-pink-600 rounded-full opacity-75 group-hover/avatar:opacity-100 blur transition-opacity"></div>
                  <img 
                    src={activity.User.avatar || 'https://via.placeholder.com/40'} 
                    alt="avatar" 
                    className="relative w-12 h-12 rounded-full object-cover ring-2 ring-black" 
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/profile/${activity.User.id}`} className="font-bold text-white hover:text-red-400 transition-colors">
                      {activity.User.username}
                    </Link>
                    <span className="text-gray-400 text-sm">
                      {activity.type === 'RATING' ? 'rated' : activity.type === 'REVIEW' ? 'reviewed' : 'added to list'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    {timeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>

              {/* Content Body */}
              <div className="px-5 pb-5">
                <div className="flex gap-5">
                  {/* Poster */}
                  <div className="flex-shrink-0 relative group/poster">
                    {activity.contentPoster ? (
                      <>
                        <div className="absolute -inset-2 bg-gradient-to-b from-red-600/50 to-transparent rounded-xl opacity-0 group-hover/poster:opacity-100 blur-xl transition-opacity"></div>
                        <img 
                          src={activity.contentPoster} 
                          alt="poster" 
                          className="relative w-28 h-40 object-cover rounded-xl shadow-2xl ring-1 ring-white/10 transition-transform group-hover/poster:scale-105" 
                        />
                      </>
                    ) : (
                      <div className="w-28 h-40 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                        <span className="text-4xl">{activity.contentType === 'MOVIE' ? '🎬' : '📖'}</span>
                      </div>
                    )}
                    
                    {/* Rating Badge on Poster */}
                    {activity.type === 'RATING' && activity.rating && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg px-2 py-1 flex items-center gap-1 shadow-lg">
                        <Star className="w-3 h-3 text-white fill-white" />
                        <span className="text-white font-black text-sm">{activity.rating}</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-2 leading-tight">{activity.contentTitle}</h3>
                    <span className="inline-block px-2 py-0.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-md mb-3">
                      {activity.contentType}
                    </span>
                    
                    {/* Review Text */}
                    {activity.type === 'REVIEW' && activity.reviewText && (
                      <div className="mt-2">
                        <div className="flex items-center gap-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 transition-colors ${i < Math.round(activity.rating / 2) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-700'}`} 
                            />
                          ))}
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed italic">
                          "{activity.reviewText.length > 120 ? activity.reviewText.substring(0, 120) + '...' : activity.reviewText}"
                        </p>
                      </div>
                    )}

                    {/* Rating Only Text */}
                    {activity.type === 'RATING' && !activity.reviewText && (
                      <p className="text-gray-400 text-sm">
                        Gave this {activity.rating}/10 stars
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer / Interactions */}
              <div className="px-5 py-4 bg-black/30 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleLike(activity.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      activity.isLiked 
                        ? 'bg-red-500/20 text-red-400' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 transition-transform hover:scale-125 ${activity.isLiked ? 'fill-current' : ''}`} />
                    <span className="text-sm font-medium">{activity.likeCount || 0}</span>
                  </button>
                  
                  <button 
                    onClick={() => toggleCommentBox(activity.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      activeCommentId === activity.id
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">{activity.commentCount || 0}</span>
                  </button>
                  
                  <button className="ml-auto p-2 rounded-full bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Comments Section */}
                {activeCommentId === activity.id && (
                  <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in slide-in-from-top-2 duration-300">
                    {/* Existing Comments */}
                    {activity.Comments && activity.Comments.length > 0 && (
                      <div className="mb-4 space-y-3 max-h-48 overflow-y-auto pr-2">
                        {activity.Comments.map(comment => (
                          <div key={comment.id} className="flex gap-3 group/comment">
                            <img src={comment.User?.avatar || 'https://via.placeholder.com/30'} alt="avatar" className="w-8 h-8 rounded-full ring-1 ring-white/10" />
                            <div className="bg-white/5 rounded-2xl rounded-tl-sm p-3 flex-1">
                              <p className="text-xs font-bold text-white mb-0.5">{comment.User?.username}</p>
                              <p className="text-sm text-gray-300">{comment.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input */}
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:bg-white/10 transition-all"
                        onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(activity.id)}
                      />
                      <button 
                        onClick={() => handleCommentSubmit(activity.id)}
                        disabled={!commentText.trim()}
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white p-3 rounded-full transition-all shadow-lg shadow-red-500/25 disabled:shadow-none"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* Empty State */}
        {activities.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-600/20 to-pink-600/20 flex items-center justify-center">
              <span className="text-5xl">🎬</span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No activities yet</h3>
            <p className="text-gray-400 max-w-sm mx-auto">Follow some users or start rating movies and books to see activities here!</p>
          </div>
        )}

        {/* Load More */}
        {activities.length > 0 && hasMore && (
          <div className="text-center pt-8 pb-12">
            <button 
              onClick={loadMore} 
              disabled={loading}
              className="group relative px-8 py-3 rounded-full font-bold text-white transition-all disabled:opacity-50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-pink-600 transition-transform group-hover:scale-105"></div>
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  'Load More Activities'
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
