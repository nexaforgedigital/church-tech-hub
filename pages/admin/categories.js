// pages/admin/categories.js
import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import AdminAuth from '../../components/AdminAuth';

const defaultCategories = [
  { id: 'worship', name: 'Worship', color: 'blue' },
  { id: 'praise', name: 'Praise', color: 'purple' },
  { id: 'christmas', name: 'Christmas', color: 'red' },
  { id: 'easter', name: 'Easter', color: 'green' },
  { id: 'communion', name: 'Communion', color: 'amber' },
  { id: 'prayer', name: 'Prayer', color: 'indigo' },
];

export default function CategoriesManager() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', color: 'blue' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('churchassist-categories');
    setCategories(saved ? JSON.parse(saved) : defaultCategories);
  }, []);

  const saveCategories = (cats) => {
    setCategories(cats);
    localStorage.setItem('churchassist-categories', JSON.stringify(cats));
  };

  const addCategory = () => {
    if (!newCategory.name.trim()) return;
    const id = newCategory.name.toLowerCase().replace(/\s+/g, '-');
    saveCategories([...categories, { ...newCategory, id }]);
    setNewCategory({ name: '', color: 'blue' });
  };

  const deleteCategory = (id) => {
    if (confirm('Delete this category?')) {
      saveCategories(categories.filter(c => c.id !== id));
    }
  };

  const colors = ['blue', 'purple', 'green', 'red', 'amber', 'indigo', 'pink', 'cyan'];

  return (
    <AdminAuth title="Categories Manager">
      <div className="py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-2xl p-8 mb-8 text-white">
            <div className="flex items-center gap-4">
              <Tag size={40} />
              <div>
                <h1 className="text-3xl font-bold">Categories Manager</h1>
                <p className="text-pink-100">Organize songs by category</p>
              </div>
            </div>
          </div>

          {/* Add New */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="font-bold mb-4">Add New Category</h2>
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name..."
                className="flex-1 px-4 py-2 border-2 rounded-lg focus:border-pink-500 focus:outline-none"
              />
              <select
                value={newCategory.color}
                onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                className="px-4 py-2 border-2 rounded-lg focus:border-pink-500 focus:outline-none"
              >
                {colors.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button
                onClick={addCategory}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="font-bold mb-4">Categories ({categories.length})</h2>
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full bg-${cat.color}-500`}></div>
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-xs text-gray-500">({cat.id})</span>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminAuth>
  );
}