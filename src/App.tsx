import { MouseEvent, useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
// Watch out, it's not from 'tauri-plugin-sql-api'.
import Database from '@tauri-apps/plugin-sql';

type User = {
  name: string;
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [reactUser, setReactUser] = useState("");
  const [rustUser, setRustUser] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  async function getDbValueInReact(e: MouseEvent<HTMLButtonElement>): Promise<void> {
      e.preventDefault();
      // It's not necessary in this code, but you can also access the file location with Path API in TypeScript.
      // https://v2.tauri.app/reference/javascript/api/namespacepath/#appdatadir
      const db = await Database.load("sqlite:mydatabase.db");

      const result = await db.select<User[]>("SELECT name FROM users LIMIT 1");
      const firstUserName = result.length > 0 ? result[0].name : "No user found";
      setReactUser(firstUserName);
  }

  async function getDbValueInRust(e: MouseEvent<HTMLButtonElement>): Promise<void> {
    e.preventDefault();
    setRustUser(await invoke("get_db_value", {}));
}

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      <button onClick={(e) => getDbValueInReact(e)}>Get DB value from React</button>
      { reactUser && <p>{reactUser} from React!</p>}
      <button onClick={(e) => getDbValueInRust(e)}>Get DB value from Rust</button>
      { rustUser && <p>{rustUser} from Rust!</p>}
    </main>
  );
}

export default App;
