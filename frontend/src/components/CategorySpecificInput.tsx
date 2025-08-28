import React from 'react';
import { BookOpen, User, Music } from 'lucide-react';

interface CategorySpecificInputProps {
  category: string;
  onInputChange: (data: any) => void;
  currentData: any;
}

const CategorySpecificInput: React.FC<CategorySpecificInputProps> = ({
  category,
  onInputChange,
  currentData
}) => {
  const handleInputChange = (field: string, value: string) => {
    onInputChange({ ...currentData, [field]: value });
  };

  const renderBookInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 책으로 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          한국 문학 작품의 제목과 작가를 입력해주세요
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📖 책 제목
          </label>
          <input
            type="text"
            value={currentData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="예: 토지, 아버지의 땅, 우리들의 일그러진 영웅"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ✍️ 작가명
          </label>
          <input
            type="text"
            value={currentData.author || ''}
            onChange={(e) => handleInputChange('author', e.target.value)}
            placeholder="예: 박경리, 이문열, 조정래"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderPersonInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <User className="w-12 h-12 text-green-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 인물에 대해 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          한국의 유명한 인물이나 리더의 이름을 입력해주세요
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          👤 인물명
        </label>
        <input
          type="text"
          value={currentData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="예: 세종대왕, 이순신, 김구, 박정희"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderKPopInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <Music className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 K-Pop으로 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          가수/그룹명과 곡명을 입력해주세요
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎤 가수/그룹명
          </label>
          <input
            type="text"
            value={currentData.artist || ''}
            onChange={(e) => handleInputChange('artist', e.target.value)}
            placeholder="예: BTS, BLACKPINK, IU, EXO"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            🎵 곡명 (선택사항)
          </label>
          <input
            type="text"
            value={currentData.song || ''}
            onChange={(e) => handleInputChange('song', e.target.value)}
            placeholder="예: 봄날, DDU-DU DDU-DU, 좋은 날"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderDramaMovieInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🎬</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 드라마/영화로 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          드라마나 영화의 제목을 입력해주세요
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🎬 제목
        </label>
        <input
          type="text"
          value={currentData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="예: 대장금, 기생충, 오징어 게임"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderHistoryInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">🏛️</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 역사 주제로 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          한국 역사의 사건이나 시대를 입력해주세요
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          🏛️ 역사 주제
        </label>
        <input
          type="text"
          value={currentData.event || ''}
          onChange={(e) => handleInputChange('event', e.target.value)}
          placeholder="예: 삼국통일, 조선시대, 한국전쟁, 6.25"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderGenericInput = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-2xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          어떤 주제로 학습지를 만들어볼까요?
        </h3>
        <p className="text-gray-600">
          주제나 키워드를 입력해주세요
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 주제어
        </label>
        <input
          type="text"
          value={currentData.topic || ''}
          onChange={(e) => handleInputChange('topic', e.target.value)}
          placeholder="학습지로 만들고 싶은 주제를 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  // 카테고리별 렌더링
  switch (category) {
    case 'book':
      return renderBookInput();
    case 'person':
      return renderPersonInput();
    case 'kpop':
      return renderKPopInput();
    case 'drama':
      return renderDramaMovieInput();
    case 'history':
      return renderHistoryInput();
    default:
      return renderGenericInput();
  }
};

export default CategorySpecificInput;
