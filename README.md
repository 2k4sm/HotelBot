# HotelBot

# Getting Started

__Follow this to get started__ **[Getting Started With Backend](./Getting_Started_Backend.md)**

# Technical Requirement Document

## Project Overview

The project involves creating a chatbot for hotel booking management. The bot will handle user interactions for booking rooms, provide current booking information, and ensure data segregation between different hotels.

## Functional Requirements

### Primary Functionalities

- Respond to users with current booking information.
- Create bookings after taking details from users.
- Store user details and room booking information.
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
- OpenAI API

### Key Features

Maintain conversation history throughout the chat session.

Implement function calling to simulate external API interactions (room booking).

Implement basic error handling for invalid user inputs or API failures.

## Entity Relation Diagram

## Frontend Requirements

### Technologies

- HTML
- CSS
- JavaScript or React.js

### Key Features

- Simple interface for interacting with the chatbot.

## Data Management

### User Data

- Store user details.
- Store room details they are booking.
- Store User Conversation Details.

### Room Data

- Room number
- Vacancy status
- Next available date
- Other relevant details

## Error Handling

- Handle invalid user inputs gracefully.
- Manage API failures with appropriate error messages.

## Security and Data Privacy

- Ensure data of one hotel is completely unlinked from other hotels.
- Implement necessary security measures to protect user and booking data.

## Conclusion

This document outlines the technical requirements for developing a hotel booking management chatbot. The bot will facilitate room bookings, provide booking information, and ensure data privacy and security across multiple hotels.
