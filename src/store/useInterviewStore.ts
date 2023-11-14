import { TExperienceLevelKeys, TInterviewRoleKeys, TQuestionEntity } from "@/shared";
import { create } from "zustand";

type Questions = Array<TQuestionEntity>;

type AnweredQuestion = {
  questionId: string;
  answer: string;
  timeTaken: number;
};

type Config = {
  role: Nullable<TInterviewRoleKeys>;
  experienceLevel: Nullable<TExperienceLevelKeys>;
  questionsNum: Nullable<number>;
  timeLimitPerQuestion: Nullable<number>;
  sendResultsToEmail: boolean;
  shuffle: boolean;
};

type User = {
  email: Nullable<string>;
};

type Error = {
  message: string;
  type: string;
};

export type TStore = {
  errors: Error[];
  user: User;
  questions: Questions;
  answered: AnweredQuestion[];
  config: Config;
};

export type TStoreActions = {
  setErrors: (errors: Error[]) => void;
  setQuestions: (questions: Questions) => void;
  setAnswer: (questionId: string, answer: string, timeTaken: number) => void;
  setConfig: (config: Partial<Config>) => void;
  setUser: (user: User) => void;
  getFirstUnansweredQuestion: () => Nullable<TQuestionEntity>;
  reset: () => void;
};

const initialStoreState = {
  user: {
    email: null,
  },
  errors: [],
  questions: [],
  answered: [],
  config: {
    role: null,
    experienceLevel: null,
    questionsNum: null,
    timeLimitPerQuestion: null,
    sendResultsToEmail: false,
    shuffle: true,
  },
};

const useInterviewStore = create<TStore & TStoreActions>((set, get) => ({
  ...initialStoreState,
  setQuestions: (questions: Questions) => set({ questions }),
  setErrors: (errors: Error[]) => {
    set({ errors });
    setTimeout(() => {
      set((state: TStore) => {
        const filteredErrors = state.errors.filter(
          (error) => !errors.includes(error)
        );
        return { errors: filteredErrors };
      });
    }, 10000);
  },
  setAnswer: (questionId: string, answer: string, timeTaken: number) =>
    set((state: TStore) => {
      const answeredQuestion = { questionId, answer, timeTaken };
      const answered = [...state.answered, answeredQuestion];
      return { answered };
    }),
  setConfig: (config: Partial<Config>) =>
    set((state: TStore) => ({ config: { ...state.config, ...config } })),
  setUser: (user: User) => set({ ...user, user }),
  getFirstUnansweredQuestion: () => {
    const { questions, answered } = get();

    const answeredQuestionIds = new Set(answered.map((aq) => aq.questionId));

    const unansweredQuestions = questions.filter(
      (question) => !answeredQuestionIds.has(question.id)
    );

    return unansweredQuestions.length > 0 ? unansweredQuestions[0] : null;
  },
  reset: () => {
    set(initialStoreState);
  },
}));

export default useInterviewStore;
