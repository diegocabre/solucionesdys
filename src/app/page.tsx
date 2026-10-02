import HomeContent from "./HomeContent";
import UltimosArticulos from "@/components/UltimosArticulos";
import ZonaAtencion from "@/components/ZonaAtencion";

export default function Home() {
  return (
    <HomeContent
      serverSections={
        <>
          <UltimosArticulos />
          <ZonaAtencion />
        </>
      }
    />
  );
}
