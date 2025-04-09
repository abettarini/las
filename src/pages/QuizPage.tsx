import QuizGroup from '@/components/quiz/quiz-group';
import ResultsDialog from '@/components/result-dialog';
import { Button } from '@/components/ui/button';
import { ListChecks, RotateCcw } from "lucide-react";
import React, { useEffect, useState } from 'react';
import { useQuizContext } from '../hooks/use-quiz-context';
import { cn } from '../lib/utils';

interface QuizPageProps {
  numQuestions?: number; // Optional prop to specify the number of questions to display
  quizId?: string; // Optional prop to specify a single quiz to display
}

const QuizPage: React.FC<QuizPageProps> = ({ quizId, numQuestions }) => {
  const { answers, setIsVerified, isVerified, setSelectedAnswers, setAnswers, setRandomQuestions, randomQuestions, selectedAnswers, completed, genRandomQuestions, setSingleQuestion } = useQuizContext();
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [finalResults, setFinalResults] = useState<{ score: number; totalQuestions: number; totalIncorrect: number } | null>(null);
  const [results, setResults] = useState<{ total: number; errors: number; questionIds: string[] }>({ total: 0, errors: 0, questionIds: [] });


  useEffect(() => {
    // Azzerare le variabili di contesto all'ingresso della pagina
    setSelectedAnswers({});
    setIsVerified(false);

    if (quizId) {
      setSingleQuestion(quizId);
    } else {
      genRandomQuestions(numQuestions || 7);
    }

  }, [setSelectedAnswers, setAnswers, setIsVerified, setRandomQuestions]);

  useEffect(() => {
    if (isVerified) {
      prepareResults();
    }
  }, [isVerified]);

  useEffect(() => {
    if (isVerified && showFinalResults) {
      const correctAnswers = results.total - results.errors;
      const score = (correctAnswers / results.total) * 100;
      setFinalResults({ score, totalQuestions: results.total, totalIncorrect: results.errors });
    }
  }, [isVerified, showFinalResults, results]);

  const verifyAllAnswers = () => {
    setIsVerified(true);
    setShowFinalResults(true);
  };

  const prepareResults = () => {
    let total = 0;
    let errors = 0;
    let questionIds: string[] = [];

    randomQuestions.forEach((quiz) => {
      total++;
      if (!(quiz.id in selectedAnswers) || !(quiz.id in selectedAnswers[quiz.id])) {
        errors++;
        questionIds.push(quiz.id);
        setResults({ ...results, total, errors, questionIds });
        return;
      }
      const quizAnswers = selectedAnswers[quiz.id][quiz.id].answers;
      const correctAnswers = quiz.correctAnswers || [];
      if (!quizAnswers || (JSON.stringify(correctAnswers.sort()) !== JSON.stringify(quizAnswers.sort())) ) {
        errors++;
        questionIds.push(quiz.id);
      } 
      setResults({ ...results, total, errors, questionIds });

      if (quiz.additionalSection) {
        quiz.additionalSection.questions.forEach((question) => {
          total++;
          if (!(question.id in selectedAnswers[quiz.id])) {
            errors++;
            questionIds.push(question.id);
            setResults({ ...results, total, errors, questionIds });
            return;
          }
          const additionalAnswers = selectedAnswers[quiz.id][question.id].answers;
          const correctAdditionalAnswers = question.correctAnswers || [];
          if (!additionalAnswers || (JSON.stringify(correctAdditionalAnswers.sort()) !== JSON.stringify(additionalAnswers.sort())) ) {
            errors++;
            questionIds.push(question.id);
          }
          setResults({ ...results, total, errors, questionIds });
        });
      }
    });
  }

  const resetQuiz = () => {
    setIsVerified(false);
    setResults({ total: 0, errors: 0, questionIds: [] });
    setShowFinalResults(false);
    setFinalResults(null);
    // if (quizId) {
    //   setSingleQuestion(quizId);
    // } else {
    //   genRandomQuestions(numQuestions || 15);
    // }
  }

  return (
    <>
    <h1 className="text-3xl font-bold mb-8 text-center my-8">Test per rilascio del Diploma Abilitazione Maneggio Armi </h1>
      <p className="text-center text-muted-foreground">
        Ambiente per esercitarsi con i test disponibili.
      </p>
    <section className="relative py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-12 items-center">
          <QuizGroup quizzes={randomQuestions} />
        </div>
        <Button onClick={verifyAllAnswers} className={cn(
              "verify-button mt-4",
              !completed
                ? "bg-gray-300 cursor-not-allowed rounded-md p-2"
                : "bg-blue-500 text-white  hover:bg-primary-dark p-2 rounded-md transition duration-300 ease-in-out",
            )} disabled={!completed}>
          <ListChecks /> Verifica
        </Button>
        <Button className={cn(
          "ml-2 bg-secondary-lighter text-secondary-dark border"
         )} onClick={() => resetQuiz()}><RotateCcw /> Reset</Button>
        {showFinalResults && finalResults && (
          <div className="final-results">
            <p>Final Score: {finalResults.score.toFixed(2)}%</p>
            <p>Total Questions: {finalResults.totalQuestions}</p>
            <p>Total Incorrect: {finalResults.totalIncorrect}</p>
            <p>{finalResults.score >= 80 ? 'Passed' : 'Failed'}</p>
            {Object.entries(answers).map(([groupId, { questions }]) => (
              <div key={groupId}>
                <h3>{groupId} Results:</h3>
                {Object.entries(questions).map(([questionId, isCorrect]) => (
                  <div key={questionId} className={`question-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <span className={`icon ${isCorrect ? 'icon-correct' : 'icon-incorrect'}`}></span>
                    {/* <p>{quizzes.groups[groupId].find(q => q.id === questionId)?.question}</p> */}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {showFinalResults && finalResults && (
          <ResultsDialog
            finalResults={finalResults}
            successThreshold={80}
            onClose={() => setShowFinalResults(false)}
          />
        )}
      </div>
    </section>
    </>
  );
};

export default QuizPage;

