import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  search: '',
  role: 'All Roles',
  status: 'All Statuses',
  page: 1,
  perPage: 10
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users.push(action.payload);
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    }
  }
});

export const { setUsers, setSearch, setRole, setStatus, setPage, setPerPage, addUser } = userSlice.actions;
export default userSlice.reducer;