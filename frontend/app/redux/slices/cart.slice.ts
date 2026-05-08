import { createSlice } from '@reduxjs/toolkit';
import { CartItem } from '../../types/cart';
// Cart chứa biến thể sản phẩm đã được thêm vào giỏ hàng, mỗi biến thể có thể có số lượng khác nhau

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [] as CartItem[],
    },
    reducers: {
        addToCart: (state, action) => {
            const { variantId, quantity } = action.payload;
            const existingItem = state.items.find(
                (item) => item.variantId === variantId
            );
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.items.push({ variantId, quantity });
            }
        },
        removeFromCart: (state, action) => {
            const { variantId } = action.payload;
            state.items = state.items.filter(
                (item) => item.variantId !== variantId
            );
        },
        increaseQuantity: (state, action) => {
            const { variantId } = action.payload;
            const item = state.items.find((item) => item.variantId === variantId);
            if (item) {
                item.quantity += 1;
            }
        },
        decreaseQuantity: (state, action) => {
            const { variantId } = action.payload;
            const item = state.items.find((item) => item.variantId === variantId);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            } else {
                state.items = state.items.filter(
                    (item) => item.variantId !== variantId
                );
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;