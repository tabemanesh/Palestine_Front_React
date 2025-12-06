import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/strore";
import type { CreateUserDto, UpdateUserDto, UserDto } from "../services/userService";
import UserService from "../services/userService";

interface UserState {
  users: UserDto[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  return await UserService.getAll();
});

export const createUser = createAsyncThunk("user/create", async (dto: CreateUserDto) => {
  const id = await UserService.create(dto);
  return id;
});

export const updateUser = createAsyncThunk("user/update", async (dto: UpdateUserDto) => {
  await UserService.update(dto);
  return dto; // برمی‌گردانیم تا state بروز شود
});

export const deleteUser = createAsyncThunk("user/delete", async (id: string) => {
  await UserService.delete(id);
  return id;
});

// Slice
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserDto[]>) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "خطا در بارگذاری کاربران";
      })

 

      .addCase(updateUser.fulfilled, (state, action: PayloadAction<UpdateUserDto>) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = {
            ...state.users[index],
            ...action.payload,
          };
        }
      })

      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export const selectUsers = (state: RootState) => state.user;
export default userSlice.reducer;
