import { Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-cream-100 flex flex-col max-w-mobile mx-auto">
      <div className="h-2 bg-green-600 w-full" />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}
