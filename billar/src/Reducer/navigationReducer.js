const initialState = {
  navigation: false,
};
export default (state, action) => {
  if (!state) return initialState;

  if (action.component == 'navigation') {
    state = {...state};
  }
  return state;
};
