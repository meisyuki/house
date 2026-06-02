
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Edit2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useStore } from '../store';

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const { categories, setCategories, addCategory, updateCategory, deleteCategory } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return;
    addCategory({
      id: crypto.randomUUID(),
      name: newCategoryName.trim(),
      order: categories.length,
      hidden: false,
      createdAt: new Date().toISOString(),
    });
    setNewCategoryName('');
    setIsAdding(false);
  };

  const handleEditCategory = (id: string) => {
    if (!editingName.trim()) return;
    const category = categories.find((c) => c.id === id);
    if (category) {
      updateCategory({ ...category, name: editingName.trim() });
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleToggleHidden = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      updateCategory({ ...category, hidden: !category.hidden });
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('确定要删除这个分类吗？该分类下的物品不会被删除。')) {
      deleteCategory(id);
    }
  };

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;

    [newCategories[index], newCategories[newIndex]] = [newCategories[newIndex], newCategories[index]];
    
    newCategories.forEach((category, i) => {
      category.order = i;
    });

    setCategories(newCategories);
  };

  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold ml-2">分类管理</h1>
      </header>

      <div className="px-4 py-4">
        <div className="space-y-2">
          {sortedCategories.map((category, index) => (
            <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {editingId === category.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleEditCategory(category.id)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditCategory(category.id)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                  >
                    保存
                  </button>
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setEditingName('');
                    }}
                    className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-5 h-5 text-gray-300" />
                    <div>
                      <span className={`font-medium ${category.hidden ? 'text-gray-400' : 'text-gray-900'}`}>
                        {category.name}
                      </span>
                      {category.hidden && (
                        <span className="ml-2 text-xs text-gray-400">(已隐藏)</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => moveCategory(index, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveCategory(index, 'down')}
                      disabled={index === categories.length - 1}
                      className={`p-2 rounded-lg ${index === categories.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:bg-gray-100'}`}
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => handleToggleHidden(category.id)}
                      className={`p-2 rounded-lg ${category.hidden ? 'text-orange-500 hover:bg-orange-50' : 'text-gray-400 hover:bg-gray-100'}`}
                      title={category.hidden ? '显示' : '隐藏'}
                    >
                      {category.hidden ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(category.id);
                        setEditingName(category.name);
                      }}
                      className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {isAdding ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                  placeholder="输入分类名称"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <button
                  onClick={handleAddCategory}
                  className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                >
                  添加
                </button>
                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewCategoryName('');
                  }}
                  className="p-2 text-gray-500 hover:bg-gray-50 rounded-lg"
                >
                  取消
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full bg-white border-2 border-dashed border-gray-200 rounded-xl p-4 text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              添加分类
            </button>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <button
          onClick={() => navigate('/')}
          className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
        >
          返回首页
        </button>
      </div>
    </div>
  );
};

export default Categories;
