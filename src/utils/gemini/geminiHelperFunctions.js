import { fetchRooms, bookRoom, registerComplaint, cancelBooking } from "../../services/roomBooking.service";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
export const toolFunctions = [
    {
        functionDeclarations: [
            {
                name: "getAvailableRooms",
                description: "Retrieve detailed information about all available rooms in the hotel.",
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
                description: 'Create a booking for the user in their requested room and provide them with a booking ID.',
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
                            description: 'The email of the person who is booking the room. eg., john.doe@example.com'
                        },
                        nights: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The number of nights the room is to be booked. eg., 1,2,3'
                        }
                    },
                    required: ["fullName", "email", "nights"],
                },
            },
            {
                name: "registerComplaint",
                description: "Register a complaint for the user associated with their booking id.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        bookingId: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The booking id of the user with which he booked the room.'
                        },
                        issue: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The issue with which the user is facing. eg., "Dirty Room", "No Internet"'
                        }
                    },
                    required: ["bookingId", "issue"]
                }
            },
            {
                name: "cancelBooking",
                description: "Cancel the booking associated with the user and booking id.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        userName: {
                            type: FunctionDeclarationSchemaType.STRING,
                            description: 'The name of the user who is cancelling the booking.'
                        },
                        bookingId: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The booking id of the user with which he booked the room.'
                        }
                    },
                    required: ["bookingId"]
                }
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
    registerComplaint: async ({ bookingId, issue }) => {
        return await registerComplaint(bookingId, issue);
    },
    cancelBooking: async ({ userName, bookingId }) => {
        return await cancelBooking(userName, bookingId);
    }
};