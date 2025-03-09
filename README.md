# Policy & Risk Assessment Tool

This project is aimed to allow for organisations and IT employees who lack intensive resources and experience respetcively to be able to perform a Policy & Risk Assessment digitally. Whilst the main focus for this tool to be used by SMEs (small medium-sized enterprises) using cloud computing environments, it can be utilised across an organisation for different departments, sub teams and projects. Integrating AI into API requests will allow a user to go through all the steps of a risk assessment, and allow employees (users) and managers/IT department (superusers) to work together to build an automated policy.

### Frontend:
    - React + Vite
    - TypeScript
    - TailwindCSS

### Backend:
    - Node.js
    - Express.js
    - MongoDB

### Installation & Setup
#   1. Clone the Repository:
        git clone "https://github.com/BrunoFernansh/PoicyTool"

#   2. Setting Up MongoDB Atlas & Connecting to Local Collections  

1. Go to **[MongoDB Atlas](https://www.mongodb.com/atlas/database)**
2. Click **"Sign Up"** and create an account using **email/GitHub/Google**.
3. Verify your email and log in.

---

SET UP A FREE CLUSTER:

1. Click **"Create a New Project"** (or use the default one).  
2. Click **"Build a Cluster"** and choose the **Free Shared** tier.  
3. Select the **Cloud Provider & Region** closest to you.  
4. Name your cluster (e.g., `MyCluster`).  
5. Click **"Create"** (it may take a few minutes for the cluster to be ready).  

---


CONFIGURE DATABASE ACCESS:

1. Navigate to **Database Access** in the left menu.  
2. Click **"Add New Database User"**.  
3. Choose **"Username & Password"** authentication and set:  
    - **Username** (e.g., `user123`)  
    - **Password** (e.g., `password123`)  
4. Select **"Read and Write"** role.  
5. Click **"Add User"**.  

---

ALLOW IP ACCESS:

1. Navigate to **Network Access** in the left menu.  
2. Click **"Add IP Address"**.  
3. Choose one of the options:  
- **Allow Access from Anywhere** (for testing)  
- **Manually add your IP** (recommended for security)  
4. Click **"Confirm"**.  

---

GET YOUR CONNECTION URI:

1. Navigate to **Clusters** and click **"Connect"** on your cluster.  
2. Select **"Connect your application"**.  
3. Copy the **MongoDB URI**, which looks like this:  

```sh
mongodb+srv://user123:password123@cluster0.mongodb.net/myDatabase?retryWrites=true&w=majority 
```
4. Replace the placeholder values:

    - user123 -> Your Database username
    - password123 -> Your Database password
    - myDatabase -> Name of your database (Not your cluster)
    
    
    
#   3. A **JWT (JSON Web Token) secret key** is used to sign and verify tokens for authentication and security.
    
GENERATE A SECURE JWT SECREY KEY:

Choose one of the following methods:

**Method 1: Using Node.js**
Run the following command in your terminal:
```sh
node -e console.log(require('crypto').randomBytes(64).toString('hex'))

This will generate a random 64-byte secrey key
```

**Method 2: Usinf OpenSSL**
Run the following command in your terminal:
```sh
openssl rand -hex 64


This will generate a secure 64-character key 
```
---
    
 #  4. Generating your own OpenAI API key (Credits required)

CREATE OPENAI ACCOUNT

1. **Go to OpenAI's website**:  
[https://platform.openai.com/signup](https://platform.openai.com/signup)  
2. Click **"Sign Up"** and create an account using **email/GitHub/Google/Microsoft**.  
3. **Verify your email** and log in.  
4. **Complete phone number verification** (required for security).  

ADD CREDITS/API TOKENS 

1. **Go to the Billing Section**:  
[https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)  
2. Click **"Add Payment Method"** and enter your credit/debit card details.  
3. Once your payment method is added, click **"Add Funds"**.  
4. Select the amount you want to add (e.g., **$5, $10, or more**).  
5. **Once the payment is processed, your account balance will be updated**, allowing you to generate more tokens.

**Note:** If you're a new user, OpenAI may provide **$6 in free credits** automatically, which can be used without adding a payment method. Check your **Usage Dashboard**:  
[https://platform.openai.com/account/usage](https://platform.openai.com/account/usage)  


GENERATE YOUR API KEY

1. **Go to API Key Management**:  
[https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)  
2. Click **"Create API Key"**.  
3. Copy the generated key **immediately**, as OpenAI won’t show it again.  
4. **Store it securely** in a `.env` file (see next step).  


#   5. Create your own private .env file in the 'backend' directory:
```sh
'cd repo_name'
'cd backend'
'touch .env' (in your terminal)
```

1. Set the following API keys and links as follows:
    - PORT=8000 (ensure the port is not in use elsewhere)
    - MONGO_URI= 'your_mongo_uri_here' (created frmo MongoDB Atlas)
    - JWT_SECRET = 'your_jwt_secret_key_here'
    - OPENAI_API_KEY = 'your_openai_api_key_here'



### Run the Application
```sh
cd your-rep 
```
    
Run the following commands:

```sh
'cd frontend'
'npm install'  (install dependencies)
```
    
Navigate to the backend directory:
```sh
'cd ..'
'cd backend'
```

Run the following commands:

```sh
'npm install' (install dependencies)
'npm run dev'
```

Access the application on http://localhost:5173/
    
    