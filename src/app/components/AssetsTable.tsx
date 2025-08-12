import Image from 'next/image';

export default function AssetsTable() {
  return (
    <div className="bg-white rounded-2xl border-[1.5px] border-gray-200 px-6 py-4">
      <div className="grid grid-cols-4 gap-8 pb-4 border-b border-gray-200 -mx-6 px-6 text-sm font-medium text-gray-700">
        <div>Name</div>
        <div>Price (24 hr)</div>
        <div>Portfolio %</div>
        <div>Value</div>
      </div>

      <div className="space-y-3 mt-2">
        {[
          {
            name: "Zodiac",
            ticker: "ZDC",
            price: "$1234.56",
            change: "+5.96%",
            changeClass: "text-green-600",
            pct: 53,
            value: "$1725.73",
            sub: "1.398 ZDC",
            image: "/zodiac.png",
          },
          {
            name: "Bitcoin",
            ticker: "BTC",
            price: "$113,654.28",
            change: "-0.92%",
            changeClass: "text-red-600",
            pct: 23,
            value: "$748.90",
            sub: "0.007 BTC",
            image: "/bitcoin.png",
          },
          {
            name: "Ethereum",
            ticker: "ETH",
            price: "$3571.28",
            change: "-2.96%",
            changeClass: "text-red-600",
            pct: 20,
            value: "$651.22",
            sub: "0.182 ETH",
            image: "/ethereum.png",
          },
          {
            name: "Solana",
            ticker: "SOL",
            price: "$168.14",
            change: "+3.57%",
            changeClass: "text-green-600",
            pct: 4,
            value: "$130.24",
            sub: "0.775 SOL",
            image: "/solana.png",
          },
        ].map((row) => (
          <div
            key={row.name}
            className="grid grid-cols-4 gap-8 items-center py-2 hover:bg-gray-100 rounded-xl px-3 -mx-3 cursor-pointer transition-colors duration-150"
            style={{ transitionTimingFunction: 'ease' }}
          >
            {/* Name and ticker */}
            <div className="flex items-center gap-2 min-w-0">
              <Image
                src={row.image}
                alt={row.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
                priority={false}
              />

              <div className="flex items-baseline gap-2 whitespace-nowrap min-w-0">
                <span className="font-medium text-sm text-gray-900 truncate max-w-[180px]">{row.name}</span>
                <span className="font-medium text-sm text-gray-500">{row.ticker}</span>
              </div>
            </div>

            {/* Price and change */}
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-medium text-sm text-gray-900">{row.price}</span>
              <span className={`font-medium text-sm ${row.changeClass}`}>{row.change}</span>
            </div>

            {/* Portfolio % */}
            <div className="flex items-center whitespace-nowrap">
              <span className="w-12 tabular-nums font-medium text-sm text-gray-900">{row.pct}%</span>
              <span className="relative w-28 h-2 -ml-2 bg-gray-200 rounded-full overflow-hidden">
                <span className="absolute left-0 top-0 h-full bg-blue-600" style={{ width: `${row.pct}%` }} />
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2 whitespace-nowrap">
              <span className="font-medium text-sm text-gray-900">{row.value}</span>
              <span className="font-medium text-sm text-gray-500">{row.sub}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


