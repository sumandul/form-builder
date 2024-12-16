import { createSlice } from "@reduxjs/toolkit";
import type { CaseReducer } from "@reduxjs/toolkit";
// import { setPasswordPattern } from "../../actions/common";

interface CommonState {
  passwordPattern: unknown;
}

const initialState: CommonState = {
  passwordPattern: null,
};

const setPasswordPattern: CaseReducer<
  CommonState
  //   PayloadAction<PromptDialogContentsType>
> = (state, action) => ({
  ...state,
  passwordPattern: action.payload || null,
});

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setPasswordPattern,
  },
});

export { commonSlice };

export default commonSlice.reducer;
