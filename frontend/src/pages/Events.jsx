import "../styles/notes.css";
import "../styles/edit.css";
import { useEffect, useState } from "react";
import "../styles/event.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEventContext } from "../hooks/useEventContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const Events = () => {
  const { events, eventDispatch } = useEventContext();
  const { user } = useAuthContext();
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    order: "",
  });
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedEvent, setEditedEvent] = useState({
    title: "",
    description: "",
    order: "",
  });

  const fetchEvents = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
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
      fetchEvents();
    }
  });

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        eventDispatch({ type: "DELETE_EVENT", payload: id });
        fetchEvents();
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleEdit = async (event) => {
    setEditedEvent(event);
    setShowEditForm(true);
  };

  const handleUpdate = async (e, id) => {
    e.preventDefault();
    console.log("id: ", id);

    if (!user) {
      console.error("No user is logged in");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(editedEvent),
        }
      );
      const curr_event = await response.json();
      console.log("API response", curr_event);

      if (response.ok) {
        eventDispatch({
          type: "UPDATE_EVENT",
          payload: curr_event.data,
        });
        setShowEditForm(false);
        fetchEvents();
      } else {
        console.error("Failed to update event: ", curr_event.message);
      }
    } catch (error) {
      console.error("Error updating event: ", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("No user is logged in");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/events/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newEvent),
        }
      );
      const event = await response.json();
      console.log("API response", event);

      if (response.ok) {
        fetchEvents();
        eventDispatch({ type: "CREATE_EVENT", payload: event });
        setShowForm(false);
        setNewEvent({
          title: "",
          description: "",
          order: "",
        });
      } else {
        console.error("Failed to add event: ", event.message);
      }
    } catch (error) {
      console.error("Error adding event: ", error);
    }
  };

  return (
    <div className="events-container">
      <div className="event-box add-event" onClick={() => setShowForm(true)}>
        <p>+ Add Event</p>
      </div>

      {events &&
        Array.isArray(events) &&
        !events.error &&
        events.map((event) => {
          const createdAtDate = new Date(event.createdAt);
          const formattedDate = isNaN(createdAtDate.getTime())
            ? "now"
            : formatDistanceToNow(createdAtDate, { addSuffix: true });
          return (
            <div key={event._id} className="event-box">
              <button className="edit-btn" onClick={() => handleEdit(event)}>
                <FaEdit />
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(event._id)}
              >
                <FaTrashAlt />
              </button>
              <h3 className="header3">{event.name}</h3>
              <p>
                <strong>Title:</strong> {event.title}
              </p>
              <p>
                <strong>Description:</strong> {event.description}
              </p>
              <p>
                <strong>Chapter:</strong> {event.order}
              </p>

              <p>Created {formattedDate}</p>
            </div>
          );
        })}
      {showEditForm && editedEvent && (
        <div className="character-form-overlay">
          <div className="character-form">
            <h2>Edit Character</h2>
            <form onSubmit={(e) => handleUpdate(e, editedEvent._id)}>
              <label htmlFor="Title">Title</label>
              <input
                type="text"
                placeholder="Title"
                value={editedEvent.title}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    title: e.target.value,
                  })
                }
                required
              />
              <label htmlFor="Description">Description</label>
              <input
                type="text"
                placeholder="Description"
                value={editedEvent.description}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    description: e.target.value,
                  })
                }
                required
              />
              <label htmlFor="Chapter">Chapter</label>
              <input
                type="number"
                placeholder="Chapter"
                value={editedEvent.order}
                onChange={(e) =>
                  setEditedEvent({
                    ...editedEvent,
                    order: e.target.value,
                  })
                }
                required
              />

              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setShowEditForm(false)}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {showForm && (
        <div className="event-form-overlay">
          <div className="event-form">
            <h2>Add Event</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Chapter"
                value={newEvent.order}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, order: e.target.value })
                }
                required
              />
              <button type="submit">+ Add Event</button>
              <button type="button" onClick={() => setShowForm(false)}>
                X Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
