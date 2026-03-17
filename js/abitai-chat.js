(function () {
  const CHAT_SELECTOR = "#abitai-chat";
  const MESSAGES_SELECTOR = "#chat-messages";
  const TYPING_ID = "typing";

  const conversations = [
    [
      { text: "Oi! Quero comprar meu primeiro apê novo, nunca habitado. Orçamento de R$ 350 mil.", user: true, delay: 1000 },
      { text: "Ótimo! Apartamento na planta ou pronto pra morar?", user: false, delay: 3000 },
      { text: "Pronto! Não quero esperar obra.", user: true, delay: 5000 },
      { text: "Perfeito! Qual região você prefere? Tenho lançamentos recém-entregues!", user: false, delay: 7000 }
    ],
    [
      { text: "Procuro apê novo com 3 quartos. Família com 2 filhos.", user: true, delay: 1000 },
      { text: "Entendi! Condomínio com área kids é importante?", user: false, delay: 3000 },
      { text: "Sim! Playground e piscina seriam perfeitos.", user: true, delay: 5000 },
      { text: "Tenho 5 lançamentos com lazer completo! Qual seu orçamento máximo?", user: false, delay: 7000 }
    ],
    [
      { text: "Quero investir em um studio novo para alugar. Primeira locação valoriza mais.", user: true, delay: 1000 },
      { text: "Ótima estratégia! Prefere na planta ou recém-entregue?", user: false, delay: 3000 },
      { text: "Na planta. Quero aproveitar o preço de lançamento.", user: true, delay: 5000 },
      { text: "Perfeito! Qual região tem mais a ver com seu perfil de inquilino?", user: false, delay: 7000 }
    ],
    [
      { text: "Quero sair do aluguel e comprar um apê novo. Tenho R$ 100 mil de entrada.", user: true, delay: 1000 },
      { text: "Ótimo! Qual sua renda mensal? Ajuda no financiamento.", user: false, delay: 3000 },
      { text: "R$ 10 mil. Quero parcela leve.", user: true, delay: 5000 },
      { text: "Com esse perfil, você alcança até R$ 500k! Prefere 2 ou 3 quartos?", user: false, delay: 7000 }
    ],
    [
      { text: "Vou me aposentar. Quero um apê novo, térreo, sem uso anterior.", user: true, delay: 1000 },
      { text: "Faz sentido! Acessibilidade é prioridade?", user: false, delay: 3000 },
      { text: "Sim! Sem escadas e perto de hospitais.", user: true, delay: 5000 },
      { text: "Tenho lançamentos com unidades térreas adaptadas! Qual região você prefere?", user: false, delay: 7000 }
    ],
    [
      { text: "Tenho medo de comprar imóvel com problema escondido.", user: true, delay: 1000 },
      { text: "Posso analisar documentação e histórico do prédio antes de qualquer decisão.", user: false, delay: 3000 },
      { text: "Isso me dá mais segurança.", user: true, delay: 5000 },
      { text: "Só priorizo imóveis com documentação validada e boa reputação construtiva.", user: false, delay: 7000 }
    ],
    [
      { text: "Estou comparando dois apartamentos parecidos.", user: true, delay: 1000 },
      { text: "Quer que eu simule valorização e liquidez futura de cada um?", user: false, delay: 3000 },
      { text: "Sim, quero escolher o mais inteligente.", user: true, delay: 5000 },
      { text: "Vou cruzar preço por m², histórico da região e potencial de revenda.", user: false, delay: 7000 }
    ],
    [
      { text: "Quero investir para gerar renda mensal consistente.", user: true, delay: 1000 },
      { text: "Prefere studio compacto perto de metrô e universidades?", user: false, delay: 3000 },
      { text: "Exatamente. Alta ocupação é prioridade.", user: true, delay: 5000 },
      { text: "Essas regiões têm maior liquidez e menor vacância.", user: false, delay: 7000 }
    ],
    [
      { text: "Já tive experiência ruim com corretor pressionando compra.", user: true, delay: 1000 },
      { text: "Aqui você decide no seu tempo. Eu apenas trago dados claros e comparativos.", user: false, delay: 3000 },
      { text: "Prefiro decidir com números.", user: true, delay: 5000 },
      { text: "Vou apresentar análise transparente para você comparar com segurança.", user: false, delay: 7000 }
    ],
    [
      { text: "Quero um imóvel novo, mas pagando preço justo.", user: true, delay: 1000 },
      { text: "Posso comparar valor com histórico real de vendas da região.", user: false, delay: 3000 },
      { text: "Não quero pagar sobrepreço de lançamento.", user: true, delay: 5000 },
      { text: "Vou priorizar unidades com maior potencial de valorização real.", user: false, delay: 7000 }
    ]
  ];

  function getViewportScale(win) {
    if (win.visualViewport && typeof win.visualViewport.scale === "number" && win.visualViewport.scale > 0) {
      return win.visualViewport.scale;
    }

    return 1;
  }

  function clamp(min, value, max) {
    return Math.min(max, Math.max(min, value));
  }

  function computeChatScale(options) {
    const viewportScale = options.viewportScale ?? 1;
    const innerWidth = options.innerWidth ?? 0;

    if (innerWidth < 768 || viewportScale <= 1.05) {
      return 1;
    }

    const dampenedScale = 1 / (1 + ((viewportScale - 1) * 0.35));
    return clamp(0.82, dampenedScale, 1);
  }

  function applyChatScale(chatElement, win) {
    if (!chatElement) {
      return 1;
    }

    const scale = computeChatScale({
      viewportScale: getViewportScale(win),
      innerWidth: win.innerWidth
    });

    chatElement.style.transform = scale === 1 ? "" : `scale(${scale})`;
    chatElement.style.width = scale === 1 ? "" : `${100 / scale}%`;
    return scale;
  }

  function getConversationDuration(conversation) {
    if (!conversation.length) {
      return 0;
    }

    return conversation[conversation.length - 1].delay + 4000;
  }

  function createTypingIndicator(doc) {
    const typing = doc.createElement("div");
    typing.className = "typing";
    typing.id = TYPING_ID;

    for (let index = 0; index < 3; index += 1) {
      const dot = doc.createElement("div");
      dot.className = "typing-dot";
      dot.style.animationDelay = `${index * 0.2}s`;
      typing.appendChild(dot);
    }

    return typing;
  }

  function createChatController(win, doc) {
    const messageContainer = doc.querySelector(MESSAGES_SELECTOR);
    let currentConversationIndex = 0;
    let scheduledTimers = [];

    function clearScheduledTimers() {
      scheduledTimers.forEach((timerId) => win.clearTimeout(timerId));
      scheduledTimers = [];
    }

    function scrollToLatest() {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }

    function addMessage(text, isUser) {
      const bubble = doc.createElement("div");
      bubble.className = `chat-bubble ${isUser ? "user" : "bot"}`;
      bubble.innerText = text;
      messageContainer.appendChild(bubble);

      scheduledTimers.push(win.setTimeout(() => {
        bubble.style.opacity = "1";
      }, 50));

      scrollToLatest();
    }

    function removeTyping() {
      const typing = doc.getElementById(TYPING_ID);
      if (typing) {
        typing.remove();
      }
    }

    function showTyping() {
      removeTyping();
      messageContainer.appendChild(createTypingIndicator(doc));
      scrollToLatest();
    }

    function queueConversation(conversation) {
      messageContainer.innerHTML = "";

      conversation.forEach((message) => {
        scheduledTimers.push(win.setTimeout(() => {
          if (!message.user) {
            showTyping();
            scheduledTimers.push(win.setTimeout(() => {
              removeTyping();
              addMessage(message.text, message.user);
            }, 1000));
            return;
          }

          addMessage(message.text, message.user);
        }, message.delay));
      });
    }

    function startConversationLoop() {
      clearScheduledTimers();
      const conversation = conversations[currentConversationIndex];
      queueConversation(conversation);

      scheduledTimers.push(win.setTimeout(() => {
        currentConversationIndex = (currentConversationIndex + 1) % conversations.length;
        startConversationLoop();
      }, getConversationDuration(conversation)));
    }

    function destroy() {
      clearScheduledTimers();
    }

    return {
      startConversationLoop,
      destroy
    };
  }

  function initializeChat() {
    const doc = window.document;
    const chatElement = doc.querySelector(CHAT_SELECTOR);
    const messageContainer = doc.querySelector(MESSAGES_SELECTOR);

    if (!chatElement || !messageContainer) {
      return;
    }

    const updateScale = () => applyChatScale(chatElement, window);
    const controller = createChatController(window, doc);

    updateScale();
    controller.startConversationLoop();

    window.addEventListener("resize", updateScale, { passive: true });
    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateScale, { passive: true });
    }
  }

  if (typeof window !== "undefined" && typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initializeChat);
  }

  if (typeof module !== "undefined" && module.exports) {
    module.exports = {
      applyChatScale,
      computeChatScale,
      conversations,
      getConversationDuration,
      getViewportScale
    };
  }
})();
