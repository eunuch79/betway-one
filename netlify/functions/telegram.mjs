
export default async (request) => {
  if (request.method !== "POST") {
    return Response.json(
      { error: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const { message } = await request.json();

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return Response.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return Response.json(
        { error: "Telegram credentials missing" },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const result = await response.json();

    if (!result.ok) {
      return Response.json(
        { error: "Telegram rejected the message" },
        { status: 502 }
      );
    }

    return Response.json({
      success: true,
      message: "Telegram message sent"
    });

  } catch (error) {
    return Response.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
};
          
