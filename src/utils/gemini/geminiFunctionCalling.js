import { fetchRooms, bookRoom } from "../../services/roomBookingService";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
export const toolFunctions = [
    {
        functionDeclarations: [
            {
                name: "getAvailableRooms",
                description: "Get all the rooms in the hotel.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        name: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The name of the room. eg., Deluxe Room, Executive Room'
                        },
                        price: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The price of the room. eg., 5000, 8000'
                        },
                        description: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The description of the room. eg., Modern room with work desk and high-speed internet, Large room with two queen-size beds, perfect for families'
                        }
                    },
                },
            },
            {
                name: "bookRoom",
                description: "Create a booking for the user in requested room.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        id: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The id of the room which is to be booked. eg, 1,2,5'
                        },
                        fullName: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The name of the person who is booking the room. eg., John Doe'
                        },
                        email: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The email fo the person who is booking the room. eg., john.doe@example.com'
                        },
                        nights: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The number of nights the room is to be booked. eg., 1,2,3'
                        }
                    },
                },
            }

        ],
    },
]


export const functions = {
    getAvailableRooms: async ({ name, price, description }) => {
        return await fetchRooms();
    },
    bookRoom: async ({ id, fullName, email, nights }) => {
        return await bookRoom(id, fullName, email, nights);
    },
};