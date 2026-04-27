🌸 Symmetra - Infinite Mandala Studio

Symmetra is a beautiful, offline-first Progressive Web App (PWA) that lets you generate, color, and save infinitely unique procedural mandalas right from your browser or mobile device.

Built with React and Vite, Symmetra is designed to be a relaxing, single-screen experience that works perfectly whether you are at your desk or completely offline on an airplane.

✨ Features

♾️ Infinite Procedural Generation: Never color the same mandala twice. The app stacks randomized geometric SVG layers (petals, diamonds, chevrons, sunbursts) to create perfectly symmetrical, interlocking rings.

🧠 Smart Naming Engine: Every generated mandala gets a unique, procedurally generated title (over 6,500 combinations like "Mystic Bloom" or "Lattice of Eternity").

📱 100% Offline Capable (PWA): Install it directly to your phone's home screen. The app uses Service Workers and local storage to run flawlessly without an internet connection.

🖼️ Personal Gallery & Auto-Save: Symmetra automatically saves your progress locally. Close the app halfway through a design, and pick it up right where you left off from your Gallery.

🔍 Native Pan & Zoom: Mobile-friendly workspace with built-in zoom controls and drag-to-pan, allowing you to easily color the smallest details on mobile screens.

💾 High-Res Export: Export your finished masterpieces as crisp, 1200x1200px high-resolution PNG files.

↩️ Undo History: Made a mistake? Use the undo button to step back through your recent color changes.

🛠️ Technologies Used

Framework: React 18 + Vite

Styling: Tailwind CSS

Icons: Lucide React

PWA / Offline: vite-plugin-pwa

Storage: Native Browser localStorage (No database required!)

🚀 Local Development Setup

To run Symmetra locally on your machine:

Clone the repository:

git clone [https://github.com/yourusername/symmetra-app.git](https://github.com/yourusername/symmetra-app.git)
cd symmetra-app


Install dependencies:

npm install


Start the development server:

npm run dev


Open http://localhost:5173 in your browser.

📲 Deploying as a Mobile App

Symmetra is optimized to be packaged as a native mobile app using PWABuilder.

Deploy the code to a hosting provider like Vercel or Netlify.

Go to PWABuilder.com.

Paste your live Vercel URL.

Because Symmetra includes a valid manifest.json and a configured Service Worker, it will pass the checks!

Click Package For Stores to generate an Android APK or iOS package.

(Alternatively, just open the live URL in Safari on iOS or Chrome on Android and tap "Add to Home Screen" for an instant native app experience).

🤝 Contributing

Feel free to fork this repository, submit pull requests, or open an issue if you have ideas for new geometric layer types, color palettes, or features!

Created for relaxation, creativity, and symmetry.
