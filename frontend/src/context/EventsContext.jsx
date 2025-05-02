import { createContext, useReducer } from "react";

export const EventsContext = createContext();

export const eventsReducer = (state, action) => {
  switch (action.type) {
    case "SET_EVENTS":
      return {
        events: action.payload,
      };
    case "CREATE_EVENTS":
      return {
        events: [action.payload, ...state.events],
      };
    case "DELETE_EVENT":
      return {
        events: state.events.filter((w) => w._id !== action.payload._id),
      };
    case "UPDATE_EVENT":
      return {
        events: state.events.map((event) =>
          event._id === action.payload._id ? action.payload : event
        ),
      };
    default:
      return state;
  }
};

export const EventsContextProvider = ({ children }) => {
  const [state, eventDispatch] = useReducer(eventsReducer, {
    events: null,
  });

  return (
    <EventsContext.Provider value={{ ...state, eventDispatch }}>
      {children}
    </EventsContext.Provider>
  );
};
