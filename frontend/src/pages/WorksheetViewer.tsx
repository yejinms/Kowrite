import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Edit3, Printer, Share2, BookOpen, History, User, Music, Film } from 'lucide-react';
import html2pdf from 'html2pdf.js';
import toast from 'react-hot-toast';

interface Worksheet {
  id: string;
  title: string;
  category: string;
  topic: string;
  difficulty: string;
  language: string;
  content: {
    reading: string;
    vocabulary: Array<{
      word: string;
      definition: string;
      example: string;
    }>;
    questions: {
      main: string;
      extended: string;
      reflection: string;
    };
    discussion: string;
    summary: string;
  };
  createdAt: string;
}

const WorksheetViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: API에서 학습지 데이터 가져오기
    fetchWorksheet();
  }, [id]);

  const fetchWorksheet = async () => {
    try {
      // 임시 데이터 (실제로는 API 호출)
      const mockWorksheet: Worksheet = {
        id: '1',
        title: 'BTS 「봄날」 학습지',
        category: 'kpop',
        topic: 'BTS 봄날',
        difficulty: 'intermediate',
        language: 'ko',
        content: {
          reading: '「봄날」은 방탄소년단(BTS)의 노래로, 그리움과 기다림을 담고 있습니다. 노랫말 속에는 계절의 변화가 친구와의 재회에 대한 기다림을 비유적으로 표현하고 있어요.',
          vocabulary: [
            { word: '그리움', definition: '보고 싶어 하는 마음', example: '친구가 그리워서 전화를 걸었다.' },
            { word: '기다림', definition: '어떤 일이 일어나기를 바라며 시간을 보내는 것', example: '버스를 기다리는 동안 책을 읽었다.' },
            { word: '비유', definition: '어떤 것을 다른 것에 빗대어 표현하는 것', example: '그는 사자처럼 용감하다.' },
            { word: '계절', definition: '봄, 여름, 가을, 겨울과 같은 시간의 흐름', example: '한국은 사계절이 뚜렷하다.' }
          ],
          questions: {
            main: '「봄날」의 노래 가사에서 표현된 주된 감정은 무엇인가요?',
            extended: '여러분은 누군가를 오래 기다린 경험이 있나요? 그때 어떤 기분이었나요?',
            reflection: '"음악은 마음을 위로할 수 있을까?"라는 질문에 대한 나의 생각을 적어보세요.'
          },
          discussion: '음악은 글이나 말보다 더 큰 힘을 가질 수 있다. 찬성 vs 반대',
          summary: '오늘 학습에서 새롭게 알게 된 점을 3가지 정리해봅시다.'
        },
        createdAt: new Date().toISOString()
      };
      
      setWorksheet(mockWorksheet);
    } catch (error) {
      toast.error('학습지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      book: BookOpen,
      history: History,
      person: User,
      kpop: Music,
      drama: Film
    };
    const Icon = icons[category as keyof typeof icons] || BookOpen;
    return <Icon size={24} />;
  };

  const getCategoryName = (category: string) => {
    const names = {
      book: '📖 책',
      history: '🏛 역사',
      person: '👤 인물',
      kpop: '🎶 K-Pop',
      drama: '🎬 드라마/영화'
    };
    return names[category as keyof typeof names] || '📖 책';
  };

  const getDifficultyName = (difficulty: string) => {
    const names = {
      beginner: '초급 (K-2)',
      intermediate: '중급 (3-8)',
      advanced: '고급 (9-12)'
    };
    return names[difficulty as keyof typeof names] || '중급';
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('worksheet-content');
    if (!element) return;

    const opt = {
      margin: 1,
      filename: `${worksheet?.title || '학습지'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
    toast.success('PDF 다운로드가 시작되었습니다!');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: worksheet?.title || '학습지',
          text: `${worksheet?.topic}에 대한 학습지입니다.`,
          url: window.location.href
        });
      } catch (error) {
        console.log('공유가 취소되었습니다.');
      }
    } else {
      // 클립보드에 링크 복사
      navigator.clipboard.writeText(window.location.href);
      toast.success('링크가 클립보드에 복사되었습니다!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">학습지를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!worksheet) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">학습지를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getCategoryIcon(worksheet.category)}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{worksheet.title}</h1>
              <p className="text-gray-600">{getCategoryName(worksheet.category)} • {getDifficultyName(worksheet.difficulty)}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit3 size={16} />
              <span>{isEditing ? '보기' : '편집'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={16} />
              <span>PDF</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Printer size={16} />
              <span>인쇄</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Share2 size={16} />
              <span>공유</span>
            </button>
          </div>
        </div>
      </div>

      {/* 학습지 내용 */}
      <div id="worksheet-content" className="bg-white rounded-xl shadow-lg p-8 print:shadow-none">
        {/* 읽기 자료 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📖</span> 읽기 자료
          </h2>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <p className="text-gray-800 leading-relaxed">{worksheet.content.reading}</p>
          </div>
        </section>

        {/* 어휘 정리 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🗂</span> 어휘 정리
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {worksheet.content.vocabulary.map((vocab, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="font-bold text-blue-600 text-lg mb-2">{vocab.word}</div>
                <div className="text-gray-700 mb-2">{vocab.definition}</div>
                <div className="text-sm text-gray-600 italic">예문: {vocab.example}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 핵심 질문 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">❓</span> 핵심 질문
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
            <p className="text-gray-800 text-lg">{worksheet.content.questions.main}</p>
          </div>
        </section>

        {/* 확장 질문 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔍</span> 확장 질문
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
            <p className="text-gray-800 text-lg">{worksheet.content.questions.extended}</p>
          </div>
        </section>

        {/* 내 생각 정리 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">✏️</span> 내 생각 정리
          </h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r-lg p-6">
            <p className="text-gray-800 text-lg mb-4">{worksheet.content.questions.reflection}</p>
            <div className="bg-white border border-gray-300 rounded-lg p-4 min-h-[100px]">
              <p className="text-gray-500">여기에 답을 작성하세요...</p>
            </div>
          </div>
        </section>

        {/* 토론 주제 */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">⚖️</span> 토론 주제
          </h2>
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
            <p className="text-gray-800 text-lg font-semibold">{worksheet.content.discussion}</p>
          </div>
        </section>

        {/* 마무리 학습 */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">📌</span> 마무리 학습
          </h2>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
            <p className="text-gray-800 text-lg mb-4">{worksheet.content.summary}</p>
            <ol className="list-decimal list-inside space-y-2">
              <li className="bg-white border border-gray-300 rounded p-2 min-h-[40px]">
                <span className="text-gray-500">첫 번째...</span>
              </li>
              <li className="bg-white border border-gray-300 rounded p-2 min-h-[40px]">
                <span className="text-gray-500">두 번째...</span>
              </li>
              <li className="bg-white border border-gray-300 rounded p-2 min-h-[40px]">
                <span className="text-gray-500">세 번째...</span>
              </li>
            </ol>
          </div>
        </section>
      </div>

      {/* 인쇄 시 숨길 요소들 */}
      <style jsx>{`
        @media print {
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>
    </div>
  );
};

export default WorksheetViewer;
