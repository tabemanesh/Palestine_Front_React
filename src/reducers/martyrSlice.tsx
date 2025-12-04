import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import MartyrService, { type CreateMartyrDto, type MartyrDto, type UpdateMartyrDto } from "../services/martyrService";

interface MartyrState {
  martyrs: MartyrDto[];
  loading: boolean;
  error: string | null;
}

const initialState: MartyrState = {
  martyrs: [],
  loading: false,
  error: null,
};

export const fetchMartyrs = createAsyncThunk("martyr/fetchAll", async () => {
  return await MartyrService.getAll();
});

export const createMartyr = createAsyncThunk("martyr/create", async (dto: CreateMartyrDto) => {
  const id = await MartyrService.create(dto);
  return { ...dto, id: id } as MartyrDto;
});

export const updateMartyr = createAsyncThunk("martyr/update", async (dto: UpdateMartyrDto) => {
  await MartyrService.update(dto);
  return dto as MartyrDto;
});

export const deleteMartyr = createAsyncThunk("martyr/delete", async (id: string) => {
  await MartyrService.delete(id);
  return id;
});

const martyrSlice = createSlice({
  name: "martyr",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchMartyrs.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchMartyrs.fulfilled, (state, action: PayloadAction<MartyrDto[]>) => {
        state.loading = false;
        state.martyrs = action.payload;
      })
      .addCase(fetchMartyrs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch martyrs";
      })
      .addCase(createMartyr.fulfilled, (state, action: PayloadAction<MartyrDto>) => {
        state.martyrs.push(action.payload);
      })
      .addCase(updateMartyr.fulfilled, (state, action: PayloadAction<MartyrDto>) => {
        state.martyrs = state.martyrs.map(m => m.id === action.payload.id ? action.payload : m);
      })
      .addCase(deleteMartyr.fulfilled, (state, action: PayloadAction<string>) => {
        state.martyrs = state.martyrs.filter(m => m.id !== action.payload);
      });
  },
});

export default martyrSlice.reducer;
