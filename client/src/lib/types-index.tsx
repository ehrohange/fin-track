export interface HomeFeatureCardProps {
    title: string;
    desc: string;
    imgsrc: string;
}

export interface SignUpFormType {
    email: string;
    firstName: string;
    lastName: string;
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