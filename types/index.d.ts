import type { Models } from "appwrite";

type Companion = Models.DocumentList<Models.Document> & {
  $id: string;
  name: string;
  subject: Subject;
  topic: string;
  duration: number;
  bookmarked: boolean;
};

interface CreateCompanion {
  name: string;
  subject: Subject;
  topic: string;
  voice: string;
  style: string;
  duration: number;
  lessonPlanFile?: FileList;
  instructions?: string; 
}

interface GetAllCompanions {
  limit?: number;
  page?: number;
  subject?: Subject | Subject[];
  topic?: string | string[];
}

interface BuildClient {
  key?: string;
  sessionToken?: string;
}

interface CreateUser {
  email: string;
  name: string;
  image?: string;
  accountId: string;
}

interface SearchParams {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface Avatar {
  userName: string;
  width: number;
  height: number;
  className?: string;
}


interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

interface CompanionComponentProps {
  companionId: string;
  subject: Subject;
  topic: string;
  name: string;
  userName: string;
  userImage: string;
  voice: string;
  style: string;
  instructions?: string;
  resumeMessages?: SavedMessage[];
}