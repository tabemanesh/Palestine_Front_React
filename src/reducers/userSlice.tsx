import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseDto, CreateUserDto, LoginUserDto, UpdateUserDto, UserDto } from "../services/userService";
import UserService from "../services/userService";
import type { RootState } from "../store/strore";


// ----------------- State -----------------
interface UserState {
  token: string | null;
  userId: string | null;
  userName: string | null;
  users: UserDto[];
  loading: boolean;
  error: string | null;
   profile: UserDto | null;
}

const initialState: UserState = {
  token: localStorage.getItem("auth_token"),
  userId: null,
  userName: null,
  profile:  null,
  users: [],
  loading: false,
  error: null,
};



export const fetchProfile = createAsyncThunk(
  "user/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserService.getProfile();
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "خطا در دریافت پروفایل");
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (dto: LoginUserDto, { rejectWithValue }) => {
    try {
      const res: AuthResponseDto= await UserService.login(dto);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "خطا در ورود");
    }
  }
);

export const logout = createAsyncThunk("user/logout", async () => {
  await UserService.logout();
  return;
});

export const register = createAsyncThunk(
  "user/register",
  async (dto: CreateUserDto, { rejectWithValue }) => {
    try {
      await UserService.register(dto);
      return;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "خطا در ثبت‌نام");
    }
  }
);

export const fetchUsers = createAsyncThunk("user/fetchAll", async () => {
  return await UserService.getAll();
});

export const createUser = createAsyncThunk("user/create", async (dto: CreateUserDto) => {
  const id = await UserService.create(dto);
  return id;
});

export const updateUser = createAsyncThunk("user/update", async (dto: UpdateUserDto) => {
  await UserService.update(dto);
  return dto;
});

export const deleteUser = createAsyncThunk("user/delete", async (id: string) => {
  await UserService.delete(id);
  return id;
});

// ----------------- Slice -----------------
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {

        builder
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserDto>) => {
        state.loading = false;
        state.profile = action.payload;
        state.userId = action.payload.id;
        state.userName = action.payload.userName;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });



    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<AuthResponseDto>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.userName = action.payload.userName;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
      state.userId = null;
      state.userName = null;
    });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Users CRUD
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
          state.users[index] = { ...state.users[index], ...action.payload };
        }
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export const selectUserState = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => !!state.user.token;
export const selectUserProfile = (state: RootState) => state.user.profile;
export default userSlice.reducer;
