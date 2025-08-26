import React from 'react';
import { Users, Heart, MessageCircle, Share2, Star } from 'lucide-react';

const Community: React.FC = () => {
  const featuredWorksheets = [
    {
      id: 1,
      title: 'BTS 「봄날」 학습지',
      author: '김선생님',
      category: 'K-Pop',
      difficulty: '중급',
      rating: 4.8,
      likes: 24,
      comments: 8
    },
    {
      id: 2,
      title: '한국의 전통 음식',
      author: '이선생님',
      category: '역사',
      difficulty: '초급',
      rating: 4.6,
      likes: 18,
      comments: 5
    },
    {
      id: 3,
      title: '이상한 변호사 우영우',
      author: '박선생님',
      category: '드라마',
      difficulty: '고급',
      rating: 4.9,
      likes: 31,
      comments: 12
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🏫 Kowrite 커뮤니티
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          전국의 교사들과 함께 한국 문화 교육의 아이디어를 나누고, 
          훌륭한 학습지를 공유해보세요.
        </p>
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900">150+</div>
          <div className="text-gray-600">활성 교사</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Share2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900">500+</div>
          <div className="text-gray-600">공유된 학습지</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <MessageCircle className="w-12 h-12 text-purple-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900">1,200+</div>
          <div className="text-gray-600">댓글</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Heart className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <div className="text-3xl font-bold text-gray-900">3,500+</div>
          <div className="text-gray-600">좋아요</div>
        </div>
      </div>

      {/* 인기 학습지 */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔥 인기 학습지
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredWorksheets.map((worksheet) => (
            <div key={worksheet.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  worksheet.category === 'K-Pop' ? 'bg-pink-100 text-pink-800' :
                  worksheet.category === '역사' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {worksheet.category}
                </span>
                <span className="text-sm text-gray-500">{worksheet.difficulty}</span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {worksheet.title}
              </h3>
              
              <p className="text-gray-600 mb-4">
                작성자: {worksheet.author}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">{worksheet.rating}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-4 h-4" />
                    <span>{worksheet.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{worksheet.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 커뮤니티 가이드라인 */}
      <div className="bg-blue-50 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          📋 커뮤니티 가이드라인
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">✅ 권장사항</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 교육적 가치가 있는 학습지 공유</li>
              <li>• 건설적인 피드백과 제안</li>
              <li>• 저작권을 준수한 콘텐츠</li>
              <li>• 다른 교사들의 경험 공유</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">❌ 금지사항</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• 상업적 홍보나 광고</li>
              <li>• 타인을 비방하는 내용</li>
              <li>• 저작권 침해 콘텐츠</li>
              <li>• 교육과 무관한 게시물</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 참여 방법 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🚀 커뮤니티에 참여하는 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">학습지 공유</h3>
            <p className="text-gray-600">
              자신이 만든 학습지를 커뮤니티에 공유하고 다른 교사들의 피드백을 받아보세요.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">경험 나누기</h3>
            <p className="text-gray-600">
              한국 문화 교육에서의 성공 사례나 어려웠던 점을 다른 교사들과 나누어보세요.
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">협업하기</h3>
            <p className="text-gray-600">
              비슷한 관심사를 가진 교사들과 함께 프로젝트를 진행하거나 아이디어를 발전시켜보세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
