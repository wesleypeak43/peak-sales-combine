// Root layout — composes the screens. Generated from the prototype template.
import React from 'react';
import './template.css';
import { EntryScreen } from '../screens/EntryScreen';
import { AppShell } from '../screens/AppShell';

export function Template({ V }: { V: any }) {
  return (
    <div style={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
      <EntryScreen V={V} />
      <AppShell V={V} />
    </div>
  );
}
