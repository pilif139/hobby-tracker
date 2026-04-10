import { createFileRoute } from '@tanstack/react-router';
import { requireAuth } from '@/modules/auth/route-guards';

export const Route = createFileRoute('/')({
  beforeLoad: requireAuth,
  component: App,
});

function App() {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome to Hobby Tracker!</h1>
    </div>
  );
}
