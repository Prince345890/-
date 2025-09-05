# 👑 Prince Bot 👑

Hey, Prince! Welcome to your very own **Prince Bot**, a powerful and highly customizable bot built for automating various tasks on Facebook Messenger.

---

### **Table of Contents**

- [🚀 Features](#-features)
- [🛠️ Installation](#️-installation)
- [⚙️ Usage](#️-usage)
- [📦 Dependencies](#-dependencies)
- [🤝 Contributing](#-contributing)
- [📜 License](#-license)

---

### **🚀 Features**

- **Fully Customizable:** Easily modify commands, events, and bot behavior to suit your needs.
- **Dynamic Configuration:** Manage all bot settings like prefix, owner ID, and bot name through a dedicated web dashboard. No need to manually edit JSON files!
- **Robust API Support:** Built on a stable and efficient FCA (Facebook Chat API) to ensure smooth performance.
- **Community Driven:** Comes with a wide range of pre-built commands for fun, utility, and administration.
- **Scalable & Efficient:** Optimized for use in multiple chat groups simultaneously without performance issues.

---

### **🛠️ Installation**

Follow these simple steps to get your bot up and running in minutes:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/prince-official/prince-bot.git](https://github.com/prince-official/prince-bot.git)
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd prince-bot
    ```

3.  **Install the dependencies:**
    ```bash
    npm install
    ```

4.  **Start the Bot (and the Web Dashboard):**
    ```bash
    npm start
    ```
    Once the server is running, open your web browser and go to `http://localhost:8080` to configure and start your bot!

---

### **⚙️ Usage**

This bot is designed to be plug-and-play. Once you've configured it via the web dashboard:

- **Commands:** All commands start with the prefix you set on the dashboard. Use `.help` to see a list of available commands.
- **Customization:** Add your own commands and events by creating new files in the `Prince/commands` and `Prince/events` folders.

---

### **📦 Dependencies**

This project uses **fca-prince**, a stable and feature-rich library for Facebook Chat API.

It's powered by a comprehensive list of NPM packages for everything from image manipulation to web scraping, ensuring a rich set of features out of the box.

---

### **🤝 Contributing**

Contributions are highly welcome! Whether you want to fix a bug, add a new command, or improve the documentation, your help is appreciated. Feel free to submit a pull request or open an issue.

---

### **📜 License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
