import { fetchRooms, bookRoom } from "../../services/roomBookingService";

export const getAvailableRoomsFunctionDeclaration = {
    name: "getAvailableRooms",
    parameters: {
        type: "OBJECT",
        description: "Get all the rooms in the hotel.",
        properties: {
            name: {
                type: 'STRING',
                description: 'The name of the room. eg., Deluxe Room, Executive Room'
            },
            price: {
                type: 'NUMBER',
                description: 'The price of the room. eg., 5000, 8000'
            },
            description: {
                type: 'STRING',
                description: 'The description of the room. eg., Modern room with work desk and high-speed internet, Large room with two queen-size beds, perfect for families'
            }
        },
    },
};

export const bookRoomFunctionDeclaration = {
    name: "bookRoom",
    parameters: {
        type: "OBJECT",
        description: "Create a booking for the user in requested room.",
        properties: {
            id: {
                type: 'NUMBER',
                description: 'The id of the room which is to be booked. eg, 1,2,5'
            },
            fullName: {
                type: 'STRING',
                description: 'The name of the person who is booking the room. eg., John Doe'
            },
            email: {
                type: 'STRING',
                description: 'The email fo the person who is booking the room. eg., john.doe@example.com'
            },
            nights: {
                type: 'NUMBER',
                description: 'The number of nights the room is to be booked. eg., 1,2,3'
            }
        },
        required: ["id", "fullname", "email", "nights"],
    },
};


export const functions = {
    getAvailableRooms: async ({ name, price, description }) => {
        return await fetchRooms();
    },
    bookRoom: async ({ id, fullName, email, nights }) => {
        return await bookRoom(id, fullName, email, nights);
    },
};