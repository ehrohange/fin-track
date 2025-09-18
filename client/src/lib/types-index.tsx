export interface HomeFeatureCardProps {
  title: string;
  desc: string;
  imgsrc: string;
}

export interface SignUpFormType {
  email: string;
  fullName: string;
  password: string;
}

export interface LoginFormType {
  email: string;
  password: string;
}

export interface ToastContentType {
  icon: "success" | "warning" | "error" | "informative";
  message: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  profilePicture?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  iat?: number;
  exp?: number;
}

export interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
}

export interface Transaction {
  _id: string;
  userId: string;
  categoryId: {
    type: string;
    name: string;
  };
  amount: number;
  date: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export interface TransactionDateState {
  currentSelectedDate: string | null;
  loading: boolean;
  error: string | null;
}

export interface Goal {
  _id: string;
  userId: string;
  categoryId: {
    _id?: string;
    color: string;
    type: string;
    name: string;
  };
  amount: number;
  goalName: number;
  goalAmount: number;
  goalStartDate: string;
  goalDeadline: string;
  active: boolean;
}

export interface GoalRes {
  data: {
    message?: string;
    goals: Goal[];
  };
}

export interface GoalSubmission {
  goalName: string;
  goalAmount: number | null;
  goalDeadline: string;
}
