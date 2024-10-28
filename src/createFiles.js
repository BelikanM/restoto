const fs = require('fs');

const files = [
  'App.js',
  'index.js',
  'manifest.json',
  'serviceWorker.js',
  'Home.js',
  'Product.js',
  'ProductList.js',
  'Cart.js',
  'Checkout.js',
  'Navbar.js',
  'Footer.js',
  'Login.js',
  'Signup.js',
  'UserProfile.js',
  'Orders.js',
  'OrderDetails.js',
  'CategoryFilter.js',
  'Search.js',
  'ProductCard.js',
  'CartItem.js',
  'Button.js',
  'Input.js',
  'api.js',
  'styles.css',
  'helpers.js',
  'README.md'
];

// Templates de base pour certains fichiers
const templates = {
  'App.js': `import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import ProductList from './ProductList';
import Product from './Product';
import Cart from './Cart';
import Checkout from './Checkout';
import Navbar from './Navbar';
import Footer from './Footer';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/products" component={ProductList} />
          <Route path="/product/:id" component={Product} />
          <Route path="/cart" component={Cart} />
          <Route path="/checkout" component={Checkout} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;`,

  'index.js': `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(<App />, document.getElementById('root'));`,

  'manifest.json': `{
  "name": "E-commerce PWA",
  "short_name": "Shop",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "description": "Une application e-commerce PWA pour les vêtements et chaussures",
  "icons": [
    {
      "src": "icon.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}`,

  'serviceWorker.js': `const CACHE_NAME = "my-cache";
const urlsToCache = ["/", "/index.html", "/styles.css"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});`,

  'README.md': `# E-commerce PWA
Une application e-commerce pour la vente de vêtements et chaussures, construite avec React.js et transformée en Progressive Web App.`
};

// Fonction pour créer un fichier avec contenu par défaut
const createFile = (fileName) => {
  const content = templates[fileName] || ''; // Récupère le template ou met du contenu vide
  fs.writeFile(fileName, content, (err) => {
    if (err) throw err;
    console.log(\`Fichier créé : \${fileName}\`);
  });
};

// Création de chaque fichier
files.forEach(createFile);
