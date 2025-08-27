import React, { useState, useEffect } from 'react';
import { Loader2, Sparkles, BookOpen, History, User, Music, Film } from 'lucide-react';

interface LoadingScreenProps {
  isVisible: boolean;
  progress: number;
  currentStep: string;
  onComplete?: () => void;
}

const koreanCultureFacts = [
  {
    category: "📚 문학",
    fact: "한국의 대표 소설 '토지'는 박경리가 26년간 집필한 작품으로, 16권의 방대한 분량을 자랑합니다.",
    icon: BookOpen
  },
  {
    category: "🏛️ 역사",
    fact: "경복궁은 1395년 조선 태조 이성계가 건설한 궁궐로, '새로운 복을 누리게 해주는 궁궐'이라는 뜻입니다.",
    icon: History
  },
  {
    category: "👤 인물",
    fact: "세종대왕은 한글을 창제한 왕으로, 1443년 훈민정음을 완성하여 백성들이 쉽게 글을 배울 수 있게 했습니다.",
    icon: User
  },
  {
    category: "🎶 K-Pop",
    fact: "BTS의 '봄날'은 2017년 발표된 곡으로, 봄의 따뜻함과 그리움을 담은 감성적인 가사가 특징입니다.",
    icon: Music
  },
  {
    category: "🎬 드라마",
    fact: "드라마 '대장금'은 2003년 MBC에서 방영되어 아시아 전역에서 큰 인기를 끌었던 사극입니다.",
    icon: Film
  }
];



const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  isVisible, 
  progress, 
  currentStep, 
  onComplete 
}) => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [factVisible, setFactVisible] = useState(true);

  // 팩트 로테이션 (5초마다) + fade 효과
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      // fade out
      setFactVisible(false);
      
      setTimeout(() => {
        // 다음 팩트로 변경
        setCurrentFactIndex((prev) => (prev + 1) % koreanCultureFacts.length);
        // fade in
        setFactVisible(true);
      }, 300);
    }, 5000);

    return () => clearInterval(interval);
  }, [isVisible]);



  if (!isVisible) return null;

  const currentFact = koreanCultureFacts[currentFactIndex];
  const FactIcon = currentFact.icon;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-indigo-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">학습지 생성 중</h1>
            <Sparkles className="w-8 h-8 text-indigo-600 ml-2" />
          </div>
          <p className="text-lg text-gray-600">{currentStep}</p>
        </div>

        {/* 프로그래스 바 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">진행률</span>
            <span className="text-sm font-medium text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* 한국 문화 상식 */}
        <div className={`bg-white rounded-xl shadow-lg p-6 mb-6 transition-opacity duration-300 ${factVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center mb-4">
            <FactIcon className="w-6 h-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">{currentFact.category}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{currentFact.fact}</p>
        </div>



        {/* 하단 메시지 */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            잠시만 기다려주세요. 최고의 학습지를 만들어드리고 있어요! ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
