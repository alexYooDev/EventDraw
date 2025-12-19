/**
 * OrganizationSettings Component
 * Allows administrators to manage organization branding and prizes
 */
import { useState, useEffect } from 'react';
import { organizationService, type Organization, type Prize } from '../services/organizationService';
import { useTheme } from '../contexts/ThemeContext';

export function OrganizationSettings() {
  const { theme, updatePrimaryColor } = useTheme();
  const [org, setOrg] = useState<Organization | null>(null);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [orgName, setOrgName] = useState('');
  const [primaryColor, setPrimaryColor] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  // Prize states
  const [editingPrize, setEditingPrize] = useState<Partial<Prize> | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const orgData = await organizationService.getMyOrg();
      setOrg(orgData);
      setOrgName(orgData.name);
      setPrimaryColor(orgData.primary_color || '');
      setLogoUrl(orgData.logo_url || '');

      const prizeData = await organizationService.getMyPrizes();
      setPrizes(prizeData.sort((a: Prize, b: Prize) => a.place - b.place));
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent duplicate submissions
    if (saving) return;
    
    setSaving(true);
    setMessage(null);
    try {
      const updated = await organizationService.updateMyOrg({
        name: orgName,
        primary_color: primaryColor,
        logo_url: logoUrl
      });
      setOrg(updated);
      if (updated.primary_color) {
        updatePrimaryColor(updated.primary_color);
      }
      setMessage({ type: 'success', text: 'Organization settings updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update organization settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePrize = async (id: number) => {
    if (!confirm('Are you sure you want to delete this prize?')) return;
    try {
      await organizationService.deletePrize(id);
      setPrizes(prizes.filter(p => p.id !== id));
      setMessage({ type: 'success', text: 'Prize deleted successfully.' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete prize.' });
    }
  };

  const handleSavePrize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPrize) return;
    
    // Prevent duplicate submissions
    if (saving) return;
    
    setSaving(true);
    try {
      if (editingPrize.id) {
        const updated = await organizationService.updatePrize(editingPrize.id, editingPrize);
        setPrizes(prizes.map(p => p.id === updated.id ? updated : p).sort((a, b) => a.place - b.place));
      } else {
        const created = await organizationService.createPrize(editingPrize as any);
        setPrizes([...prizes, created].sort((a, b) => a.place - b.place));
      }
      setEditingPrize(null);
      setMessage({ type: 'success', text: 'Prize saved successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save prize.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-10">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Messages */}
      {message && (
        <div className={`p-4 rounded-lg border ${message.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Organization Branding */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${theme.gradients.button} px-6 py-4`}>
          <h2 className="text-xl font-bold text-white flex items-center">
            {theme.emojis.decoration[0]} Organization Branding
          </h2>
        </div>
        <form onSubmit={handleUpdateOrg} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
              <input
                type="text"
                value={org?.slug}
                disabled
                className="w-full px-4 py-2 border rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Slug cannot be changed once created.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color (Hex)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="h-10 w-10 p-1 rounded border cursor-pointer"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#6366f1"
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo URL</label>
              <input
                type="url"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 bg-gradient-to-r ${theme.gradients.button} text-white font-bold rounded-lg hover:shadow-md transition-all disabled:opacity-50 cursor-pointer`}
            >
              {saving ? 'Saving...' : 'Update Branding'}
            </button>
          </div>
        </form>
      </section>

      {/* Prize Management */}
      <section className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className={`bg-gradient-to-r ${theme.gradients.button} px-6 py-4 flex justify-between items-center`}>
          <h2 className="text-xl font-bold text-white flex items-center">
            {theme.emojis.celebration[0]} Prize Pool
          </h2>
          <button
            onClick={() => setEditingPrize({ place: prizes.length + 1, name: '', description: '', image_url: '', link: '' })}
            className="px-4 py-1.5 bg-white text-purple-700 font-bold rounded-lg hover:bg-gray-50 transition-colors text-sm cursor-pointer"
          >
            + Add Prize
          </button>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b text-gray-400 text-sm">
                  <th className="py-2 px-4 font-semibold">Place</th>
                  <th className="py-2 px-4 font-semibold">Prize Name</th>
                  <th className="py-2 px-4 font-semibold">Image</th>
                  <th className="py-2 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {prizes.map((prize) => (
                  <tr key={prize.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-bold text-gray-700">{prize.place}</td>
                    <td className="py-3 px-4 text-gray-600">{prize.name}</td>
                    <td className="py-3 px-4">
                      {prize.image_url ? (
                        <img src={prize.image_url} alt={prize.name} className="h-8 w-8 object-contain rounded border" />
                      ) : (
                        <span className="text-gray-300 text-xs italic">No image</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingPrize(prize)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePrize(prize.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {prizes.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-400 italic">No prizes configured.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Prize Edit Modal */}
      {editingPrize && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden animate-fadeIn">
            <div className={`bg-gradient-to-r ${theme.gradients.button} px-6 py-4`}>
              <h3 className="text-xl font-bold text-white">
                {editingPrize.id ? 'Edit Prize' : 'Add New Prize'}
              </h3>
            </div>
            <form onSubmit={handleSavePrize} className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place</label>
                  <input
                    type="number"
                    value={editingPrize.place}
                    onChange={(e) => setEditingPrize({ ...editingPrize, place: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prize Name</label>
                  <input
                    type="text"
                    value={editingPrize.name || ''}
                    onChange={(e) => setEditingPrize({ ...editingPrize, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingPrize.description || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500 h-20"
                  placeholder="Tell winners what they won..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (PNG recommended)</label>
                <input
                  type="url"
                  value={editingPrize.image_url || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, image_url: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/prize.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link (Optional)</label>
                <input
                  type="url"
                  value={editingPrize.link || ''}
                  onChange={(e) => setEditingPrize({ ...editingPrize, link: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://myshop.com/product"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingPrize(null)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${theme.gradients.button} text-white font-bold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 cursor-pointer`}
                >
                  {saving ? 'Saving...' : 'Save Prize'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
