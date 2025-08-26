import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, History, User, Music, Film, Loader2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface WorksheetForm {
  category: string;
  topic: string;
  difficulty: string;
  grade: string;
  language: string;
}

const categories = [
  { id: 'book', name: '📖 책', icon: BookOpen, description: '한국 문학 작품과 동화' },
  { id: 'history', name: '🏛 역사', icon: History, description: '한국 역사와 문화' },
  { id: 'person', name: '👤 인물', icon: User, description: '한국 유명 인물과 리더' },
  { id: 'kpop', name: '🎶 K-Pop', icon: Music, description: 'K-Pop 가수와 음악' },
  { id: 'drama', name: '🎬 드라마/영화', icon: Film, description: '한국 드라마와 영화' }
];

const difficulties = [
  { id: 'beginner', name: '초급', description: 'K-5 저학년 (6-10세)', grade: 'K-2' },
  { id: 'intermediate', name: '중급', description: '초등 고학년/중학 (11-14세)', grade: '3-8' },
  { id: 'advanced', name: '고급', description: '중등 이상 (15세+)', grade: '9-12' }
];

const WorksheetGenerator: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<WorksheetForm>();
  const selectedCategory = watch('category');
  const selectedDifficulty = watch('difficulty');

  const onSubmit = async (data: WorksheetForm) => {
    setIsGenerating(true);
    
    try {
      // TODO: API 호출하여 학습지 생성
      const response = await fetch('/api/worksheets/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) throw new Error('학습지 생성에 실패했습니다.');
      
      const worksheet = await response.json();
      setGeneratedWorksheet(worksheet);
      toast.success('학습지가 성공적으로 생성되었습니다!');
      
    } catch (error) {
      console.error('Error generating worksheet:', error);
      toast.error('학습지 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? React.createElement(category.icon, { size: 24 }) : null;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎓 학습지 자동 생성
        </h1>
        <p className="text-xl text-gray-600">
          주제를 선택하고 입력하면 AI가 자동으로 학습지를 만들어드립니다
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* 입력 폼 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            📝 학습지 정보 입력
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* 카테고리 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📂 카테고리 선택
              </label>
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedCategory === category.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={category.id}
                      {...register('category', { required: '카테고리를 선택해주세요' })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <div className="font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* 주제어 입력 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ✏️ 주제어 입력
              </label>
              <input
                type="text"
                placeholder="예: BTS 봄날, 이상한 변호사 우영우, 6.25 전쟁..."
                {...register('topic', { 
                  required: '주제어를 입력해주세요',
                  minLength: { value: 2, message: '최소 2자 이상 입력해주세요' }
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.topic && (
                <p className="mt-2 text-sm text-red-600">{errors.topic.message}</p>
              )}
            </div>

            {/* 난이도 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📊 난이도 선택
              </label>
              <div className="grid grid-cols-1 gap-3">
                {difficulties.map((difficulty) => (
                  <label
                    key={difficulty.id}
                    className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedDifficulty === difficulty.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={difficulty.id}
                      {...register('difficulty', { required: '난이도를 선택해주세요' })}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">
                          {difficulty.grade}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{difficulty.name}</div>
                        <div className="text-sm text-gray-500">{difficulty.description}</div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              {errors.difficulty && (
                <p className="mt-2 text-sm text-red-600">{errors.difficulty.message}</p>
              )}
            </div>

            {/* 언어 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                🌍 언어 선택
              </label>
              <select
                {...register('language', { required: '언어를 선택해주세요' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">언어를 선택하세요</option>
                <option value="ko">한국어</option>
                <option value="en">English</option>
                <option value="bilingual">이중언어 (한국어 + English)</option>
              </select>
              {errors.language && (
                <p className="mt-2 text-sm text-red-600">{errors.language.message}</p>
              )}
            </div>

            {/* 생성 버튼 */}
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>학습지 생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>AI 학습지 생성하기</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* 미리보기 및 결과 */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            👀 미리보기
          </h2>
          
          {isGenerating ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin mx-auto mb-4" size={48} />
              <p className="text-gray-600">AI가 학습지를 생성하고 있습니다...</p>
              <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
            </div>
          ) : generatedWorksheet ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">✅ 생성 완료!</h3>
                <p className="text-blue-800 text-sm">
                  {generatedWorksheet.topic}에 대한 {generatedWorksheet.difficulty} 난이도의 학습지가 생성되었습니다.
                </p>
              </div>
              
              <div className="space-y-3">
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors">
                  📄 학습지 보기
                </button>
                <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  💾 PDF 다운로드
                </button>
                <button className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors">
                  ✏️ 편집하기
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
              <p>왼쪽에서 정보를 입력하고</p>
              <p>AI 학습지 생성을 시작해보세요!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorksheetGenerator;
