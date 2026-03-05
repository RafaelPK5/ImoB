import Link from 'next/link';

export function Footer() {
  return (
    <footer id="contato" className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Imobiliária</h3>
            <p className="mt-2 text-sm">
              Nossa missão é tornar seu sonho imobiliário realidade com transparência e excelência.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Contato
            </h3>
            <address className="mt-3 not-italic text-sm">
              <p>Av. Exemplo, 123</p>
              <p>Sua Cidade, SP 00000-000</p>
              <p className="mt-2">
                <a href="tel:+5511999999999" className="hover:text-primary-400">
                  +55 (11) 99999-9999
                </a>
              </p>
              <p>
                <a href="mailto:contato@imobiliaria.com" className="hover:text-primary-400">
                  contato@imobiliaria.com
                </a>
              </p>
              <p className="mt-2">
                <a
                  href="https://wa.me/5511999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-green-400 hover:text-green-300"
                >
                  WhatsApp
                </a>
              </p>
            </address>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-primary-400">
                  Imóveis
                </Link>
              </li>
              <li>
                <Link href="#cadastre" className="hover:text-primary-400">
                  Cadastre seu imóvel
                </Link>
              </li>
              <li>
                <Link href="#quem-somos" className="hover:text-primary-400">
                  Quem somos
                </Link>
              </li>
              <li>
                <Link href="#contato" className="hover:text-primary-400">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm text-slate-400">CRECI: 000.000-0</p>
          </div>
        </div>
        <div className="mt-10 border-t border-slate-700 pt-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} - Imobiliária. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
