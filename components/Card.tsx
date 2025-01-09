export interface Card {
    id: string;
    name: string;
    status: "to-do" | "on progress" | "done";
    description: string;
  }
