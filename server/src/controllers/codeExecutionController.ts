import { Request, Response } from 'express';

export const executeCode = async (req: Request, res: Response) => {
  try {
    const { language, code, input } = req.body;

    console.log('Received request - Language:', language);
    console.log('Received request - Code preview:', code.substring(0, 100) + '...');

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    let result = '';

    const languageLower = language.toLowerCase();
    console.log('Processing language:', languageLower);
    
    switch (languageLower) {
      case 'javascript':
        console.log('Executing JavaScript code');
        result = await executeWithPistonAPI('node', '18.15.0', code, input);
        break;
      case 'python':
        console.log('Executing Python code');
        result = await executeWithPistonAPI('python', '3.10.0', code, input);
        break;
      case 'cpp':
        console.log('Executing C++ code');
        result = await executeWithPistonAPI('c++', '10.2.0', code, input);
        break;
      case 'java':
        console.log('Executing Java code');
        result = await executeWithPistonAPI('java', '15.0.2', code, input);
        break;
      case 'sql':
        console.log('Executing SQL code');
        result = await executeSQL(code, input);
        break;
      case 'html':
        console.log('Executing HTML code');
        result = await executeHTML(code, input);
        break;
      case 'css':
        console.log('Executing CSS code');
        result = await executeCSS(code, input);
        break;
      default:
        console.log('Unsupported language:', languageLower);
        return res.status(400).json({ error: 'Unsupported language' });
    }

    return res.json({ output: result });
  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({ error: 'Code execution failed' });
  }
};

export const getAvailableRuntimes = async (req: Request, res: Response) => {
  try {
    const response = await fetch('https://emkc.org/api/v2/piston/runtimes');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const runtimes = await response.json();
    return res.json(runtimes);
  } catch (error) {
    console.error('Failed to fetch runtimes:', error);
    return res.status(500).json({ error: 'Failed to fetch available runtimes' });
  }
};

async function executeWithPistonAPI(language: string, version: string, code: string, input: string): Promise<string> {
  try {
    // Check if code requires input
    const requiresInput = code.includes('Scanner') || 
                         code.includes('input(') || 
                         code.includes('readline') ||
                         code.includes('cin') ||
                         code.includes('scanf');

    if (requiresInput && !input.trim()) {
      // For programs that require input, show a simulated prompt
      const prompt = extractPrompt(code);
      return `${prompt}\n\n[INPUT REQUIRED] Please provide input and run the code again.`;
    }

    // Run with input (if provided)
    const requestBody = {
      language: language,
      version: version,
      files: [
        {
          name: `main.${getFileExtension(language)}`,
          content: code
        }
      ],
      stdin: input || ''
    };

    console.log('Piston API request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Piston API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, response: ${errorText}`);
    }

    const data = await response.json();
    console.log('Piston API response:', JSON.stringify(data, null, 2));
    
    if (data.run.stderr) {
      return data.run.stderr;
    } else {
      return data.run.stdout || 'Code executed successfully';
    }
  } catch (error) {
    console.error('Piston API error:', error);
    return `Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
  }
}

// Helper function to extract prompt from code
function extractPrompt(code: string): string {
  // Extract System.out.print statements for Java
  const javaPrintMatch = code.match(/System\.out\.print\("([^"]+)"\)/);
  if (javaPrintMatch && javaPrintMatch[1]) {
    return javaPrintMatch[1];
  }
  
  // Extract print statements for Python
  const pythonPrintMatch = code.match(/print\("([^"]+)"\)/);
  if (pythonPrintMatch && pythonPrintMatch[1]) {
    return pythonPrintMatch[1];
  }
  
  // Extract cout statements for C++
  const cppCoutMatch = code.match(/cout\s*<<\s*"([^"]+)"/);
  if (cppCoutMatch && cppCoutMatch[1]) {
    return cppCoutMatch[1];
  }
  
  // Default prompt
  return "Enter input:";
}

function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    'node': 'js',
    'python': 'py',
    'c++': 'cpp',
    'java': 'java'
  };
  return extensions[language] || 'txt';
}



async function executeSQL(code: string, input: string): Promise<string> {
  // For SQL, we'll simulate execution since we don't have a database connection
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
  const hasSqlKeywords = sqlKeywords.some(keyword => code.toUpperCase().includes(keyword));
  
  if (hasSqlKeywords) {
    return `SQL Query executed successfully:\n${code}\n\nSimulated output:\nQuery completed successfully.`;
  }
  
  return 'Invalid SQL query';
}

async function executeHTML(code: string, input: string): Promise<string> {
  return `HTML Code:\n${code}\n\nPreview the HTML code in your browser to see the result.`;
}

async function executeCSS(code: string, input: string): Promise<string> {
  return `CSS Code:\n${code}\n\nLink this CSS code to an HTML document to see the styles applied.`;
}

 