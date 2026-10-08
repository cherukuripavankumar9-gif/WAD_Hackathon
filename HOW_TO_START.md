# 🚀 HOW TO START YOUR MUSIC APP

## ✨ SUPER SIMPLE - 3 STEPS!

---

## 📍 **OPTION 1: FULL APP (Recommended)**

### **Step 1: Open TWO Terminals**

**Terminal 1:**
```bash
node server.js
```
✅ This starts the backend (for playlists & profile)

**Terminal 2:**
```bash
npm run dev
```
✅ This starts the frontend (main app)

### **Step 2: Wait for Both to Start**

**Terminal 1 should show:**
```
🎵 TuneFlow Backend API running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
✅ Database loaded from file
💾 Database saved
```

**Terminal 2 should show:**
```
VITE v8.3.3  ready in 171 ms
➜  Local:   http://localhost:5173/
```

### **Step 3: Open Your Browser**

👉 **Go to: http://localhost:5173/**

**That's it! You're done!** 🎉

---

## 📍 **OPTION 2: MUSIC ONLY (Quick Test)**

Just want to test the music player without playlists?

**Terminal:**
```bash
npm run dev
```

**Browser:**
```
http://localhost:5173/
```

**What Works:**
✅ Play music
✅ Volume control
✅ Next/Previous
✅ Search
✅ Like songs (localStorage only)

**What Doesn't Work:**
❌ Create playlists (needs backend)
❌ Save profile (needs backend)

---

## 🎯 **WHAT TO REMEMBER:**

### **Only ONE URL to access:**
```
http://localhost:5173
```

**NOT:** ~~http://localhost:3001~~ ❌

The backend runs in the background, but you **NEVER** access it directly!

---

## 🛑 **HOW TO STOP:**

### **Stop Both Servers:**

**In Terminal 1 (backend):**
```
Press: Ctrl+C
```

**In Terminal 2 (frontend):**
```
Press: Ctrl+C
```

---

## 🔄 **HOW TO RESTART:**

### **If You Change Code:**

**Frontend Changes:**
- Vite auto-reloads! ✨
- Just save the file
- No restart needed

**Backend Changes:**
```bash
# In Terminal 1:
Ctrl+C
node server.js
```

**Config Changes (vite.config.js):**
```bash
# In Terminal 2:
Ctrl+C
npm run dev
```

---

## 🐛 **TROUBLESHOOTING:**

### **Issue: "Port 5173 already in use"**

**Solution:**
```bash
# Stop Vite
Ctrl+C

# Or kill the process
npx kill-port 5173

# Restart
npm run dev
```

### **Issue: "Port 3001 already in use"**

**Solution:**
```bash
# Stop backend
Ctrl+C

# Or kill the process
npx kill-port 3001

# Restart
node server.js
```

### **Issue: Nothing loads in browser**

**Check:**
1. Is `npm run dev` running? (Terminal 2)
2. Is it showing `Local: http://localhost:5173/`?
3. Did you open the correct URL?
4. Try hard refresh: `Ctrl+Shift+R`

### **Issue: Playlists not saving**

**Check:**
1. Is `node server.js` running? (Terminal 1)
2. Does it show "Database loaded"?
3. Check browser console for errors (F12)

---

## ✅ **SUCCESS CHECKLIST:**

Before you start, make sure you're in the right folder:

```bash
cd music_streaming
```

Then:

- [ ] Terminal 1: `node server.js` ✅
- [ ] See: "TuneFlow Backend API running" ✅
- [ ] Terminal 2: `npm run dev` ✅
- [ ] See: "Local: http://localhost:5173/" ✅
- [ ] Browser: Open `http://localhost:5173/` ✅
- [ ] Click a song ✅
- [ ] Music plays! ✅
- [ ] Create a playlist ✅
- [ ] Playlist saves! ✅

**All checks passed?** 🎉 **YOU'RE READY TO GO!**

---

## 📚 **QUICK REFERENCE:**

### **Start Commands:**
```bash
# Terminal 1:
node server.js

# Terminal 2:
npm run dev
```

### **Your App URL:**
```
http://localhost:5173
```

### **Stop Commands:**
```bash
# Both terminals:
Ctrl+C
```

---

## 💡 **PRO TIPS:**

### **1. Keep Terminals Open**
Don't close the terminal windows while using the app

### **2. Save Terminal Layout**
Your IDE can save terminal configurations for quick startup

### **3. Use Keyboard Shortcuts**
- `Ctrl+C` = Stop server
- `↑` arrow = Previous command
- Easy to restart quickly!

### **4. Check Terminal Output**
If something's not working, look at terminal messages for clues

---

## 🎵 **FEATURES YOU CAN USE:**

### **When Both Servers Running:**
✅ Play all 15 songs
✅ Volume control & mute
✅ Next/Previous/Shuffle/Repeat
✅ Search & filter songs
✅ Like songs (persists)
✅ Recently played (tracks)
✅ **Create playlists** (saves to database)
✅ **Add songs to playlists** (persists)
✅ **Edit profile** (saves to database)
✅ View library
✅ All navigation

### **When Only Frontend Running:**
✅ Play all 15 songs
✅ Volume control & mute
✅ Next/Previous/Shuffle/Repeat
✅ Search & filter songs
✅ Like songs (localStorage)
✅ Recently played
❌ Create playlists (lost on refresh)
❌ Edit profile (lost on refresh)

---

## 🎉 **YOU'RE ALL SET!**

### **Just remember:**

1. **Start both servers** (2 terminals)
2. **Open browser** to http://localhost:5173
3. **Enjoy your music!** 🎵

---

## 📞 **NEED HELP?**

### **Check These First:**

1. **Are both servers running?**
   - Look at both terminal windows
   - Both should show "running" messages

2. **Did you open the right URL?**
   - Should be: `localhost:5173`
   - NOT: `localhost:3001`

3. **Is your internet working?**
   - Songs stream from Google CDN
   - Need internet for audio playback

4. **Try refreshing the page**
   - Press `F5` or `Ctrl+R`
   - Hard refresh: `Ctrl+Shift+R`

5. **Check browser console**
   - Press `F12`
   - Look for error messages
   - Red text = problems

---

Made with ❤️ and 🎵

**Happy Music Streaming!** 🎧✨

---

## 📋 **COMMAND CHEAT SHEET:**

```bash
# Start Backend
node server.js

# Start Frontend
npm run dev

# Stop (in any terminal)
Ctrl+C

# Kill stuck port
npx kill-port 5173
npx kill-port 3001

# Restart Backend
Ctrl+C
node server.js

# Restart Frontend
Ctrl+C
npm run dev

# Open App
http://localhost:5173
```

**Save this file and refer to it anytime you need to start your app!** 📌
