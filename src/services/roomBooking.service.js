import { createBooking, getBookingById, updateBooking } from "../repositories/bookingsRepo";

export async function fetchRooms() {
    try {
        const response = await fetch("https://bot9assignement.deno.dev/rooms");
        if (!response.ok) {
            throw new Error(`Error fetching rooms: ${response.statusText}`);
        }
        const rooms = await response.json();
        return JSON.stringify(rooms);
    } catch (error) {
        console.error(error);
        return JSON.stringify({ error: error.message });
    }
}

export async function bookRoom(id, fullName, email, nights) {
    try {
        const response = await fetch("https://bot9assignement.deno.dev/book", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                roomId: id,
                fullName: fullName,
                email: email,
                nights: nights,
            }),
        });
        if (!response.ok) {
            throw new Error(`Error booking room: ${response.statusText}`);
        }
        const booking = await response.json();

        createBooking(booking);
        return JSON.stringify(booking);
    } catch (error) {
        console.error(error);
        return JSON.stringify({ error: error.message });
    }
}

export async function getBooking(bookingId) {
    try {
        const booking = await getBookingById(bookingId);
        if (!booking) {
            return JSON.stringify("Booking not found");
        }

        return JSON.stringify(booking);
    } catch (error) {
        console.error(error);
        return JSON.stringify({ error: error.message });
    }
}

export async function cancelBooking(userName, bookingId) {

    try {
        const booking = await getBookingById(bookingId);
        if (!booking) {
            return JSON.stringify("Booking not found");
        }

        await updateBooking(bookingId, { message: "Booking cancelled" });

        return JSON.stringify({ status: `Booking Canceled for User: ${userName} with Booking ID: ${bookingId}` });

    } catch (error) {
        console.log(error);
        return JSON.stringify({ error: error.message });
    }

}