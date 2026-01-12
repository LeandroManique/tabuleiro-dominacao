import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { validateAnswer, getHint, HOUSES } from "./gemini";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tabuleiro: router({
    // Obtém o progresso do usuário
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      let progress = await db.getUserProgress(ctx.user.id);
      
      // Se não existe, cria o progresso inicial
      if (!progress) {
        progress = await db.createUserProgress(ctx.user.id);
      }

      return {
        progress,
        user: ctx.user,
        houses: HOUSES,
      };
    }),

    // Valida a resposta do aluno e avança se aprovado
    submitAnswer: protectedProcedure
      .input(z.object({
        houseId: z.number().min(1).max(20),
        answer: z.string().min(10),
      }))
      .mutation(async ({ ctx, input }) => {
        const progress = await db.getUserProgress(ctx.user.id);
        if (!progress) {
          throw new Error("Progresso não encontrado");
        }

        // Verifica se o usuário está tentando responder a casa correta
        if (input.houseId !== progress.currentHouseId) {
          throw new Error("Você deve completar a casa atual primeiro");
        }

        // Valida a resposta com o Mentor Arthur
        const validation = await validateAnswer(input.houseId, input.answer);

        // Salva no histórico
        await db.saveChatMessage({
          userId: ctx.user.id,
          houseId: input.houseId,
          userMessage: input.answer,
          mentorResponse: validation.feedback,
          approved: validation.approved,
        });

        // Se aprovado, avança para próxima casa
        if (validation.approved) {
          const newHouseId = input.houseId + 1;
          const xpGained = validation.xpGained || 10;
          await db.updateUserProgress(ctx.user.id, newHouseId, xpGained);
        }

        return validation;
      }),

    // Obtém uma dica do Mentor Arthur
    getHint: protectedProcedure
      .input(z.object({
        houseId: z.number().min(1).max(20),
      }))
      .query(async ({ input }) => {
        const hint = await getHint(input.houseId);
        return { hint };
      }),

    // Obtém o histórico de chat de uma casa
    getChatHistory: protectedProcedure
      .input(z.object({
        houseId: z.number().min(1).max(20),
      }))
      .query(async ({ ctx, input }) => {
        const history = await db.getChatHistory(ctx.user.id, input.houseId);
        return { history };
      }),
  }),

  stripe: router({
    // Cria uma sessão de checkout
    createCheckout: publicProcedure
      .input(z.object({
        email: z.string().email().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { createCheckoutSession } = await import("./stripe");
        
        const url = await createCheckoutSession({
          email: input.email || ctx.user?.email || undefined,
          userId: ctx.user?.id,
        });

        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
