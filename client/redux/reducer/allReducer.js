import { FAILED } from "../action";

const INITIAL_STATE = {
  error_msg: {},
};

const handleReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FAILED: {
      return Object.assign({}, state, { error_msg: action.data.error_msg });
    }

    default:
      return state;
  }
};
export default handleReducer;
