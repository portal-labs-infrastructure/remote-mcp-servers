import { ServerForm } from '@/components/dashboard/server-form';

export default function AddNewServerPage() {
  return (
    <div className="container mx-auto py-8 max-w-xl px-4 md:px-6 w-full">
      <h1 className="text-3xl font-bold mb-8">Register New MCP Server</h1>
      <ServerForm />
    </div>
  );
}
