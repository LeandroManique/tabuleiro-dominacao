import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, Target, TrendingUp, DollarSign } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user } = useAuth();
  const createCheckout = trpc.stripe.createCheckout.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: () => {
      toast.error("Erro ao criar sessão de pagamento");
    },
  });

  const handleCTA = () => {
    if (user?.isActive) {
      window.location.href = "/tabuleiro";
    } else {
      createCheckout.mutate({});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Grid animado de fundo */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px] animate-pulse" />
        
        {/* Gradiente radial */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15),transparent_70%)]" />

        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-5xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-8"
            >
              <Zap className="w-4 h-4 text-yellow-500" />
              <span className="text-purple-200 text-sm font-semibold">Sistema Validado por IA</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              O Algoritmo não é{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                sorte
              </span>
              .
            </h1>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
              É <span className="text-yellow-500">engenharia</span>.
            </h2>

            {/* Subhead */}
            <p className="text-xl md:text-2xl text-purple-200 mb-12 max-w-3xl mx-auto leading-relaxed">
              Dinheiro na conta em menos de <span className="font-bold text-white">20 dias</span>.
              <br />
              Jogue o tabuleiro.
            </p>

            {/* CTA Principal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={handleCTA}
                disabled={createCheckout.isPending}
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xl px-12 py-8 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
              >
                {user?.isActive ? "Acessar Tabuleiro" : "Começar Agora"}
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </Button>
              <p className="text-purple-300 text-sm mt-4">
                Pagamento único • Acesso vitalício • Garantia de 7 dias
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1 h-2 bg-purple-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Como Funciona */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Como Funciona
            </h2>
            <p className="text-purple-300 text-lg">
              Um tabuleiro. 20 casas. Um mentor implacável.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Target,
                title: "20 Desafios Estratégicos",
                description: "Cada casa ensina uma técnica específica de dominação do algoritmo. Sem enrolação.",
              },
              {
                icon: Zap,
                title: "Validação por IA",
                description: "O Mentor Arthur (Gemini AI) valida suas respostas. Só avança quem demonstra domínio real.",
              },
              {
                icon: TrendingUp,
                title: "Progressão Gamificada",
                description: "Ganhe XP, desbloqueie casas, construa seu império no TikTok passo a passo.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="bg-slate-800/50 border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 h-full">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <item.icon className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-purple-300">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-20 bg-black/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              O Que Você Vai Dominar
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Algoritmo do TikTok (como ele REALMENTE funciona em 2026)",
              "Hooks magnéticos que prendem nos primeiros 3 segundos",
              "Técnicas de retenção visual e storytelling em 15s",
              "Gatilhos emocionais para viralização orgânica",
              "Edição estratégica e timing de postagem",
              "Monetização desde os primeiros 1000 seguidores",
              "Sistemas de scaling para crescer de 10k para 100k",
              "Brand building e comunidade leal",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 bg-slate-800/30 p-4 rounded-lg border border-purple-500/20"
              >
                <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                <span className="text-purple-100">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <DollarSign className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Pronto para jogar?
            </h2>
            <p className="text-xl text-purple-200 mb-12">
              O tabuleiro está esperando. Sua jornada começa agora.
            </p>
            <Button
              onClick={handleCTA}
              disabled={createCheckout.isPending}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-2xl px-16 py-10 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 group"
            >
              {user?.isActive ? "Acessar Tabuleiro" : "Começar Agora - R$ 197"}
              <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-2 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/50 border-t border-purple-500/30 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-purple-300 text-sm">
            © 2026 O Tabuleiro da Dominação. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
