import { openai } from "../../config/apiconfig"
export async function createAssistantIfNeeded() {
    const existingAssistants = await openai.beta.assistants.list();
    const existingAssistant = existingAssistants.data.find(
        (assistant) => assistant.name === "HotelBot_v0"
    );

    const assistantConfig = {
        name: "HotelBot_v0",
        model: "gpt-4o",
        instructions: "As a Hotel Booking chatbot, You assist with room reservations and handle complaints using booking IDs",
        tools: [
            {
                type: 'function',
                function: {
                    name: 'getAvailableRooms',
                    description: 'Retrieve detailed information about all available rooms in the hotel.',
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
                    description: 'Create a booking for the user in their requested room and provide them with a booking ID.',
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
            {
                type: 'function',
                function: {
                    name: 'registerComplaint',
                    description: 'Register a complaint for the user associated with their booking id.',
                    parameters: {
                        type: 'object',
                        properties: {
                            bookingId: {
                                type: 'number',
                                description: 'The booking id of the user with which he booked the room.'
                            },
                            issue: {
                                type: 'string',
                                description: 'The issue with which the user is facing. eg., "Dirty Room", "No Internet"'
                            }
                        },
                        required: ["bookindid", "issue"]
                    }
                }
            },
            {
                type: 'function',
                function: {
                    name: 'cancelBooking',
                    description: 'Cancel the booking associated with the user and booking id.',
                    parameters: {
                        type: 'object',
                        properties: {
                            userName: {
                                type: 'string',
                                description: 'The name of the user who is cancelling the booking.'
                            },
                            bookingId: {
                                type: 'number',
                                description: 'The booking id of the user with which he booked the room.'
                            }
                        },
                        required: ["bookingid"]
                    }
                }
            },
        ]
    }

    if (existingAssistant) {
        console.log("Assistant already exists:", existingAssistant);
    } else {
        const assistant = await openai.beta.assistants.create({
            ...assistantConfig
        });
        return assistant;
    }

    await openai.beta.assistants.update(existingAssistant.id, {
        ...assistantConfig
    })

    const assistant = await openai.beta.assistants.retrieve(
        existingAssistant.id
    );

    return assistant;
}