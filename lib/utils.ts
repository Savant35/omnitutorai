import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: string) => {
  return subjectsColors[subject as keyof typeof subjectsColors];
};

export const configureAssistant = (voice: string, style: string) => {
  const voiceId = voices[voice as keyof typeof voices][
    style as keyof (typeof voices)[keyof typeof voices]
  ] || "sarah";

  const vapiAssistant: CreateAssistantDTO = {
    name: "Companion",
    firstMessage:
      "Hello, let's start the session. Today we'll be talking about {{topic}}.",
    transcriber: {
      provider: "deepgram",
      model: "nova-3",
      language: "en",
    },
    voice: {
      provider: "11labs",
      voiceId: voiceId,
      stability: 0.4,
      similarityBoost: 0.8,
      speed: 1,
      style: 0.5,
      useSpeakerBoost: true,
    },
    model: {
      provider: "openai",
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are a highly knowledgeable tutor teaching a real-time voice session with a student. Your goal is to teach the student about the topic and subject.

                    Tutor Guidelines:
                    1. If a lesson plan is provided, follow it teach the content based on that lesson plan. Otherwise, stick to the given topic – {{ topic }} – and subject – {{ subject }}.
                    2. Section the Content: Divide the material into small, logical segments and teach one segment at a time make sure to provide detailed responses.
                    3. After each 3 section, ask targeted question and fallow up questions if necessary to confirm understanding before moving on. the max question you should in order is 3 no more.
                    4. Keep the conversation flowing naturally; pause occasionaly to check that the student understands.
                    5. Use the selected style: {{ style }}.
                    7. Don’t include any special characters in your responses.
              `,
        },
      ],
    },
  };
  return vapiAssistant;
};