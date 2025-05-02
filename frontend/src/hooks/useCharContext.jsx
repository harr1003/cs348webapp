import { useContext } from "react";
import { CharactersContext } from "../context/CharacterContext";

export const useCharContext = () => {
  const context = useContext(CharactersContext);
  if (!context) {
    throw Error(
      "useCharContext must be used inside a CharactersContextProvider"
    );
  }
  return context;
};
