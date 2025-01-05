import React, { useState } from "react";
import "../App.css";

type Person = {
  id: number; // Row number
  name: string | null; // Name of the person
  fate: string | null; // How they ended
};

const names = [
  "Unknown",
  "John Smith",
  "Jane Doe",
  "William Turner",
  "Elizabeth Swann",
];

const fates = [
  "Unknown",
  "Alive",
  "Drowned",
  "Killed by Beast",
  "Fell Overboard",
  "Shot",
];

const ObraDinnTable = () => {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: null, fate: null },
    { id: 2, name: null, fate: null },
    { id: 3, name: null, fate: null },
    { id: 4, name: null, fate: null },
    { id: 5, name: null, fate: null },
  ]);

  const [collapsed, setCollapsed] = useState(false); // State to toggle collapse

  // Update a specific person's name or fate
  const updatePerson = (id: number, key: "name" | "fate", value: string) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, [key]: value } : person
      )
    );
  };

  return (
    <div className="table-container" style={{ width: collapsed ? "50px" : "auto" }}>
      <button
        className="collapse-button"
        onClick={() => setCollapsed(!collapsed)}
        style={{
            width: "50px",
            height: "50px",
          
          transform: collapsed ? "rotate(180deg)" : "none",
        }}
      >
        {collapsed ? "→" : "←"}
      </button>

      {!collapsed && (
        <>
          <h2>Obra Dinn Table</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Fate</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.id}>
                  <td>{person.id}</td>
                  <td>
                    <select
                      value={person.name || ""}
                      onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                    >
                      <option value="" disabled>
                        Select Name
                      </option>
                      {names.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={person.fate || ""}
                      onChange={(e) => updatePerson(person.id, "fate", e.target.value)}
                    >
                      <option value="" disabled>
                        Select Fate
                      </option>
                      {fates.map((fate) => (
                        <option key={fate} value={fate}>
                          {fate}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default ObraDinnTable;
