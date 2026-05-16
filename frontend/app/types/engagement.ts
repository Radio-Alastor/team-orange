export interface LikeStatusDTO {
    totalLikes: number;
    hasLiked: boolean;
}

export interface CommentDTO {
    id: string;
    text: string;
    authorName: string;
    authorId: string;
    createdAt: string;
}

export interface CommentRequestDTO {
    text: string;
}
