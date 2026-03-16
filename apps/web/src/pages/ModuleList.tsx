import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Module } from '@culinary/shared';

export default function ModuleList() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/modules').then(res => {
      setModules(res.data.data);
      setLoading(false);
    });
  }, []);

  const colors = [
    'bg-red-50 border-red-200',
    'bg-orange-50 border-orange-200',
    'bg-yellow-50 border-yellow-200',
    'bg-green-50 border-green-200',
    'bg-teal-50 border-teal-200',
    'bg-blue-50 border-blue-200',
    'bg-indigo-50 border-indigo-200',
    'bg-purple-50 border-purple-200',
  ];

  if (loading) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-culinary-brown">📚 Curriculum Modules</h1>
        <p className="text-gray-600 mt-2">Explore all {modules.length} modules covering the complete culinary arts curriculum</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod, i) => (
          <Link key={mod._id} to={`/modules/${mod._id}`}
            className={`border-2 ${colors[i % colors.length]} rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between mb-2">
              <span className="text-2xl font-black text-gray-400">{mod.code}</span>
              <span className="text-xs bg-white/80 text-gray-500 px-2 py-0.5 rounded-full border">
                {mod.objectives.length} objectives
              </span>
            </div>
            <h2 className="font-bold text-gray-800 text-sm leading-tight">{mod.title}</h2>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{mod.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
