export type IUser = {
  id: number;
  name: string;
  role: "USER" | "ADMIN";
};

export type CreateUser = {
  name: string;
  uniqueCode: string;
};
