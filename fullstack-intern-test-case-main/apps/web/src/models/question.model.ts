export interface Choice 
{
    _id: string; 
    text: string;
    isCorrect: boolean;
};

export interface Question {
    _id: string;
    title: string;
    choices: Choice[];
    course?: string;
    createdAt?: string;
    updatedAt?: string;
};