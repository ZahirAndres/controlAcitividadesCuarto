declare module 'botui' {
    export default class BotUI {
      constructor(id: string);
      message: {
        add: (message: { content: string; delay?: number }) => Promise<void>;
      };
      action: {
        user: (action: { message: string }) => Promise<void>;
      };
    }
  }
declare var BotUI: any;

  