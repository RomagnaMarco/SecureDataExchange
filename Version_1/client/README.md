# SecureDataExchange Frontend Application

This README provides insights and setup information for the frontend of the SecureDataExchange full-stack application.

<details>
<summary>## 🔍 Available Scripts</summary>

### `yarn start`
- **What it does**: Launches the app in development mode.
- **Access**: Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- **Features**:
  - Automatic page reloading upon source code changes.
  - Displays lint errors in the console.

### `yarn test`
- **What it does**: Starts the test runner in interactive watch mode.

### `yarn build`
- **What it does**: Creates a production-ready build in the `build` folder.
- **Features**:
  - Bundles React in production mode.
  - Optimizes for the best performance.
  - Minifies the build and appends hashes to filenames for cache management.

### `yarn eject`
- **Caution**: This is irreversible! Once you've ejected, there's no going back.
- **What it does**: Provides more control over build tools and configurations by removing the single build dependency and copying all configurations and dependencies into your project.
- **Note**: Ejecting is optional. It's beneficial for larger projects requiring customization. Use with caution and understand the consequences before proceeding.

</details>

<details>
<summary>## 📦 Additional Dependencies</summary>

For a holistic frontend functionality in the SecureDataExchange application, we've integrated some pivotal dependencies:

### `react-router-dom`
- **What it does**: Enables dynamic routing in the application, vital for crafting intuitive navigation within single-page applications.

### `axios`
- **What it does**: An esteemed promise-driven HTTP client instrumental in making asynchronous requests in JavaScript, paramount for asynchronous HTTP requests to RESTful endpoints and curating CRUD operations.

### `react-cookie`
- **What it does**: Offers a seamless cookie management system within React, crucial for reading, setting, and managing cookies across components.

To seamlessly integrate these dependencies, execute:

```bash
yarn add react-router-dom axios react-cookie
