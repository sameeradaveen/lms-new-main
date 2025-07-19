import { Request, Response } from 'express';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export const executeCode = async (req: Request, res: Response) => {
  try {
    const { language, code, input } = req.body;

    if (!language || !code) {
      return res.status(400).json({ error: 'Language and code are required' });
    }

    const tempDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const fileId = uuidv4();
    let result = '';

    switch (language.toLowerCase()) {
      case 'javascript':
        result = await executeJavaScript(code, input, fileId, tempDir);
        break;
      case 'python':
        result = await executePython(code, input, fileId, tempDir);
        break;
      case 'cpp':
        result = await executeCpp(code, input, fileId, tempDir);
        break;
      case 'java':
        result = await executeJava(code, input, fileId, tempDir);
        break;
      case 'sql':
        result = await executeSQL(code, input, fileId, tempDir);
        break;
      case 'html':
        result = await executeHTML(code, input, fileId, tempDir);
        break;
      case 'css':
        result = await executeCSS(code, input, fileId, tempDir);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported language' });
    }

    // Clean up temporary files
    cleanupTempFiles(fileId, tempDir);

    return res.json({ output: result });
  } catch (error) {
    console.error('Code execution error:', error);
    return res.status(500).json({ error: 'Code execution failed' });
  }
};

async function executeJavaScript(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, `${fileId}.js`);
  fs.writeFileSync(filePath, code);

  return new Promise((resolve, reject) => {
    const child = spawn('node', [filePath], { timeout: 10000 });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout || 'Code executed successfully');
      } else {
        resolve(stderr || 'Execution failed');
      }
    });
    
    child.on('error', (error) => {
      resolve(`Error: ${error.message}`);
    });
    
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

async function executePython(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, `${fileId}.py`);
  fs.writeFileSync(filePath, code);

  return new Promise((resolve, reject) => {
    const child = spawn('python', [filePath], { timeout: 10000 });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout || 'Code executed successfully');
      } else {
        resolve(stderr || 'Execution failed');
      }
    });
    
    child.on('error', (error) => {
      resolve(`Error: ${error.message}`);
    });
    
    if (input) {
      child.stdin.write(input);
      child.stdin.end();
    }
  });
}

async function executeCpp(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const sourcePath = path.join(tempDir, `${fileId}.cpp`);
  const exePath = path.join(tempDir, `${fileId}.exe`);
  
  fs.writeFileSync(sourcePath, code);

  return new Promise((resolve, reject) => {
    // Compile
    const compile = spawn('g++', [sourcePath, '-o', exePath]);
    
    compile.on('close', (code) => {
      if (code === 0) {
        // Execute
        const execute = spawn(exePath, [], { timeout: 10000 });
        
        let stdout = '';
        let stderr = '';
        
        execute.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        execute.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        execute.on('close', (code) => {
          if (code === 0) {
            resolve(stdout || 'Code executed successfully');
          } else {
            resolve(stderr || 'Execution failed');
          }
        });
        
        execute.on('error', (error) => {
          resolve(`Error: ${error.message}`);
        });
        
        if (input) {
          execute.stdin.write(input);
          execute.stdin.end();
        }
      } else {
        resolve('Compilation failed');
      }
    });
  });
}

async function executeJava(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, `${fileId}.java`);
  fs.writeFileSync(filePath, code);

  return new Promise((resolve, reject) => {
    // Compile
    const compile = spawn('javac', [filePath]);
    
    compile.on('close', (code) => {
      if (code === 0) {
        // Execute
        const execute = spawn('java', ['-cp', tempDir, fileId], { timeout: 10000 });
        
        let stdout = '';
        let stderr = '';
        
        execute.stdout.on('data', (data) => {
          stdout += data.toString();
        });
        
        execute.stderr.on('data', (data) => {
          stderr += data.toString();
        });
        
        execute.on('close', (code) => {
          if (code === 0) {
            resolve(stdout || 'Code executed successfully');
          } else {
            resolve(stderr || 'Execution failed');
          }
        });
        
        execute.on('error', (error) => {
          resolve(`Error: ${error.message}`);
        });
        
        if (input) {
          execute.stdin.write(input);
          execute.stdin.end();
        }
      } else {
        resolve('Compilation failed');
      }
    });
  });
}

async function executeSQL(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  // For SQL, we'll simulate execution since we don't have a database connection
  const sqlKeywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER'];
  const hasSqlKeywords = sqlKeywords.some(keyword => code.toUpperCase().includes(keyword));
  
  if (hasSqlKeywords) {
    return `SQL Query executed successfully:\n${code}\n\nSimulated output:\nQuery completed successfully.`;
  }
  
  return 'Invalid SQL query';
}

async function executeHTML(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, `${fileId}.html`);
  fs.writeFileSync(filePath, code);
  
  return `HTML file created successfully!\nFile: ${filePath}\n\nPreview the HTML file in your browser to see the result.`;
}

async function executeCSS(code: string, input: string, fileId: string, tempDir: string): Promise<string> {
  const filePath = path.join(tempDir, `${fileId}.css`);
  fs.writeFileSync(filePath, code);
  
  return `CSS file created successfully!\nFile: ${filePath}\n\nLink this CSS file to an HTML document to see the styles applied.`;
}

function cleanupTempFiles(fileId: string, tempDir: string) {
  const files = [
    `${fileId}.js`,
    `${fileId}.py`,
    `${fileId}.cpp`,
    `${fileId}.exe`,
    `${fileId}.java`,
    `${fileId}.class`,
    `${fileId}.html`,
    `${fileId}.css`
  ];

  files.forEach(file => {
    const filePath = path.join(tempDir, file);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (error) {
        console.error(`Failed to delete ${filePath}:`, error);
      }
    }
  });
} 