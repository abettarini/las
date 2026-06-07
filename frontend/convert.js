import fs from 'fs';
import path from 'path';

function generateRandomId(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function parseQuestions(text) {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const quizzes = [];
    let currentQuestion = null;
    lines.forEach(line => {
      const questionMatch = line.match(/^\d+\)\s*(.+)$/);
      const optionMatch = line.match(/^([A-Z])\)\s*(.+)$/);
      if (questionMatch) {
        if (currentQuestion) {
          quizzes.push(currentQuestion);
        }
        currentQuestion = {
          id: generateRandomId(),
          question: questionMatch[1].trim(),
          options: [],
          correctAnswers: [] // Add the correctAnswers label with an empty array
        };
      } else if (optionMatch && currentQuestion) {
        const text = optionMatch[2];
        currentQuestion.options.push(text.trim());
      }
    });
    if (currentQuestion) {
      quizzes.push(currentQuestion);
    }
    return quizzes;
  }

function convertToJSON(inputFilePath, outputFilePath) {
    const text = fs.readFileSync(inputFilePath, 'utf-8');
    const quizzes = parseQuestions(text);
    fs.writeFileSync(outputFilePath, JSON.stringify(quizzes, null, 2), 'utf-8');
}

const inputFilePath = path.join(process.cwd(), 'src/data/DomandeDIMA.txt');
const outputFilePath = path.join(process.cwd(), 'quizzes.json');

convertToJSON(inputFilePath, outputFilePath);
