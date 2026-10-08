import React, { useState } from 'react';
import { useLabStore } from '../store/labStore';
import { CheckCircle, XCircle } from 'lucide-react';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'What is Cross-Site Scripting (XSS)?',
    options: [
      'A vulnerability allowing attackers to inject malicious scripts into web pages',
      'A type of SQL injection attack',
      'A server-side authentication bypass',
      'A network protocol vulnerability'
    ],
    correct: 0,
    explanation: 'XSS is a security vulnerability where attackers inject malicious scripts that execute in victims\' browsers.'
  },
  {
    id: 2,
    question: 'Which of the following is NOT a type of XSS?',
    options: [
      'Reflected XSS',
      'Stored XSS',
      'DOM-based XSS',
      'Cached XSS'
    ],
    correct: 3,
    explanation: 'The main types of XSS are Reflected, Stored, and DOM-based. "Cached XSS" is not a standard classification.'
  },
  {
    id: 3,
    question: 'Reflected XSS typically requires...',
    options: [
      'The victim to click a malicious link',
      'Data to be permanently stored in the database',
      'JavaScript execution on the server',
      'Multiple users to be targeted simultaneously'
    ],
    correct: 0,
    explanation: 'Reflected XSS is delivered through a link that the victim must click. It\'s not stored permanently.'
  },
  {
    id: 4,
    question: 'What is the primary cause of XSS vulnerabilities?',
    options: [
      'Treating user input as trusted code without encoding',
      'Using HTTPS instead of HTTP',
      'Storing passwords in plain text',
      'Having too many user accounts'
    ],
    correct: 0,
    explanation: 'XSS occurs when applications treat untrusted user input as code and render it without proper output encoding.'
  },
  {
    id: 5,
    question: 'Which approach is SAFEST for displaying user-generated content?',
    options: [
      'Use dangerouslySetInnerHTML in React',
      'Use textContent and render as plain text',
      'Store in database without sanitization',
      'Pass through eval() for processing'
    ],
    correct: 1,
    explanation: 'Using textContent ensures user input is displayed as plain text, not executed as code.'
  },
  {
    id: 6,
    question: 'What does output encoding do?',
    options: [
      'Encrypts data for storage',
      'Converts special characters to safe HTML entities',
      'Compresses user input',
      'Validates input before processing'
    ],
    correct: 1,
    explanation: 'Output encoding converts characters like < and > to &lt; and &gt;, preventing them from being interpreted as HTML tags.'
  },
  {
    id: 7,
    question: 'Which HTTP header helps prevent XSS attacks?',
    options: [
      'Content-Length',
      'Content-Security-Policy',
      'Content-Type',
      'Cache-Control'
    ],
    correct: 1,
    explanation: 'CSP restricts the sources from which scripts can be loaded, providing defense-in-depth against XSS.'
  },
  {
    id: 8,
    question: 'In the lab, what made the vulnerable implementation unsafe?',
    options: [
      'It used HTTPS',
      'It used dangerouslySetInnerHTML without encoding',
      'It validated input length',
      'It used CORS'
    ],
    correct: 1,
    explanation: 'The vulnerable implementation rendered user input directly with dangerouslySetInnerHTML, allowing script execution.'
  },
  {
    id: 9,
    question: 'How did the secure implementation prevent XSS?',
    options: [
      'By encrypting all data',
      'By HTML entity encoding and rendering as plain text',
      'By rejecting all special characters',
      'By sending data to a remote server'
    ],
    correct: 1,
    explanation: 'The secure version escaped HTML entities and rendered content as plain text using textContent.'
  },
  {
    id: 10,
    question: 'True or False: User input should ALWAYS be considered untrusted.',
    options: [
      'True',
      'False'
    ],
    correct: 0,
    explanation: 'User input (forms, URLs, APIs) should always be treated as potentially malicious until proven safe.'
  },
  {
    id: 11,
    question: 'What is the OWASP Top 10 ranking for XSS?',
    options: [
      '#1 - Broken Access Control',
      '#2 - Cryptographic Failures',
      '#3 - Injection (includes XSS)',
      '#7 - Identification and Authentication Failures'
    ],
    correct: 2,
    explanation: 'XSS falls under the Injection category (#3) in the OWASP Top 10 2021.'
  },
  {
    id: 12,
    question: 'Which of these is a valid XSS payload that was demonstrated?',
    options: [
      '<script>alert("XSS")</script>',
      'DROP TABLE users;',
      'union select * from passwords',
      'OR 1=1'
    ],
    correct: 0,
    explanation: 'The lab used a safe alert() script to demonstrate XSS execution without causing real harm.'
  }
];

