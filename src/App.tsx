import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddEditItem from "./pages/AddEditItem";
import ItemDetail from "./pages/ItemDetail";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add" element={<AddEditItem />} />
        <Route path="/edit/:id" element={<AddEditItem />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}
