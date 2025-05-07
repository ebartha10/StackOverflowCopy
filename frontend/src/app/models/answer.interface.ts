export interface Answer {
    id: string;
    questionId: string;
    questionTitle: string;
    content: string;
    body: string;
    votes: number;
    createdAt: Date;
    authorId: string;
    authorUsername: string;
    author: {
        id: string;
        username: string;
        reputation: number;
    };
} 