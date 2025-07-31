import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    categories: [/* same initial dummy data */]
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        fetchCategories: (state) => state,
        activateCategory: (state, action) => {
            const cat = state.categories.find(c => c.id === action.payload);
            if (cat) cat.status = 'Active';
        },
        deactivateCategory: (state, action) => {
            const cat = state.categories.find(c => c.id === action.payload);
            if (cat) cat.status = 'Inactive';
        },
        deleteCategory: (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload);
        },
        addCategory: (state, action) => {
            const newId = state.categories.length ? Math.max(...state.categories.map(c => c.id)) + 1 : 1;
            state.categories.push({ ...action.payload, id: newId });
        },
        editCategory: (state, action) => {
            const index = state.categories.findIndex(c => c.id === action.payload.id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        }
    }
});

export const {
    fetchCategories,
    activateCategory,
    deactivateCategory,
    deleteCategory,
    addCategory,
    editCategory
} = categorySlice.actions;

export default categorySlice.reducer;
