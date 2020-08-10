export namespace Elm {
  namespace SignUp {
    function init(arg: { flags: {}; node: HTMLElement }): ElmApp;
  }
}

type ElmApp = {
  ports: {
    load: {
      subscribe: (
        arg: (arg: {
          imageInputElementId: string;
          imageUrl: string;
          nameElementId: string;
          name: string;
        }) => void
      ) => void;
    };
    imageInput: {
      send: (arg: string) => void;
    };
    sendConfirmEmail: {
      subscribe: (arg: (token: string) => void) => void;
    };
    sentConfirmEmail: {
      send: (args: null) => void;
    };
    alert: {
      subscribe: (arg: (token: string) => void) => void;
    };
  };
};
