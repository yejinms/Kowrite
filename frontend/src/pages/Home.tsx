import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, History, User, Music, Film, Sparkles, Download, Share2, Users, Award } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: BookOpen,
      title: '📖 책',
      description: '한국 문학 작품과 동화를 통한 문화 학습',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: History,
      title: '🏛 역사',
      description: '한국 역사와 문화적 사건을 통한 이해',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: User,
      title: '👤 인물',
      description: '한국 유명 인물과 리더를 통한 영감',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Music,
      title: '🎶 K-Pop',
      description: 'K-Pop 가수와 음악을 통한 현대 문화',
      color: 'from-pink-500 to-pink-600'
    },
    {
      icon: Film,
      title: '🎬 드라마/영화',
      description: '한국 드라마와 영화를 통한 스토리텔링',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const benefits = [
    {
      icon: Sparkles,
      title: 'AI 자동 생성',
      description: 'OpenAI GPT-4를 활용한 스마트한 학습지 생성'
    },
    {
      icon: Download,
      title: '다양한 출력 형식',
      description: 'PDF, Word, 인쇄 등 다양한 형태로 활용'
    },
    {
      icon: Share2,
      title: '커뮤니티 공유',
      description: '교사들 간의 학습지 공유 및 협업'
    },
    {
      icon: Users,
      title: '미국 교육 표준',
      description: 'Common Core Standards 연계 및 학년별 맞춤'
    }
  ];

  const stats = [
    { number: '500+', label: '생성된 학습지' },
    { number: '50+', label: '활성 교사' },
    { number: '5', label: '주제 카테고리' },
    { number: '3', label: '난이도 레벨' }
  ];

  return (
    <div className="min-h-screen">
      {/* 히어로 섹션 */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI로 만드는
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {' '}한국 문화 학습지
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              교사가 주제를 입력하면 AI가 자동으로 읽기 자료, 어휘, 질문, 토론 주제를 포함한 
              완성된 학습지를 생성합니다. 미국 학생들을 위한 한국 문화 교육을 더욱 쉽고 재미있게!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/generate"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Sparkles className="inline-block mr-2" size={24} />
                학습지 생성 시작하기
              </Link>
              <Link
                to="/community"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                커뮤니티 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 소개 */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              다양한 주제로 학습지 생성
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              5가지 카테고리에서 원하는 주제를 선택하고, AI가 자동으로 
              교육적이고 흥미로운 학습지를 만들어드립니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-lg flex items-center justify-center mb-6 mx-auto`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 주요 기능 */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Kowrite만의 특별한 기능
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              AI 기술과 교육 전문성을 결합하여 교사들이 쉽게 사용할 수 있는 
              강력한 학습지 생성 도구를 제공합니다.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-lg border border-gray-100"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 통계 */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Kowrite의 성과
            </h2>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              이미 많은 교사들이 Kowrite를 통해 효과적인 한국 문화 교육을 
              진행하고 있습니다.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-100 text-lg">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <Award className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              지금 바로 시작해보세요!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              AI 기술로 한국 문화 교육을 한 단계 업그레이드하세요. 
              무료로 체험해보고 효과를 직접 확인해보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/generate"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                무료로 시작하기
              </Link>
              <Link
                to="/about"
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                더 알아보기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
