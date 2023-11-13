export const initialState = {
    user: null,
    projects: null
}

export const actionTypes = {
    SET_USER: "SET_USER",
    SET_PROJECTS: "SET_PROJECTS"
}

const reducer = (state, action) => {
    switch (action.type) {
        case actionTypes.SET_USER:
            return {
                ...state,
                user: action.user,
            };
        case actionTypes.SET_PROJECTS:
            return {
                ...state,
                projects: action.projects,
            };
        default: return state;
    }
}

export default reducer;