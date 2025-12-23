import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import ChallengeService, { type CreateChallengeDto, type UpdateChallengeDto, type ChallengeDto } from "../services/challengeService";

interface ChallengeState {
  challenges: ChallengeDto[];
  loading: boolean;
  error: string | null;
}

const initialState: ChallengeState = {
  challenges: [],
  loading: false,
  error: null,
};

export const fetchChallenges = createAsyncThunk("challenge/fetchAll", async () => {
  return await ChallengeService.getAll();
});

export const createChallenge = createAsyncThunk(
  "challenge/create",
  async (dto: CreateChallengeDto) => {
    const id = await ChallengeService.create(dto);
    return { ...dto, id } as ChallengeDto;
  }
);

export const updateChallenge = createAsyncThunk(
  "challenge/update",
  async (dto: UpdateChallengeDto) => {
    await ChallengeService.update(dto);
    return dto as ChallengeDto;
  }
);

export const deleteChallenge = createAsyncThunk(
  "challenge/delete",
  async (id: string) => {
    await ChallengeService.delete(id);
    return id;
  }
);

export const startUserChallenge = createAsyncThunk(
  "challenge/start",
  async ({ challengeId, userId }: { challengeId: string; userId: string }) => {
    const userChallengeId = await ChallengeService.startChallenge(challengeId, userId);
    return { challengeId, userChallengeId };
  }
);

export const completeChallengeDay = createAsyncThunk(
  "challenge/completeDay",
  async ({ userChallengeId, day, reflection }: { userChallengeId: string; day: number; reflection?: string }) => {
    await ChallengeService.completeDay(userChallengeId, day, reflection);
    return { userChallengeId, day, reflection };
  }
);

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChallenges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChallenges.fulfilled, (state, action: PayloadAction<ChallengeDto[]>) => {
        state.loading = false;
        state.challenges = action.payload;
      })
      .addCase(fetchChallenges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch challenges";
      })
      .addCase(createChallenge.fulfilled, (state, action: PayloadAction<ChallengeDto>) => {
        state.challenges.push(action.payload);
      })
      .addCase(updateChallenge.fulfilled, (state, action: PayloadAction<ChallengeDto>) => {
        state.challenges = state.challenges.map(c =>
          c.id === action.payload.id ? action.payload : c
        );
      })
      .addCase(deleteChallenge.fulfilled, (state, action: PayloadAction<string>) => {
        state.challenges = state.challenges.filter(c => c.id !== action.payload);
      });
  },
});

export default challengeSlice.reducer;
