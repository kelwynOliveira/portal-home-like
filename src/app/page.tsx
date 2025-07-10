import Header from "./_home/header";
import { Metadata } from "next";
import ClientHome from "./_home/client-home";

export const metadata: Metadata = {
  title: "LiKe Home Server",
};

export default function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <Header />
      <ClientHome />
    </div>
  );
}
