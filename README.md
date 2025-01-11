# Multimodal Live API Web Console 🚀

## 🎥 Watch DeepDive Video

Watch the DeepDive Crash Course on Our YouTube Channel:

<p align="center">
    <a href="https://www.youtube.com/channel/UCxgkN3luQgLQOd_L7tbOdhQ?sub_confirmation=1">
        <img src="https://img.shields.io/badge/Subscribe-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="Subscribe">
    </a>
</p>

## 🚀 Introduction

This project demonstrates a powerful web console that combines live API interactions with multimodal capabilities, featuring:
- Real-time code modifications through AI
- Screen sharing for visual context
- Interactive graph generation
- File system integration
- WebSocket-based communication


## 🛠️ Key Features

- **AI-Powered Code Modifications**: Modify any code file by sharing your screen and describing changes
- **Live API Integration**: Real-time communication with Gemini API
- **File System Access**: Read and modify files anywhere on your system through a secure backend
- **Graph Generation**: Create and display Altair graphs through natural language
- **Screen Sharing**: Share your screen for visual context during modifications

## 🔧 Getting Started

1. Clone this repository:
```bash
git clone https://github.com/yourusername/multimodal-live-api-web-console.git
cd multimodal-live-api-web-console
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Gemini API key in .env:
```bash
REACT_APP_GEMINI_API_KEY='your_api_key_here'
```

4. Start the backend server:
```bash
cd server
npm start
```

5. Start the frontend:
```bash
npm start
```

## 📚 Project Structure

- `src/`: React frontend application
  - `components/altair/`: Altair graph and code modification component
  - `contexts/`: React contexts for state management
- `server/`: Express backend for file operations
- `public/`: Static assets

## 🎯 Core Components

### Altair Component
- Handles code modifications through AI
- Manages file operations
- Generates graphs
- Processes screen sharing

### Live API Context
- WebSocket connection management
- Gemini API integration
- Real-time communication

### Express Backend
- Secure file system operations
- File reading and writing
- Path validation

## 🔑 Requirements

- Node.js 14+
- Gemini API key
- Modern web browser
- Screen sharing capability

## 🎮 Usage

1. Start the application
2. Share your screen showing the code you want to modify
3. Provide the absolute path to the file
4. Describe the changes you want
5. AI will fetch, modify, and update the file
6. Use the following project as a pet project if you want to test.



## 🛡️ Error Handling

The system handles:
- File not found scenarios
- Permission issues
- Invalid paths
- API communication errors

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

### Community and Support
- Join our community: [Kno2gether Community](https://community.kno2gether.com)
- Full Production Ready SaaS Launch Course (50% OFF): [End-to-End SaaS Launch Course](https://knolabs.biz/course-at-discount)

### Hosting Partners
- [Kamatera - Get $100 Free VPS Credit](https://knolabs.biz/100-dollar-free-credit)
- [Hostinger - Additional 20% Discount](https://knolabs.biz/20-Percent-Off-VPS)

## 📺 Video Tutorials

Follow along with our detailed video tutorials on the [Kno2gether YouTube Channel](https://youtube.com/@kno2gether) for step-by-step guidance and best practices.

## 🎉 Conclusion

This project showcases a powerful combination of AI, real-time communication, and file system operations to create an interactive code modification system.

Happy coding! 🚀
