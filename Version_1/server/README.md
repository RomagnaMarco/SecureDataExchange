
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

