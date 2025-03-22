import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Pages/HomePage';
import CreateNewBlog from './Pages/CreateNewBlog';
import BlogDetail from './Pages/BlogDetail';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-new-blog" element={<CreateNewBlog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
