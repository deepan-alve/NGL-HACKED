
# Anonymous Message Sender 📬
![sddefault](https://github.com/user-attachments/assets/a27b3584-601e-417c-858e-bbc5e7c36369)

A modern web application that allows users to send anonymous messages, built with **React**, **TypeScript**, and **Tailwind CSS**. 🚀

---

## 🌟 Features
- 🎯 **Send Anonymous Messages**: Share thoughts anonymously with ease.
- 🔄 **Random Message Suggestions**: Generate creative prompts for users.
- ⏱️ **Rate Limiting**: Prevents spam by limiting message frequency (1 message/2 hours).
- 📱 **Fully Responsive Design**: Optimized for mobile and desktop devices.
- 🎨 **Beautiful Gradient UI**: Eye-catching visuals and smooth animations.
- 🔐 **Basic Security**: Message validation to ensure appropriate content.
- 💾 **Airtable Integration**: Messages stored securely in Airtable.
- ⚡ **Lightning-Fast Performance**: Powered by Vite for super-fast load times.

---

## 🛠️ Tech Stack
| Technology      | Purpose                           |
|------------------|-----------------------------------|
| **React**       | Frontend library                 |
| **TypeScript**  | Ensures type safety              |
| **Tailwind CSS**| Rapid and beautiful styling      |
| **Vite**        | Build tool for lightning speed   |
| **Airtable**    | Database for storing messages    |
| **Lucide Icons**| Icons for the user interface     |

---

## 🚀 Getting Started
Follow these steps to set up the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/anonymous-message-sender.git
   ```
2. Navigate to the project directory:
   ```bash
   cd anonymous-message-sender
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with your Airtable credentials:
   ```env
   AIRTABLE_API_KEY=your_api_key
   AIRTABLE_BASE_ID=your_base_id
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Build for production:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure
```plaintext
.
├── src
│   ├── components  # Reusable UI components
│   ├── pages       # Main application pages
│   ├── utils       # Helper functions and validations
│   └── assets      # Static files (images, icons, etc.)
├── public          # Public assets
├── .env.example    # Example environment variables
├── package.json    # Project dependencies and scripts
└── README.md       # Project documentation
```

---

## 💡 Features in Detail
- **Message Validation**: Prevents empty or overly long messages.
- **Rate Limiting**: Users can only send one message every 2 hours.
- **Responsive Design**: Seamlessly adapts to any screen size.
- **Error Handling**: Provides clear error feedback to users.
- **Loading States**: Ensures smooth user experience with visual feedback.
- **Animations**: Subtle micro-interactions to enhance usability.

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss your ideas.

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature description"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

---

## 📜 License
This project is licensed under the [MIT License](LICENSE).

---

## 🔒 Privacy Notice
This application stores messages in Airtable. Please avoid sharing sensitive personal information in messages.

---

### Made with ❤️ by [Deepan](https://github.com/deepan-alve) using **React** and **TypeScript**.
