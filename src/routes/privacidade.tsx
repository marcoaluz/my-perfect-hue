import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  component: Privacidade,
  head: () => ({ meta: [{ title: "Política de Privacidade — Meu Tom Perfeito" }] }),
});

function Privacidade() {
  return (
    <div className="mx-auto w-full max-w-2xl px-6 py-10">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-terracotta mb-6">
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <h1 className="font-serif text-3xl mb-2">Política de Privacidade</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Atualizada em {new Date().toLocaleDateString("pt-BR")}
      </p>

      <div className="space-y-8 text-sm leading-relaxed">
        <section>
          <h2 className="font-serif text-xl mb-3">1. Informações que coletamos</h2>
          <p className="mb-2">Coletamos as seguintes informações quando você usa o Meu Tom Perfeito:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Nome e e-mail (fornecidos no cadastro)</li>
            <li>Fotos que você envia para análise de cores</li>
            <li>Preferências de formato de rosto e tipo de cabelo</li>
            <li>Peças adicionadas ao seu closet virtual</li>
            <li>Consultas de estilo salvas</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">2. Como usamos suas informações</h2>
          <p className="mb-2">Usamos suas informações exclusivamente para:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Realizar a análise de cores personalizada</li>
            <li>Sugerir looks, maquiagem, penteados e joias compatíveis com seu subtom</li>
            <li>Salvar suas preferências e histórico no app</li>
            <li>Melhorar nossos algoritmos e experiência do usuário</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Nunca vendemos, compartilhamos ou distribuímos suas informações pessoais para terceiros.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">3. Armazenamento e segurança</h2>
          <p className="text-muted-foreground">
            Seus dados são armazenados de forma segura em servidores criptografados. Suas fotos ficam em storage privado acessível apenas por você.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">4. Seus direitos (LGPD)</h2>
          <p className="mb-2">De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li>Acessar seus dados pessoais a qualquer momento</li>
            <li>Corrigir dados incompletos ou incorretos</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimento para uso de dados</li>
          </ul>
          <p className="mt-3 text-muted-foreground">
            Para exercer esses direitos, vá em Perfil → Configurações → Excluir conta, ou entre em contato conosco.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">5. Cookies e rastreamento</h2>
          <p className="text-muted-foreground">
            Usamos cookies apenas para manter você logada no app. Não fazemos rastreamento de terceiros ou publicidade direcionada.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">6. Alterações nesta política</h2>
          <p className="text-muted-foreground">
            Podemos atualizar esta política ocasionalmente. A data de atualização estará sempre visível no topo desta página.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-xl mb-3">7. Contato</h2>
          <p className="text-muted-foreground">
            Dúvidas sobre privacidade? Entre em contato: meutomperfeito@gmail.com
          </p>
        </section>
      </div>
    </div>
  );
}
