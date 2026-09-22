import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Settings, Plus, Heart, MessageSquare, Star, Film, Book, Clock, CheckCircle, List as ListIcon, Edit3, X, Camera, Award, Sparkles, TrendingUp, Eye, BookOpen } from 'lucide-react';

// Avatar Kategorileri ve Seçenekleri
const AVATAR_CATEGORIES = [
  {
    name: 'Maceraperest',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4', name: 'Felix' },
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Luna&backgroundColor=c0aede', name: 'Luna' },
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=ffd5dc', name: 'Max' },
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe&backgroundColor=d1f4d1', name: 'Zoe' },
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Oscar&backgroundColor=ffdfbf', name: 'Oscar' },
      { url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Mia&backgroundColor=e8d5f4', name: 'Mia' },
    ]
  },
  {
    name: 'Pixel Art',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Gamer&backgroundColor=0a0a0a', name: 'Gamer' },
      { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Retro&backgroundColor=1a1a2e', name: 'Retro' },
      { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=Arcade&backgroundColor=16213e', name: 'Arcade' },
      { url: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=8bit&backgroundColor=0f3460', name: '8-Bit' },
    ]
  },
  {
    name: 'Robot',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot1&backgroundColor=ffcf00', name: 'Alpha' },
      { url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot2&backgroundColor=00d2ff', name: 'Beta' },
      { url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot3&backgroundColor=ff6b6b', name: 'Gamma' },
      { url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Robot4&backgroundColor=4ecdc4', name: 'Delta' },
    ]
  },
  {
    name: 'Sanatsal',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Artist&backgroundColor=gradient', name: 'Artist' },
      { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Dreamer&backgroundColor=gradient', name: 'Dreamer' },
      { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Creator&backgroundColor=gradient', name: 'Creator' },
      { url: 'https://api.dicebear.com/7.x/lorelei/svg?seed=Poet&backgroundColor=gradient', name: 'Poet' },
    ]
  },
  {
    name: 'Emoji',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy', name: 'Happy' },
      { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cool', name: 'Cool' },
      { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Love', name: 'Love' },
      { url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Star', name: 'Star' },
    ]
  },
  {
    name: 'Minimalist',
    avatars: [
      { url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Circle&backgroundColor=ef4444', name: 'Kırmızı' },
      { url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Square&backgroundColor=3b82f6', name: 'Mavi' },
      { url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Triangle&backgroundColor=22c55e', name: 'Yeşil' },
      { url: 'https://api.dicebear.com/7.x/shapes/svg?seed=Hex&backgroundColor=a855f7', name: 'Mor' },
    ]
  },
];

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useContext(AuthContext);
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [activities, setActivities] = useState([]);
  const [activeTab, setActiveTab] = useState('watched'); // watched, to_watch, read, to_read, lists, activity
  const [loading, setLoading] = useState(true);
  
  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editAvatar, setEditAvatar] = useState('');
  const [editBio, setEditBio] = useState('');
  
  // Avatar Selection Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Custom List Creation State
  const [showCreateList, setShowCreateList] = useState(false);
  const [newListName, setNewListName] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, activitiesRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/activities/user/${id}`)
        ]);
        setProfile(profileRes.data);
        setActivities(activitiesRes.data);
        
        // Initialize edit state
        setEditAvatar(profileRes.data.avatar || '');
        setEditBio(profileRes.data.bio || '');
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFollow = async () => {
    try {
      if (profile.isFollowing) {
        await api.delete(`/users/${id}/follow`);
        setProfile(prev => ({ ...prev, isFollowing: false, followersCount: prev.followersCount - 1 }));
      } else {
        await api.post(`/users/${id}/follow`);
        setProfile(prev => ({ ...prev, isFollowing: true, followersCount: prev.followersCount + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', {
        avatar: editAvatar,
        bio: editBio
      });
      setProfile(prev => ({ ...prev, avatar: res.data.user.avatar, bio: res.data.user.bio }));
      setIsEditing(false);
      showToast('Profile updated successfully!', 'success', 'Profile Saved');
    } catch (err) {
      console.error(err);
      showToast('Failed to update profile. Please try again.', 'error', 'Update Failed');
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    showToast(`Custom list "${newListName}" created!`, 'info', 'List Created');
    setShowCreateList(false);
    setNewListName('');
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen text-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
    </div>
  );
  
  if (!profile) return <div className="text-white text-center mt-20">User not found</div>;

  // Filter Activities for Tabs
  const watchedList = activities.filter(a => a.type === 'ADD_TO_LIST' && a.listName === 'WATCHED');
  const toWatchList = activities.filter(a => a.type === 'ADD_TO_LIST' && a.listName === 'TO_WATCH');
  const readList = activities.filter(a => a.type === 'ADD_TO_LIST' && a.listName === 'READ');
  const toReadList = activities.filter(a => a.type === 'ADD_TO_LIST' && a.listName === 'TO_READ');
  
  // Custom Lists: Group by listName (excluding standard ones)
  const standardLists = ['WATCHED', 'TO_WATCH', 'READ', 'TO_READ'];
  const customListActivities = activities.filter(a => a.type === 'ADD_TO_LIST' && a.listName && !standardLists.includes(a.listName));
  const customLists = [...new Set(customListActivities.map(a => a.listName))];

  const recentActivity = activities.filter(a => ['RATING', 'REVIEW'].includes(a.type));

  const renderContentGrid = (items) => (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {items.map(item => (
        <div key={item.id} className="bg-[#181818] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors">
          <img 
            src={item.contentPoster || 'https://via.placeholder.com/150x225'} 
            alt={item.contentTitle} 
            className="w-full h-48 object-cover"
          />
          <div className="p-3">
            <h3 className="font-bold text-white text-sm truncate">{item.contentTitle}</h3>
            <p className="text-xs text-gray-500">{item.contentType}</p>
            {item.rating && (
              <div className="flex items-center text-yellow-500 text-xs mt-1">
                <Star className="w-3 h-3 fill-current mr-1" /> {item.rating}
              </div>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-500">
          No items in this list yet.
        </div>
      )}
    </div>
  );

  // İstatistik hesaplamaları
  const totalMovies = watchedList.length;
  const totalBooks = readList.length;
  const totalReviews = recentActivity.filter(a => a.type === 'REVIEW').length;
  const totalRatings = recentActivity.filter(a => a.type === 'RATING').length;

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-900 via-purple-900 to-black">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-10 left-10 w-72 h-72 bg-red-500 rounded-full filter blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Profile Content */}
      <div className="container mx-auto px-4 max-w-6xl -mt-32 relative z-10">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl border border-gray-800/50 shadow-2xl overflow-hidden">
          {/* Profile Header */}
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
              {/* Avatar Section */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-300"></div>
                <div className="relative">
                  <img 
                    src={profile.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}&backgroundColor=1a1a2e`} 
                    alt={profile.username} 
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black shadow-2xl object-cover bg-gray-900"
                  />
                  {currentUser.id === parseInt(id) && (
                    <button 
                      onClick={() => setIsEditing(!isEditing)}
                      className="absolute bottom-2 right-2 bg-red-600 p-3 rounded-full shadow-lg hover:bg-red-500 text-white transition-all hover:scale-110"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{profile.username}</h1>
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                </div>
                <p className="text-gray-400 max-w-xl mb-4">{profile.bio || 'Henüz bir bio eklenmemiş.'}</p>
                
                {/* Follow Stats */}
                <div className="flex items-center justify-center md:justify-start gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{profile.followersCount}</span>
                    <span className="text-gray-500">Takipçi</span>
                  </div>
                  <div className="w-px h-6 bg-gray-700"></div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-white">{profile.followingCount}</span>
                    <span className="text-gray-500">Takip</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {currentUser.id !== parseInt(id) && (
                <button
                  onClick={handleFollow}
                  className={`px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 ${
                    profile.isFollowing 
                      ? 'bg-gray-800 text-white border border-gray-600 hover:bg-gray-700' 
                      : 'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/25'
                  }`}
                >
                  {profile.isFollowing ? 'Takibi Bırak' : 'Takip Et'}
                </button>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20 rounded-xl p-4 text-center hover:border-red-500/40 transition-colors">
                <Film className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalMovies}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Film İzlendi</div>
              </div>
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-900/10 border border-blue-500/20 rounded-xl p-4 text-center hover:border-blue-500/40 transition-colors">
                <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalBooks}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Kitap Okundu</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/20 rounded-xl p-4 text-center hover:border-yellow-500/40 transition-colors">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalRatings}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">Değerlendirme</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-900/10 border border-purple-500/20 rounded-xl p-4 text-center hover:border-purple-500/40 transition-colors">
                <MessageSquare className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{totalReviews}</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">İnceleme</div>
              </div>
            </div>

            {/* Edit Form */}
            {isEditing && (
              <div className="mt-8 bg-black/50 backdrop-blur rounded-xl border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" /> Profili Düzenle
                </h3>
                <form onSubmit={handleUpdateProfile}>
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-3 text-gray-300">Avatar Seç</label>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img
                          src={editAvatar || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.username}&backgroundColor=1a1a2e`}
                          alt="Avatar Preview"
                          className="w-20 h-20 rounded-full border-2 border-gray-600 bg-gray-900"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowAvatarModal(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg"
                      >
                        <Camera className="w-5 h-5" />
                        Avatar Galerisi
                      </button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-bold mb-3 text-gray-300">Hakkında</label>
                    <textarea
                      className="w-full p-4 rounded-xl bg-gray-900/50 border border-gray-700 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none transition-all"
                      rows={3}
                      value={editBio}
                      onChange={(e) => setEditBio(e.target.value)}
                      placeholder="Kendinizden bahsedin..."
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="px-6 py-3 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit" 
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold hover:from-red-500 hover:to-red-400 transition-all hover:scale-105 shadow-lg shadow-red-500/25"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-t border-gray-800">
          <div className="flex overflow-x-auto gap-2 p-2 -mb-px">
            {[
              { id: 'watched', label: 'İzlenenler', icon: Eye, count: watchedList.length },
              { id: 'to_watch', label: 'İzlenecek', icon: Clock, count: toWatchList.length },
              { id: 'read', label: 'Okunanlar', icon: BookOpen, count: readList.length },
              { id: 'to_read', label: 'Okunacak', icon: Book, count: toReadList.length },
              { id: 'lists', label: 'Listeler', icon: ListIcon, count: customLists.length },
              { id: 'activity', label: 'Aktivite', icon: TrendingUp, count: recentActivity.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-red-600 text-white shadow-lg shadow-red-500/25' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 md:p-8 min-h-[400px]">
        {activeTab === 'watched' && renderContentGrid(watchedList)}
        {activeTab === 'to_watch' && renderContentGrid(toWatchList)}
        {activeTab === 'read' && renderContentGrid(readList)}
        {activeTab === 'to_read' && renderContentGrid(toReadList)}
        
        {activeTab === 'lists' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">My Collections</h2>
              {currentUser.id === parseInt(id) && (
                <button 
                  onClick={() => setShowCreateList(true)}
                  className="flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded text-white text-sm font-bold transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" /> Create List
                </button>
              )}
            </div>

            {showCreateList && (
              <div className="mb-6 p-4 bg-gray-900 rounded border border-gray-800">
                <form onSubmit={handleCreateList} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="List Name (e.g., Best Sci-Fi)" 
                    className="flex-1 bg-black border border-gray-700 rounded px-4 py-2 text-white focus:outline-none focus:border-red-500"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                  />
                  <button type="submit" className="bg-red-600 text-white px-6 py-2 rounded font-bold">Create</button>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customLists.map(listName => {
                const listItems = customListActivities.filter(a => a.listName === listName);
                const coverImage = listItems[0]?.contentPoster || 'https://via.placeholder.com/300x200';
                
                return (
                  <div key={listName} className="bg-[#181818] rounded-lg overflow-hidden border border-gray-800 hover:border-gray-600 transition-colors group cursor-pointer">
                    <div className="h-40 overflow-hidden relative">
                      <img src={coverImage} alt={listName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{listItems.length} Items</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-white text-lg">{listName}</h3>
                    </div>
                  </div>
                );
              })}
              {customLists.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  No custom lists created yet.
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-4 max-w-3xl">
            {recentActivity.map(act => (
              <div key={act.id} className="bg-[#181818] p-4 rounded-lg border border-gray-800 flex gap-4">
                <img 
                  src={act.contentPoster || 'https://via.placeholder.com/60x90'} 
                  alt={act.contentTitle} 
                  className="w-16 h-24 object-cover rounded"
                />
                <div>
                  <h3 className="font-bold text-white">{act.contentTitle}</h3>
                  <div className="flex items-center text-sm text-gray-400 mb-2">
                    <span className="mr-2">{act.type === 'REVIEW' ? 'Reviewed' : 'Rated'}</span>
                    {act.rating && (
                      <span className="flex items-center text-yellow-500">
                        <Star className="w-3 h-3 fill-current mr-1" /> {act.rating}
                      </span>
                    )}
                  </div>
                  {act.reviewText && (
                    <p className="text-gray-300 text-sm line-clamp-2">{act.reviewText}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">{new Date(act.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <div className="text-center py-12 text-gray-500">No recent activity.</div>
            )}
          </div>
        )}
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700/50 w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-gradient-to-r from-red-600/10 to-purple-600/10">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-yellow-500" />
                  Avatar Galerisi
                </h3>
                <p className="text-gray-400 text-sm mt-1">Profiliniz için bir avatar seçin</p>
              </div>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {AVATAR_CATEGORIES.map((category, catIndex) => (
                <div key={catIndex} className="mb-8 last:mb-0">
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <div className="w-8 h-px bg-gradient-to-r from-red-500 to-transparent"></div>
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-4">
                    {category.avatars.map((avatar, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => {
                          setEditAvatar(avatar.url);
                          setShowAvatarModal(false);
                        }}
                        className={`group relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-110 hover:z-10 ${
                          editAvatar === avatar.url 
                            ? 'border-red-500 ring-4 ring-red-500/30 shadow-lg shadow-red-500/25' 
                            : 'border-gray-700 hover:border-red-400'
                        }`}
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-full h-full object-cover bg-gray-800"
                        />
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
                          <span className="text-xs text-white font-medium">{avatar.name}</span>
                        </div>
                        {/* Selected Check */}
                        {editAvatar === avatar.url && (
                          <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-800 bg-black/50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                {editAvatar ? 'Avatar seçildi' : 'Bir avatar seçin'}
              </p>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition-colors font-medium"
              >
                Tamam
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