export default function Assessment() {
  const { setQuizScore } = useLabStore();
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const correct = answers.filter(
      (answer, idx) => answer === QUIZ_QUESTIONS[idx].correct
    ).length;

    const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    setQuizScore(score);
    setSubmitted(true);
  };

  if (!started) {
    return (
      <div className="space-y-6 max-w-2xl">
        <h1 className="text-3xl font-bold text-white">Assessment Quiz</h1>

        <div className="lab-card">
          <h2 className="text-2xl font-bold mb-4">Ready for Assessment?</h2>
          <div className="space-y-4 text-gray-300">
            <p>This comprehensive quiz tests your understanding of XSS vulnerabilities and mitigation strategies.</p>
            <div className="bg-dark-700 rounded p-4 space-y-2">
              <p className="font-bold text-security-blue">Quiz Details:</p>
              <p>• {QUIZ_QUESTIONS.length} questions</p>
              <p>• Multiple choice format</p>
              <p>• 70% required to pass</p>
              <p>• Immediate feedback on answers</p>
            </div>
            <p className="text-sm text-gray-400">
              Make sure you've completed the XSS Simulation before taking the quiz.
            </p>
          </div>
          <button
            onClick={() => setStarted(true)}
            className="lab-btn-primary mt-6 w-full"
          >
            Start Quiz
          </button>
        </div>

        <div className="lab-card">
          <h3 className="font-bold mb-3">Topics Covered:</h3>
          <ul className="text-sm text-gray-300 space-y-1">
            <li>✓ XSS fundamentals and types</li>
            <li>✓ Root causes and attack flow</li>
            <li>✓ Prevention techniques</li>
            <li>✓ Output encoding and sanitization</li>
            <li>✓ Content Security Policy</li>
            <li>✓ Practical mitigation (lab demonstrations)</li>
          </ul>
        </div>
      </div>
    );
  }

  if (submitted) {
    const correct = answers.filter(
      (answer, idx) => answer === QUIZ_QUESTIONS[idx].correct
    ).length;
    const score = Math.round((correct / QUIZ_QUESTIONS.length) * 100);
    const passed = score >= 70;

    return (
      <div className="space-y-6 max-w-3xl">
        <h1 className="text-3xl font-bold text-white">Quiz Results</h1>

        <div className={`lab-card border-2 ${passed ? 'border-security-green' : 'border-security-red'}`}>
          <div className="text-center space-y-4">
            <div className={`text-6xl font-bold ${passed ? 'text-security-green' : 'text-security-red'}`}>
              {score}%
            </div>
            <h2 className={`text-2xl font-bold ${passed ? 'text-security-green' : 'text-security-red'}`}>
              {passed ? '✓ PASSED' : '✗ NEEDS IMPROVEMENT'}
            </h2>
            <p className="text-gray-300">
              You answered <span className="font-bold">{correct}/{QUIZ_QUESTIONS.length}</span> questions correctly.
            </p>
          </div>
        </div>

        {/* Review Answers */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Answer Review</h2>
          {QUIZ_QUESTIONS.map((q, idx) => {
            const isCorrect = answers[idx] === q.correct;
            return (
              <div key={q.id} className={`lab-card border-l-4 ${isCorrect ? 'border-security-green' : 'border-security-red'}`}>
                <div className="flex gap-3 mb-2">
                  {isCorrect ? (
                    <CheckCircle className="text-security-green flex-shrink-0" size={20} />
                  ) : (
                    <XCircle className="text-security-red flex-shrink-0" size={20} />
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">{q.question}</h3>
                    <p className="text-sm text-gray-400 mt-2">
                      Your answer: <span className={isCorrect ? 'text-security-green' : 'text-security-red'}>
                        {q.options[answers[idx]]}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-security-green mt-1">
                        Correct answer: {q.options[q.correct]}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2 italic">
                      {q.explanation}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers([]);
              setSubmitted(false);
            }}
            className="lab-btn-primary flex-1"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => {
              setStarted(false);
              setCurrentQuestion(0);
              setAnswers([]);
              setSubmitted(false);
            }}
            className="lab-btn-primary bg-dark-700 hover:bg-dark-600 flex-1"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  const q = QUIZ_QUESTIONS[currentQuestion];
  const answered = answers[currentQuestion] !== undefined;

  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-white">Assessment Quiz</h1>

      {/* Progress */}
      <div className="lab-card">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
          </div>
          <div className="w-32 bg-dark-700 rounded-full h-2">
            <div
              className="bg-security-blue h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question */}
      <div className="lab-card">
        <h2 className="text-xl font-bold mb-6">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                answers[currentQuestion] === idx
                  ? 'border-security-blue bg-security-blue/10'
                  : 'border-dark-700 hover:border-dark-600'
              }`}
            >
              <div className="flex gap-3">
                <div className={`w-6 h-6 rounded border-2 flex-shrink-0 flex items-center justify-center ${
                  answers[currentQuestion] === idx ? 'border-security-blue bg-security-blue' : 'border-gray-500'
                }`}>
                  {answers[currentQuestion] === idx && <span className="text-white font-bold">✓</span>}
                </div>
                <span className="text-gray-200">{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="lab-btn-primary bg-dark-700 hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        {currentQuestion === QUIZ_QUESTIONS.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={answers.length !== QUIZ_QUESTIONS.length}
            className="lab-btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="lab-btn-primary flex-1"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
