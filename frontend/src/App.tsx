import { Link, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
import Register from './views/Register';

function Home() {
  return (
    <div className="page">
      <h1 className="title">Savorly</h1>
      <p>Welcome to your recipe collection app.</p>
    </div>
  );
}

function Recipes() {
  return (
    <div className="page">
      <h2>Recipes</h2>
      <p>Here will be the recipes list and CRUD UI.</p>
    </div>
  );
}

function Categories() {
  return (
    <div className="page">
      <h2>Categories</h2>
      <p>Here will be the categories list and CRUD UI.</p>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <nav className="nav">
        <Link to="/">Home</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/login">Login</Link>
      </nav>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}
