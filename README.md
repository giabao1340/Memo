# 📱 Memo - Real-time Chat Application

**Memo** is a modern, real-time chat application that allows users to communicate seamlessly. Built with a robust stack, Memo focuses on performance, security, and an intuitive user experience. Whether you're sending a quick note or having a group conversation, Memo makes it feel natural.

## ✨ Key Features

*   **Real-time Messaging:** Experience instant communication with WebSocket support via **Socket.IO**.
*   **Secure Authentication:** User accounts are protected with **JWT (JSON Web Tokens)** for authentication and authorization.
*   **RESTful API:** A clean and well-defined API for all client-server interactions.
*   **Responsive Design:** A modern and adaptive user interface built with **Tailwind CSS** that looks great on any device.
*   **Persistent Storage:** All messages and user data are securely stored in a **MongoDB** database.
*   **User Presence:** See who's online and available to chat (requires Socket.IO integration).
*   **Typing Indicators:** Know when someone is composing a message (requires Socket.IO integration).

## 🛠️ Technology Stack

### Frontend
*   **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
*   **[Vite](https://vitejs.dev/):** A next-generation frontend tooling for fast development and builds.
*   **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
*   **[Socket.IO Client](https://socket.io/docs/v4/client-api/):** For real-time, bidirectional communication with the server.

### Backend
*   **[Node.js](https://nodejs.org/):** JavaScript runtime environment.
*   **[Express.js](https://expressjs.com/):** Fast, unopinionated, minimalist web framework for Node.js.
*   **[Socket.IO](https://socket.io/):** Enables real-time, bidirectional and event-based communication.
*   **[MongoDB](https://www.mongodb.com/):** A NoSQL database for storing user profiles and chat history.
*   **[Mongoose](https://mongoosejs.com/):** Elegant MongoDB object modeling for Node.js.
*   **[JSON Web Tokens (JWT)](https://jwt.io/):** For securely transmitting information between parties as a JSON object.

## 📁 Project Structure

```
memo-chat-app/
├── client/                 # React Frontend (Vite)
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/       # React Context (e.g., Auth, Socket)
│   │   ├── pages/          # Main application views (Login, Chat, etc.)
│   │   ├── services/       # API calls and Socket logic
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                 # Node.js/Express Backend
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware (e.g., auth)
│   ├── models/             # Mongoose data models
│   ├── routes/             # API route definitions
│   ├── sockets/            # Socket.IO event handlers
│   ├── utils/              # Helper functions
│   ├── .env                # Environment variables
│   ├── package.json
│   └── server.js           # Entry point
└── README.md
```

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn
*   MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database)

### Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/memo-chat-app.git
    cd memo-chat-app
    ```

2.  **Set up the Backend**
    ```bash
    cd server
    npm install
    ```
    *   Create a `.env` file in the `server` directory and add the following:
        ```env
        PORT=5000
        MONGODB_URI=your_mongodb_connection_string
        JWT_SECRET=your_super_secret_jwt_key
        CLIENT_URL=http://localhost:5173
        ```

3.  **Set up the Frontend**
    ```bash
    cd ../client
    npm install
    ```
    *   Create a `.env` file in the `client` directory:
        ```env
        VITE_API_BASE_URL=http://localhost:5000/api
        VITE_SOCKET_URL=http://localhost:5000
        ```

### Running the Application

1.  **Start the Backend Server**
    ```bash
    cd server
    npm run dev  # or npm start
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server**
    ```bash
    cd client
    npm run dev
    ```
    The application will open in your browser at `http://localhost:5173`.

## 📚 API Documentation (Key Endpoints)

| Method | Endpoint              | Description                 | Auth Required |
| :----- | :-------------------- | :-------------------------- | :------------ |
| POST   | `/api/auth/register`  | Register a new user         | No            |
| POST   | `/api/auth/login`     | Login a user                | No            |
| GET    | `/api/users`          | Get all users               | Yes           |
| GET    | `/api/messages/:userId` | Get chat history with a user | Yes           |

## 🔌 Real-time Events (Socket.IO)

The following Socket.IO events are implemented for real-time functionality:

*   **Connection / Disconnection:** Tracks user online status.
*   **`send_message`:** Client emits this to send a message. Server broadcasts it.
*   **`receive_message`:** Client listens for incoming messages.
*   **`typing`:** Notifies the recipient that the sender is typing.

## 🗺️ Future Roadmap

- [ ] Group chat functionality
- [ ] Image and file sharing
- [ ] Message reactions and replies
- [ ] End-to-end encryption
- [ ] Push notifications
- [ ] Voice and video calling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Gia Bảo (Coide) - - luonggiabao060904@ggmail.com.com

Project Link: [(https://github.com/giabao1340/Mem)]

---

**Happy Chatting with Memo!** 💬
