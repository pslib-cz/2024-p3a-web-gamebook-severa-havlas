import { useState, useEffect, useRef } from "react";
import { useGameContext } from "../../GameProvider";
import ChecklistImage from "../../assets/checklist.webp";
import styles from "./Checklist.module.css";
import { Link } from "react-router-dom";

const names = [
  "Unknown", "Jeff Swiatkovsky", "Erik Maria Bark", "Jona Magnus", "Björn Lorgbrog", "Sven Nordström", "Harald Isberg", "Sigurd Kvastsson", "Viggo Sørvik", "Einar Frostvik", "Anders Lundström", "Tore Eikfjell", "Lars Vindhaug", "Lapalus Vermeulen", "Frida Oeberg", "Sten Bjørneson", "Vidar Myrland", "Johann Amundsen", "Sigmund Oerberg", "Finn van der Nordhagen"
];

const fates = [
  "Unknown", "Alive", "Avalanche", "Disease", "Executed", "Fall (cliff)", "Fall (ice wall)", "Killed", "Rebellion", "Starvation"
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

const Checklist = () => {
  const { checklist, setChecklist } = useGameContext();
  const defaultPeople = Array.from({ length: 19 }, (_, i) => ({
    id: i + 1,
    name: "Unknown",
    fate: "Unknown",
  }));

  const [people, setPeople] = useState(defaultPeople);
  const [confirmedPairs, setConfirmedPairs] = useState(new Set());
  const [isClosed, setIsClosed] = useState(true);
  const prevPeopleRef = useRef<{ id: number; name: string; fate: string; }[] | null>(null);

  useEffect(() => {
    if (checklist) {
      try {
        const parsedChecklist = JSON.parse(checklist);
        if (Array.isArray(parsedChecklist)) {
          setPeople(parsedChecklist);
        }
      } catch (error) {
        console.error("Failed to parse checklist: ", error);
      }
    }
  }, []);

  useEffect(() => {
    if (prevPeopleRef.current && JSON.stringify(prevPeopleRef.current) !== JSON.stringify(people)) {
      setChecklist(JSON.stringify(people));
    }
    prevPeopleRef.current = people;
  }, [people, setChecklist]);

  useEffect(() => {
    let isSolve: boolean = false;
    let correctCount = 0;
    const newConfirmedPairs = new Set(confirmedPairs);
    people.forEach((person) => {
      if (correctPairs.some(pair => pair.name === person.name && pair.fate === person.fate)) {
        correctCount++;
        newConfirmedPairs.add(person.id);
      }
    });
    if (correctCount % 3 === 0 && correctCount !== confirmedPairs.size) {
      setConfirmedPairs(newConfirmedPairs);
    }
    if (correctCount === correctPairs.length) {
      isSolve = true;
    }
  }, [people]);

  const updatePerson = (id: number, key: 'name' | 'fate', value: string) => {
    setPeople((prevPeople) =>
      prevPeople.map((person) =>
        person.id === id ? { ...person, [key]: value } : person
      )
    );
  };

  const usedNames = new Set(people.map((p) => p.name).filter((name) => name !== "Unknown"));

  const toggleChecklist = () => setIsClosed((prev) => !prev);

  return (
    <>
      <button className={styles.toggleButton} onClick={toggleChecklist}>
        <img className={styles.image} src={ChecklistImage} />
      </button>

      <div className={`${styles.checklistContent} ${isClosed ? styles.closed : styles.expanded}`}>
        <h2>Checklist</h2>
        <table className={styles.table}>
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
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                    >
                      {names.filter(name => !usedNames.has(name) || name === person.name).map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td>
                  {confirmedPairs.has(person.id) ? (
                    <span>{person.fate}</span>
                  ) : (
                    <select
                      value={person.fate}
                      onChange={(e) => updatePerson(person.id, "fate", e.target.value)}
                    >
                      {fates.map((fate) => (
                        <option key={fate} value={fate}>{fate}</option>
                      ))}
                    </select>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* <Link to="/">Well Done</Link> */}
      </div>
    </>
  );
};

export default Checklist;
