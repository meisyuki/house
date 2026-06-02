
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload, X, Image as ImageIcon } from 'lucide-react';
import { useStore } from '../store';
import { LOCATIONS } from '../types';
import { QRCodeSVG } from 'qrcode.react';

const AddEditItem: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items, categories, addItem, updateItem } = useStore();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    location: LOCATIONS[0],
    images: [] as string[],
    purchaseDate: '',
    expiryDate: '',
    notes: '',
  });

  useEffect(() => {
    if (isEdit) {
      const item = items.find((i) => i.id === id);
      if (item) {
        setFormData({
          name: item.name,
          categoryId: item.categoryId,
          location: item.location,
          images: item.images,
          purchaseDate: item.purchaseDate || '',
          expiryDate: item.expiryDate || '',
          notes: item.notes || '',
        });
      }
    } else {
      if (categories.length > 0) {
        setFormData((prev) => ({ ...prev, categoryId: categories[0].id }));
      }
    }
  }, [id, items, categories, isEdit]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const now = new Date().toISOString();
    const itemId = isEdit ? id! : crypto.randomUUID();

    const item = {
      id: itemId,
      name: formData.name,
      categoryId: formData.categoryId,
      location: formData.location,
      images: formData.images,
      purchaseDate: formData.purchaseDate || undefined,
      expiryDate: formData.expiryDate || undefined,
      notes: formData.notes || undefined,
      qrCode: `${window.location.origin}/item/${itemId}`,
      createdAt: isEdit ? items.find((i) => i.id === id)!.createdAt : now,
      updatedAt: now,
    };

    if (isEdit) {
      updateItem(item);
    } else {
      addItem(item);
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold ml-2">{isEdit ? '编辑物品' : '添加物品'}</h1>
      </header>

      <form onSubmit={handleSubmit} className="pb-24">
        <div className="bg-white px-4 py-4 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">物品照片</label>
          <div className="flex space-x-3 overflow-x-auto pb-2">
            {formData.images.map((image, index) => (
              <div key={index} className="relative flex-shrink-0">
                <img src={image} alt="物品" className="w-20 h-20 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            <label className="flex-shrink-0 w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <input type="file" accept="image/*" multiple hidden onChange={handleImageUpload} />
              <Upload className="w-6 h-6 text-gray-400" />
            </label>
          </div>
        </div>

        <div className="bg-white mb-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">物品名称 *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full text-gray-900 placeholder-gray-400 focus:outline-none"
              placeholder="请输入物品名称"
            />
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}
              className="w-full text-gray-900 bg-transparent focus:outline-none"
            >
              {categories.filter((c) => !c.hidden).map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">存放位置</label>
            <select
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full text-gray-900 bg-transparent focus:outline-none"
            >
              {LOCATIONS.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">购买日期</label>
            <input
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, purchaseDate: e.target.value }))}
              className="w-full text-gray-900 bg-transparent focus:outline-none"
            />
          </div>

          <div className="px-4 py-3 border-b border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">过期日期</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full text-gray-900 bg-transparent focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-white mb-4 px-4 py-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
            rows={3}
            placeholder="用法、价格、购买渠道、用量等"
          />
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors"
          >
            {isEdit ? '保存修改' : '添加物品'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditItem;
