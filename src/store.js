// src/store.js
import { createStore } from 'redux';

// Un exemple de réducteur (reducer)
const initialState = {
  user: null,
  cart: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    // Ajoutez d'autres cas selon vos besoins
    default:
      return state;
  }
};

const store = createStore(reducer);

export default store;
