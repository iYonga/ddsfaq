import Button from "@/components/pickles/Button";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Title Section */}
      <Head>
        <title>Drug Demands | DDS2FAQ</title>
      </Head>
      <header
        style={{
          textAlign: "center",
          padding: "10px 0",
          background: "#222",
          color: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
          Drug Dealer Simulator 2 | Drug Demands
        </h1>
        <Button
          key={"back"}
          label={"Back"}
          trigger={() => {
            router.push("/");
          }}
        />
      </header>
      <h4
        style={{
          textAlign: "center",
        }}
      >
        These values are not equal to how much you have to give. This is only a
        comparison. Small Island's demands cannot be affected. They are fixed.
      </h4>
      <DrugDemandsTable />
    </div>
  );
}

import React from "react";

// All your row data here
const data = [
  {
    region: "Small Island",
    marijuana: 120,
    amphetamine: 90,
  },
  {
    region: "Archipelago",
    marijuana: 250,
    amphetamine: 150,
    methamphetamine: 100,
  },
  {
    region: "Callejon",
    marijuana: 250,
    amphetamine: 300,
    methamphetamine: 150,
    opium: 100,
  },
  {
    region: "Jungle",
    marijuana: 100,
    amphetamine: 150,
    methamphetamine: 300,
    opium: 100,
    cocaine: 50,
    shrooms: 80,
  },
  {
    region: "Paraíso Peninsular",
    marijuana: 200,
    amphetamine: 250,
    cocaine: 300,
    lsd: 150,
  },
  {
    region: "Slav's Bay",
    marijuana: 350,
    amphetamine: 300,
    methamphetamine: 550,
    opium: 200,
    cocaine: 50,
    shrooms: 100,
  },
  {
    region: "La Colina Sangrienta",
    marijuana: 150,
    amphetamine: 300,
    opium: 200,
    lsd: 150,
  },
  {
    region: "Volcano Island",
    marijuana: 50,
    methamphetamine: 200,
    opium: 100,
    cocaine: 50,
    shrooms: 100,
  },
  {
    region: "Dueño del Mar",
    marijuana: 150,
    amphetamine: 300,
    opium: 200,
    cocaine: 100,
    lsd: 100,
  },
  {
    region: "Bahía de Oro - Favela",
    marijuana: 200,
    amphetamine: 250,
    methamphetamine: 100,
    cocaine: 300,
  },
  {
    region: "Bahía de Oro - Downtown",
    marijuana: 200,
    amphetamine: 250,
    cocaine: 300,
    lsd: 100,
  },
];

// Function to decide cell styling: green if value, red if missing
const getCellStyle = value => ({
  backgroundColor: value ? "green" : "red",
  border: "1px solid ",
  textAlign: "center",
  padding: "0.5rem",
  fontWeight: "bold",
});

const DrugDemandsTable = () => {
  return (
    <div
      style={{
        backgroundColor: "",
        color: "#fff",
        padding: "1rem",
        fontFamily: "sans-serif",
        overflowX: "auto",
      }}
    >
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid ",
                padding: "0.5rem",
                backgroundColor: "",
                color: "#fff",
                textAlign: "center",
              }}
            >
              Drug Demands
            </th>
            <th style={headerCellStyle}>Marijuana</th>
            <th style={headerCellStyle}>Amphetamine</th>
            <th style={headerCellStyle}>Methamphetamine</th>
            <th style={headerCellStyle}>Opium</th>
            <th style={headerCellStyle}>Cocaine</th>
            <th style={headerCellStyle}>Shrooms</th>
            <th style={headerCellStyle}>LSD</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx}>
              {/* Region cell: keep it dark gray to stand out */}
              <td
                style={{
                  ...getCellStyle(true),
                  backgroundColor: "",
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                {row.region}
              </td>
              <td style={getCellStyle(row.marijuana)}>{row.marijuana ?? ""}</td>
              <td style={getCellStyle(row.amphetamine)}>
                {row.amphetamine ?? ""}
              </td>
              <td style={getCellStyle(row.methamphetamine)}>
                {row.methamphetamine ?? ""}
              </td>
              <td style={getCellStyle(row.opium)}>{row.opium ?? ""}</td>
              <td style={getCellStyle(row.cocaine)}>{row.cocaine ?? ""}</td>
              <td style={getCellStyle(row.shrooms)}>{row.shrooms ?? ""}</td>
              <td style={getCellStyle(row.lsd)}>{row.lsd ?? ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const headerCellStyle = {
  border: "1px solid ",
  padding: "0.5rem",
  backgroundColor: "",
  color: "#fff",
  textAlign: "center",
};
