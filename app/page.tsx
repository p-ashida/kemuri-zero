"use client";

import { useEffect, useState } from "react";
import Setup from "@/components/Setup";
import Dashboard from "@/components/Dashboard";
import { clearProfile, loadProfile, saveProfile, type Profile } from "@/lib/storage";

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setProfile(loadProfile());
    setLoaded(true);
  }, []);

  const update = (next: Profile) => {
    saveProfile(next);
    setProfile(next);
  };

  if (!loaded) return <main className="container" />;

  if (!profile || editing) {
    return (
      <Setup
        initial={profile}
        onSave={(p) => {
          update(p);
          setEditing(false);
        }}
        onCancel={profile ? () => setEditing(false) : undefined}
      />
    );
  }

  return (
    <Dashboard
      profile={profile}
      onUpdate={update}
      onEdit={() => setEditing(true)}
      onReset={() => {
        clearProfile();
        setProfile(null);
      }}
    />
  );
}
