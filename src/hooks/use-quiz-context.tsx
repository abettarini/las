import { useContext } from "react";
import { QuizContext, QuizState } from "../context/quiz-context";

// Custom hook per utilizzare il contesto
export const useQuizContext = (): QuizState => {
    const context = useContext(QuizContext);
    if (!context) {
      throw new Error('useQuizContext must be used within a QuizProvider');
    }
    return context;
  };