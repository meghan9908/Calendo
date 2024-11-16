'use client';
import axios from "axios";
import { useState, FormEvent } from "react";

export default function ProfileForm({existingUsername}:{existingUsername:string}){
    const [username, setUsername] = useState(existingUsername);
  const [isSaved, setIsSaved] = useState(false);

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    try {
      await axios.put("/api/profile", { username });
      setIsSaved(true);  // Set isSaved to true after a successful save
    } catch (error) {
      console.error("Failed to save username:", error);
      // Optionally, set isSaved to false or show an error message
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="max-w-xs mx-auto mt-10">
        <label>
          <span className="text-sm text-slate-600">Username: {username}</span>
          <input
            type="text"
            value={username}
            onChange={(ev) => {
              setUsername(ev.target.value);
              setIsSaved(false);  // Reset isSaved when the username is modified
            }}
            className="border border-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
          <div className="text-center">
            {isSaved ? (
              <button
                type="submit"
                className="btn-gray mt-2 !bg-green-300 !font-semibold !px-8 pointer-events-none"
                disabled
              >
                Username Saved
              </button>
            ) : (
              <button type="submit" className="btn-blue mt-2 !px-8">
                Save
              </button>
            )}
          </div>
        </label>
      </form>
    </div>
  );
}