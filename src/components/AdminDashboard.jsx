import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AdminDashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      const snapshot = await getDocs(collection(db, 'campaigns'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Sort by submission date (descending)
      data.sort((a, b) => {
        const aDate = a.createdAt?.toDate?.() || 0;
        const bDate = b.createdAt?.toDate?.() || 0;
        return bDate - aDate;
      });

      setCampaigns(data);
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c =>
    (c.brandName?.toLowerCase().includes(search.toLowerCase()) ||
     c.creativeHook?.toLowerCase().includes(search.toLowerCase()) ||
     c.category?.toLowerCase().includes(search.toLowerCase()) ||
     c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
     c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
     c.email?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white p-8 font-sans text-black">
      <h1 className="text-4xl font-bold text-red-700 mb-6">Trudy Campaign Admin</h1>

      <input
        type="text"
        placeholder="Search by brand, person, email, hook, or category..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
      />

      <div className="overflow-auto rounded-xl shadow border border-gray-200">
        <table className="w-full table-auto text-sm">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Creative Hook</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">First Name</th>
              <th className="px-4 py-3 text-left">Last Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Submitted</th>
              <th className="px-4 py-3 text-left">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map(c => (
              <tr key={c.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-3">{c.brandName || '—'}</td>
                <td className="px-4 py-3">{c.creativeHook || '—'}</td>
                <td className="px-4 py-3">{c.category || '—'}</td>
                <td className="px-4 py-3">{c.firstName || c.name?.split(' ')[0] || '—'}</td>
                <td className="px-4 py-3">{c.lastName || c.name?.split(' ').slice(1).join(' ') || '—'}</td>
                <td className="px-4 py-3">{c.email || '—'}</td>
                <td className="px-4 py-3">{c.createdAt?.toDate?.().toLocaleString() || '—'}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => setSelected(c)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                  No campaigns found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full p-6 rounded-xl shadow-lg relative overflow-auto max-h-[90vh]">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-6 text-gray-500 hover:text-black text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-red-700">
              {selected.brandName} — {selected.creativeHook}
            </h2>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selected.evaluationHtml || '<p><em>No evaluation available.</em></p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
