export async function fetchRooms() {
    const rooms = await fetch("https://bot9assignement.deno.dev/rooms");
    return JSON.stringify(rooms.body);
}

export async function bookRoom(id, fullName, email, nights) {
    const booking = await fetch("https://bot9assignement.deno.dev/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            roomId: id,
            fullName: fullName,
            email: email,
            nights: nights
        }),
    });
    return JSON.stringify(booking.body);
}