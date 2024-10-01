export interface Chat {
   id: string;
   username: string;
   message: string;
   upvotes: number;
   isDismissed?: boolean;
}

export class User {
   id!: string;
   name!: string;
   roomId!: string;
   isAdmin?: boolean;

   constructor() {
      this.id = '';
      this.name = '';
      this.roomId = '';
   }
}