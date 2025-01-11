import express from 'express';
import cors from 'cors';
import { readFile, writeFile, access } from 'fs/promises';
import { constants } from 'fs';
import path from 'path';

const app = express();
const port = 3001; // Different from React's default port

app.use(cors());
app.use(express.json());

// Helper function to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
    try {
        await access(filePath, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

// Endpoint to fetch file contents
app.get('/api/file', async (req, res) => {
    try {
        const filePath = req.query.path as string;
        
        console.log('Attempting to read file at:', filePath);
        console.log('File path type:', typeof filePath);
        
        if (!filePath) {
            console.log('No file path provided');
            return res.status(400).json({ 
                error: 'File path is required',
                details: 'Please provide a valid file path'
            });
        }

        // Check if file exists
        const exists = await fileExists(filePath);
        console.log('File exists?', exists);
        
        if (!exists) {
            console.log('File not found at path:', filePath);
            // Try to list parent directory if possible
            try {
                const parentDir = path.dirname(filePath);
                const dirExists = await fileExists(parentDir);
                console.log('Parent directory exists?', dirExists);
                if (dirExists) {
                    const { readdir } = require('fs/promises');
                    const files = await readdir(parentDir);
                    console.log('Files in parent directory:', files);
                }
            } catch (err) {
                console.log('Could not read parent directory:', err);
            }
            
            return res.status(404).json({ 
                error: 'File not found',
                details: `The file at path "${filePath}" does not exist`
            });
        }

        // Read the file contents
        const content = await readFile(filePath, 'utf-8');
        res.json({ content });
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ 
            error: 'Failed to read file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Endpoint to modify file contents
app.post('/api/file', async (req, res) => {
    try {
        const { filePath, content } = req.body;
        
        if (!filePath || content === undefined) {
            return res.status(400).json({ 
                error: 'Invalid request',
                details: 'Both file path and content are required'
            });
        }

        // Check if file exists before trying to modify
        const exists = await fileExists(filePath);
        if (!exists) {
            return res.status(404).json({ 
                error: 'File not found',
                details: `The file at path "${filePath}" does not exist`
            });
        }

        // Write the modified content to the file
        await writeFile(filePath, content, 'utf-8');
        res.json({ 
            success: true,
            message: 'File updated successfully'
        });
    } catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ 
            error: 'Failed to write file',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
