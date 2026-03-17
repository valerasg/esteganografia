# Secure Steganography

A modern, secure web application that allows you to hide encrypted messages inside images seamlessly. Built with React, Vite, and Tailwind CSS.

## 🚀 Features

*   **Image Steganography:** Hide secret messages within ordinary images without noticeably altering their appearance.
*   **RSA Encryption:** Messages are encrypted using 2048-bit RSA keys before being embedded, ensuring that only the intended recipient can read the hidden data.
*   **Key Generation:** Built-in toolkit to generate temporary RSA Key Pairs (Public/Private) for testing and immediate use.
*   **Fully Client-Side:** All encryption, decryption, and image processing happen directly in your browser. No messages or images are sent to a server.
*   **Dark/Light Mode:** Seamlessly toggle between dark and light themes.
*   **Responsive Design:** Works beautifully on desktops, tablets, and mobile devices.

## 🛠️ Tech Stack

*   **Frontend Framework:** [React 19](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Cryptography:** [node-forge](https://github.com/digitalbazaar/forge)
*   **Language:** TypeScript

## 📦 Getting Started

### Prerequisites

*   Node.js (v20 or higher recommended)
*   npm (or yarn/pnpm)

### Installation

1.  Clone the repository and navigate to the project folder.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## ⚠️ Important Notes

*   **Image Format:** The output image containing the hidden message is provided as a **PNG**. You must keep it as a PNG; converting it to JPEG or other lossy formats will destroy the hidden data.
*   **Key Storage:** The built-in key generator creates temporary keys. Be sure to save your private key if you wish to decode messages later, as the application does not store them for security reasons.
