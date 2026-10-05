export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 font-sans dark:bg-black">
      <main className="w-full max-w-xl rounded-2xl bg-white px-8 py-16 text-center dark:bg-zinc-950">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          front-test
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
          Esta es una página de prueba
        </h1>
        <p className="mt-4 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          El frontend ya no muestra la plantilla de Next.js. Este texto es solo
          para confirmar que la página principal cambió.
        </p>
      </main>
    </div>
  );
}
