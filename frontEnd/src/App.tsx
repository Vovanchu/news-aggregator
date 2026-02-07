import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import NewsDisplay from "./views/newsDisplay";
import NewsDetails from "./components/NewsDetail";
import SearchBar from "./components/SearchBar";

const App = () => {
  const [search, setSearch] = useState("");

  return (
    <BrowserRouter>
      <SearchBar value={search} onChange={setSearch} />

      <Routes>
        <Route path="/" element={<NewsDisplay search={search} />} />
        <Route path="/news/:url" element={<NewsDetails />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
