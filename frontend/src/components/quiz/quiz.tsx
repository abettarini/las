import React, { useEffect } from 'react';
import { useQuizContext } from '../../hooks/use-quiz-context';

interface QuizProps {
  groupId: string;
}

const Quiz: React.FC<QuizProps> = ({ groupId }) => {
  const { selectedAnswers, setSelectedAnswers, setAnswers, isVerified, randomQuestions } = useQuizContext();
  const questions = randomQuestions[groupId] || [];

  useEffect(() => {
    // Reset answers when the component mounts or groupId changes
    console.log(`ID: ${groupId}`);
    console.log(randomQuestions);
  }, []);

  const updateAnswers = (updatedSelectedAnswers: Record<string, any>) => {
    const totalQuestions = questions.length;
    let errors = 0;
    const questionResults: Record<string, number> = {};

    questions.forEach((question, index) => {
      const questionId = `${groupId}-${index}`;
      const correctAnswers = question.correctAnswers;
      const userAnswers = updatedSelectedAnswers[groupId]?.[index]?.answers || [];

      // Verify main answers
      const isCorrectMain = correctAnswers.every(answer => userAnswers.includes(answer)) && correctAnswers.length === userAnswers.length;

      // Verify additional questions
      let isCorrectAdditional = true;
      if (question.additionalQuestions && userAnswers.includes(question.additionalQuestions[0].trigger)) {
        question.additionalQuestions.forEach((additionalQuestion) => {
          additionalQuestion.questions.forEach((q) => {
            const userAdditionalAnswer = updatedSelectedAnswers[groupId]?.[index]?.additionalAnswers?.[q.id]?.answers[0];
            if (q.type === 'number') {
              isCorrectAdditional = isCorrectAdditional && (parseInt(userAdditionalAnswer, 10) === q.correctAnswer);
            } else {
              isCorrectAdditional = isCorrectAdditional && (userAdditionalAnswer === q.correctAnswer);
            }
          });
        });
      }

      const isCorrect = isCorrectMain && isCorrectAdditional;
      questionResults[questionId] = isCorrect ? 1 : 0;
      if (!isCorrect) {
        errors += 1;
      }
    });

    setAnswers((prev) => ({
      ...prev,
      [groupId]: { total: totalQuestions, errors, questions: questionResults },
    }));
  };

  const handleAnswerChange = (questionIndex: number, answer: string, isAdditional: boolean = false, additionalId?: string) => {
    setSelectedAnswers((prev) => {
      const updatedAnswers = {
        ...prev,
        [groupId]: {
          ...prev[groupId],
          [questionIndex]: {
            ...prev[groupId]?.[questionIndex],
            answers: isAdditional ? prev[groupId]?.[questionIndex]?.answers || [] : [...(prev[groupId]?.[questionIndex]?.answers || []), answer],
            additionalAnswers: isAdditional ? {
              ...prev[groupId]?.[questionIndex]?.additionalAnswers,
              [additionalId!]: {
                answers: [...(prev[groupId]?.[questionIndex]?.additionalAnswers?.[additionalId!]?.answers || []), answer]
              }
            } : prev[groupId]?.[questionIndex]?.additionalAnswers || {}
          }
        }
      };
      updateAnswers(updatedAnswers);
      return updatedAnswers;
    });
  };

  const renderAdditionalQuestions = (additionalQuestions: any[], questionIndex: number) => {
    return additionalQuestions.map((additionalQuestion, addIndex) => {
      const { title, questions } = additionalQuestion;
      return (
        <div key={addIndex} className="additional-questions">
          <h4>{title}</h4>
          {questions.map((q: any, qIndex: number) => {
            const inputId = `q${questionIndex}a${addIndex}q${qIndex}`;
            if (q.type === 'number' || q.type === 'text') {
              return (
                <div key={qIndex}>
                  <label htmlFor={inputId}>{q.label}</label>
                  <input
                    type={q.type}
                    id={inputId}
                    onChange={(e) => handleAnswerChange(questionIndex, e.target.value, true, q.id)}
                    disabled={isVerified}
                  />
                </div>
              );
            } else if (q.type === 'selection') {
              return (
                <div key={qIndex}>
                  <label htmlFor={inputId}>{q.label}</label>
                  <select
                    id={inputId}
                    onChange={(e) => handleAnswerChange(questionIndex, e.target.value, true, q.id)}
                    disabled={isVerified}
                  >
                    {q.options.map((option: string, optIndex: number) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return null;
          })}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col gap-2">
      {questions.map((question, index) => (
        <div key={index} className="flex flex-col">
          <h3 className="text-lg font-bold mb-2">{question.question}</h3>
          {question.options.map((option, optIndex) => (
            <div key={optIndex}>
              <input
                type="checkbox"
                id={`q${index}o${optIndex}`}
                name={`question${index}`}
                value={option}
                onChange={() => handleAnswerChange(index, option)}
                checked={selectedAnswers[groupId]?.[index]?.answers.includes(option) || false}
                disabled={isVerified}
              />
              <label htmlFor={`q${index}o${optIndex}`}>{option}</label>
            </div>
          ))}
          {question.additionalQuestions &&
            selectedAnswers[groupId]?.[index]?.answers.includes(question.additionalQuestions[0].trigger) &&
            renderAdditionalQuestions(question.additionalQuestions, index)}
        </div>
      ))}
    </div>
  );
};

export default Quiz;
