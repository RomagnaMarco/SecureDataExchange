# SecureDataExchange Server API

This repository contains the server-side implementation for SecureDataExchange, providing authentication and data management functionalities. The server is built using Express.js, and it interfaces with a MongoDB database.

<details>
<summary><h2>🌐 MongoDB Atlas Setup</h2></summary>

- **Atlas**: 
  - We utilize [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for our cloud database service.

- **Login**: 
  - Access the database via the [Atlas Login Page](https://account.mongodb.com/account/login).

- **Project**: 
  - After logging in, set up a new project and a corresponding cluster.

- **IP Whitelisting**: 
  - Navigate to `Security` > `Network Access` and whitelist your IP. 
  - ⚠️ **Note**: If using a VPN, it can change your IP. Ensure the VPN's IP is whitelisted.

- **Database Creation**:
  - Set up a database using the free tier.
  - Choose **Azure** as the cloud provider.
  - Ensure the database is hosted in **US West**.

- **Authentication**:
  - Create a new **user** and set a **password** in `Security` > `Database Access`.
  - Use these credentials to authenticate and establish a connection to the database.
  
- **Connection**:
  - Navigate to your database and select the one you've created.
  - Click on `Connect` and then select `Connect using MongoDB Drivers`.
  - Copy the provided connection string.
  - Paste this connection string into the `index.js` file within your server code, ensuring that you provide the correct credentials, so that Mongoose can establish a connection to the database. Replace password with your password (Use .env variables to keep this data safe).
  - Add database name in between / and ?retryWrites

</details>

<details>
<summary><h2>🔍 MongoDB Visualization and Interaction</h2></summary>

To effectively visualize and interact with your MongoDB data using the `securedata` database, follow these steps:

1. **Download MongoDB Compass**:
   - [MongoDB Compass](https://www.mongodb.com/products/tools/compass) is the official GUI tool for MongoDB. It provides an interactive view of your data.

2. **Get Your Connection String from MongoDB Atlas**:
   - Log in to your MongoDB Atlas account.
   - Locate your `securedata` cluster and click on the `Connect` button.
   - Choose the `Connect with MongoDB Compass` option.
   - Copy the provided connection string. Make sure to replace any placeholders, such as `<password>`, with your actual credentials.

3. **Connect to Your Database via Compass**:
   - Launch MongoDB Compass.
   - Insert the connection string you copied from MongoDB Atlas into the required field.
   
4. **Use the `securedata` Database**:
   - Once connected in Compass, you'll see a list of databases. Access the database named `securedata`.
   - Inside `securedata`, if not already existing, create a collection named `users`. This name should correspond with the user model located at `/server/src/models/Users.js`.

**Note**: Always double-check your connection string for accuracy before connecting.

</details>

<details>
<summary><h2>📝 API Overview</h2></summary>

The SecureDataExchange API offers secure endpoints for user registration and login, ensuring data protection and efficient processing.

</details>

<details>
<summary><h2>❓ Why Insomnia?</h2></summary>

- **Validation**: Easily test security features like password hashing and JWT authentication.
- **Visualization**: View request and response data clearly, identifying potential issues.
- **Ease of Use**: Its GUI simplifies crafting complex requests without resorting to the command-line.
- **Environment Management**: Seamlessly manage and reuse API-related variables across requests.

</details>

<details>
<summary><h2>🛠 Setting Up Insomnia</h2></summary>

1. **Download**: Grab it from [Insomnia's official site](https://insomnia.rest/download).
2. **Install**: Follow on-screen instructions.

</details>

<details>
<summary><h2>🔧 Using Insomnia (Basics) </h2></summary>

Insomnia is a powerful tool for testing API endpoints. It provides a clean interface to set up requests, view responses, and diagnose network operations. Here's a quick guide to get you started:

1. **Create a New Request Document**
    - Click on the `+` symbol.
    - Choose `New Request` and give it a meaningful name. We will use HTTP Requests for now.

2. **Set Up Your HTTP Request**
    - Input the API endpoint URL you want to test.
    - From the dropdown menu, select the appropriate request type (GET, POST, PUT, etc.).
    - If necessary, configure the body of the request:
      - Ensure the body type is set to `JSON`.
      - Enter the relevant JSON payload.
</details>

<details>
<summary><h2> Handling Authorization with Insomnia </h2></summary>

To ensure secure access and respect clearance levels for certain requests, it's imperative to properly handle authorization. Follow these detailed steps for optimal security:

1. **Log in as a User**: 
    - Start by initiating a login request for the user you're testing with.
    - Upon a successful login, the response will provide a token. This token represents the user's session and also embeds their clearance level.

2. **Check Clearance Level**:
    - Before proceeding, verify the user's clearance level. Make sure it aligns with the requirements of the specific endpoint you aim to test. Different endpoints might necessitate different clearance levels.

3. **Setting the Authorization Header**:
    - For authenticated requests, inclusion of the `Authorization` header is a must.
    - This header should be structured as: `Bearer YOUR_RECEIVED_TOKEN`.
    - For clarity, if you have a token like `abc123`, your `Authorization` header should be set to: `Bearer abc123`.

4. **Token Expiry and Renewal**:
    - Tokens, depending on system settings, might have an expiry. If you encounter any authorization issues, an expired token might be the culprit.
    - Simply log in again, retrieve a new token, and use this renewed token for upcoming requests.

> **Important**: Tokens, being access keys to your system, demand utmost security. Ensure they're stored safely. Exposing them in client-side scripts or public repositories is highly discouraged.

</details>

<details>
<summary><h2>🔍 Checking Local Storage</h2></summary>

Local storage is a web browser's feature that allows you to store key-value pairs in a persistent manner. In our application, we store certain data, like the user's ID, in local storage for quicker access upon subsequent visits or interactions.

### How to Inspect Stored Data in Local Storage:

1. **Access Developer Tools**:
   - Right-click on any part of our frontend webpage.
   - Select `Inspect` or `Inspect Element` from the dropdown menu.

2. **Navigate to the Application Tab**:
   - Within the Developer Tools, locate and click on the `Application` tab.

3. **View Local Storage Data**:
   - In the left sidebar of the `Application` tab, click on `Local Storage`. This will expand to show all domains for which data is stored.
   - Select your website's domain. You should now see a table displaying all the key-value pairs stored in local storage for your domain.
   - Here, you can locate the `userID` key to see its corresponding value.

> **Note**: Always exercise caution when dealing with local storage, especially if storing sensitive data. Although data in local storage persists even after the browser is closed, it can be inspected by anyone with access to the browser.

</details>


