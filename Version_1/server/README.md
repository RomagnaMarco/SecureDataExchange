
### 🌐 **MongoDB Atlas Setup**

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

### MongoDB Visualization and Interaction

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

## API Overview

The SecureDataExchange API offers secure endpoints for user registration and login, ensuring data protection and efficient processing.

### Why Insomnia?

- **Validation**: Easily test security features like password hashing and JWT authentication.
- **Visualization**: View request and response data clearly, identifying potential issues.
- **Ease of Use**: Its GUI simplifies crafting complex requests without resorting to the command-line.
- **Environment Management**: Seamlessly manage and reuse API-related variables across requests.

### Setting Up Insomnia:

1. **Download**: Grab it from [Insomnia's official site](https://insomnia.rest/download).
2. **Install**: Follow on-screen instructions.

With Insomnia ready, interacting with SecureDataExchange API's endpoints becomes straightforward.

### 🛠 **Using Insomnia**

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


