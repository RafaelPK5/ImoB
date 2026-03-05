export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 px-6 py-16 text-white shadow-xl sm:px-10 sm:py-20">
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Encontre seu imóvel dos sonhos
        </h1>
        <p className="mt-4 text-lg text-primary-100 sm:text-xl">
          Apartamentos, casas, terrenos e chácaras nos melhores condomínios e regiões.
        </p>
      </div>
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
    </section>
  );
}
