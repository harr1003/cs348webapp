import "../styles/notes.css";
import "../styles/edit.css";
import { useEffect, useState } from "react";
import "../styles/character.css";
import { useAuthContext } from "../hooks/useAuthContext";
import { useCharContext } from "../hooks/useCharContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import { FaTrashAlt, FaEdit, FaFilter } from "react-icons/fa";

const Characters = () => {
  const { characters, charDispatch } = useCharContext();
  const { user } = useAuthContext();
  const [allChars, setAllChars] = useState();
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedCharacter, setEditedCharacter] = useState({
    gender: "",
    race: "",
    age: "",
    haircolor: "",
    hairtexture: "",
    eyecolor: "",
    height: "",
    weight: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    gender: "",
    race: "",
    age: "",
    haircolor: "",
    hairtexture: "",
    eyecolor: "",
    height: "",
    weight: "",
  });
  const [stats, setStats] = useState({
    avgAge: "",
    maxHeight: "",
    minHeight: "",
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCharacter, setFilterCharacter] = useState("");
  const [haircolors, setHaircolors] = useState();
  const [showStats, setShowStats] = useState(false);

  const fetchCharacters = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/characters", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok && json.success) {
        charDispatch({ type: "SET_CHARACTERS", payload: json.data });
        setAllChars(json.data);

        if (json.stats) {
          charDispatch({ type: "SET_STATS", payload: json.stats });
        }
      } else {
        console.error("Error fetching characters:", json);
      }
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCharacters();
    }
  }, [user]);

  useEffect(() => {
    if (allChars != null) {
      setHaircolors([...new Set(allChars.map((char) => char.haircolor))]);
    }
  }, [allChars]);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/characters/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (response.ok) {
        charDispatch({ type: "DELETE_CHARACTER", payload: id });
        fetchCharacters();
      } else {
        console.error("Failed to delete character");
      }
    } catch (error) {
      console.error("Error deleting character: ", error);
    }
  };

  const handleEdit = async (char) => {
    setEditedCharacter(char);
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
        `http://localhost:5000/api/characters/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(editedCharacter),
        }
      );
      const curr_character = await response.json();
      console.log("API response", curr_character);

      if (response.ok) {
        charDispatch({
          type: "UPDATE_CHARACTER",
          payload: curr_character.data,
        });
        setShowEditForm(false);
      } else {
        console.error("Failed to update character: ", curr_character.message);
      }
    } catch (error) {
      console.error("Error updating character: ", error);
    }
  };

  // handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      console.error("No user is logged in");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/api/characters/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newCharacter),
      });
      const character = await response.json();
      console.log("API response", character);

      if (response.ok) {
        if (!character.createdAt) {
          console.warn(
            "Warning: New character is missing createdAt",
            character
          );
        }
        fetchCharacters();
        charDispatch({ type: "CREATE_CHARACTER", payload: character });
        setShowForm(false);
        setNewCharacter({
          name: "",
          gender: "",
          race: "",
          age: "",
          haircolor: "",
          hairtexture: "",
          eyecolor: "",
          height: "",
          weight: "",
        });
      } else {
        console.error("Failed to add character: ", character.message);
      }
    } catch (error) {
      console.error("Error adding character: ", error);
    }
  };

  const fetchFilteredCharacters = async () => {
    try {
      const queryParams = new URLSearchParams({
        haircolor: filterCharacter || "",
        includeStats: "true",
      }).toString();

      console.log(`/characters?${queryParams}`);

      const response = await fetch(
        `http://localhost:5000/api/characters?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const json = await response.json();

      if (response.ok && json.success) {
        charDispatch({ type: "SET_CHARACTERS", payload: json.data });

        if (json.stats) {
          charDispatch({ type: "SET_STATS", payload: json.stats });
          console.log(json.stats);
          setStats(json.stats);
        }
      } else {
        console.error("Error fetching filtered characters:", json);
      }
      console.log(json.data);
    } catch (error) {
      console.error("Fetch error: ", error);
    }
  };

  const clearFilters = () => {
    setFilterCharacter("");
    fetchCharacters();
  };

  return (
    <>
      <div className="notes-header">
        <button
          className="filter-btn"
          onClick={() => {
            setFilterOpen(!filterOpen);
          }}
        >
          <FaFilter /> Filter
        </button>
        {filterOpen && (
          <div className="filter-panel">
            <select
              value={filterCharacter}
              onChange={(e) => setFilterCharacter(e.target.value)}
            >
              <option value="">All Hair Colors</option>
              {haircolors &&
                haircolors.map((color, index) => (
                  <option key={index} value={color}>
                    {color}
                  </option>
                ))}
            </select>
            <button onClick={fetchFilteredCharacters}>Apply Filter</button>
            <button onClick={clearFilters}>Clear</button>
            <button onClick={() => setShowStats(true)}>Show Stats</button>
            {showStats && (
              <>
                <h2>maxHeight: {stats.maxHeight}</h2>
                <h2>minHeight: {stats.minHeight}</h2>
                <h2>avgAge: {stats.avgAge}</h2>
                <button onClick={() => setShowStats(false)}>Hide Stats</button>
              </>
            )}
          </div>
        )}
      </div>
      <div className="characters-container">
        <div
          className="character-box add-character"
          onClick={() => setShowForm(true)}
        >
          <p>+ Add Character</p>
        </div>

        {characters &&
          Array.isArray(characters) &&
          !characters.error &&
          characters.map((char) => {
            const createdAtDate = new Date(char.createdAt);
            const formattedDate = isNaN(createdAtDate.getTime())
              ? "now"
              : formatDistanceToNow(createdAtDate, { addSuffix: true });
            return (
              <div key={char._id} className="character-box">
                <button className="edit-btn" onClick={() => handleEdit(char)}>
                  <FaEdit />
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(char._id)}
                >
                  <FaTrashAlt />
                </button>
                <h3 className="header3">{char.name}</h3>
                <p>
                  <strong>Gender:</strong> {char.gender}
                </p>
                <p>
                  <strong>Race:</strong> {char.race}
                </p>
                <p>
                  <strong>Age:</strong> {char.age}
                </p>
                <p>
                  <strong>Hair Color:</strong> {char.haircolor}
                </p>
                <p>
                  <strong>Hair Texture:</strong> {char.hairtexture}
                </p>
                <p>
                  <strong>Eye Color:</strong> {char.eyecolor}
                </p>
                <p>
                  <strong>Height(in):</strong> {char.height}
                </p>
                <p>
                  <strong>Weight(lbs):</strong> {char.weight}
                </p>

                <p>Created {formattedDate}</p>
              </div>
            );
          })}

        {showEditForm && editedCharacter && (
          <div className="character-form-overlay">
            <div className="character-form">
              <h2>Edit Character</h2>
              <form onSubmit={(e) => handleUpdate(e, editedCharacter._id)}>
                <label htmlFor="Name">Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={editedCharacter.name}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      name: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Gender">Gender</label>
                <input
                  type="text"
                  placeholder="Gender"
                  value={editedCharacter.gender}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      gender: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Race">Race</label>
                <input
                  type="text"
                  placeholder="Race"
                  value={editedCharacter.race}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      race: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Age">Age</label>
                <input
                  type="number"
                  placeholder="Age"
                  value={editedCharacter.age}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      age: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Hair Color">Hair Color</label>
                <input
                  type="text"
                  placeholder="Hair Color"
                  value={editedCharacter.haircolor}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      haircolor: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Hair Texture">Hair Texture</label>
                <input
                  type="text"
                  placeholder="Hair Texture"
                  value={editedCharacter.hairtexture}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      hairtexture: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Eye Color">Eye Color</label>
                <input
                  type="text"
                  placeholder="Eye Color"
                  value={editedCharacter.eyecolor}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      eyecolor: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Height (in)">Height (in)</label>
                <input
                  type="number"
                  placeholder="Height (in)"
                  value={editedCharacter.height}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      height: e.target.value,
                    })
                  }
                  required
                />
                <label htmlFor="Weight (lbs)">Weight (lbs)</label>
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={editedCharacter.weight}
                  onChange={(e) =>
                    setEditedCharacter({
                      ...editedCharacter,
                      weight: e.target.value,
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
          <div className="character-form-overlay">
            <div className="character-form">
              <h2>Add Character</h2>
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Name"
                  value={newCharacter.name}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, name: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Gender"
                  value={newCharacter.gender}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, gender: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Race"
                  value={newCharacter.race}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, race: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Age"
                  value={newCharacter.age}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, age: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Hair Color"
                  value={newCharacter.haircolor}
                  onChange={(e) =>
                    setNewCharacter({
                      ...newCharacter,
                      haircolor: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Hair Texture"
                  value={newCharacter.hairtexture}
                  onChange={(e) =>
                    setNewCharacter({
                      ...newCharacter,
                      hairtexture: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Eye Color"
                  value={newCharacter.eyecolor}
                  onChange={(e) =>
                    setNewCharacter({
                      ...newCharacter,
                      eyecolor: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Height (in)"
                  value={newCharacter.height}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, height: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Weight (lbs)"
                  value={newCharacter.weight}
                  onChange={(e) =>
                    setNewCharacter({ ...newCharacter, weight: e.target.value })
                  }
                  required
                />
                <button type="submit">+ Add Character</button>
                <button type="button" onClick={() => setShowForm(false)}>
                  X Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Characters;
