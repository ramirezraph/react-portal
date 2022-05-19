/* --- STATE --- */
export interface UserState {
  currentUser: Auth0User | null;
}

export interface Auth0User {
  name?: string;
  given_name?: string;
  family_name?: string;
  middle_name?: string;
  nickname?: string;
  preferred_username?: string;
  profile?: string;
  picture?: string;
  website?: string;
  email?: string;
  email_verified?: boolean;
  gender?: string;
  birthdate?: string;
  zoneinfo?: string;
  locale?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: string;
  updated_at?: string;
  sub?: string;
  [key: string]: any;
}

export enum NotificationType {
  ClassInvite = 'ClassInvite',
  ClassInviteResult = 'ClassInviteResult',
  Assignment = 'Assignment',
  Regular = 'Regular',
  Post = 'Post',
  Comment = 'Comment',
}

export enum ClassInviteResult {
  Accepted = 'Accepted',
  Rejected = 'Rejected',
}

export interface AppNotification {
  createdAt: string;
  fromUserId: string;
  read: boolean;
  type: NotificationType;

  // class invite
  classId?: string;

  // class invite result
  result?: ClassInviteResult;

  // post
  postId?: string;

  // assignment
  classworkId?: string;
}
