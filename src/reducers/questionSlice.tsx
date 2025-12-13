// store/questionSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Question {
  questionId: string;
  userId: string;
  text: string;
}

interface QuestionState {
  questions: Question[];
  answers: Record<string, string>;
}

const initialState: QuestionState = {
  questions: [],
  answers: {},
};

const questionSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    },
    addAnswer: (state, action: PayloadAction<{ questionId: string; answer: string }>) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    clearQuestions: (state) => {
      state.questions = [];
      state.answers = {};
    },
  },
});

export const { addQuestion, addAnswer, clearQuestions } = questionSlice.actions;
export default questionSlice.reducer;
