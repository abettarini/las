import React from 'react';
import { AdditionalSection, Quiz } from '../../context/quiz-context';
import { useQuizContext } from '../../hooks/use-quiz-context';
import { cn } from '../../lib/utils';
import { QuizCheckboxes } from './components/checkboxes';
import { QuizInput } from './components/input';
import { QuizRadioGroup } from './components/radio-group';
interface QuizGroupProps {
  quizzes: Quiz[];
}

const QuizGroup: React.FC<QuizGroupProps> = ({ quizzes }) => {
  const { selectedAnswers, setSelectedAnswers, hasError, isVerified } = useQuizContext();

  const handleCheckboxGroupChange = (quizId: string, questionId: string) => (values: string[]) => {
    const correctAnswers = quizzes.find(q => q.id === quizId)?.correctAnswers || [];
    const errors = JSON.stringify(values.sort()) !== JSON.stringify(correctAnswers.sort());

    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: {
          answers: values, // Assuming only one selection per group
          errors: errors // Reset error state when changing an answer
        }
      }
    }));
  };

  const handleRadioGroupChange = (quizId: string, questionId: string) => (value: string) => {
    let correctAnswers: string[] = [];
    if (quizId !== questionId) {
      const additionalSection = quizzes.find(q => q.id === quizId)?.additionalSection;
      if (additionalSection) {
        const matchingQuestion = additionalSection.questions.find(q => q.id === questionId);
        if (matchingQuestion) {
          correctAnswers = matchingQuestion.correctAnswers || [];
        } else {
          console.error("Matching question not found.");
        }
      }
    } else {
      correctAnswers = quizzes.find(q => q.id === quizId)?.correctAnswers || [];
    }
    const errors = value !== correctAnswers[0];

    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: {
          answers: [value], // Assuming only one selection per group
          errors: errors // Reset error state when changing an answer
        }
      }
    }));
  };

  const handleInputChange = (quizId: string, questionId: string) => (value: string) => {
    let correctAnswers: string[] = [];
    if (quizId !== questionId) {
      const additionalSection = quizzes.find(q => q.id === quizId)?.additionalSection;
      if (additionalSection) {
        const matchingQuestion = additionalSection.questions.find(q => q.id === questionId);
        if (matchingQuestion) {
          correctAnswers = matchingQuestion.correctAnswers || [];
        } else {
          console.error("Matching question not found.");
        }
      }
    } else {
      correctAnswers = quizzes.find(q => q.id === quizId)?.correctAnswers || [];
    }

    const errors = value.toLowerCase() !== correctAnswers[0].toLowerCase();
    setSelectedAnswers(prev => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: {
          answers: value.split(',').map(v => v.trim()),
          errors: errors
        }
      }
    }));
  };

  const handleAnswerChange = (quizId: string, questionId: string, type: 'selection' | 'multiselect' | 'number' | 'text') => (e: React.ChangeEvent<HTMLInputElement> | string) => {
    setSelectedAnswers((prev) => {
        const currentAnswers = prev[quizId]?.[questionId]?.answers || [];
        let updatedAnswers;

        if (type === 'selection' || type === 'number' || type === 'text') {
            // For single-answer questions, replace the current answer
            updatedAnswers = [e];
        } else {
            return prev; // Default return if type is not recognized
        }

        // Check correctness
        
        let correctAnswers: string[] = [];

        if (quizId === questionId) {
            correctAnswers = quizzes.find(q => q.id === quizId)?.correctAnswers || [];
        } else {
            const additionalSection = quizzes.find(q => q.id === quizId)?.additionalSection;
            if (additionalSection) {
                const matchingQuestion = additionalSection.questions.find(q => q.id === questionId);
                if (matchingQuestion) {
                    correctAnswers = matchingQuestion.correctAnswers || [];
                } else {
                  console.error("Matching question not found.");
                  return prev;
                }
            }
        }

        // Verifica che correctAnswers e updatedAnswers siano uguali in ordine
        const errors = JSON.stringify(updatedAnswers.sort()) !== JSON.stringify(correctAnswers.sort());
        const retval = {
            ...prev,
            [quizId]: {
                ...prev[quizId],
                [questionId]: {
                    answers: updatedAnswers,
                    errors,
                },
            },
        };
        return retval;
    });    
  };

  const renderQuestion = (quiz: Quiz) => {
    const { id, index, title, type, options, additionalSection } = quiz;
    const overrideClasses = cn(
      {'bg-red-500 text-white p-2 rounded mb-2': isVerified && hasError(quiz.id, id)},
      {'bg-green-500 text-white p-2 rounded mb-2': isVerified && !hasError(quiz.id, id)},
      {'bg-gray-100 p-2 rounded mb-2': !isVerified}
    );
    return (
      <div key={id} className={overrideClasses}>
        <h3 className="font-bold mb-4">{index} - {title}</h3>
        { type === 'selection' && (
          <QuizRadioGroup
            label={title}
            id={id}
            type={type}
            options={options || []}
            onValueChange={handleRadioGroupChange(id, id)} />
        )}
        { type === 'multiselect' && (
            <QuizCheckboxes 
              label={title}
              id={id}
              type={type}
              options={options || []}
              onChange={handleCheckboxGroupChange(id, id)} />
        )}
        {type === 'text' || type === 'number' && (
          <QuizInput 
            label={title}
            id={id}
            type={type}
            onChange={handleInputChange(id, id)}
          />
        )}
        {additionalSection && renderAdditionalQuestions(quiz, additionalSection)}
      </div>
    );
  };

  const renderAdditionalQuestions = (quiz: Quiz, additionalSection: AdditionalSection) => {
    const { title, trigger, questions } = additionalSection;
    const { id } = quiz;
    const mainAnswer = selectedAnswers[quiz.id]?.[quiz.id]?.answers[0];

    if (mainAnswer === trigger) {
      return (
        <div key={id} className="mt-4 bg-gray-100 p-2 rounded-md">
          <h4 className="">{title}</h4>
          {questions.map((q) => (
            <div key={q.id}>
              <h5>{q.title}</h5>
              <label htmlFor="">{q.label}</label>
              { q.type === 'selection' && (
                <QuizRadioGroup
                  label={title}
                  id={id}
                  type={q.type}
                  options={q.options || []}
                  onValueChange={handleRadioGroupChange(id, q.id)} />
              )}
              { q.type === 'multiselect' && (
                  <QuizCheckboxes 
                    label={title}
                    id={id}
                    type={q.type}
                    options={q.options || []}
                    onChange={handleCheckboxGroupChange(id, id)} />
              )}
              {q.type === 'text' || q.type === 'number' && (
                <QuizInput
                  label={title}
                  id={id}
                  type={q.type}
                  onChange={handleInputChange(id, q.id)}
                />
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {quizzes.map((quiz) => (
        <div key={quiz.id}>
          {renderQuestion(quiz)}
        </div>
      ))}
    </div>
  );
};

export default QuizGroup;
