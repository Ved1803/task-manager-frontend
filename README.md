# Task Manager Frontend

This is the frontend for the Task Manager application, built using **React** and **Vite**.

## **Project Setup Instructions**

Follow these steps to set up the project on your local machine.

---

## **1️⃣ Install Node.js and npm**

Make sure you have **Node.js** installed. If you don't have it, install it using **nvm (Node Version Manager)**.

### **Install nvm (Recommended)**
Run the following command:
```sh
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
source ~/.bashrc   # For Linux/macOS (Bash)
source ~/.zshrc    # For macOS (Zsh)
```

### **Install the Latest Node.js Version**
```sh
nvm install node
```

### **Verify Installation**
Check if Node.js and npm are installed correctly:
```sh
node -v   # Check Node.js version
npm -v    # Check npm version
```

---

## **2️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/task-manager-frontend.git
cd task-manager-frontend
```

---

## **3️⃣ Install Dependencies**
Run the following command inside the project directory:
```sh
npm install
```

---

## **4️⃣ Install Vite**
Vite is used as the development server for React. Install it as a dev dependency:
```sh
npm install --save-dev vite
```

---

## **5️⃣ Start the Development Server**
Run the React development server using Vite:
```sh
npm run dev
```
By default, the server will start at:
```
http://localhost:5173
```
If the port is busy, you can specify a different port:
```sh
PORT=3000 npm run dev
```

---

## **6️⃣ Build for Production**
To create a production build, run:
```sh
npm run build
```
This will generate optimized files inside the `dist/` folder.

---

## **7️⃣ Preview the Production Build**
To preview the production build locally:
```sh
npm run preview
```

---

## **8️⃣ Troubleshooting**
- If you get **"vite: command not found"**, ensure Vite is installed:
  ```sh
  npm install --save-dev vite
  ```
- If `npm run dev` doesn't work, try running Vite directly:
  ```sh
  npx vite
  ```

---

### **🔗 Useful Links**
- [Node.js Download](https://nodejs.org/)
- [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm)
- [Vite Documentation](https://vitejs.dev/)

---

### **📌 Author**
**Your Name**  
Email: [your-email@example.com](mailto:your-email@example.com)  
GitHub: [your-github-profile](https://github.com/your-username)

