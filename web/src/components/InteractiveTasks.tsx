'use client';

import { useState } from 'react';

const initial = [
  { id: 1, text: 'Book dentist appointment', done: true },
  { id: 2, text: 'Read chapter 4 of the design book', done: false },
  { id: 3, text: 'Draft the M0 spike notes', done: false }
];

export default function InteractiveTasks() {
  const [tasks, setTasks] = useState(initial);
  const toggle = (id: number) => setTasks((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const remaining = tasks.filter((t) => !t.done).length;

  return (
    <div className="widget-frame">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>Tasks · {remaining} left</strong>
        <span className="demo-tag">Interactive demo with sample data</span>
      </div>
      {tasks.map((task) => (
        <div key={task.id} className={`task-row${task.done ? ' done' : ''}`}>
          <input id={`task-${task.id}`} type="checkbox" checked={task.done} onChange={() => toggle(task.id)} aria-labelledby={`task-label-${task.id}`} />
          <span id={`task-label-${task.id}`}>{task.text}</span>
        </div>
      ))}
      <p className="caption" style={{ marginTop: '0.6rem' }}>The built-in list works fully offline with no account. Other task apps can come later through a provider interface.</p>
    </div>
  );
}
