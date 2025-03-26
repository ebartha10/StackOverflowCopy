export interface Question {
    id: number;
    title: string;
    body: string;
    votes: number;
    answers: number;
    views: number;
    tags: string[];
    author: {
        id: number;
        username: string;
        reputation: number;
    };
    createdAt: Date;
    updatedAt: Date;
} 