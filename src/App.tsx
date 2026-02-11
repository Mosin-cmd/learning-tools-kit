import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import classNames from 'classnames';
import './App.css';

type Topic = {
  topicId: string;
  title: string;
  estimatedMinutes: number;
  learningContent: {
    markdown: string;
    keyPoints: string[];
  };
  questions: { id: string; question: string; answer: string }[];
};

function App() {
  const [topic] = useState<Topic>({
    topicId: 'react-hooks-useState',
    title: 'React Hooks - useState',
    estimatedMinutes: 20,
    learningContent: {
      markdown: `# React Hook - useState

## Podstawowa składnia

\`\`\`jsx
const [wartość, setWartość] = useState(wartośćPoczątkowa);
\`\`\`

## Przykład - Licznik

\`\`\`jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Kliknięto: {count} razy</p>
      <button onClick={() => setCount(count + 1)}>
        Kliknij
      </button>
    </div>
  );
}
\`\`\`

## Aktualizacja z poprzednią wartością

\`\`\`jsx
// Bezpieczniejsze:
setCount(prevCount => prevCount + 1);
\`\`\`

## State jako obiekt

\`\`\`jsx
const [user, setUser] = useState({ name: 'Jan', age: 25 });

// WAŻNE: spread operator!
setUser(prev => ({ ...prev, age: 26 }));
\`\`\`

## Najczęstsze błędy

❌ \`count = 5\` // Nie możesz bezpośrednio!

✅ \`setCount(5)\` // Zawsze przez setter`,
      keyPoints: [
        'useState zwraca [wartość, setter]',
        'Setter powoduje re-render',
        'Użyj funkcji w setterze: prev => prev + 1',
        'Nigdy nie modyfikuj state bezpośrednio',
      ],
    },
    questions: [
      {
        id: 'q1',
        question: 'Jak zadeklarować state licznika o wartości 0?',
        answer: 'const [count, setCount] = useState(0);',
      },
      {
        id: 'q2',
        question: 'Co zwraca useState()?',
        answer: 'Tablicę: [wartość, funkcja setter]',
      },
      {
        id: 'q3',
        question: 'Dlaczego setCount(prev => prev + 1) jest lepsze?',
        answer: 'Bo prev jest zawsze aktualny, count może być nieaktualny',
      },
      {
        id: 'q4',
        question: 'Jak zaktualizować wiek w { name: "Jan", age: 25 }?',
        answer: 'setUser(prev => ({ ...prev, age: 26 }))',
      },
      {
        id: 'q5',
        question: 'Co się stanie gdy: count = 5?',
        answer: 'Komponent się nie przerenderuje',
      },
    ],
  });

  const [activeTab, setActiveTab] = useState<'pomodoro' | 'flashcards'>('pomodoro');
  const [darkMode, setDarkMode] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [seconds, setSeconds] = useState(topic.estimatedMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    if (!isRunning || seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setSessionsCompleted((prev) => prev + 1);
          return topic.estimatedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, seconds, topic.estimatedMinutes]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = topic.questions[currentIndex];

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header>
        <h1>Learning Tools Kit</h1>
        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? '☀️ Tryb jasny' : '🌙 Tryb ciemny'}
        </button>
      </header>

      <nav className="tabs">
        <button
          className={activeTab === 'pomodoro' ? 'active' : ''}
          onClick={() => setActiveTab('pomodoro')}
        >
          Pomodoro
        </button>
        <button
          className={activeTab === 'flashcards' ? 'active' : ''}
          onClick={() => setActiveTab('flashcards')}
        >
          Fiszki
        </button>
      </nav>

      <main>
        <h2>{topic.title}</h2>

        {activeTab === 'pomodoro' ? (
          <section className="pomodoro-section">
            <div className="markdown">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: '1.5rem 0',
                          borderRadius: '8px',
                          fontSize: '0.95rem',
                        }}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {topic.learningContent.markdown}
              </ReactMarkdown>
            </div>

            <div className="timer-box">
              <div className="time">{formatTime(seconds)}</div>

              <div className="timer-buttons">
                <button onClick={() => setIsRunning(true)} disabled={isRunning}>
                  Start
                </button>
                <button onClick={() => setIsRunning(false)} disabled={!isRunning}>
                  Stop
                </button>
                <button
                  onClick={() => {
                    setIsRunning(false);
                    setSeconds(topic.estimatedMinutes * 60);
                  }}
                >
                  Reset
                </button>
              </div>

              <div className="sessions">
                Ukończone sesje: <strong>{sessionsCompleted}</strong>
              </div>
            </div>
          </section>
        ) : (
          <section className="flashcards-section">
            <div className="counter">
              {currentIndex + 1} / {topic.questions.length}
            </div>

            <div
              className={classNames('card', { flipped: isFlipped })}
              onClick={() => setIsFlipped(!isFlipped)}
            >
              <div className="front">
                <strong>Pytanie:</strong>
                <div className="question-text">{currentQuestion.question}</div>
              </div>
              <div className="back">
                <strong>Odpowiedź:</strong>
                <div className="answer-text">{currentQuestion.answer}</div>
              </div>
            </div>

            <div className="card-controls">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex(currentIndex - 1);
                  setIsFlipped(false);
                }}
              >
                ← Poprzednie
              </button>

              <button
                disabled={currentIndex === topic.questions.length - 1}
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                  setIsFlipped(false);
                }}
              >
                Następne →
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;