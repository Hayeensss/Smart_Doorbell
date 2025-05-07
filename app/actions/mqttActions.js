"use server";

import { publishMessage } from "@/lib/mqtt-server-util.js";
import { currentUser } from "@clerk/nextjs/server";

export async function publishMqttMessageAction(
  topic,
  message
) {
  const user = await currentUser();

  if (!user) {
    console.error(
      "[Action Error] publishMqttMessageAction: Unauthenticated user."
    );
    return {
      success: false,
      error: "Authentication required. Please sign in.",
    };
  }

  console.log(
    `[Action] User ${user.id} attempting to publish to topic: ${topic}`
  );

  try {
    const published = await publishMessage(topic, message);

    if (published) {
      return { success: true, message: "Message published successfully." };
    } else {
      return {
        success: false,
        error: "Failed to publish message via MQTT. Check server logs for details.",
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[Action Error] publishMqttMessageAction failed for topic ${topic} by user ${user.id}: ${errorMessage}`
    );
    return {
      success: false,
      error: `An unexpected error occurred while trying to publish the message: ${errorMessage}`,
    };
  }
} 