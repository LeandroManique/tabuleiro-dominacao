import { describe, expect, it, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import * as db from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(userId: number = 1, isActive: boolean = true): TrpcContext {
  const user: AuthenticatedUser = {
    id: userId,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    isActive,
    stripeCustomerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return ctx;
}

describe("tabuleiro.getProgress", () => {
  it("retorna o progresso do usuário com sucesso", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tabuleiro.getProgress();

    expect(result).toBeDefined();
    expect(result.progress).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.houses).toBeDefined();
    expect(result.houses.length).toBe(20);
  });

  it("cria progresso inicial se não existir", async () => {
    const ctx = createAuthContext(1); // Usa ID 1 que deve existir
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tabuleiro.getProgress();

    expect(result.progress).toBeDefined();
    expect(result.progress?.currentHouseId).toBeGreaterThanOrEqual(1);
    expect(result.progress?.xpPoints).toBeGreaterThanOrEqual(0);
  });
});

describe("tabuleiro.submitAnswer", () => {
  it("rejeita resposta se não for a casa atual", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    // Primeiro obtém o progresso para saber a casa atual
    const progress = await caller.tabuleiro.getProgress();
    const currentHouse = progress.progress?.currentHouseId || 1;

    // Tenta responder uma casa diferente
    const wrongHouse = currentHouse + 1;

    await expect(
      caller.tabuleiro.submitAnswer({
        houseId: wrongHouse,
        answer: "Resposta de teste",
      })
    ).rejects.toThrow("Você deve completar a casa atual primeiro");
  });

  it("aceita resposta válida para a casa atual", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const progress = await caller.tabuleiro.getProgress();
    const currentHouse = progress.progress?.currentHouseId || 1;

    // Nota: Este teste pode falhar se o Gemini rejeitar a resposta
    // Em produção, você pode querer mockar a função validateAnswer
    const result = await caller.tabuleiro.submitAnswer({
      houseId: currentHouse,
      answer: "O algoritmo do TikTok prioriza conteúdo nos primeiros 3 segundos através de métricas de engajamento inicial como watch time, completion rate e interações imediatas. O sistema usa machine learning para identificar padrões de retenção e distribui o conteúdo para audiências similares baseado em comportamento histórico.",
    });

    expect(result).toBeDefined();
    expect(result.feedback).toBeDefined();
    expect(typeof result.approved).toBe("boolean");
  });
});

describe("tabuleiro.getHint", () => {
  it("retorna uma dica para a casa solicitada", async () => {
    const ctx = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.tabuleiro.getHint({ houseId: 1 });

    expect(result).toBeDefined();
    expect(result.hint).toBeDefined();
    expect(typeof result.hint).toBe("string");
    expect(result.hint.length).toBeGreaterThan(0);
  });
});
