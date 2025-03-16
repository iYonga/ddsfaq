import dynamic from "next/dynamic";

const GameMap = dynamic(() => import("@/components/GameMap"), { ssr: false });

export default function Home() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Title Section */}
      <header
        style={{
          textAlign: "center",
          padding: "10px 0",
          background: "#222",
          color: "#fff",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          Drug Dealer Simulator 2 | Interactive Map
        </h1>
      </header>

      {/* Game Map Wrapper */}
      <div style={{ flex: 1, width: "100vw", overflow: "hidden" }}>
        <GameMap />
      </div>
    </div>
  );
}
