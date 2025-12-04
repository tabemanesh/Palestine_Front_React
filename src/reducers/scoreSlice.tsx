import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/strore";
import type { CreateScoreDto, ScoreDetailsDto } from "../services/scoreService";
import ScoreService from "../services/scoreService";

interface ScoreState {
  scores: ScoreDetailsDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ScoreState = {
  scores: [],
  loading: false,
  error: null,
};

export const fetchScores = createAsyncThunk("score/fetchAll", async () => {
  return await ScoreService.getAll();
});

export const createScore = createAsyncThunk("score/create", async (dto: CreateScoreDto) => {
  const id = await ScoreService.create(dto);
  return id;
});

export const deleteScore = createAsyncThunk("score/delete", async (id: string) => {
  await ScoreService.delete(id);
  return id;
});

export const scoreSlice = createSlice({
  name: "score",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchScores.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchScores.fulfilled, (state, action: PayloadAction<ScoreDetailsDto[]>) => {
        state.loading = false;
        state.scores = action.payload;
      })
      .addCase(fetchScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "خطا در بارگذاری";
      })

      .addCase(deleteScore.fulfilled, (state, action: PayloadAction<string>) => {
        state.scores = state.scores.filter(s => s.id !== action.payload);
      });
  },
});

export const selectScores = (state: RootState) => state.score;
export default scoreSlice.reducer;
