import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BookOpen, History, User, Music, Film, Loader2, Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';
import CategorySpecificInput from '../components/CategorySpecificInput';

interface WorksheetForm {
  category: string;
  topic: string;
  difficulty: string;
  grade: string;
  language: string;
}

interface CategoryInputData {
  // 책 카테고리
  title?: string;
  author?: string;
  
  // 인물 카테고리
  name?: string;
  
  // K-Pop 카테고리
  artist?: string;
  song?: string;
  
  // 드라마/영화 카테고리
  // title 재사용
  
  // 역사 카테고리
  event?: string;
  
  // 일반 주제
  // topic 재사용
}

// interface WorksheetContent {
//   reading: string;
//   vocabulary: Array<{
//     word: string;
//     definition: string;
//     example: string;
//   }>;
//   questions: {
//     main: string;
//     extended: string;
//     reflection: string;
//   };
//   discussion: string;
//   summary: string | {
//     passage: string;
//     options: string[];
//   };
// }

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
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorksheet, setGeneratedWorksheet] = useState<any>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStep, setLoadingStep] = useState('');
  const [showWorksheet, setShowWorksheet] = useState(false);
  const [categoryInputData, setCategoryInputData] = useState<CategoryInputData>({});

  const { register, handleSubmit, watch, formState: { errors } } = useForm<WorksheetForm>();
  const selectedCategory = watch('category');
  const selectedDifficulty = watch('difficulty');

  // 카테고리별 입력 데이터 처리
  const handleCategoryInputChange = (data: CategoryInputData) => {
    setCategoryInputData(data);
  };

  // 카테고리별 주제어 생성
  const generateTopicFromCategoryData = (): string => {
    switch (selectedCategory) {
      case 'book':
        return `${categoryInputData.title || ''} ${categoryInputData.author || ''}`.trim();
      case 'person':
        return categoryInputData.name || '';
      case 'kpop':
        return `${categoryInputData.artist || ''} ${categoryInputData.song || ''}`.trim();
      case 'drama':
        return categoryInputData.title || '';
      case 'history':
        return categoryInputData.event || '';
      default:
        return '';
    }
  };

  // 20초 동안 연속적인 진행률 시뮬레이션
  const simulateLoadingProgress = () => {
    const totalDuration = 30000; // 30초
    const updateInterval = 100; // 100ms마다 업데이트
    const startTime = Date.now();
    
    const steps = [
      { progress: 15, message: '주제 분석 중...' },
      { progress: 35, message: 'AI 모델 연결 중...' },
      { progress: 55, message: '읽기 자료 생성 중...' },
      { progress: 75, message: '어휘와 문제 만들기 중...' },
      { progress: 90, message: '토론 주제와 요약 정리 중...' },
      { progress: 99, message: '최종 검토 중...' }
    ];
    
    let currentStepIndex = 0;
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / totalDuration) * 99, 99); // 최대 99%까지만
      
      setLoadingProgress(Math.round(progress));
      
      // 단계별 메시지 업데이트
      if (currentStepIndex < steps.length && progress >= steps[currentStepIndex].progress) {
        setLoadingStep(steps[currentStepIndex].message);
        currentStepIndex++;
      }
      
      // 99%에 도달하면 대기
      if (progress >= 99) {
        setLoadingProgress(99);
        setLoadingStep('거의 완료! 잠시만 기다려주세요...');
        return; // 더 이상 업데이트하지 않음
      }
      
      // 다음 업데이트 예약
      setTimeout(updateProgress, updateInterval);
    };
    
    // 시작
    setLoadingProgress(0);
    setLoadingStep('시작 중...');
    setTimeout(updateProgress, updateInterval);
  };

  const totalSteps = 5;

  const nextStep = () => {
    if (currentStep < totalSteps) {
      // 2단계(주제 입력)에서 카테고리별 데이터 검증
      if (currentStep === 1) {
        // 카테고리가 선택되었는지만 확인
        if (!selectedCategory) {
          toast.error('카테고리를 선택해주세요.');
          return;
        }
        // 입력 데이터는 나중에 검증하도록 수정
      }
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: WorksheetForm) => {
    const startTime = Date.now();
    setIsGenerating(true);
    
    // 카테고리별 입력 데이터를 topic으로 변환
    const topic = generateTopicFromCategoryData();
    if (!topic) {
      toast.error('주제 정보를 입력해주세요.');
      setIsGenerating(false);
      return;
    }
    
    // data 객체에 topic 추가
    const enrichedData = { ...data, topic };
    
    try {
      const worksheet = await generateWorksheetWithAI(enrichedData);
      setGeneratedWorksheet(worksheet);
      setShowWorksheet(true);
      toast.success('학습지가 성공적으로 생성되었습니다!');
    } catch (error) {
      console.error('Error:', error);
      toast.error('학습지 생성 중 오류가 발생했습니다.');
    } finally {
      // API 완료 시 최소 30초 대기 후 100%로 설정
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 30000 - elapsed); // 최소 30초 보장
      
      setTimeout(() => {
        setLoadingProgress(100);
        setLoadingStep('완료!');
        setTimeout(() => {
          setIsGenerating(false);
          setShowWorksheet(true);
        }, 1000); // 1초 후 새 페이지로 전환
      }, remainingTime);
    }
  };

  const generateWorksheetWithAI = async (data: WorksheetForm) => {
    const OPENAI_API_KEY = (import.meta as any).env.VITE_OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      toast.error('API 키가 설정되지 않았습니다. 환경변수를 확인해주세요.');
      return;
    }

    // 로딩 시작
    setIsGenerating(true);
    setLoadingProgress(0);
    setLoadingStep('시작 중...');
    
    // 진행률 시뮬레이션 시작
    simulateLoadingProgress();
    
    const prompt = `
다음 주제로 한국 문화 학습지를 만들어주세요:

카테고리: ${data.category}
주제: ${data.topic}
난이도: ${data.difficulty}
언어: ${data.language}
학년: ${data.grade || '초등학교'}

다음 형식으로 JSON 응답을 제공해주세요:
{
  "reading": "읽기 자료 (난이도에 따른 최소 분량 충족: 초급 400자 / 중급 700자 / 고급 1000자 이상, 필요 시 문단 구분)",
  "vocabulary": [
    {
      "word": "한국어 단어",
      "definition": "단어의 뜻 (쉬운 설명)",
      "example": "간단한 예문"
    }
  ],
  "questions": {
    "main": "핵심 질문 (본문 이해 확인)",
    "extended": "확장 질문 (학생 경험과 연결)",
    "reflection": "생각 정리 질문 (깊이 있는 사고 유도)"
  },
  "discussion": "찬반이 가능한 토론 주제",
  "summary": {
    "passage": "전체 내용을 요약한 짧은 지문. 일부 단어를 빈칸(_____)으로 처리.",
    "options": ["보기 단어1", "보기 단어2", "보기 단어3", "보기 단어4"] 
  }
}

추가 지침:
1. 읽기 자료는 피상적이지 않게 작성하고, 주제에 맞는 사례, 인용, 구체적 사건을 반드시 포함하세요.  
   - 책: 줄거리/문장/인물/사건 일부 직접 인용
   - 인물: 해당 인물의 업적·생애에서 중요한 사건 사례 제시  
   - 드라마/영화: 인물명, 장면이나 대사 일부를 간단히 인용  
   - K-Pop: 가수에 대한 이야기나 가사 일부를 예시로 제시 
2. 출처가 부족하거나 정보가 모호할 경우, 내용을 임의로 생성하지 말고 
   "추가 검색 필요"라고 명시하고 다시 시도하도록 안내하세요.  
3. 난이도별 최소 글자 수를 반드시 충족하세요.  
   - 초급 (400자 이상, 단순 문장)  
   - 중급 (700자 이상, 중간 난이도 어휘/문장)  
   - 고급 (1000자 이상, 복잡한 문장과 고급 어휘)  
4. 마무리 학습은 '빈칸 채우기 문제' 형식으로 작성하세요.  
   - 요약 지문 속 빈칸(_____) 5개 제공  
   - 보기 단어 5개 제시 (정답 포함, 순서 섞기)  

체인 오브 쏘트 사고 과정:
1단계: 주제에 대한 정보 검증 - 확실한 사실과 불확실한 정보를 구분
2단계: 내용 구성 계획 - 어떤 사례와 인용을 포함할지 결정
3단계: 난이도별 분량 확인 - 요구되는 최소 글자 수 충족 여부 검토
4단계: 최종 검증 - 모든 정보가 정확하고 교육적으로 유효한지 확인
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: '당신은 한국 문화와 언어를 가르치는 \'한국어 독서논술\' 전문 교육자입니다. 미국 학생들을 위한 한국 문화 학습지를 만드는 것이 목표입니다. 정확한 리서치를 바탕으로 한 신뢰할 수 있는 학습지가 생성되어야 합니다. 확실하지 않은 정보는 명시적으로 표시하고, 출처가 부족한 경우 "추가 검색 필요"라고 안내하세요.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        max_tokens: 2500
      })
    });

    if (!response.ok) {
      throw new Error('OpenAI API 호출 실패');
    }

    const result = await response.json();
    const aiResponse = result.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('AI 응답을 받지 못했습니다.');
    }

    let worksheetContent;
    try {
      worksheetContent = JSON.parse(aiResponse);
    } catch (parseError) {
      worksheetContent = {
        reading: `${data.topic}에 대한 ${data.difficulty} 난이도의 읽기 자료입니다. 이 주제에 대한 구체적이고 흥미로운 배경지식을 포함하여 학생들이 충분한 정보를 얻을 수 있도록 구성했습니다.`,
        vocabulary: [
          {
            word: "샘플 단어",
            definition: "샘플 정의",
            example: "샘플 예문"
          }
        ],
        questions: {
          main: `${data.topic}에 대해 무엇을 배웠나요?`,
          extended: `${data.topic}의 중요성은 무엇인가요?`,
          reflection: `${data.topic}에 대해 어떻게 생각하나요?`
        },
        discussion: `${data.topic}에 대해 찬성과 반대로 나뉘는 토론 주제입니다. 당신의 입장을 정하고 근거를 제시해보세요.`,
        summary: {
          passage: `${data.topic}에 대한 _____을 통해 우리는 _____을 배울 수 있습니다. 또한 _____는 _____에 중요한 역할을 합니다.`,
          options: ["샘플1", "샘플2", "샘플3", "샘플4", "샘플5"]
        }
      };
    }

    return {
      id: Date.now().toString(),
      title: `${data.topic} 학습지`,
      category: data.category,
      topic: data.topic,
      difficulty: data.difficulty,
      language: data.language,
      grade: data.grade,
      content: worksheetContent,
      createdAt: new Date().toISOString()
    };
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📂 카테고리 선택</h3>
            <p className="text-gray-600 mb-8">학습지의 주제 카테고리를 선택해주세요</p>
            <div className="grid grid-cols-1 gap-4">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
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
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{category.name.split(' ')[0]}</span>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">{category.name.split(' ')[1]}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="text-center">
            <CategorySpecificInput
              category={selectedCategory || ''}
              onInputChange={handleCategoryInputChange}
              currentData={categoryInputData}
            />
          </div>
        );

      case 3:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📊 난이도 선택</h3>
            <p className="text-gray-600 mb-8">학생들의 수준에 맞는 난이도를 선택해주세요</p>
            <div className="grid grid-cols-1 gap-4 max-w-2xl mx-auto">
              {difficulties.map((difficulty) => (
                <label
                  key={difficulty.id}
                  className={`flex items-center p-6 border-2 rounded-xl cursor-pointer transition-all ${
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
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-lg">
                        {difficulty.grade}
                      </span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg text-gray-900">{difficulty.name}</div>
                      <div className="text-sm text-gray-500">{difficulty.description}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">🌍 언어 선택</h3>
            <p className="text-gray-600 mb-8">학습지에 사용할 언어를 선택해주세요</p>
            <div className="max-w-md mx-auto">
              <select
                {...register('language', { required: '언어를 선택해주세요' })}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">언어를 선택하세요</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="en">🇺🇸 English</option>
                <option value="bilingual">🌐 이중언어 (한국어 + English)</option>
              </select>
              {errors.language && (
                <p className="mt-3 text-sm text-red-600">{errors.language.message}</p>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">📋 최종 확인</h3>
            <p className="text-gray-600 mb-8">입력한 정보를 확인하고 학습지를 생성하세요</p>
            <div className="bg-gray-50 rounded-xl p-6 max-w-2xl mx-auto text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-semibold text-gray-700">카테고리:</span>
                  <p className="text-gray-900">{categories.find(c => c.id === watch('category'))?.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">주제:</span>
                  <p className="text-gray-900">{generateTopicFromCategoryData() || '입력 중...'}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">난이도:</span>
                  <p className="text-gray-900">{difficulties.find(d => d.id === watch('difficulty'))?.name}</p>
                </div>
                <div>
                  <span className="font-semibold text-gray-700">언어:</span>
                  <p className="text-gray-900">
                    {watch('language') === 'ko' ? '🇰🇷 한국어' : 
                     watch('language') === 'en' ? '🇺🇸 English' : 
                     watch('language') === 'bilingual' ? '🌐 이중언어' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (showWorksheet && generatedWorksheet) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">

        <div className="max-w-6xl mx-auto px-4">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowWorksheet(false)}
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-4"
            >
              <ArrowLeft size={20} />
              <span>다시 만들기</span>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">생성된 학습지</h1>
          </div>

          {/* A4 비율 학습지 */}
          <div className="bg-white shadow-2xl rounded-lg overflow-hidden worksheet-content mx-auto" style={{ aspectRatio: '1/1.414', maxHeight: '80vh', width: '100%', maxWidth: '800px' }}>
            <div className="p-6 h-full overflow-y-auto" style={{ minWidth: '600px' }}>
              {/* 학습지 헤더 */}
              <div className="flex justify-between items-start mb-6">
                <div className="text-left">
                  <div className="text-sm text-gray-500 mb-1">이름: _________________</div>
                  <div className="text-sm text-gray-500">날짜: _________________</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-700">{generatedWorksheet.category}</div>
                  <div className="text-sm text-gray-500">{generatedWorksheet.difficulty}</div>
                </div>
              </div>

              {/* 메인 제목 */}
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                {generatedWorksheet.topic} 학습지
              </h1>

              {/* 읽기 자료 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📖 읽기 자료</h2>
                <div className="text-gray-700 leading-relaxed text-justify px-2">
                  {generatedWorksheet.content.reading}
                </div>
              </div>

              {/* 어휘 섹션 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📚 어휘</h2>
                <div className="space-y-3 px-2">
                  {generatedWorksheet.content.vocabulary.map((vocab: any, index: number) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-semibold text-gray-900">{vocab.word}</div>
                      <div className="text-gray-700 text-sm">의미: {vocab.definition}</div>
                      <div className="text-gray-600 text-sm">예문: {vocab.example}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 문제 섹션 */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">❓ 문제</h2>
                <div className="space-y-6 px-2">
                  <div>
                    <div className="font-medium text-gray-900 mb-2">1. 주요 질문</div>
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[60px] mb-3">
                      {generatedWorksheet.content.questions.main}
                    </div>
                    <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-2">2. 심화 질문</div>
                    <div className="bg-gray-50 p-3 rounded-lg min-h-[60px] mb-3">
                      {generatedWorksheet.content.questions.extended}
                    </div>
                    <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300"></div>
                    </div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 mb-2">3. 생각해보기</div>
                    <div className="bg-gray-300 p-3 rounded-lg min-h-[60px] mb-3">
                      {generatedWorksheet.content.questions.reflection}
                    </div>
                    <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300 mb-2"></div>
                      <div className="h-6 border-b border-gray-300"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 토론 주제 */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-3">💬 토론 주제 (찬성/반대)</h2>
                <div className="bg-gray-50 p-3 rounded-lg px-2 mb-3">
                  {generatedWorksheet.content.discussion}
                </div>
                <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300"></div>
                </div>
              </div>

              {/* 빈칸 채우기 문제 */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-3">📝 빈칸 채우기</h2>
                <div className="bg-gray-50 p-3 rounded-lg px-2 mb-3">
                  {typeof generatedWorksheet.content.summary === 'string' 
                    ? generatedWorksheet.content.summary 
                    : generatedWorksheet.content.summary.passage}
                </div>
                {typeof generatedWorksheet.content.summary === 'object' && generatedWorksheet.content.summary.options && (
                  <div className="bg-blue-50 p-3 rounded-lg mb-3">
                    <h3 className="font-semibold text-gray-700 mb-2">보기:</h3>
                    <div className="flex flex-wrap gap-2">
                      {generatedWorksheet.content.summary.options.map((option: string, index: number) => (
                        <span key={index} className="bg-white px-3 py-1 rounded border text-sm">
                          {option}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-white border border-gray-300 rounded-lg p-4 mt-2">
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300 mb-2"></div>
                  <div className="h-6 border-b border-gray-300"></div>
                </div>
              </div>

              {/* 푸터 */}
              <div className="mt-8 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>© Kowrite.com</span>
                  <span>한국 문화 학습지</span>
                </div>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex justify-center mt-8 print-hide">
            <button 
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🖨️ 인쇄하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-8">
      {/* 로딩 화면 */}
      <LoadingScreen 
        isVisible={isGenerating}
        progress={loadingProgress}
        currentStep={loadingStep}
        onComplete={() => setIsGenerating(false)}
      />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎓 학습지 자동 생성
          </h1>
          <p className="text-xl text-gray-600">
            단계별로 정보를 입력하면 AI가 자동으로 학습지를 만들어드립니다
          </p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  index + 1 < currentStep
                    ? 'bg-green-500 text-white'
                    : index + 1 === currentStep
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {index + 1 < currentStep ? <Check size={20} /> : index + 1}
                </div>
                {index < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 단계별 내용 */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
              currentStep === 1
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-600 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft size={20} />
            <span>이전</span>
          </button>

          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>다음</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isGenerating}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                isGenerating
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  <span>AI 학습지 생성하기</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorksheetGenerator;
