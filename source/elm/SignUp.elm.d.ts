export namespace Elm {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace SignUp {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function init(arg: {
      flags: {
        sendEmailToken: string;
        name: string;
        imageId: string;
      };
      node: HTMLElement;
    }): ElmApp;
  }
}

type ElmApp = {
  ports: {
    load: {
      subscribe: (
        arg: (parameter: {
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
