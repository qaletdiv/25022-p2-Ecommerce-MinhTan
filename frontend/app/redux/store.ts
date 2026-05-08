import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cart.slice';

export const makeStore = () => {
    return configureStore({
        reducer: {
            cart: cartReducer,
        },
    });
};
