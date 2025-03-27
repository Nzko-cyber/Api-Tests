# 📌 API Test Documentation

## 📢 Overview
This document explains the structure and setup of API tests written using **PactumJS** and **Jest**.

---

## 🛠 Setup Instructions

### 1. Install Dependencies
Run the following command to install necessary dependencies:
```sh
npm install --save-dev pactum jest
```

### 2. Configure Jest
#### For CommonJS
Create a `jest.config.ts` file with the following content:
```javascript
module.exports = {
  testEnvironment: 'node',
  transform: {},
};
```

#### For ES Modules
Ensure `"type": "module"` is added in your `package.json`.

### 3. Run Tests
Execute the tests with:
```sh
npx jest
```

---

## 📂 File Structure

The project follows this organized folder structure:
```plaintext
📦 tests/
 ┣ 📂 ProjectExplorer/
 ┃ ┣ 📜 1. Namespace.test.ts  # API Tests for Namespace
 ┣ 📜 units.js             # Utility functions (e.g., randomString)
 ┣ 📜 jest.config.ts       # Jest Configuration
```

---

## 📔 Notes
1. Keep test utility functions, like `randomString` and helpers.
2. Separate test files by feature or module to enhance maintainability.
3. Use proper naming conventions for clarity (e.g., `ProjectExplorer` vs `ProjetExplorer`).