import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Definição das 20 casas do tabuleiro com objetivos específicos
 */
export const HOUSES = [
  { id: 1, title: "Casa 1: Fundamentos do Algoritmo", objective: "Explique como o algoritmo do TikTok prioriza conteúdo nos primeiros 3 segundos" },
  { id: 2, title: "Casa 2: Hook Magnético", objective: "Crie um hook que gere curiosidade sem revelar a solução" },
  { id: 3, title: "Casa 3: Retenção Visual", objective: "Descreva 3 técnicas para manter o espectador até o final" },
  { id: 4, title: "Casa 4: Gatilhos Emocionais", objective: "Identifique os 4 gatilhos emocionais mais eficazes para viralização" },
  { id: 5, title: "Casa 5: Edição Estratégica", objective: "Explique a técnica de cortes rápidos e quando NÃO usá-la" },
  { id: 6, title: "Casa 6: Trending Sounds", objective: "Como escolher um som trending que se alinha com sua mensagem" },
  { id: 7, title: "Casa 7: CTA Invisível", objective: "Crie um call-to-action que não pareça vendedor" },
  { id: 8, title: "Casa 8: Storytelling em 15s", objective: "Estruture uma história completa em 15 segundos" },
  { id: 9, title: "Casa 9: Timing de Postagem", objective: "Explique por que timing importa menos do que consistência" },
  { id: 10, title: "Casa 10: Análise de Métricas", objective: "Quais 3 métricas realmente importam e por quê" },
  { id: 11, title: "Casa 11: Nicho vs. Amplitude", objective: "Quando estreitar e quando expandir seu conteúdo" },
  { id: 12, title: "Casa 12: Comentários Estratégicos", objective: "Como usar comentários para aumentar engajamento" },
  { id: 13, title: "Casa 13: Thumbnail Psychology", objective: "Elementos visuais que aumentam CTR em 40%" },
  { id: 14, title: "Casa 14: Batching de Conteúdo", objective: "Sistema para criar 30 vídeos em 4 horas" },
  { id: 15, title: "Casa 15: Monetização Inicial", objective: "3 formas de monetizar com menos de 10k seguidores" },
  { id: 16, title: "Casa 16: Colaborações Estratégicas", objective: "Como escolher parceiros que multiplicam seu alcance" },
  { id: 17, title: "Casa 17: Conteúdo Evergreen", objective: "Crie conteúdo que gera views por 6+ meses" },
  { id: 18, title: "Casa 18: Scaling Systems", objective: "Estrutura para crescer de 10k para 100k em 60 dias" },
  { id: 19, title: "Casa 19: Brand Building", objective: "Transforme audiência em comunidade leal" },
  { id: 20, title: "Casa 20: Monetização Avançada", objective: "Estratégias para gerar R$10k+/mês com TikTok" },
];

export interface ValidationResult {
  approved: boolean;
  feedback: string;
  xpGained?: number;
}

/**
 * Valida a resposta do aluno usando o Mentor Arthur (Gemini)
 */
export async function validateAnswer(
  houseId: number,
  userAnswer: string
): Promise<ValidationResult> {
  try {
    const house = HOUSES.find(h => h.id === houseId);
    if (!house) {
      return {
        approved: false,
        feedback: "Casa inválida. Tente novamente.",
      };
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Você é o Mentor Arthur, um estrategista de TikTok frio e calculista. 

CONTEXTO: O aluno está na ${house.title}. O objetivo dele é: "${house.objective}".

MÉTODO: Use o Método Socrático. Faça perguntas que levem o aluno a pensar mais profundamente. Critique a resposta dele de forma construtiva.

CRITÉRIOS DE APROVAÇÃO (2026):
- A resposta deve demonstrar compreensão técnica profunda
- Deve incluir exemplos práticos ou dados concretos
- Deve mostrar pensamento estratégico, não apenas conhecimento superficial
- Deve estar alinhada com as melhores práticas de 2026

FORMATO DE RESPOSTA:
Se a resposta for tecnicamente perfeita e demonstrar domínio completo, retorne APENAS um JSON válido:
{"approved": true, "feedback": "Sua análise crítica aqui", "xpGained": 10}

Se a resposta for insuficiente, retorne:
{"approved": false, "feedback": "Sua crítica construtiva e perguntas socráticas aqui"}

IMPORTANTE: Seja rigoroso. Apenas 20% das respostas devem ser aprovadas na primeira tentativa. O padrão é ALTO.`,
    });

    const result = await model.generateContent(userAnswer);
    const responseText = result.response.text();

    // Tentar extrair JSON da resposta
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        approved: parsed.approved || false,
        feedback: parsed.feedback || responseText,
        xpGained: parsed.xpGained || (parsed.approved ? 10 : 0),
      };
    }

    // Se não conseguir parsear JSON, considerar como não aprovado
    return {
      approved: false,
      feedback: responseText,
    };
  } catch (error) {
    console.error("[Gemini] Error validating answer:", error);
    return {
      approved: false,
      feedback: "Erro ao processar sua resposta. Tente novamente em alguns instantes.",
    };
  }
}

/**
 * Obtém uma dica do Mentor Arthur para uma casa específica
 */
export async function getHint(houseId: number): Promise<string> {
  try {
    const house = HOUSES.find(h => h.id === houseId);
    if (!house) {
      return "Casa inválida.";
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: `Você é o Mentor Arthur. Dê uma dica sutil (não a resposta completa) para ajudar o aluno a pensar na direção certa para: "${house.objective}". Use no máximo 2 frases.`,
    });

    const result = await model.generateContent(`Dê uma dica para: ${house.objective}`);
    return result.response.text();
  } catch (error) {
    console.error("[Gemini] Error getting hint:", error);
    return "Não foi possível obter uma dica no momento.";
  }
}
