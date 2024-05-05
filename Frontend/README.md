# Visual Draft

The project is a web application designed to facilitate diagram creation and document editing simultaneously. It includes document view and flow diagram view on same screen. so you can create doc and flow diagram at a same time.

## Features

- Diagram Creation: Users can create diagrams.
- Document Editing: Allows users to create and edit documents.
- Project: Creating and managing multiple projects.
- Live Storage: Utilizes realtime db to store user work in real-time.
- Authentication: Integrated user authentication for secure access.

## Demo

https://visualdraft-ef6no5ykz-mosam219s-projects.vercel.app

## Tech Stack

**Client:** React, Jotai, TailwindCSS, Roughjs, QuillJs, shadecn

**Database:** ConvexDB (realtime)

## Future Collaborative Features (Planned)

In future iterations, the project aims to integrate Socket.IO to enable real-time collaboration among multiple users. The envisioned features include:

- Real-time Collaboration: Allow multiple users to work together on diagrams and documents.
- Simultaneous Editing: Enable simultaneous editing with live updates.
- User Presence: Display online users and their activities within the project.
- Shared Workspace: Provide a shared workspace for collaborative work.

## Installation

```
  git clone  https://github.com/Mosam219/VisualDraft.git
  cd VisualDraft
  npm run dev
  npx convex dev
```
