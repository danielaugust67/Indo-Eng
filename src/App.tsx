import React, { useEffect, useState } from 'react';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';
import { generateTranslationQuestion } from './api/gemini';

type Category = 'greetings' | 'daily activities' | 'food' | 'numbers';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
  id: number;
  indonesian: string;
  english: string;
  category: Category;
  difficulty: Difficulty;
}

function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('greetings');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [answer, setAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loadingNewQuestion, setLoadingNewQuestion] = useState(false);

  const categoryQuestions = questions.filter(
    q => q.category === selectedCategory && q.difficulty === difficulty
  );
  const currentQuestion = categoryQuestions[currentQuestionIndex];

  const isCorrect = answer.toLowerCase().trim() === currentQuestion?.english.toLowerCase();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResult(true);
  };

  const handleGenerateNewQuestion = async () => {
    setLoadingNewQuestion(true);
    const newQ = await generateTranslationQuestion(selectedCategory, difficulty);
    if (newQ) {
      const newQuestion: Question = {
        id: questions.length + 1,
        indonesian: newQ.indonesian,
        english: newQ.english,
        category: selectedCategory,
        difficulty: difficulty,
      };
      setQuestions(prev => [...prev, newQuestion]);
      setCurrentQuestionIndex(
        questions.filter(q => q.category === selectedCategory && q.difficulty === difficulty).length
      );
      setShowResult(false);
      setAnswer('');
    }
    setLoadingNewQuestion(false);
  };

  useEffect(() => {
    if (categoryQuestions.length === 0) {
      handleGenerateNewQuestion();
    }
  }, [selectedCategory, difficulty]);

  useEffect(() => {
    if (isCorrect && showResult) {
      const timeout = setTimeout(() => {
        handleGenerateNewQuestion();
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isCorrect, showResult]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Indonesian - English Practice
            </h1>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value as Category);
                setCurrentQuestionIndex(0);
                setShowResult(false);
                setAnswer('');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="greetings">Greetings</option>
              <option value="daily activities">Daily Activities</option>
              <option value="food">Food</option>
              <option value="numbers">Numbers</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => {
                setDifficulty(e.target.value as Difficulty);
                setCurrentQuestionIndex(0);
                setShowResult(false);
                setAnswer('');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {categoryQuestions.length === 0 || !currentQuestion ? (
            <p className="text-center text-gray-500">Loading question...</p>
          ) : (
            <>
              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-lg font-medium text-gray-700">
                  Translate to English:
                </p>
                <p className="text-xl font-bold text-indigo-700 mt-2">
                  {currentQuestion.indonesian}
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    disabled={showResult}
                  />
                </div>

                {!showResult ? (
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Check Answer
                  </button>
                ) : (
                  <div>
                    <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <XCircle className="w-6 h-6" />
                      )}
                      <p className="font-medium">
                        {isCorrect
                          ? 'Correct! Well done!'
                          : `Incorrect. The correct answer is: "${currentQuestion.english}"`}
                      </p>
                    </div>

                    {!isCorrect && (
                      <button
                        onClick={() => setShowResult(false)}
                        className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        Try Again
                      </button>
                    )}
                  </div>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
