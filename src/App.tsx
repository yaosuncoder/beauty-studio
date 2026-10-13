import {EditorCanvas} from './features/editor/EditorCanvas';

export default function App() {
  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Beauty Studio
      </h1>

      <EditorCanvas />
    </main>
  )
}