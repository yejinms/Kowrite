import React from 'react';
import { BookOpen, Download, Heart, Eye, Plus, TrendingUp, Calendar, Star } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = [
    { name: '생성된 학습지', value: '24', icon: BookOpen, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { name: '다운로드', value: '156', icon: Download, color: 'text-green-600', bgColor: 'bg-green-100' },
    { name: '좋아요', value: '89', icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
    { name: '조회수', value: '1,234', icon: Eye, color: 'text-purple-600', bgColor: 'bg-purple-100' }
  ];

  const recentWorksheets = [
    {
      id: 1,
      title: 'BTS 「봄날」 학습지',
      category: 'K-Pop',
      difficulty: '중급',
      createdAt: '2024-01-15',
      views: 45,
      downloads: 12,
      rating: 4.8
    },
    {
      id: 2,
      title: '한국의 전통 음식',
      category: '역사',
      difficulty: '초급',
      createdAt: '2024-01-12',
      views: 32,
      downloads: 8,
      rating: 4.6
    },
    {
      id: 3,
      title: '이상한 변호사 우영우',
      category: '드라마',
      difficulty: '고급',
      createdAt: '2024-01-10',
      views: 67,
      downloads: 23,
      rating: 4.9
    }
  ];

  const quickActions = [
    { name: '새 학습지 생성', icon: Plus, href: '/generate', color: 'bg-blue-600 hover:bg-blue-700' },
    { name: '템플릿 보기', icon: BookOpen, href: '/templates', color: 'bg-green-600 hover:bg-green-700' },
    { name: '커뮤니티', icon: TrendingUp, href: '/community', color: 'bg-purple-600 hover:bg-purple-700' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">안녕하세요, 김선생님! 👋</h1>
        <p className="text-gray-600 mt-2">오늘도 한국 문화 교육을 위해 노력하고 계시는군요.</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 빠른 액션 */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">빠른 액션</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.name}
                href={action.href}
                className={`${action.color} text-white p-4 rounded-lg text-center transition-colors duration-200`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <span className="font-medium">{action.name}</span>
              </a>
            );
          })}
        </div>
      </div>

      {/* 최근 학습지 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">최근 생성한 학습지</h2>
          <a href="/worksheets" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            모두 보기 →
          </a>
        </div>
        
        <div className="space-y-4">
          {recentWorksheets.map((worksheet) => (
            <div key={worksheet.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{worksheet.title}</h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      worksheet.category === 'K-Pop' ? 'bg-pink-100 text-pink-800' :
                      worksheet.category === '역사' ? 'bg-green-100 text-green-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {worksheet.category}
                    </span>
                    <span>{worksheet.difficulty}</span>
                    <span>•</span>
                    <span>{worksheet.createdAt}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{worksheet.views}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>{worksheet.downloads}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span>{worksheet.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 활동 요약 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 이번 주 활동 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 주 활동</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">새 학습지 생성</span>
              <span className="font-medium text-gray-900">3개</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">다운로드</span>
              <span className="font-medium text-gray-900">28회</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">커뮤니티 참여</span>
              <span className="font-medium text-gray-900">5회</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">평균 평점</span>
              <span className="font-medium text-gray-900">4.7/5.0</span>
            </div>
          </div>
        </div>

        {/* 다음 목표 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">다음 목표</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-medium">1</span>
              </div>
              <span className="text-gray-700">이번 달 10개 학습지 생성하기</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <span className="text-gray-700">커뮤니티에 3개 학습지 공유하기</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-medium">3</span>
              </div>
              <span className="text-gray-700">평균 평점 4.8 이상 달성하기</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
