"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const promises_1 = require("fs/promises");
const app = (0, express_1.default)();
const port = 3001; // Different from React's default port
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Endpoint to fetch file contents
app.get('/api/file', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = req.query.path;
        if (!filePath) {
            return res.status(400).json({ error: 'File path is required' });
        }
        // Read the file contents
        const content = yield (0, promises_1.readFile)(filePath, 'utf-8');
        res.json({ content });
    }
    catch (error) {
        console.error('Error reading file:', error);
        res.status(500).json({ error: 'Failed to read file' });
    }
}));
// Endpoint to modify file contents
app.post('/api/file', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filePath, content } = req.body;
        if (!filePath || content === undefined) {
            return res.status(400).json({ error: 'File path and content are required' });
        }
        // Write the modified content to the file
        yield (0, promises_1.writeFile)(filePath, content, 'utf-8');
        res.json({ success: true });
    }
    catch (error) {
        console.error('Error writing file:', error);
        res.status(500).json({ error: 'Failed to write file' });
    }
}));
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
