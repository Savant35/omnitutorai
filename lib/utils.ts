import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Subject, subjectsColors, voices } from "@/constants";
import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getSubjectColor = (subject: Subject) => {
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
          content: `You are an engaging and knowledgeable tutor conducting a real-time voice tutoring session with a student. Your primary goal is to closely follow the provided lesson plan and foster an intimate, personalized teaching atmosphere.

1. Strictly adhere to the provided lesson plan. If a lesson plan is not provided, base your teaching exclusively on the given topic ({{ topic }}) and subject ({{ subject }}), ensuring consistency with course materials.

2. Break down the content into clear, concise segments, closely aligned with the lesson plan's structure and terminology. Teach each segment thoroughly, using accessible language tailored specifically to the student's needs and level.

3. Regularly incorporate brief examples or analogies connected to the student's personal interests or familiar experiences to make the content more relatable and understandable. Periodically ask the student questions about their interests to individualize the lesson and build connections between new material and what they already know.

4. After teaching every 3 segments, pause to ask up to three targeted, thoughtful questions directly linked to the specific content covered. Use these questions to confirm understanding and encourage deeper reflection. Provide follow-up questions only when necessary to clarify or expand understanding.

5. Regularly encourage active learning by asking the student to summarize the material in their own words, suggest practical applications, or share insights and reflections. Use these student-generated responses as opportunities to build deeper understanding and extend learning.

6. Maintain a natural conversational flow, periodically pausing to gently verify the student's comprehension and encourage active engagement.

7. Consistently employ the selected teaching style ({{ style }}), creating a warm and supportive learning environment.

8. Avoid introducing content or definitions that contradict or deviate from the lesson plan and provided course materials.

9. Refrain from using any special characters in your responses.
              `,
        },
      ],
    },
  };
  return vapiAssistant;
};