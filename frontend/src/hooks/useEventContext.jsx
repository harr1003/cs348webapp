import { useContext } from "react";
import { EventsContext } from "../context/EventsContext";

export const useEventContext = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw Error("useEventContext must be used inside a EventsContextProvider");
  }
  return context;
};
