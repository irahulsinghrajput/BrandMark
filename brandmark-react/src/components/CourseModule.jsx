import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export const CourseModule = ({ module, onNext, onPrev, isFirst, isLast, onCompleteModule }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const handleSelectOption = (questionIdx, optionIdx) => {
    if (quizSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const handleCheckQuiz = () => {
    if (Object.keys(selectedAnswers).length < (module.quiz?.length || 0)) {
      toast.error('Please answer all 3 questions before submitting.');
      return;
    }
    setQuizSubmitted(true);
    let correctCount = 0;
    (module.quiz || []).forEach((q, i) => {
      if (selectedAnswers[i] === q.correctIndex) correctCount++;
    });

    if (correctCount >= 2) {
      toast.success(`Great job! You scored ${correctCount}/${module.quiz.length}`);
      if (onCompleteModule) onCompleteModule(module.id);
    } else {
      toast.error(`You scored ${correctCount}/${module.quiz.length}. Review the explanations and retry.`);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setQuizSubmitted(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 md:p-10 rounded-3xl border border-brand-border-light shadow-sm relative w-full mb-8"
    >
      {/* Badge & Duration */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        {module.badge && (
          <span className="px-3 py-1 bg-brand-orange/10 text-brand-orange font-extrabold text-xs uppercase tracking-wider rounded-md">
            {module.badge}
          </span>
        )}
        <span className="px-3 py-1 bg-brand-bg-light text-brand-navy font-bold text-xs rounded-md">
          ⏱ {module.duration}
        </span>
      </div>

      <h1 className="text-2xl md:text-3xl font-black text-brand-navy mb-8 leading-tight">
        {module.title}
      </h1>
      
      {/* Rich Markdown & Content Rendering */}
      <div className="prose prose-lg text-brand-text-body mb-12 max-w-none space-y-4 text-sm md:text-base leading-relaxed">
        {module.content.split('\n').map((paragraph, idx) => {
          const trimmed = paragraph.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-xl md:text-2xl font-black text-brand-navy pt-4 pb-1 border-b border-gray-100 flex items-center gap-2">
                {trimmed.replace('### ', '')}
              </h3>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h4 key={idx} className="text-base md:text-lg font-extrabold text-brand-orange pt-2">
                {trimmed.replace('#### ', '')}
              </h4>
            );
          }

          // Code blocks
          if (trimmed.startsWith('```') || paragraph.includes('```')) {
            const cleanCode = paragraph.replace(/```(javascript|html|css|json|markdown|dockerfile)?/g, '').replace(/```/g, '').trim();
            if (!cleanCode) return null;
            return (
              <pre key={idx} className="bg-[#0b1626] text-gray-100 p-5 rounded-2xl overflow-x-auto text-xs font-mono my-4 shadow-inner border border-gray-800">
                <code>{cleanCode}</code>
              </pre>
            );
          }

          // Bullet points
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <li key={idx} className="ml-4 list-disc text-gray-700 pl-1">
                {content.split(/(\*\*.*?\*\*)/).map((part, i) => 
                  part.startsWith('**') && part.endsWith('**') ? (
                    <strong key={i} className="text-brand-navy font-bold">{part.slice(2, -2)}</strong>
                  ) : part
                )}
              </li>
            );
          }

          // Standard paragraph with bolding
          const boldedText = paragraph.split(/(\*\*.*?\*\*)/).map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="text-brand-navy font-bold">{part.slice(2, -2)}</strong>;
            }
            return part;
          });

          return <p key={idx} className="text-gray-700">{boldedText}</p>;
        })}
      </div>

      {/* Interactive Module Knowledge Check Quiz */}
      {module.quiz && module.quiz.length > 0 && (
        <div className="mt-10 pt-8 border-t border-brand-border-light bg-brand-bg-light/60 p-6 md:p-8 rounded-3xl border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                Knowledge Check
              </span>
              <h3 className="text-xl font-extrabold text-brand-navy">
                Test Your Comprehension (3 Questions)
              </h3>
            </div>
            {quizSubmitted && (
              <button
                onClick={handleResetQuiz}
                className="text-xs text-brand-orange hover:underline font-bold"
              >
                ↻ Retake Quiz
              </button>
            )}
          </div>

          <div className="space-y-6">
            {module.quiz.map((q, qIdx) => (
              <div key={qIdx} className="bg-white p-5 rounded-2xl border border-brand-border-light shadow-sm">
                <h4 className="font-extrabold text-sm text-brand-navy mb-3">
                  {qIdx + 1}. {q.question}
                </h4>
                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedAnswers[qIdx] === optIdx;
                    const isCorrect = q.correctIndex === optIdx;
                    let optionStyle = "border-gray-200 hover:bg-gray-50 text-gray-700";

                    if (quizSubmitted) {
                      if (isCorrect) {
                        optionStyle = "bg-green-50 border-green-400 text-green-800 font-bold";
                      } else if (isSelected && !isCorrect) {
                        optionStyle = "bg-red-50 border-red-400 text-red-800 line-through";
                      }
                    } else if (isSelected) {
                      optionStyle = "bg-brand-orange/10 border-brand-orange text-brand-orange font-bold";
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(qIdx, optIdx)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionStyle}`}
                      >
                        <span>{opt}</span>
                        {quizSubmitted && isCorrect && <span className="text-green-600 font-black">✓ Correct</span>}
                        {quizSubmitted && isSelected && !isCorrect && <span className="text-red-500 font-black">✗</span>}
                      </button>
                    );
                  })}
                </div>

                {quizSubmitted && (
                  <p className="mt-3 text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                    💡 <strong className="text-brand-navy">Explanation:</strong> {q.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            {!quizSubmitted ? (
              <button
                onClick={handleCheckQuiz}
                className="px-6 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-extrabold text-xs rounded-xl shadow-md transition-all"
              >
                Submit Answers
              </button>
            ) : (
              <span className="text-xs text-brand-navy font-bold flex items-center gap-1.5">
                <span>✓</span> Quiz Completed
              </span>
            )}
          </div>
        </div>
      )}
      
      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-8 mt-8 border-t border-brand-border-light">
        <button 
          disabled={isFirst}
          onClick={onPrev}
          className="px-6 py-3 border border-brand-border-light rounded-xl font-bold text-xs uppercase tracking-wider text-brand-navy hover:bg-brand-bg-light disabled:opacity-40 transition-colors"
        >
          &larr; Previous Module
        </button>
        <button 
          disabled={isLast}
          onClick={onNext}
          className="px-6 py-3 bg-brand-orange text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-brand-orange-dark disabled:opacity-40 shadow-md transition-all hover:shadow-lg"
        >
          Next Module &rarr;
        </button>
      </div>
    </motion.div>
  );
};
