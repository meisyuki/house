
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, QrCode, Folder, Settings, Filter, Trash2, Calendar, MapPin } from 'lucide-react';
import { useStore } from '../store';
import { ItemStatus } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { items, categories, selectedCategoryId, filterStatus, getItemStatus, deleteItem, setSelectedCategoryId, setFilterStatus } = useStore();

  const filteredItems = items.filter((item) => {
    const matchCategory = !selectedCategoryId || item.categoryId === selectedCategoryId;
    const itemStatus = getItemStatus(item);
    const matchStatus = filterStatus === 'all' || itemStatus === filterStatus;
    return matchCategory && matchStatus;
  });

  const visibleCategories = categories.filter((c) => !c.hidden).sort((a, b) => a.order - b.order);

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getStatusLabel = (status: ItemStatus) => {
    switch (status) {
      case 'expired': return '已过期';
      case 'expiring': return '即将过期';
      default: return '正常';
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || '未分类';
  };

  const expiringItems = items.filter((item) => {
    const status = getItemStatus(item);
    return status === 'expiring' || status === 'expired';
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-6">
        <h1 className="text-2xl font-bold">家庭收纳</h1>
        <p className="text-blue-100 mt-1">管理你的每一件物品</p>
      </header>

      {expiringItems.length > 0 && (
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mx-4 mt-4 rounded-r-lg">
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-orange-500 mr-2" />
            <span className="font-medium text-orange-800">
              有 {expiringItems.length} 件物品需要注意
            </span>
          </div>
          <Link to="#" onClick={() => setFilterStatus(filterStatus === 'all' ? 'expiring' : 'all')} className="text-orange-600 text-sm mt-2 inline-block">
            查看详情 →
          </Link>
        </div>
      )}

      <div className="px-4 mt-4">
        <div className="flex space-x-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategoryId(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              !selectedCategoryId ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'
            }`}
          >
            全部
          </button>
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                selectedCategoryId === category.id ? 'bg-blue-500 text-white' : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="flex space-x-2 mt-3">
          {(['all', 'normal', 'expiring', 'expired'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                filterStatus === status ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {status === 'all' ? '全部' : status === 'normal' ? '正常' : status === 'expiring' ? '即将过期' : '已过期'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 mt-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无物品</p>
            <p className="text-gray-400 text-sm mt-1">点击下方按钮添加你的第一件物品</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const status = getItemStatus(item);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(status)}`}>
                          {getStatusLabel(status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Folder className="w-4 h-4 mr-1" />
                          {getCategoryName(item.categoryId)}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </span>
                      </div>
                      {item.expiryDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 inline mr-1" />
                          过期日期：{new Date(item.expiryDate).toLocaleDateString('zh-CN')}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => navigate(`/item/${item.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Settings className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('确定要删除这个物品吗？')) {
                            deleteItem(item.id);
                          }
                        }}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/categories')}
            className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            分类管理
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/add')}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-1" />
            添加物品
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
