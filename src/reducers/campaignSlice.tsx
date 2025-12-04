import { createAsyncThunk, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store/strore";
import type { CampaignDetailsDto, CreateCampaignDto, UpdateCampaignDto } from "../services/campaignService";
import CampaignService from "../services/campaignService";

interface CampaignState {
  campaigns: CampaignDetailsDto[];
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  loading: false,
  error: null,
};

export const fetchCampaigns = createAsyncThunk("campaign/fetchAll", async () => {
  const data = await CampaignService.getAll();
  return data;
});

export const createCampaign = createAsyncThunk("campaign/create", async (dto: CreateCampaignDto) => {
  const id = await CampaignService.create(dto);
  return id;
});

export const updateCampaign = createAsyncThunk("campaign/update", async (dto: UpdateCampaignDto) => {
  await CampaignService.update(dto.id, dto);
  return dto;
});

export const deleteCampaign = createAsyncThunk("campaign/delete", async (id: string) => {
  await CampaignService.delete(id);
  return id;
});

export const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCampaigns.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCampaigns.fulfilled, (state, action: PayloadAction<CampaignDetailsDto[]>) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => { state.loading = false; state.error = action.error.message || "خطا در بارگذاری"; })

      .addCase(updateCampaign.fulfilled, (state, action: PayloadAction<UpdateCampaignDto>) => {
        const index = state.campaigns.findIndex(c => c.id === action.payload.id);
        if (index >= 0) state.campaigns[index] = { ...state.campaigns[index], ...action.payload };
      })
      .addCase(deleteCampaign.fulfilled, (state, action: PayloadAction<string>) => {
        state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
      });
  },
});

export const selectCampaigns = (state: RootState) => state.campaign;
export default campaignSlice.reducer;
