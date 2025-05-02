import { useContext } from "react";
import { NotesContext } from "../context/NotesContext";

export const useNoteContext = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw Error("useNoteContext must be used inside a NotesContextProvider");
  }
  return context;
};
