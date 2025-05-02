import { useState, useEffect } from "react";
import "../styles/note2.css";
import "../styles/edit.css";
import "../styles/filter.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCharContext } from "../hooks/useCharContext";
import { useNoteContext } from "../hooks/useNoteContext";
import { useEventContext } from "../hooks/useEventContext";
import { formatDistanceToNow } from "date-fns";
import { FaTrashAlt, FaEdit, FaFilter } from "react-icons/fa";

const Notes = () => {
  const { characters, charDispatch } = useCharContext();
  const { events, eventDispatch } = useEventContext();
  const { notes, noteDispatch } = useNoteContext();
  const { user } = useAuthContext();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedNote, setEditedNote] = useState({
    title: "",
    description: "",
    character: "",
    event: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCharacter, setFilterCharacter] = useState("");
  const [filterEvent, setFilterEvent] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok && json.success) {
        noteDispatch({ type: "SET_NOTES", payload: json.data });
      } else {
        console.error("Error fetching notes:", json);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const fetchCharacters = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/characters", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok && json.success) {
        charDispatch({ type: "SET_CHARACTERS", payload: json.data });
      } else {
        console.error("Error fetching characters:", json);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/events", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const json = await response.json();
      if (response.ok && json.success) {
        eventDispatch({ type: "SET_EVENTS", payload: json.data });
      } else {
        console.error("Error fetching events:", json);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCharacters();
      fetchEvents();
      fetchNotes();
    }
  }, [showForm]);

  const handleEdit = async (note) => {
    setSelectedCharacter(note.character_id);
    setSelectedEvent(note.event_id);
    setEditedNote(note);
    setShowEditForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      console.error("No user is logged in");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          title,
          description,
          event_id: selectedEvent,
          character_id: selectedCharacter,
        }),
      });

      const note = await response.json();
      if (response.ok) {
        noteDispatch({ type: "CREATE_NOTE", payload: note });
        setTitle("");
        setDescription("");
        setSelectedCharacter("");
        setSelectedEvent("");
        setShowForm(false);
      } else {
        console.error("Failed to add note: ", note.message);
      }
    } catch (error) {
      console.error("Error saving note: ", error);
    }
  };

  const fetchFilteredNotes = async () => {
    if (!user) return;
    const params = new URLSearchParams();
    if (filterCharacter) params.append("character_id", filterCharacter);
    if (filterEvent) params.append("event_id", filterEvent);

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const json = await response.json();
      if (response.ok && json.success) {
        noteDispatch({ type: "SET_NOTES", payload: json.data });
      } else {
        console.error("Error fetching filtered notes:", json);
      }
    } catch (error) {
      console.error("Filter fetch error:", error);
    }
  };

  const clearFilters = () => {
    setFilterCharacter("");
    setFilterEvent("");
    fetchNotes();
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log("id: ", id);

    if (!user) {
      console.error("No user is logged in");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(editedNote),
      });
      const curr_note = await response.json();
      console.log("API response", curr_note);

      if (response.ok) {
        noteDispatch({
          type: "UPDATE_NOTE",
          payload: curr_note.data,
        });
        setShowEditForm(false);
        fetchNotes();
      } else {
        console.error("Failed to update character: ", curr_note.message);
      }
    } catch (error) {
      console.error("Error updating character: ", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.ok) {
        noteDispatch({ type: "DELETE_NOTE", payload: id });
        fetchNotes();
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note: ", error);
    }
  };

  return (
    <>
      <div className="notes-header">
        <button
          className="filter-btn"
          onClick={() => setFilterOpen(!filterOpen)}
        >
          <FaFilter /> Filter
        </button>
        {filterOpen && (
          <div className="filter-panel">
            <select
              value={filterCharacter}
              onChange={(e) => setFilterCharacter(e.target.value)}
            >
              <option value="">All Characters</option>
              {characters &&
                characters.map((char) => (
                  <option key={char._id} value={char._id}>
                    {char.name}
                  </option>
                ))}
            </select>

            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
            >
              <option value="">All Events</option>
              {events &&
                events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.title}
                  </option>
                ))}
            </select>

            <button onClick={fetchFilteredNotes}>Apply Filters</button>
            <button onClick={clearFilters}>Clear</button>
          </div>
        )}
      </div>

      <div className="notes-container">
        <button className="note-box add-note" onClick={() => setShowForm(true)}>
          + Add Note
        </button>

        {notes &&
          Array.isArray(notes) &&
          !notes.error &&
          notes.map((note) => {
            const createdAtDate = new Date(note.createdAt);
            const formattedDate = isNaN(createdAtDate.getTime())
              ? "now"
              : formatDistanceToNow(createdAtDate.getTime());
            return (
              <div key={note._id} value={note._id} className="character-box">
                <button className="edit-btn" onClick={() => handleEdit(note)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(note._id)}
                >
                  <FaTrashAlt />
                </button>
                <h3 className="header3">{note.title}</h3>
                <p>
                  <strong>Note:</strong> {note.title}
                </p>
                <p>
                  <strong>Description:</strong> {note.description}
                </p>
                <p>
                  <strong>Character: </strong>
                  {characters?.find((char) => char._id === note.character_id)
                    ?.name || "Unknown"}
                </p>
                <p>
                  <strong>Event:</strong>{" "}
                  {events?.find((event) => event._id === note.event_id)
                    ?.title || "Unknown"}
                </p>
                <p>Created {formattedDate} ago</p>
              </div>
            );
          })}

        {showEditForm && editedNote && (
          <div className="character-form-overlay">
            <div className="character-form">
              <h2>Edit Character</h2>
              <form onSubmit={(e) => handleUpdate(e, editedNote._id)}>
                <label htmlFor="Title">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={editedNote.title}
                  onChange={(e) =>
                    setEditedNote({
                      ...editedNote,
                      title: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Description">Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  value={editedNote.description}
                  onChange={(e) =>
                    setEditedNote({
                      ...editedNote,
                      description: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Character">Character</label>
                <select
                  value={selectedCharacter}
                  onChange={(e) => {
                    setSelectedCharacter(e.target.value);
                    setEditedNote({
                      ...editedNote,
                      character_id: e.target.value,
                    });
                  }}
                >
                  <option value="">Select a Character</option>
                  {characters &&
                    !characters.error &&
                    characters.map((char) => (
                      <option key={char._id} value={char._id}>
                        {char.name}
                      </option>
                    ))}
                </select>
                <label htmlFor="Event">Event</label>
                <select
                  value={selectedEvent}
                  onChange={(e) => {
                    setSelectedEvent(e.target.value);
                    setEditedNote({
                      ...editedNote,
                      event_id: e.target.value,
                    });
                  }}
                >
                  <option value="">Select an Event</option>
                  {events &&
                    events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                </select>
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setShowEditForm(false)}>
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {showForm && (
          <div className="note-form-overlay" onClick={() => setShowForm(false)}>
            <div className="note-form" onClick={(e) => e.stopPropagation()}>
              <h2>New Note</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Write note here..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                ></textarea>

                <select
                  value={selectedCharacter}
                  onChange={(e) => setSelectedCharacter(e.target.value)}
                >
                  <option value="">Select a Character</option>
                  {characters &&
                    !characters.error &&
                    characters.map((char) => (
                      <option key={char._id} value={char._id}>
                        {char.name}
                      </option>
                    ))}
                </select>

                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                >
                  <option value="">Select an Event</option>
                  {events &&
                    events.map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                </select>

                <button type="submit">Save Note</button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Notes;
