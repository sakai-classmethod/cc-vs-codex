import TodoApp from "@/components/TodoApp";

export default function Home() {
  return (
    <div className="font-sans min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <main className="container mx-auto">
        <TodoApp />
      </main>
    </div>
  );
}
