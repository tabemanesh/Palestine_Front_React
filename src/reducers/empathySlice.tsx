import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/strore";
import type { CreateEmpathyDto, EmpathyDetailsDto, UpdateEmpathyDto } from "../services/EmpathyService";
import EmpathyService from "../services/EmpathyService";


interface EmpathyState {
  empathies: EmpathyDetailsDto[];
  loading: boolean;
  error: string | null;
}

const initialState: EmpathyState = {
  empathies: [],
  loading: false,
  error: null,
};

export const fetchEmpathies = createAsyncThunk("empathy/fetchAll", async () => {
  const data = await EmpathyService.getAll();
  return data;
});

export const createEmpathy = createAsyncThunk("empathy/create", async (dto: CreateEmpathyDto) => {
  const id = await EmpathyService.create(dto);
  return id;
});

export const updateEmpathy = createAsyncThunk("empathy/update", async (dto: UpdateEmpathyDto) => {
  await EmpathyService.update(dto.id, dto);
  return dto;
});

export const deleteEmpathy = createAsyncThunk("empathy/delete", async (id: string) => {
  await EmpathyService.delete(id);
  return id;
});

export const empathySlice = createSlice({
  name: "empathy",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmpathies.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchEmpathies.fulfilled, (state, action: PayloadAction<EmpathyDetailsDto[]>) => {
        state.loading = false;
        state.empathies = action.payload;
      })
      .addCase(fetchEmpathies.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "خطا در بارگذاری"; })

      .addCase(updateEmpathy.fulfilled, (state, action: PayloadAction<UpdateEmpathyDto>) => {
        const index = state.empathies.findIndex(e => e.id === action.payload.id);
        if (index >= 0) state.empathies[index] = { ...state.empathies[index], ...action.payload };
      })
      .addCase(deleteEmpathy.fulfilled, (state, action: PayloadAction<string>) => {
        state.empathies = state.empathies.filter(e => e.id !== action.payload);
      });
  },
});

export const selectEmpathies = (state: RootState) => state.empathy;
export default empathySlice.reducer;
