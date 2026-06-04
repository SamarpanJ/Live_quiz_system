export interface AdminQuestion {
  id: string;
  quizId: string;
  order: number;
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
  durationSec: number;
  breakSec: number;
}

export interface AdminQuiz {
  id: string;
  title: string;
  description: string | null;
  joinCode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  participantCount: number;
  questions?: AdminQuestion[];
}
