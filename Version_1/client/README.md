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

### `jwt-decode`
- **What it does**: Facilitates decoding of JWTs, empowering the application to extract and use information stored in JSON Web Tokens. It's critical for user authentication and role-based access control within the application.

To seamlessly integrate these dependencies, execute:

```bash
yarn add react-router-dom axios react-cookie jwt-decode
```
</details>

<details>
<summary>##🔐 Security Clearance and User Permissions</summary>

In the SecureDataExchange application, user permissions and visibility are governed by their designated security clearance levels. Here's a breakdown of the functionalities and access granted to each security clearance level:

### `Level 0`
- **Permissions**:
  - **GET**: Users can retrieve information.
- **Restrictions**: Certain sensitive information might be concealed or redacted.

### `Level 1`
- **Permissions**:
  - **GET**: Users can retrieve information.
  - **POST**: Users can add or submit new information.
- **Restrictions**: While users can both retrieve and post, certain data points or functionalities might be restricted based on their clearance.

### `Level 2`
- **Permissions**:
  - **GET**: Users can retrieve information.
  - **POST**: Users can add or submit new information.
  - **PUT**: Users can modify or update existing information.
- **Restrictions**: Even though they have more access, some functionalities or data might still be restricted.

### `Level 3` (Admins)
- **Permissions**:
  - **Full Access**: Admins can GET, POST, PUT, and DELETE data. They have the most extensive set of privileges and can manage users, data, and application settings.
- **Note**: Admins should be cautious and operate with due diligence given their elevated access rights.

Always ensure that you're aware of your security clearance and only perform actions within your designated permissions. Misuse or unauthorized access attempts will be logged and may have consequences.

</details>
