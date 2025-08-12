import Sidebar from "./components/Sidebar";
import BalanceHeader from "./components/BalanceHeader";
import BalanceChart from "./components/BalanceChart";
import AssetsTable from "./components/AssetsTable";
import AssetsHeader from "./components/AssetsHeader";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-12 -ml-56">
      <div className="max-w-6xl mx-auto flex gap-16">
        <Sidebar />

        <main className="flex-1">
          <BalanceHeader/>
          <BalanceChart />
          <AssetsHeader />
          <AssetsTable />
        </main>
      </div>
    </div>
  );
}
