import './App.css';
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { initializeTheme } from './features/common/hooks/theme';
import { ThemeProvider } from './features/common/hooks/ThemeContext';
import { MediaListPage } from './features/media/index';
import { FeedListPage } from './features/feed/index';

// Import the disable-devtool function
function App() {
  useEffect(() => {
    // Initialize theme when app mounts
    initializeTheme();
  }, []);


  return (
    <ThemeProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<MediaListPage />} />
            <Route path="/feeds/:mediaId" element={<FeedListPage />} />
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
