import { Code2, BarChart, BrainCog, ShieldCheck, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function About() {
  return (
    <>
    <Navbar/>
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto py-10">
        <h1 className="text-4xl font-bold text-blue-700 mb-4">About FundFlow</h1>
        <p className="text-gray-700 text-lg">
          FundFlow is your smart companion for managing budgets and tracking expenses — enhanced with free AI insights.
        </p>
      </div>

      {/* Why Section */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4 text-center">Why FundFlow?</h2>
        <p className="text-gray-600 text-center mb-8">
          Most budgeting apps are cluttered, complicated, or pricey. FundFlow is designed to be clean, simple, insightful — and completely free.
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Feature icon={<BarChart className="text-blue-600" />} title="Track Spending" desc="Log income and expenses daily with smart visual summaries." />
          <Feature icon={<BrainCog className="text-purple-600" />} title="AI-Powered Insights" desc="Get spending tips and overspending alerts using simple rule-based logic (no external AI APIs required).

" />
          <Feature icon={<ShieldCheck className="text-green-600" />} title="Private & Secure" desc="All your data is protected, no third-party tracking." />
          <Feature icon={<Code2 className="text-orange-600" />} title="Open Tech Stack" desc="Built with Django REST + React + Tailwind + Recharts." />
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

function Feature({ icon, title, desc }) {
  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <div className="flex items-center space-x-2 mb-2">
        <div className="text-xl">{icon}</div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
