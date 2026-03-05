export function PorQueEscolher() {
  return (
    <section id="quem-somos" className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
      <h2 className="text-center text-2xl font-bold text-slate-800 sm:text-3xl">
        Por que nos escolher
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
        Nossa missão é tornar seu sonho imobiliário realidade com transparência e excelência.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <span className="text-xl">✓</span>
          </div>
          <h3 className="mt-3 font-semibold text-slate-800">Transparência</h3>
          <p className="mt-1 text-sm text-slate-600">
            Processo claro do início ao fechamento, sem surpresas.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <span className="text-xl">★</span>
          </div>
          <h3 className="mt-3 font-semibold text-slate-800">Excelência</h3>
          <p className="mt-1 text-sm text-slate-600">
            Atendimento dedicado e imóveis selecionados com critério.
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-6 text-center sm:col-span-2 lg:col-span-1">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-600">
            <span className="text-xl">◉</span>
          </div>
          <h3 className="mt-3 font-semibold text-slate-800">Experiência</h3>
          <p className="mt-1 text-sm text-slate-600">
            Conhecimento do mercado e das melhores regiões.
          </p>
        </div>
      </div>
    </section>
  );
}
