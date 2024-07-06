import { openai } from "../config/apikey"
export async function createAssistantIfNeeded() {
    const existingAssistants = await openai.beta.assistants.list();
    const existingAssistant = existingAssistants.data.find(
        (assistant) => assistant.name === "HotelBot_v0"
    );

    if (existingAssistant) {
        console.log("Assistant already exists:", existingAssistant);
        return existingAssistant;
    }

    const assistant = await openai.beta.assistants.create({
        name: "HotelBot_v0",
        model: "gpt-3.5-turbo",
        instructions: "You are a Hotel Booking chatbot. You have to assist users in booking rooms in the hotel.",
        tools: [
            {
                type: 'function',
                function: {
                    name: 'getAvailableRooms',
                    description: 'Get all the rooms in the hotel.',
                    parameters: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                description: 'The name of the room. eg., Deluxe Room, Executive Room'
                            },
                            price: {
                                type: 'number',
                                description: 'The price of the room. eg., 5000, 8000'
                            },
                            description: {
                                type: 'string',
                                description: 'The description of the room. eg., Modern room with work desk and high-speed internet, Large room with two queen-size beds, perfect for families'
                            }
                        }
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'bookRoom',
                    description: 'Create a booking for the user in requested room.',
                    parameters: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'number',
                                description: 'The id of the room which is to be booked. eg, 1,2,5'
                            },
                            fullName: {
                                type: 'string',
                                description: 'The name of the person who is booking the room. eg., John Doe'
                            },
                            email: {
                                type: 'string',
                                description: 'The email fo the person who is booking the room. eg., john.doe@example.com'
                            },
                            nights: {
                                type: 'number',
                                description: 'The number of nights the room is to be booked. eg., 1,2,3'
                            }
                        },
                        required: ["id", "fullname", "email", "nights"],
                    }
                }
            },
        ],
    })

    return assistant;
}