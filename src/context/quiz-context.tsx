import React, { createContext, ReactNode, useEffect, useState } from 'react';
import quizzes from '../data/quizzes.json';
import { shuffle } from '../lib/utils';

// Interfacce per i dati del quiz
export interface Question {
  id: string;
  label?: string;
  title?: string;
  type: 'selection' | 'number' | 'text' | 'multiselect';
  correctAnswers?: string[];
  options?: string[];
}

export interface AdditionalSection {
  id: string;
  title: string;
  trigger: string;
  questions: Question[];
}

export interface Quiz {
  id: string;
  index: number;
  group: string;
  title: string;
  type: 'selection' | 'number' | 'text' | 'multiselect';
  options?: string[];
  correctAnswers?: string[];
  additionalSection?: AdditionalSection;
}

// Definisci il tipo per lo stato del quiz
export interface QuizState {
  selectedAnswers: Record<string, Record<string, { answers: string[], additionalAnswers: Record<string, { answers: string[] }> }>>;
  setSelectedAnswers: React.Dispatch<React.SetStateAction<Record<string, Record<string, { answers: string[], additionalAnswers: Record<string, { answers: string[] }> }>>>>;
  isVerified: boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  answers: Record<string, { total: number; errors: number; questions: Record<string, number> }>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, { total: number; errors: number; questions: Record<string, number> }>>>;
  randomQuestions: Quiz[];
  genRandomQuestions: (numberOfQuestions: number) => void;
  setSingleQuestion: (quizId: string) => void;
  setRandomQuestions: React.Dispatch<React.SetStateAction<Quiz[]>>;
  questions: Quiz[];
  setQuestions: React.Dispatch<React.SetStateAction<Quiz[]>>;
  hasError: (quizId: string, questionId: string) => boolean;
  completed: boolean;
}


// Crea il contesto con un valore predefinito
export const QuizContext = createContext<QuizState | undefined>(undefined);

// Crea un provider per il contesto
export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize selectedAnswers with the new structure
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, Record<string, { answers: string[], additionalAnswers: Record<string, { answers: string[] }> }>>>(() => {
    const savedAnswers = localStorage.getItem('selectedAnswers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const [answers, setAnswers] = useState<Record<string, { total: number; errors: number; questions: Record<string, number> }>>(() => {
    const savedAnswers = localStorage.getItem('answers');
    return savedAnswers ? JSON.parse(savedAnswers) : {};
  });

  const [randomQuestions, setRandomQuestions] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<Quiz[]>([]);

  const hasError = (quizId: string, questionId: string) => {
    if (!(quizId in selectedAnswers)) {
      return true;
    }
    if (!(questionId in selectedAnswers[quizId])) {
      return true;
    }

    return selectedAnswers[quizId][questionId].errors;
  }

  const genRandomQuestions = (numberOfQuestions: number): void => {
    setRandomQuestions([]);
    
    const q = shuffle(quizzes).slice(0, numberOfQuestions)
    console.log("Shuffled Quizzes:", q);
    setRandomQuestions(q);
  };

  const setSingleQuestion = (quizId: string): void => {
    setRandomQuestions(quizzes.filter((q) => q.id === quizId));
  };

  useEffect(() => {
      // Check if all questions have been answered, including additional questions
      let allAnswered = true;
      for (let i = 0; i < randomQuestions.length; i++) {
        const quiz = randomQuestions[i];
        if (!(quiz.id in selectedAnswers) || !(quiz.id in selectedAnswers[quiz.id])) {
          allAnswered = false;
          break;
        } 
        
        // Check if the main question has been answered
        const mainAnswer = selectedAnswers[quiz.id][quiz.id].answers;
        if (!mainAnswer || mainAnswer.length === 0) {
          allAnswered = false;
          break;
        }
        
        // If there's an additional section and the trigger condition is met, check those questions too
        if (quiz.additionalSection && mainAnswer[0] === quiz.additionalSection.trigger) {
          for (const question of quiz.additionalSection.questions) {
            if (!(question.id in selectedAnswers[quiz.id])) {
              allAnswered = false;
              break;
            }
            
            // Check if the additional question has been answered
            const additionalAnswer = selectedAnswers[quiz.id][question.id].answers;
            if (!additionalAnswer || additionalAnswer.length === 0) {
              allAnswered = false;
              break;
            }
          }
        }
      }
      setCompleted(allAnswered);     
  }, [selectedAnswers, randomQuestions]);

  return (
    <QuizContext.Provider value={{ selectedAnswers, setSelectedAnswers, isVerified, setIsVerified, answers, setAnswers, randomQuestions, setRandomQuestions, questions, setQuestions, hasError, completed, genRandomQuestions, setSingleQuestion }}>
      {children}
    </QuizContext.Provider>
  );
};
