export interface App {
  id: string;
  name: string;
  description: string;
  url: string;
  icon: string;
  category: string;
  color: string;
}

export type AppWithStatus = App & {
  status: "online" | "offline";
};
