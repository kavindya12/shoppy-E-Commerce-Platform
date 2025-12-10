import { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../services/api';

const StoreContext = createContext();


const initialState = {
  user: null,
  cart: [],
  wishlist: [],
  recentViewed: JSON.parse(localStorage.getItem('recentViewed') || '[]'),
  loading: false,
  currency: localStorage.getItem('currency') || 'USD',
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'ADD_TO_WISHLIST':
      return { ...state, wishlist: [...state.wishlist, action.payload] };
    case 'REMOVE_FROM_WISHLIST':
      return { ...state, wishlist: state.wishlist.filter(item => item._id !== action.payload) };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'ADD_TO_CART':
      return { ...state, cart: [...state.cart, action.payload] };
    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item._id !== action.payload) };
    case 'UPDATE_CART_ITEM':
      return {
        ...state,
        cart: state.cart.map(item =>
          item._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'SET_RECENT_VIEWED':
      const updated = action.payload;
      localStorage.setItem('recentViewed', JSON.stringify(updated));
      return { ...state, recentViewed: updated };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/user/profile')
        .then(res => dispatch({ type: 'SET_USER', payload: res.data }))
        .catch(() => localStorage.removeItem('token'));
      api.get('/wishlist')
        .then(res => dispatch({ type: 'SET_WISHLIST', payload: res.data }))
        .catch(() => dispatch({ type: 'SET_WISHLIST', payload: [] }));
    }
  }, []);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

