# HotelBot

# Getting Started
Clone the repository with the client submodule:

```bash
	git clone --recursive git@github.com:2k4sm/HotelBot.git
```

__Follow this to get started with backend__ **[Getting Started With Backend](./Getting_Started_Backend.md)**

__Follow this to get started with frontend__**[Getting Started With Frontend](./Getting_Started_Frontend.md)**

# Technical Requirement Document

## Project Overview

The project involves creating a chatbot for hotel booking management. The bot will handle user interactions for booking rooms, provide current booking information.

## Functional Requirements

### Primary Functionalities

- Respond to users with room details.
- Create bookings after taking details from users.
- Store room booking information.
- Uses conversation history as a context throughout the conversation.

### Chatbot Flow

1. User initiates a conversation about booking a resort room.
2. Bot fetches room options from an API and responds with a list of room options.
3. User selects a room.
4. Bot provides pricing information.
5. User confirms they want to proceed with booking.
6. Bot makes a simulated API call to book the room and returns a booking confirmation with a booking ID.

## API Requirements

### Main Endpoint

**POST /chat**: Handle user messages and return chatbot responses.

### External API Interactions

- Fetch room options.
- Store and use conversation history.
- Simulate room booking.

## Backend Requirements

### Technologies

- Node.js
- Express.js
- GEMINI API

### Key Features

Maintain conversation history throughout the chat session.

Implement function calling to simulate external API interactions (room booking).

Implement basic error handling for invalid user inputs or API failures.


## Frontend Requirements

### Technologies

- HTML
- CSS
- JavaScript or React.js

### Key Features

- Simple interface for interacting with the chatbot.

## Data Management

### User Data

- Store booking details.
- Store Conversation.


## Error Handling

- Handle invalid user inputs gracefully.
- Manage API failures with appropriate error messages.


## Conclusion

This document outlines the technical requirements for developing a hotel booking management chatbot. The bot will facilitate room bookings, provide booking information.