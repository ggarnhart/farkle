import Head from "next/head";
import GameSpace from "../components/GameSpace.tsx";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GameSpace title="Farkle" />
    </div>
  );
}
