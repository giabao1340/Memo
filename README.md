# 📱 Memo - Real-time Chat Application

**Memo** is a modern, real-time chat application that allows users to communicate seamlessly. Built with a robust stack, Memo focuses on performance, security, and an intuitive user experience. Whether you're sending a quick note or having a group conversation, Memo makes it feel natural.

## ✨ Key Features

- **Real-time Messaging:** Experience instant communication with WebSocket support via **Socket.IO**.
- **Secure Authentication:** User accounts are protected with **JWT (JSON Web Tokens)** for authentication and authorization.
- **RESTful API:** A clean and well-defined API for all client-server interactions.
- **Responsive Design:** A modern and adaptive user interface built with **Tailwind CSS** that looks great on any device.
- **Persistent Storage:** All messages and user data are securely stored in a **MongoDB** database.
- **User Presence:** See who's online and available to chat (requires Socket.IO integration).
- **Typing Indicators:** Know when someone is composing a message (requires Socket.IO integration).

## 🛠️ Technology Stack

### Frontend

- **[React](https://reactjs.org/):** A JavaScript library for building user interfaces.
- **[Vite](https://vitejs.dev/):** A next-generation frontend tooling for fast development and builds.
- **[Tailwind CSS](https://tailwindcss.com/):** A utility-first CSS framework for rapid UI development.
- **[Socket.IO Client](https://socket.io/docs/v4/client-api/):** For real-time, bidirectional communication with the server.

### Backend

- **[Node.js](https://nodejs.org/):** JavaScript runtime environment.
- **[Express.js](https://expressjs.com/):** Fast, unopinionated, minimalist web framework for Node.js.
- **[Socket.IO](https://socket.io/):** Enables real-time, bidirectional and event-based communication.
- **[MongoDB](https://www.mongodb.com/):** A NoSQL database for storing user profiles and chat history.
- **[Mongoose](https://mongoosejs.com/):** Elegant MongoDB object modeling for Node.js.
- **[JSON Web Tokens (JWT)](https://jwt.io/):** For securely transmitting information between parties as
  a JSON object.
- **[Cloudinary](https://cloudinary.com/):** Upload image mesage and avatar url

## 📁 Project Structure

```
memo-chat-app/
|   .gitignore
|   build
|   node_modules
|   README.md
|   structure.txt
|
+---backend
|   |   .env
|   |   babel.config.cjs
|   |   dockerfile
|   |   jest.config.cjs
|   |   package-lock.json
|   |   package.json
|   |   server.js
|   |
|   +---coverage
|   |
|   +---node_modules
|   |
|   +---src
|       +---config
|       |       cloudinary.js
|       |
|       +---controllers
|       |       authController.js
|       |       conversationController.js
|       |       friendController.js
|       |       messageController.js
|       |       userController.js
|       |
|       +---libs
|       |       db.js
|       |
|       +---middleware
|       |       authMiddleware.js
|       |       friendMiddleware.js
|       |       socketMiddleware.js
|       |       uploadMiddleware.js
|       |
|       +---models
|       |       Conversation.js
|       |       Friend.js
|       |       FriendRequest.js
|       |       Message.js
|       |       Session.js
|       |       User.js
|       |
|       +---routes
|       |       authRoute.js
|       |       conversationRoute.js
|       |       friendRoute.js
|       |       messageRoute.js
|       |       userRoute.js
|       |
|       +---socket
|       |       index.js
|       |
|       +---test
|       |   \---testApi
|       |           test.js
|       |
|       \---utils
|               messageHelper.js
|
\---frontend
    |   .env.development
    |   .env.production
    |   .gitignore
    |   components.json
    |   eslint.config.js
    |   index.html
    |   package-lock.json
    |   package.json
    |   README.md
    |   tailwind.config.ts
    |   tsconfig.app.json
    |   tsconfig.json
    |   tsconfig.node.json
    |   vite.config.ts
    |
    +---node_modules
    |
    +---public
    |       .DS_Store
    |       logo.svg
    |       placeholder.png
    |       placeholderSignUp.png
    |       vite.svg
    |
    +---src
        |   App.tsx
        |   index.css
        |   main.tsx
        |
        +---assets
        |       react.svg
        |
        +---components
        |   +---AddFriendModal
        |   |       SearchFrom.tsx
        |   |       SendFriendRequestForm.tsx
        |   |
        |   +---auth
        |   |       Logout.tsx
        |   |       ProtectedRoute.tsx
        |   |       signin-form.tsx
        |   |       signup-form.tsx
        |   |
        |   +---chat
        |   |       AddFriendModal.tsx
        |   |       ChatCard.tsx
        |   |       ChatWelComeScreen.tsx
        |   |       ChatWindowBody.tsx
        |   |       ChatWindowHeader.tsx
        |   |       ChatWindowLayout.tsx
        |   |       ChatWindowSkeleton.tsx
        |   |       CreateNewChat.tsx
        |   |       DirecteMessageCard.tsx
        |   |       DirectMessageList.tsx
        |   |       EmojiPicker.tsx
        |   |       FriendList.tsx
        |   |       GroupChatAvatar.tsx
        |   |       GroupChatCard.tsx
        |   |       GroupChatDetails.tsx
        |   |       GroupChatList.tsx
        |   |       MessageInput.tsx
        |   |       MessagesItem.tsx
        |   |       NewGroupChatModal.tsx
        |   |       StatusBadge.tsx
        |   |       UnreadCountBadge.tsx
        |   |       UserAvatar.tsx
        |   |
        |   +---createNewChat
        |   |       FriendListModal.tsx
        |   |
        |   +---friendRequest
        |   |       FriendRequestDialog.tsx
        |   |       FriendRequestItem.tsx
        |   |       ReceivedRequests.tsx
        |   |       SendRequests.tsx
        |   |
        |   +---newGroupChat
        |   |       InviteSuggestionList.tsx
        |   |       SelectedUsersList.tsx
        |   |
        |   +---profile
        |   |       AvatarUploader.tsx
        |   |       PersonalInfoForm.tsx
        |   |       PreferencesForm.tsx
        |   |       PrivacySettings.tsx
        |   |       ProfileCard.tsx
        |   |       ProfileDialog.tsx
        |   |
        |   +---sidebar
        |   |       app-sidebar.tsx
        |   |       nav-main.tsx
        |   |       nav-projects.tsx
        |   |       nav-secondary.tsx
        |   |       nav-user.tsx
        |   |
        |   \---ui
        |           avatar.tsx
        |           badge.tsx
        |           breadcrumb.tsx
        |           button.tsx
        |           card.tsx
        |           collapsible.tsx
        |           dialog.tsx
        |           dropdown-menu.tsx
        |           field.tsx
        |           input.tsx
        |           label.tsx
        |           popover.tsx
        |           separator.tsx
        |           sheet.tsx
        |           sidebar.tsx
        |           skeleton.tsx
        |           switch.tsx
        |           tabs.tsx
        |           test.tsx
        |           textarea.tsx
        |           tooltip.tsx
        |
        +---hooks
        |       use-mobile.ts
        |
        +---lib
        |       axios.ts
        |       utils.ts
        |
        +---pages
        |       ChatAppPage.tsx
        |       SignInPage.tsx
        |       SignUpPage.tsx
        |       TestPage.tsx
        |
        +---services
        |       authService.ts
        |       chatService.ts
        |       friendService.ts
        |       userService.ts
        |
        +---store
        |       useAuthStore.ts
        |       useChatStore.ts
        |       useFriendStore.ts
        |       useSocketStore.ts
        |       useThemeStore.ts
        |       useUserStore.ts
        |
        \---types
                chat.ts
                store.ts
                user.ts

```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud database)

### Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/memo-chat-app.git
    cd memo-chat-app
    ```

2.  **Set up the Backend**
    Open new terminal
    `bash
cd backend
npm install
` \* Create a `.env` file in the `server` directory and add the following:

                ```env
                PORT = 5001
                MONGODB_CONNECTIONSTRING = "Your_mongodb_connect_string"
                CLIENT_URL = http://localhost:5173
                ACCESS_TOKEN_SECRET = "Your_access_token_secret"

                CLOUDINARY_CLOUD_NAME = "your_cloudinary_name"
                CLOUDINARY_API_KEY = "your_cloudinary_api_key"
                CLOUDINARY_API_SECRET = "Your_cloudinary_api_serect"
                ```

````

3.  **Set up the Frontend**
    Open new terminal
    `bash
    cd ../frontend
    npm install
    ` \* Create a `.env` file in the `client` directory:
    `env
        VITE_API_BASE_URL=http://localhost:5001/api
        VITE_SOCKET_URL=http://localhost:5001
        `

### Running the Application

1.  **Start the Backend Server**

    ```bash
    cd backend
    npm run dev
    ```

    The server will start on `http://localhost:5001`.

2.  **Start the Frontend Development Server**
    ```bash
    cd frontend
    npm run dev
    ```
    The application will open in your browser at `http://localhost:5173`.

# API Documentation (Chat App Backend)
## Base URL
http://localhost:5001/api
````

---

# Authentication APIs

| Method | Endpoint        | Description          | Auth Required |
| ------ | --------------- | -------------------- | ------------- |
| POST   | `/auth/signup`  | Register new account | ❌            |
| POST   | `/auth/signin`  | Login account        | ❌            |
| POST   | `/auth/signout` | Logout account       | ✅            |
| POST   | `/auth/refresh` | Refresh access token | ❌            |
| GET    | `/auth/test`    | Test API route       | ❌            |

---

# User APIs

| Method | Endpoint              | Description             | Auth Require |
| ------ | --------------------- | ----------------------- | ------------ |
| GET    | `/users/me`           | Get current user info   | ✅           |
| GET    | `/users/search`       | Search user by username | ✅           |
| POST   | `/users/uploadAvatar` | Upload user avatar      | ✅           |

---

# Friend APIs

| Method | Endpoint                               | Description                 | Auth Required |
| ------ | -------------------------------------- | --------------------------- | ------------- |
| POST   | `/friends/requests`                    | Send friend request         | ✅            |
| POST   | `/friends/requests/:requestId/accept`  | Accept friend request       | ✅            |
| POST   | `/friends/requests/:requestId/decline` | Decline friend request      | ✅            |
| GET    | `/friends`                             | Get all friends             | ✅            |
| GET    | `/friends/requests`                    | Get pending friend requests | ✅            |

---

# Conversation APIs

| Method | Endpoint                                  | Description                  | Auth Required |
| ------ | ----------------------------------------- | ---------------------------- | ------------- |
| POST   | `/conversations`                          | Create conversation          | ✅            |
| GET    | `/conversations`                          | Get all conversations        | ✅            |
| GET    | `/conversations/:conversationId/messages` | Get messages in conversation | ✅            |
| PATCH  | `/conversations/:conversationId/seen`     | Mark messages as seen        | ✅            |
| PATCH  | `/conversations/:conversationId/invite`   | Invite members to group      | ✅            |
| DELETE | `/conversations/:conversationId`          | Delete conversation          | ✅            |
| PATCH  | `/conversations/:conversationId/leave`    | Leave group conversation     | ✅            |

---

# Message APIs

| Method | Endpoint               | Description         | Auth Required |
| ------ | ---------------------- | ------------------- | ------------- |
| POST   | `/messages/direct`     | Send direct message | ✅            |
| POST   | `/messages/group`      | Send group message  | ✅            |
| DELETE | `/messages/:messageId` | Delete message      | ✅            |

---

# Middleware Protection

| Middleware             | Purpose                             |
| ---------------------- | ----------------------------------- |
| `protectedRoute`       | Verify JWT access token             |
| `checkFriendShip`      | Check friendship before direct chat |
| `checkGroupMembership` | Verify group membership             |

---

# Upload APIs

## Upload Avatar

### Endpoint

```
POST /api/users/uploadAvatar
```

### Content-Type

```
multipart/form-data
```

### Form Data

| Key  | Type  |
| ---- | ----- |
| file | image |

---

## Send Message With Images

### Endpoint

```
POST /api/messages/direct
POST /api/messages/group
```

### Content-Type

```
multipart/form-data
```

### Form Data

| Key     | Type    |
| ------- | ------- |
| images  | image[] |
| content | string  |

---

# Example Responses

## Success Response

```json
{
  "success": true,
  "message": "Login successful",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

# Suggested RESTful Improvements

- `/messages/direct` → `/conversations/:id/messages`
- `/messages/group` → `/conversations/:id/messages`
- `/uploadAvatar` → `/users/avatar`
- `/friends/requests/:id/accept` → `PATCH /friends/requests/:id`

---

# Project Architecture Summary

- Express modular routing
- JWT authentication
- Middleware-based authorization
- Feature-based structure (auth, users, friends, messages, conversations)
- Real-time chat backend ready

## 🔌 Real-time Events (Socket.IO)

The following Socket.IO events are implemented for real-time functionality:

- **Connection / Disconnection:** Tracks user online status.
- **`send_message`:** Client emits this to send a message. Server broadcasts it.
- **`receive_message`:** Client listens for incoming messages.
- **`typing`:** Notifies the recipient that the sender is typing.

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

Gia Bảo (Codie) - - luonggiabao060904@ggmail.com.com

Project Link: [(https://github.com/giabao1340/Memo)]

Demo Link: [(https://memo-eta-eight.vercel.app/)]

---

**Happy Chatting with Memo!** 💬
