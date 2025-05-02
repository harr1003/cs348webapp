import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import { CharactersContextProvider } from "./context/CharacterContext";
import App from "./App.jsx";
import React from "react";
import { EventsContextProvider } from "./context/EventsContext.jsx";
import { NotesContextProvider } from "./context/NotesContext.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <CharactersContextProvider>
        <EventsContextProvider>
          <NotesContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </NotesContextProvider>
        </EventsContextProvider>
      </CharactersContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
