# Getting Started with the Backend.

To get started with HotelBot, follow these steps:

1. Clone the repository:
	```bash
	git clone git@github.com:2k4sm/HotelBot.git
	```

2. Navigate to the project directory:
	```bash
	cd HotelBot
	```

3. Install the dependencies:
	```bash
	npm install
	```
	or
	```bash
	bun install
	```

4. Set up the environment variables:
	- Create a `.env` file in the root directory.
	- Add the following variables to the `.env` file:
	  ```plaintext
	  OPENAI_API_KEY=your_api_key
	  DATABASE_URL=your_database_url
	  DB_PORT=your_database_port
	  DB_NAME=your_database_name
	  DB_USER=your_database_user
	  ```

5. Start the development server:
	```bash
	npm start
	```
	or
	```bash
	bun --hot run index.ts
	```

6. Open your browser and navigate to `http://localhost:PORT` to access HotelBot.

# Thanks for using HotelBot!