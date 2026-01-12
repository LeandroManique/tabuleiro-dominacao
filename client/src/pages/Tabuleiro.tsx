import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Lightbulb, Trophy, Target } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import TabuleiroMap from "@/components/TabuleiroMap";
import { motion } from "framer-motion";

export default function Tabuleiro() {
  const { user, loading: authLoading } = useAuth();
  const [selectedHouse, setSelectedHouse] = useState<number | null>(null);
  const [answer, setAnswer] = useState("");

  const { data, isLoading, refetch } = trpc.tabuleiro.getProgress.useQuery(undefined, {
    enabled: !!user,
  });

  const submitAnswer = trpc.tabuleiro.submitAnswer.useMutation({
    onSuccess: (result) => {
      if (result.approved) {
        toast.success("🎉 Resposta aprovada!", {
          description: result.feedback,
        });
        setAnswer("");
        setSelectedHouse(null);
        refetch();
      } else {
        toast.error("Resposta não aprovada", {
          description: result.feedback,
        });
      }
    },
    onError: (error) => {
      toast.error("Erro ao enviar resposta", {
        description: error.message,
      });
    },
  });

  const { data: hintData, refetch: refetchHint } = trpc.tabuleiro.getHint.useQuery(
    { houseId: selectedHouse || 1 },
    { enabled: false }
  );

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Acesso Restrito</CardTitle>
            <CardDescription>Você precisa estar logado para acessar o tabuleiro.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (!user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>🔒 Acesso Bloqueado</CardTitle>
            <CardDescription>
              Você precisa completar o pagamento para acessar o tabuleiro.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              Voltar para a Landing Page
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = data?.progress;
  const houses = data?.houses || [];
  const currentHouse = houses.find(h => h.id === progress?.currentHouseId);

  const handleHouseClick = (houseId: number) => {
    setSelectedHouse(houseId);
  };

  const handleSubmit = () => {
    if (!selectedHouse || !answer.trim()) {
      toast.error("Por favor, escreva sua resposta");
      return;
    }

    submitAnswer.mutate({
      houseId: selectedHouse,
      answer: answer.trim(),
    });
  };

  const handleGetHint = () => {
    if (selectedHouse) {
      refetchHint();
      toast.info("💡 Dica do Mentor Arthur", {
        description: hintData?.hint || "Carregando dica...",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-black/50 backdrop-blur-sm border-b border-purple-500/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">Olá, {user.name || "Aluno"}</h2>
            <p className="text-purple-300 text-sm">Casa atual: {progress?.currentHouseId || 1} de 20</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-purple-500/20 px-4 py-2 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-white font-bold">{progress?.xpPoints || 0} XP</span>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/"}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Mapa do Tabuleiro */}
      <TabuleiroMap
        houses={houses}
        currentHouseId={progress?.currentHouseId || 1}
        onHouseClick={handleHouseClick}
      />

      {/* Painel de Desafio */}
      {selectedHouse && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-purple-500/30 p-6 z-40"
        >
          <div className="container mx-auto max-w-4xl">
            <Card className="bg-slate-800/50 border-purple-500/30">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl text-white flex items-center gap-2">
                      <Target className="w-6 h-6 text-purple-500" />
                      {currentHouse?.title}
                    </CardTitle>
                    <CardDescription className="text-purple-300 mt-2">
                      {currentHouse?.objective}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGetHint}
                    className="ml-4"
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Dica
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Digite sua resposta aqui... O Mentor Arthur está esperando."
                  className="min-h-[120px] bg-slate-900/50 border-purple-500/30 text-white"
                  disabled={submitAnswer.isPending}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-purple-300">
                    Seja específico e demonstre seu conhecimento técnico.
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitAnswer.isPending || !answer.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {submitAnswer.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Validando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar Resposta
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
}
