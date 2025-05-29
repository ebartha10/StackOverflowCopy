export interface Question {
    id: string;
    authorId: string;
    title: string;
    body: string;
    createdAt: Date;
    tags: string[];
    voteCount: number;
    likedById: Set<string>;
    dislikedById: Set<string>;
    answers: number;
    views: number;
    author: {
        id: string;
        name: string;
        score: number;
    };
    updatedAt: Date;
} 