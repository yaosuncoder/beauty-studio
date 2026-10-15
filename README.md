# Beauty Studio

## Overview
Beauty Studio is a React application built with TypeScript and Vite. This project serves as a template for creating a beauty-related web application, providing a structured setup with essential files and configurations.

## Getting Started

### Prerequisites
Make sure you have the following installed:
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd beauty-studio
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Running the Application
To start the development server, run:
```
npm run dev
```
Open your browser and go to `http://localhost:3000` to see the application in action.

### Linting
Run ESLint to check the project source and configuration:
```
npm run lint
```

## Project Structure
```
beauty-studio
├── src
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point for the React application
│   ├── index.css        # Global CSS styles
│   └── vite-env.d.ts    # TypeScript definitions for Vite
├── public
│   └── favicon.svg      # Favicon for the application
├── package.json         # npm configuration file
├── tsconfig.json        # TypeScript configuration file
├── tsconfig.node.json   # Node.js specific TypeScript configuration
├── vite.config.ts       # Vite configuration file
├── index.html           # Main HTML file
├── README.md            # Project documentation
└── .gitignore           # Git ignore file
```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License
This project is licensed under the MIT License. See the LICENSE file for details.