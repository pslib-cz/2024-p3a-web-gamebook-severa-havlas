import React, { useState, useEffect } from "react";
import "../App.css";

type Person = {
  id: number; // Row number
  name: string | null; // Name of the person
  fate: string | null; // How they ended
};

const names = [
  "Unknown",
  "Jeff Swiatkovsky",
  "Erik Maria Bark",
  "Jona Magnus",
  "Björn Lorgbrog",
  "Sven Nordström",
  "Harald Isberg",
  "Sigurd Kvastsson",
  "Viggo Sørvik",
  "Einar Frostvik",
  "Anders Lundström",
  "Tore Eikfjell",
  "Lars Vindhaug",
  "Lapalus Vermeulen",
  "Frida Oeberg",
  "Sten Bjørneson",
  "Vidar Myrland",
  "Johann Amundsen",
  "Sigmund Oerberg",
  "Finn van der Nordhagen",
];

const fates = [
  "Unknown",
  "Alive",
  "Avalanche",
  "Disease",
  "Executed",
  "Fall (cliff)",
  "Fall (ice wall)",
  "Killed",
  "Rebellion",
  "Starvation",
];

const correctPairs = [
  { name: "Jeff Swiatkovsky", fate: "Avalanche" },
  { name: "Erik Maria Bark", fate: "Fall (ice wall)" },
  { name: "Jona Magnus", fate: "Fall (ice wall)" },
  { name: "Björn Lorgbrog", fate: "Fall (ice wall)" },
  { name: "Sven Nordström", fate: "Rebellion" },
  { name: "Harald Isberg", fate: "Rebellion" },
  { name: "Sigurd Kvastsson", fate: "Rebellion" },
  { name: "Viggo Sørvik", fate: "Rebellion" },
  { name: "Einar Frostvik", fate: "Rebellion" },
  { name: "Anders Lundström", fate: "Rebellion" },
  { name: "Tore Eikfjell", fate: "Rebellion" },
  { name: "Lars Vindhaug", fate: "Executed" },
  { name: "Lapalus Vermeulen", fate: "Alive" },
  { name: "Frida Oeberg", fate: "Disease" },
  { name: "Sten Bjørneson", fate: "Starvation" },
  { name: "Vidar Myrland", fate: "Starvation" },
  { name: "Johann Amundsen", fate: "Fall (cliff)" },
  { name: "Sigmund Oerberg", fate: "Killed" },
  { name: "Finn van der Nordhagen", fate: "Alive" },
];

const ObraDinnTable = () => {
  const [people, setPeople] = useState<Person[]>(Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    name: "",
    fate: "",
  })));

  const [collapsed, setCollapsed] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [confirmedPairs, setConfirmedPairs] = useState<Set<number>>(new Set());

  const checkIfCorrectPair = (name: string | null, fate: string | null) => {
    return correctPairs.some((pair) => pair.name === name && pair.fate === fate);
  };

  const updatePerson = (id: number, key: "name" | "fate", value: string) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, [key]: value } : person
      )
    );
  };

  const checkAndConfirmPairs = () => {
    const newConfirmedPairs = new Set<number>();
    let correctCount = 0;

    people.forEach((person) => {
      if (checkIfCorrectPair(person.name, person.fate)) {
        newConfirmedPairs.add(person.id);
        correctCount++;
      }
    });

    setCorrectAnswersCount(correctCount);

    // Pokud je správných odpovědí více než 3 nebo zbývají poslední nezkontrolované řádky
    if (correctCount >= confirmedPairs.size + 3 || correctCount === people.length) {
      setConfirmedPairs((prev) => {
        const updatedPairs = new Set<number>(prev);
        let addedCount = 0;

        people.forEach((person) => {
          if (
            !prev.has(person.id) &&
            checkIfCorrectPair(person.name, person.fate)
          ) {
            updatedPairs.add(person.id);
            addedCount++;
          }
        });

        return updatedPairs;
      });
    }
  };

  useEffect(() => {
    checkAndConfirmPairs();
  }, [people]);

  const usedNames = new Set(
    people
      .filter((person) => person.name && person.name !== "Unknown")
      .map((person) => person.name)
  );

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
                    {confirmedPairs.has(person.id) ? (
                      <span>{person.name}</span>
                    ) : (
                      <select
                        value={person.name || ""}
                        onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                      >
                        <option value="" disabled>
                          Select Name
                        </option>
                        {names
                          .filter((name) => !usedNames.has(name) || name === person.name)
                          .map((name) => (
                            <option key={name} value={name}>
                              {name}
                            </option>
                          ))}
                      </select>
                    )}
                  </td>
                  <td>
                    {confirmedPairs.has(person.id) ? (
                      <span>{person.fate}</span>
                    ) : (
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
                    )}
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
