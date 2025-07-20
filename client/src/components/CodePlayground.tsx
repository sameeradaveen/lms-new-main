import React, { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { dracula } from '@uiw/codemirror-theme-dracula';
import { fetchPlaygroundLogs, createPlaygroundLog, deletePlaygroundLogs } from '@/api/playgroundLogApi';

interface CodePlaygroundProps {
  userId: string;
  assignmentId?: string;
  onCodeSubmit?: (code: string, language: string, output: string) => void;
}

const CodePlayground: React.FC<CodePlaygroundProps> = ({ userId, assignmentId, onCodeSubmit }) => {
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [clearingHistory, setClearingHistory] = useState(false);
  const [waitingForInput, setWaitingForInput] = useState(false);

  // Language configurations
  const languages = {
    javascript: {
      name: 'JavaScript',
      extension: javascript(),
      template: `// JavaScript Code
console.log("Hello, World!");

function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Student"));`
    },
    python: {
      name: 'Python',
      extension: python(),
      template: `# Python Code
print("Hello, World!")

def greet(name):
    return f"Hello, {name}!"

print(greet("Student"))`
    },
    cpp: {
      name: 'C++',
      extension: cpp(),
      template: `// C++ Code
#include <iostream>
#include <string>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    
    string name = "Student";
    cout << "Hello, " << name << "!" << endl;
    
    return 0;
}`
    },
    java: {
      name: 'Java',
      extension: java(),
      template: `// Java Code
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
        
        String name = "Student";
        System.out.println("Hello, " + name + "!");
    }
}`
    },
    sql: {
      name: 'SQL',
      extension: sql(),
      template: `-- SQL Code
-- Example queries
SELECT 'Hello, World!' AS greeting;

-- Create a sample table
CREATE TABLE students (
    id INT PRIMARY KEY,
    name VARCHAR(50),
    age INT
);

-- Insert sample data
INSERT INTO students (id, name, age) VALUES (1, 'John', 20);

-- Query the data
SELECT * FROM students;`
    },
    html: {
      name: 'HTML',
      extension: html(),
      template: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hello World</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .greeting {
            color: #388bff;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <h1 class="greeting">Hello, World!</h1>
    <p>Welcome to the Code Playground!</p>
    
    <script>
        console.log("JavaScript is working!");
        document.querySelector('.greeting').addEventListener('click', function() {
            alert('Hello from JavaScript!');
        });
    </script>
</body>
</html>`
    },
    css: {
      name: 'CSS',
      extension: css(),
      template: `/* CSS Code */
body {
    font-family: 'Arial', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin: 0;
    padding: 20px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.container {
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
}

.greeting {
    color: #388bff;
    font-size: 2em;
    margin-bottom: 10px;
}

.subtitle {
    color: #666;
    font-size: 1.2em;
}

.button {
    background: #388bff;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 20px;
    transition: background 0.3s;
}

.button:hover {
    background: #2779bd;
}`
    }
  };

  // Load playground logs
  useEffect(() => {
    loadLogs();
  }, [userId]);

  // Set initial code template when language changes
  useEffect(() => {
    if (languages[language as keyof typeof languages]) {
      setCode(languages[language as keyof typeof languages].template);
    }
  }, [language]);

  // Add keyboard shortcut for clear (Ctrl+Shift+C)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'C') {
        event.preventDefault();
        clearCode();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [language]);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const logsData = await fetchPlaygroundLogs(userId);
      setLogs(logsData);
    } catch (error) {
      console.error('Failed to load playground logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput('');

    try {
      console.log('Running code with language:', language);
      console.log('Code content:', code.substring(0, 100) + '...');
      
      const requestBody = {
        language: language,
        code: code,
        input: input
      };
      
      console.log('Request body:', requestBody);

      const response = await fetch('/api/codeexecution/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error('Code execution failed');
      }

      const result = await response.json();
      
      // Check if the program is waiting for input
      if (result.output.includes('[INPUT REQUIRED]')) {
        setWaitingForInput(true);
        setOutput(result.output.replace('[INPUT REQUIRED] Please provide input and run the code again.', ''));
        // Clear input field when waiting for new input
        setInput('');
      } else {
        setWaitingForInput(false);
        setOutput(result.output);
        // Clear input field after successful execution
        setInput('');
      }

      // Save to playground logs
      await createPlaygroundLog({
        user: userId,
        language: languages[language as keyof typeof languages].name,
        code,
        input,
        output: result.output
      });

      // Reload logs
      await loadLogs();

    } catch (error: any) {
      setOutput('Error executing code: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const submitToAssignment = () => {
    if (onCodeSubmit && assignmentId) {
      onCodeSubmit(code, language, output);
    }
  };

  const clearCode = async () => {
    console.log('Clear button clicked!');
    
    // Ask for confirmation before clearing history
    if (window.confirm('Are you sure you want to clear all playground history? This action cannot be undone.')) {
      console.log('Clearing playground history...');
      setClearingHistory(true);
      
      try {
        // Delete logs from database
        await deletePlaygroundLogs(userId);
        
        // Clear the logs state
        setLogs([]);
        
        console.log('Playground history cleared successfully from database');
        
        // Show a brief success message
        setTimeout(() => {
          alert('Playground history cleared successfully!');
        }, 100);
      } catch (error) {
        console.error('Failed to clear playground history:', error);
        alert('Failed to clear playground history. Please try again.');
      } finally {
        setClearingHistory(false);
      }
    } else {
      console.log('Clear operation cancelled by user');
    }
  };

  const getLanguageExtension = () => {
    const lang = languages[language as keyof typeof languages];
    return lang ? lang.extension : javascript();
  };

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#1a1e2a' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold" style={{ color: '#388bff' }}>
            Multi-Language Code Playground
          </h2>
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-2 rounded border border-gray-600 bg-gray-800 text-white"
            >
              {Object.keys(languages).map(lang => (
                <option key={lang} value={lang}>
                  {languages[lang as keyof typeof languages].name}
                </option>
              ))}
            </select>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="px-4 py-2 rounded font-semibold"
              style={{ backgroundColor: '#388bff', color: '#fff' }}
            >
              {isRunning ? 'Running...' : '▶ Run Code'}
            </button>
            {(language === 'html' || language === 'css') && (
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="px-4 py-2 rounded font-semibold"
                style={{ backgroundColor: '#8b5cf6', color: '#fff' }}
              >
                {showPreview ? '📝 Hide Preview' : '👁️ Show Preview'}
              </button>
            )}
            {assignmentId && (
              <button
                onClick={submitToAssignment}
                className="px-4 py-2 rounded font-semibold"
                style={{ backgroundColor: '#10b981', color: '#fff' }}
              >
                📝 Submit to Assignment
              </button>
            )}
            <button
              onClick={clearCode}
              disabled={clearingHistory}
              className="px-4 py-2 rounded font-semibold hover:bg-red-600 transition-colors"
              style={{ 
                backgroundColor: clearingHistory ? '#6b7280' : '#ef4444', 
                color: '#fff', 
                cursor: clearingHistory ? 'not-allowed' : 'pointer' 
              }}
              title="Clear all playground history (Ctrl+Shift+C)"
            >
              {clearingHistory ? '🔄 Clearing...' : '🗑️ Clear History'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#388bff' }}>
              Code Editor
            </h3>
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <CodeMirror
                value={code}
                onChange={setCode}
                extensions={[getLanguageExtension()]}
                theme={dracula}
                height="400px"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Output */}
          <div className="flex-1 p-4">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#388bff' }}>
              Output
            </h3>
            <div className="w-full h-64 p-3 rounded border border-gray-600 bg-gray-800 text-white overflow-auto">
              <pre className="whitespace-pre-wrap">{output || 'Output will appear here...'}</pre>
            </div>
            
            {/* Input field that appears when program is waiting for input */}
            {waitingForInput && (
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400">📝 Enter your input:</span>
                  <span className="text-gray-400 text-sm">(Input field will be cleared after each run)</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your input here..."
                    className="flex-1 p-2 rounded border border-gray-600 bg-gray-800 text-white"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        runCode();
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={runCode}
                    disabled={isRunning}
                    className="px-4 py-2 rounded font-semibold"
                    style={{ backgroundColor: '#388bff', color: '#fff' }}
                  >
                    {isRunning ? 'Running...' : 'Submit'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* HTML/CSS Preview */}
          {showPreview && (language === 'html' || language === 'css') && (
            <div className="p-4 border-t border-gray-700">
              <h3 className="text-lg font-semibold mb-2" style={{ color: '#388bff' }}>
                Preview
              </h3>
              <div className="w-full h-64 border border-gray-600 rounded bg-white overflow-auto">
                {language === 'html' ? (
                  <iframe
                    srcDoc={code}
                    className="w-full h-full"
                    title="HTML Preview"
                  />
                ) : (
                  <div className="p-4">
                    <div 
                      style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        minHeight: '100%',
                        padding: '20px'
                      }}
                    >
                      <div className="container" style={{ 
                        background: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                        textAlign: 'center'
                      }}>
                        <div className="greeting" style={{ color: '#388bff', fontSize: '2em', marginBottom: '10px' }}>
                          Hello, World!
                        </div>
                        <div className="subtitle" style={{ color: '#666', fontSize: '1.2em' }}>
                          CSS Preview
                        </div>
                        <button className="button" style={{
                          background: '#388bff',
                          color: 'white',
                          border: 'none',
                          padding: '10px 20px',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginTop: '20px',
                          transition: 'background 0.3s'
                        }}>
                          Click Me!
                        </button>
                      </div>
                    </div>
                    <style>{code}</style>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Playground Logs */}
        <div className="w-80 border-l border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-semibold mb-4" style={{ color: '#388bff' }}>
            Playground History
          </h3>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-gray-400">No code execution history yet.</div>
          ) : (
            <div className="space-y-3">
              {logs.slice(0, 10).map((log) => (
                <div key={log._id} className="p-3 rounded border border-gray-600 bg-gray-800">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold" style={{ color: '#388bff' }}>
                      {log.language}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-300 mb-2">
                    <pre className="whitespace-pre-wrap overflow-hidden" style={{ maxHeight: '60px' }}>
                      {log.code}
                    </pre>
                  </div>
                  {log.output && (
                    <div className="text-xs text-green-400">
                      <strong>Output:</strong>
                      <pre className="whitespace-pre-wrap overflow-hidden" style={{ maxHeight: '40px' }}>
                        {log.output}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePlayground; 