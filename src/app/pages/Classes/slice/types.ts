/* --- STATE --- */
export interface ClassesState {
  classes: Class[];
}

export interface Class {
  id: string;
  code: string;
  name: string;
  ownerId: string;
  shortDescription: string;
  usersList: string[];
  inviteCode: string;
  color: string;
  createdAt: string;
  updatedAt: string;
}
