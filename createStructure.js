
const fs = require('fs');
const path = require('path');

const dirStructure = {
  'src': {
    'EC': {
      'e-commerce.js': "import React from 'react';\nimport Header from './components/Header/Header';\nimport Footer from './components/Footer/Footer';\nimport ProductList from './components/ProductList/ProductList';\nimport Cart from './components/Cart/Cart';\nimport Checkout from './components/Checkout/Checkout';\nimport UserProfile from './components/UserProfile/UserProfile';\nimport OrderHistory from './components/OrderHistory/OrderHistory';\nimport SearchBar from './components/SearchBar/SearchBar';\nimport NotFound from './components/NotFound/NotFound';\n\nconst ECommerce = () => {\n  return (\n    <div>\n      <Header />\n      <SearchBar />\n      <ProductList />\n      <Cart />\n      <Checkout />\n      <UserProfile />\n      <OrderHistory />\n      <Footer />\n    </div>\n  );\n};\n\nexport default ECommerce;",
      'components': {
        'Header': {
          'Header.js': "import React from 'react';\n\nconst Header = () => <header><h1>My E-Commerce Site</h1></header>;\n\nexport default Header;",
          'Header.css': ''
        },
        'Footer': {
          'Footer.js': "import React from 'react';\n\nconst Footer = () => <footer><p>© 2024 My E-Commerce Site</p></footer>;\n\nexport default Footer;",
          'Footer.css': ''
        },
        'ProductList': {
          'ProductList.js': "import React from 'react';\n\nconst ProductList = () => <div>Product List</div>;\n\nexport default ProductList;",
          'ProductList.css': ''
        },
        'ProductItem': {
          'ProductItem.js': "import React from 'react';\n\nconst ProductItem = () => <div>Product Item</div>;\n\nexport default ProductItem;",
          'ProductItem.css': ''
        },
        'Cart': {
          'Cart.js': "import React from 'react';\n\nconst Cart = () => <div>Shopping Cart</div>;\n\nexport default Cart;",
          'Cart.css': ''
        },
        'Checkout': {
          'Checkout.js': "import React from 'react';\n\nconst Checkout = () => <div>Checkout</div>;\n\nexport default Checkout;",
          'Checkout.css': ''
        },
        'UserProfile': {
          'UserProfile.js': "import React from 'react';\n\nconst UserProfile = () => <div>User Profile</div>;\n\nexport default UserProfile;",
          'UserProfile.css': ''
        },
        'OrderHistory': {
          'OrderHistory.js': "import React from 'react';\n\nconst OrderHistory = () => <div>Order History</div>;\n\nexport default OrderHistory;",
          'OrderHistory.css': ''
        },
        'SearchBar': {
          'SearchBar.js': "import React from 'react';\n\nconst SearchBar = () => <input type='text' placeholder='Search...' />;\n\nexport default SearchBar;",
          'SearchBar.css': ''
        },
        'NotFound': {
          'NotFound.js': "import React from 'react';\n\nconst NotFound = () => <div>404 Not Found</div>;\n\nexport default NotFound;",
          'NotFound.css': ''
        }
      },
      'utils': {
        'firebase.js': "import { initializeApp } from 'firebase/app';\nimport { getAuth } from 'firebase/auth';\nimport { getFirestore } from 'firebase/firestore';\nimport { getStorage } from 'firebase/storage';\n\nconst firebaseConfig = {\n  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,\n  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,\n  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,\n  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,\n  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,\n  appId: process.env.REACT_APP_FIREBASE_APP_ID,\n  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,\n};\n\nconst app = initializeApp(firebaseConfig);\nconst auth = getAuth(app);\nconst db = getFirestore(app);\nconst storage = getStorage(app);\n\nexport { auth, db, storage };",
        'helpers.js': ''
      }
    },
    'Profile.js': "import React from 'react';\nimport ECommerce from './EC/e-commerce';\n\nconst Profile = () => {\n  return <ECommerce />;\n};\n\nexport default Profile;"
  }
};

function createDirStructure(basePath, structure) {
  for (const [name, content] of Object.entries(structure)) {
    const currentPath = path.join(basePath, name);
    if (typeof content === 'object') {
      fs.mkdirSync(currentPath, { recursive: true });
      createDirStructure(currentPath, content);
    } else {
      fs.writeFileSync(currentPath, content);
    }
  }
}

// Start creating the directory structure in the current working directory
createDirStructure(process.cwd(), dirStructure);
console.log('Directory structure created successfully.');
