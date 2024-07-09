import { fetchRooms, bookRoom, cancelBooking, getBooking } from "../../services/roomBooking.service";
import { FunctionDeclarationSchemaType } from "@google/generative-ai";
export const toolFunctions = [
    {
        functionDeclarations: [
            {
                name: "getAvailableRooms",
                description: "Get all the rooms and their details.",
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
                description: 'Book the requested room for the user after getting all the required details from the user and then provide them with their booking details.',
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
                name: "getBooking",
                description: "Get the booking details for the provided bookingId even if the booking is cancelled.",
                parameters: {
                    type: FunctionDeclarationSchemaType.OBJECT,
                    properties: {
                        bookingId: {
                            type: FunctionDeclarationSchemaType.NUMBER,
                            description: 'The booking id of the user with which he booked the room.'
                        },
                    },
                    required: ["bookingId"]
                }
            },
            {
                name: "cancelBooking",
                description: "Cancel the booking with the provided bookingId and provide the user with details of the cancelled booking.",
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
            },
        ],
    },
]


export const functions = {
    getAvailableRooms: async () => {
        return await fetchRooms();
    },
    bookRoom: async ({ id, fullName, email, nights }) => {
        return await bookRoom(id, fullName, email, nights);
    },

    cancelBooking: async ({ userName, bookingId }) => {
        return await cancelBooking(userName, bookingId);
    },
    getBooking: async ({ bookingId }) => {
        return await getBooking(bookingId);
    },
};