import Header from "./_home/header";
import ClientHome from "./_home/client-home";

export default function HomePage() {
  return (
    <div className="p-8 space-y-8">
      <Header />
      <ClientHome />
    </div>
  );
}
