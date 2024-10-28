const fs = require('fs');

// Liste des fichiers à créer
const files = [
  'App.js',
  'index.js',
  'Home.js',
  'RecipeStreaming.js',
  'RecipeDetails.js',
  'ChefProfile.js',
  'SearchBar.js',
  'Cart.js',
  'Checkout.js',
  'PaymentConfirmation.js',
  'Login.js',
  'Signup.js',
  'UserProfile.js',
  'OrderHistory.js',
  'LiveChat.js',
  'Footer.js'
];

// Contenu pour les fichiers
const fileContents = {
  'App.js': `
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './Home';
import RecipeStreaming from './RecipeStreaming';
import RecipeDetails from './RecipeDetails';
import ChefProfile from './ChefProfile';
import Cart from './Cart';
import Checkout from './Checkout';
import Login from './Login';
import Signup from './Signup';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';
import LiveChat from './LiveChat';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/streaming">Recipe Streaming</Link></li>
          <li><Link to="/cart">Cart</Link></li>
          <li><Link to="/checkout">Checkout</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/profile">Profile</Link></li>
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/streaming" element={<RecipeStreaming />} />
        <Route path="/recipe/:id" element={<RecipeDetails />} />
        <Route path="/chef/:id" element={<ChefProfile />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/orders" element={<OrderHistory />} />
        <Route path="/chat" element={<LiveChat />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
  `,

  'index.js': `
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
  `,

  // Autres fichiers avec des composants fonctionnels de base
  'Home.js': `const Home = () => <h1>Welcome to the Home Page</h1>; export default Home;`,
  'RecipeStreaming.js': `const RecipeStreaming = () => <h1>Watch Recipe Streaming</h1>; export default RecipeStreaming;`,
  'RecipeDetails.js': `const RecipeDetails = () => <h1>Recipe Details Page</h1>; export default RecipeDetails;`,
  'ChefProfile.js': `const ChefProfile = () => <h1>Chef Profile</h1>; export default ChefProfile;`,
  'SearchBar.js': `const SearchBar = () => <input type="text" placeholder="Search for recipes or dishes" />; export default SearchBar;`,
  'Cart.js': `const Cart = () => <h1>Your Cart</h1>; export default Cart;`,
  'Checkout.js': `const Checkout = () => <h1>Checkout Page</h1>; export default Checkout;`,
  'PaymentConfirmation.js': `const PaymentConfirmation = () => <h1>Payment Confirmation</h1>; export default PaymentConfirmation;`,
  'Login.js': `const Login = () => <h1>Login Page</h1>; export default Login;`,
  'Signup.js': `const Signup = () => <h1>Signup Page</h1>; export default Signup;`,
  'UserProfile.js': `const UserProfile = () => <h1>User Profile</h1>; export default UserProfile;`,
  'OrderHistory.js': `const OrderHistory = () => <h1>Order History</h1>; export default OrderHistory;`,
  'LiveChat.js': `const LiveChat = () => <h1>Live Chat</h1>; export default LiveChat;`,
  'Footer.js': `const Footer = () => <footer><p>Footer Content</p></footer>; export default Footer;`,
};

// Créer chaque fichier
files.forEach(file => {
  fs.writeFileSync(`./src/${file}`, fileContents[file]);
  console.log(`${file} created!`);
});

console.log('All files have been created successfully!');
