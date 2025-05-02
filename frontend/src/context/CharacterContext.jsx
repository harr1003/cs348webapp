import { createContext, useReducer } from "react";

export const CharactersContext = createContext();

export const charactersReducer = (state, action) => {
  switch (action.type) {
    case "SET_CHARACTERS":
      return {
        characters: action.payload,
      };
    case "CREATE_CHARACTER":
      return {
        characters: [action.payload, ...state.characters],
      };
    case "DELETE_CHARACTER":
      return {
        characters: state.characters.filter(
          (w) => w._id !== action.payload._id
        ),
      };
    case "UPDATE_CHARACTER":
      return {
        characters: state.characters.map((char) =>
          char._id === action.payload._id ? action.payload : char
        ),
      };
    case "SET_STATS":
      return {
        ...state,
        stats: action.payload,
      };
    default:
      return state;
  }
};

export const CharactersContextProvider = ({ children }) => {
  const [state, charDispatch] = useReducer(charactersReducer, {
    characters: null,
  });

  return (
    <CharactersContext.Provider value={{ ...state, charDispatch }}>
      {children}
    </CharactersContext.Provider>
  );
};
