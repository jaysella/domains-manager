import AllDomains from "./_blocks/all-domains";

export default function Home() {
  return (
    <div className="font-[family-name:var(--font-geist-sans)] p-4">
      <main className="flex flex-col gap-8">
        <AllDomains />
      </main>
    </div>
  );
}
