import Header from "./_home/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "LiKe Home Server",
};

export default function Home() {
  return (
    <div className="p-8">
      <Header />
      <main className=""></main>
    </div>
  );
}
