
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell } from 'lucide-react';
import { useStore } from '../store';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, updateSettings } = useStore();

  const reminderOptions = [
    { value: 1, label: '提前 1 天' },
    { value: 3, label: '提前 3 天' },
    { value: 7, label: '提前 7 天' },
    { value: 15, label: '提前 15 天' },
    { value: 30, label: '提前 30 天' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="bg-white border-b border-gray-200 px-4 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-semibold ml-2">设置</h1>
      </header>

      <div className="px-4 py-4">
        <div className="bg-white rounded-xl shadow-sm mb-4">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center">
              <Bell className="w-5 h-5 text-blue-500 mr-3" />
              <h2 className="font-medium text-gray-900">过期提醒</h2>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-600 mb-4">设置物品过期前的提醒时间</p>
            <div className="space-y-2">
              {reminderOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateSettings({ reminderDays: option.value })}
                  className={`w-full p-3 rounded-lg text-left flex items-center justify-between transition-colors ${
                    settings.reminderDays === option.value
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 border border-transparent hover:bg-gray-100'
                  }`}
                >
                  <span className={settings.reminderDays === option.value ? 'text-blue-700' : 'text-gray-700'}>
                    {option.label}
                  </span>
                  {settings.reminderDays === option.value && (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-medium text-gray-900 mb-2">关于</h3>
          <p className="text-sm text-gray-600">
            家庭收纳小助手 v1.0
          </p>
          <p className="text-xs text-gray-400 mt-2">
            数据存储在本地浏览器中
          </p>
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

export default Settings;
