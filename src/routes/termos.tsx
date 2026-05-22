import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/termos")({
  component: Termos,
  head: () => ({ meta: [{ title: "Termos de Uso — Meu Tom Perfeito" }] }),
});

function Termos() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-terracotta mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="font-serif text-3xl mb-2">Termos de Uso</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Atualizada em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl mb-3">1. Aceitação dos termos</h2>
          <p className="text-muted-foreground">
            Ao usar o Meu Tom Perfeito, você concorda com estes Termos de Uso. Se não concordar, por favor, não use o aplicativo.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">2. Sobre o serviço</h2>
          <p className="text-muted-foreground">
            O Meu Tom Perfeito oferece análise de cores de pele e sugestões de estilo baseadas em algoritmos. As sugestões são orientações gerais e não substituem consultoria profissional de imagem.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">3. Uso permitido</h2>
          <p className="mb-2">Você pode usar o app para:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Fazer análise de cores pessoal</li>
            <li>Criar e gerenciar seu closet virtual</li>
            <li>Receber sugestões de looks e estilo</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">4. Uso proibido</h2>
          <p className="mb-2">Você não pode:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Fazer engenharia reversa ou copiar o algoritmo</li>
            <li>Usar o app para fins comerciais sem autorização</li>
            <li>Enviar conteúdo ofensivo, ilegal ou inadequado</li>
            <li>Compartilhar sua conta com terceiros</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">5. Propriedade intelectual</h2>
          <p className="text-muted-foreground">
            O Meu Tom Perfeito, incluindo design, código, algoritmos e conteúdo, é propriedade exclusiva dos desenvolvedores. Você mantém propriedade das fotos que envia.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">6. Isenção de garantias</h2>
          <p className="text-muted-foreground">
            O app é fornecido "como está". Não garantimos que as sugestões de cores sejam 100% precisas ou que funcionem perfeitamente em todos os dispositivos.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">7. Limitação de responsabilidade</h2>
          <p className="text-muted-foreground">
            Não nos responsabilizamos por decisões de compra, escolhas de vestuário ou qualquer dano indireto decorrente do uso do app.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">8. Modificações no serviço</h2>
          <p className="text-muted-foreground">
            Podemos adicionar, modificar ou remover funcionalidades a qualquer momento. Tentaremos avisar com antecedência quando possível.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">9. Encerramento de conta</h2>
          <p className="text-muted-foreground">
            Você pode excluir sua conta a qualquer momento em Perfil → Configurações → Excluir conta. Reservamos o direito de suspender contas que violem estes termos.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">10. Lei aplicável</h2>
          <p className="text-muted-foreground">
            Estes termos são regidos pelas leis do Brasil. Disputas serão resolvidas nos tribunais brasileiros.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">11. Contato</h2>
          <p className="text-muted-foreground">
            Dúvidas sobre os termos? Entre em contato: [seu-email@dominio.com]
          </p>
        </section>
      </div>
    </div>
  );
}
