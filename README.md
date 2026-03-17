# Secure Steganography App

A React and TypeScript application that allows you to securely hide encrypted messages inside images. It leverages a hybrid approach combining AES-GCM and RSA cryptography, along with Least Significant Bit (LSB) steganography, ensuring both robust security and seamless visual integration.

## 🌟 Features

- **Hybrid Encryption**: Uses `node-forge` to generate a strong random AES-GCM key to encrypt your message of *any length*, and then encrypts the AES key using the recipient's public RSA key.
- **LSB Steganography**: Embeds the encrypted payload into the Red, Green, and Blue channels of an image. The Alpha channel is skipped to preserve transparency consistency, making the modified image visually indistinguishable from the original.
- **Easy-to-use Interface**: A clean, responsive UI built with TailwindCSS, featuring distinct tabs for **Encoding** (hiding) and **Decoding** (revealing) messages.
- **Lossless Format Protection**: Forces downloads in `.png` format to prevent lossy compression (like `.jpeg`) from destroying the hidden LSB data.
- **Built-in Key Generator**: A handy testing toolkit included directly in the UI to generate temporary 2048-bit RSA key pairs on the fly.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd esteganografia
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local server address (usually `http://localhost:5173`).

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8
- **Styling**: TailwindCSS 4
- **Cryptography**: `node-forge`

## 🔒 How it works

### Encoding (Hiding a Message)
1. You provide a message, a target image, and the recipient's public RSA key.
2. The app generates a random AES key and encrypts the message using AES-GCM.
3. The AES key itself is encrypted using the recipient's public RSA key.
4. The combined encrypted data is converted to binary and embedded into the LSB of the RGB channels of the image's pixels.
5. You can download the new image as a `.png`.

### Decoding (Revealing a Message)
1. You provide the encoded `.png` image and your private RSA key.
2. The app extracts the binary data hidden in the LSB of the RGB channels.
3. It separates the encrypted AES key and the encrypted message.
4. Your private RSA key decrypts the AES key.
5. The AES key decrypts the original message, revealing the hidden secret.

## 📝 Scripts

- `npm run dev`: Starts the local development server.
- `npm run build`: Compiles TypeScript and builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Locally previews the production build.

## ⚠️ Important Notes

- **Always use PNG**: When sharing the encoded image, ensure it remains in `.png` format. Compressing it to `.jpg` or sending it through platforms that heavily compress images (like WhatsApp or Messenger) may corrupt the hidden data.
- **Key Security**: The key generator provided in the app is for testing and convenience. In a real-world scenario, you should generate and manage your RSA keys securely offline.

## License

This project is licensed under the MIT License.
