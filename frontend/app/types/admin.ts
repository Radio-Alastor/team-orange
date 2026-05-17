export interface AdminMetricsDTO {
  totalUsers: number;
  totalComments: number;
  totalLikes: number;
}

export interface UserAdminDTO {
  id: string;
  username: string;
  dateCreated: string;
  totalEngagements: number;
  isStaff: boolean;
  isSuperuser: boolean;
}

export type ArticleStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'DELETED';

export interface AdminArticleDTO {
  id: number;
  title: string;
  authorName: string;
  dateCreated: string;
  status: ArticleStatus;
}

export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}
