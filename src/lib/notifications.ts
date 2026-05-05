const FUNCTION_URL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-notification`;

export async function notifyBooking(booking: {
  guest_name: string;
  guest_email: string;
  room_name: string;
  check_in: string;
  check_out: string;
  total_amount: number;
  booking_id: string;
  guests: number;
}) {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ type: "booking", booking }),
    });
  } catch {
    // Notification is best-effort — don't block the UX
  }
}

export async function notifyContact(contact: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
}) {
  try {
    await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      },
      body: JSON.stringify({ type: "contact", contact }),
    });
  } catch {
    // Notification is best-effort
  }
}
