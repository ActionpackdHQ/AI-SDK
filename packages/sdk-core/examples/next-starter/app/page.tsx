import { Demo } from '../components/client/Demo';

export default function Home(): JSX.Element {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Actionpackd AI SDK Demo
        </h1>
        <Demo />
      </div>
    </main>
  );
}
