
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, Folder, FileText } from 'lucide-react';
import { useStore } from '../store';
import { QRCodeSVG } from 'qrcode.react';

const ItemDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, categories, getItemStatus, deleteItem } = useStore();

  const item = items.find((i) => i.id === id);

  if (!item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">物品不存在</p>
          <button onClick={() => navigate('/')} className="mt-4 text-blue-500">
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const status = getItemStatus(item);
  const category = categories.find((c) => c.id === item.categoryId);

  const getStatusColor = () => {
    switch (status) {
      case 'expired': return 'bg-red-100 text-red-800';
      case 'expiring': return 'bg-orange-100 text-orange-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'expired': return '已过期';
      case 'expiring': return '即将过期';
      default: return '正常';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold ml-2">物品详情</h1>
      </header>

      {item.images.length > 0 && (
        <div className="bg-white mb-4">
          <div className="flex overflow-x-auto">
            {item.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${item.name} ${index + 1}`}
                className="w-full h-64 object-cover flex-shrink-0"
              />
            ))}
          </div>
        </div>
      )}

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{item.name}</h2>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
                {getStatusLabel()}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center text-gray-600">
              <Folder className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">分类</p>
                <p className="text-sm font-medium">{category?.name || '未分类'}</p>
              </div>
            </div>

            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">存放位置</p>
                <p className="text-sm font-medium">{item.location}</p>
              </div>
            </div>

            {item.purchaseDate && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">购买日期</p>
                  <p className="text-sm font-medium">{new Date(item.purchaseDate).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
            )}

            {item.expiryDate && (
              <div className="flex items-center text-gray-600">
                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">过期日期</p>
                  <p className="text-sm font-medium">{new Date(item.expiryDate).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>
            )}

            {item.notes && (
              <div className="flex items-start text-gray-600">
                <FileText className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-400">备注</p>
                  <p className="text-sm">{item.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <h3 className="text-sm font-medium text-gray-700 mb-4">物品二维码</h3>
          <div className="inline-block bg-white p-4 rounded-lg border border-gray-200">
            <QRCodeSVG value={item.qrCode} size={180} />
          </div>
          <p className="text-xs text-gray-400 mt-4">扫描二维码快速查看物品信息</p>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex space-x-3">
          <button
            onClick={() => {
              if (confirm('确定要删除这个物品吗？')) {
                deleteItem(item.id);
                navigate('/');
              }
            }}
            className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center"
          >
            <Trash2 className="w-5 h-5 mr-1" />
            删除
          </button>
          <button
            onClick={() => navigate(`/edit/${item.id}`)}
            className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <Edit className="w-5 h-5 mr-1" />
            编辑
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
