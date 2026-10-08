# 🎵 TuneFlow - Premium Music Streaming Platform

A modern, full-featured music streaming web application built with React, Node.js, and Express. Features include real-time audio playback, user profile management, playlist creation, and a premium glassmorphism UI.

![TuneFlow](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-24.x-339933?logo=node.js)
![Express](https://img.shields.io/badge/Express-5.2.1-000000?logo=express)

## ✨ Features

### 🎵 Music Playback
- **Real Audio Streaming** - High-quality MP3 playback from Pixabay CDN
- **Full Player Controls** - Play, Pause, Next, Previous, Shuffle, Repeat
- **Volume Control** - Slider with mute/unmute and percentage display
- **Progress Bar** - Seekable timeline with real-time updates
- **Auto-play** - Seamless track transitions

### 👤 User Management
- **Profile Page** - View and edit user information
- **Account Settings** - Update username, email, and avatar
- **Account Statistics** - Member since date, user ID, account type

### 📝 Music Organization
- **Liked Songs** - Save and manage favorite tracks
- **Recently Played** - Track listening history (last 5 songs)
- **Search Functionality** - Real-time search by song title or artist
- **Category Filters** - Browse by genre (Pop, Hip Hop, Chill, Focus, Rock, Jazz)

### 🎨 Premium UI/UX
- **Glassmorphism Design** - Modern frosted glass effects
- **Smooth Animations** - 60fps transitions and hover effects
- **Gradient Accents** - Purple/pink color scheme
- **Responsive Layout** - Works on desktop, tablet, and mobile
- **Dark Theme** - Easy on the eyes

### 🖥️ Backend API
- **RESTful API** - Full CRUD operations
- **User Endpoints** - Profile management
- **Playlist System** - Create, update, delete playlists
- **Song Management** - Add/remove songs to playlists

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd music_streaming
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development servers**

Open two terminal windows:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
node server.js
```

4. **Open your browser**
```
Frontend: http://localhost:5173/
Backend:  http://localhost:3001/
```

## 📁 Project Structure

```
music_streaming/
├── public/
│   ├── songs/          # Audio files (placeholder)
│   └── icons.svg       # Icon sprites
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Route pages
│   │   ├── Home.jsx
│   │   ├── SearchPage.jsx
│   │   ├── Library.jsx
│   │   ├── AlbumPage.jsx
│   │   ├── LikedSongs.jsx
│   │   └── ProfilePage.jsx
│   ├── data/          # Data files
│   │   └── allSongs.js
│   ├── services/      # API service layer
│   │   └── api.js
│   ├── App.jsx        # Main application component
│   ├── App.css        # Global styles
│   └── main.jsx       # Application entry point
├── server.js          # Express backend server
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## 🎮 Usage

### Playing Music
1. Browse the home page for trending and curated songs
2. Click any song card to start playback
3. Use player controls at the bottom for playback management
4. Adjust volume with the slider (bottom right)

### Managing Profile
1. Click "Listener" in the top right corner
2. View your profile information
3. Click "Edit Profile" to update details
4. Save changes to persist to backend

### Searching Music
1. Use the search bar on the home page
2. Navigate to Search page for advanced filtering
3. Filter by category (Pop, Hip Hop, Chill, etc.)
4. Click songs to play instantly

### Organizing Music
1. Click heart icon to like/unlike songs
2. Access "Liked Songs" from sidebar
3. View "Your Library" for collections
4. Check "Recently Played" for history

## 🔌 API Endpoints

### User Endpoints
```
GET    /api/users/:userId              - Get user profile
PUT    /api/users/:userId              - Update user profile
```

### Playlist Endpoints
```
GET    /api/users/:userId/playlists           - Get user's playlists
POST   /api/users/:userId/playlists           - Create new playlist
GET    /api/playlists/:playlistId             - Get specific playlist
PUT    /api/playlists/:playlistId             - Update playlist
DELETE /api/playlists/:playlistId             - Delete playlist
POST   /api/playlists/:playlistId/songs       - Add song to playlist
DELETE /api/playlists/:playlistId/songs/:id   - Remove song from playlist
```

### Health Check
```
GET    /api/health                     - Check backend status
```

## 🛠️ Technologies Used

### Frontend
- **React 19.2.8** - UI framework
- **React Router DOM 7.18.4** - Client-side routing
- **Lucide React** - Icon library
- **Vite 8.3.0** - Build tool and dev server

### Backend
- **Node.js** - Runtime environment
- **Express 5.2.1** - Web framework
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique ID generation

### Styling
- **Custom CSS** - Modern CSS with variables
- **Glassmorphism** - Backdrop filters and transparency
- **CSS Grid & Flexbox** - Responsive layouts
- **CSS Animations** - Smooth transitions

## 🎨 Design Features

- **Premium Glassmorphism UI** - Frosted glass effects with backdrop blur
- **Gradient Animations** - Purple to pink gradient accents
- **Smooth Transitions** - Cubic-bezier animations
- **3D Transforms** - Card lift and scale effects
- **Floating Elements** - Animated disc visualizations
- **Responsive Design** - Mobile-first approach

## 📝 Available Scripts

```bash
npm run dev        # Start frontend development server
npm run server     # Start backend API server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001
PORT=3001
```

## 🐛 Troubleshooting

### Audio Not Playing?
1. Check volume slider is above 0%
2. Ensure speaker icon is not muted
3. Verify browser tab is not muted
4. Check system volume settings
5. Try a different song

### Backend Connection Issues?
1. Ensure backend server is running on port 3001
2. Check `http://localhost:3001/api/health`
3. Verify CORS is enabled
4. Check browser console for errors

### Profile Not Loading?
1. Confirm backend server is running
2. Check network tab in browser dev tools
3. Verify API endpoints are accessible

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'dist' folder
```

### Backend (Heroku/Railway)
- Set PORT environment variable
- Ensure all dependencies in package.json
- Configure CORS for production domain

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.

## 🙏 Acknowledgments

- Audio files from [Pixabay](https://pixabay.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Images from [Picsum](https://picsum.photos/)

## 📊 Project Status

🟢 Active Development - v1.0.0

### Completed Features:
✅ Audio playback system
✅ User profile management
✅ Backend API
✅ Search and filtering
✅ Liked songs
✅ Recently played
✅ Premium UI design
✅ Responsive layout

### Upcoming Features:
🔄 Playlist UI integration
🔄 User authentication
🔄 Database persistence
🔄 Social features
🔄 Music recommendations

---

Made with ❤️ and 🎵 by Your Name

**Star ⭐ this repository if you found it helpful!**
