export namespace Elm {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  namespace Main {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function init(args: {
      readonly flags: { accessToken: string | null };
    }): ElmApp;
  }
}

type ElmApp = {
  ports: {
    addEventListenerForUserImage: {
      subscribe: (
        arg: (parameter: { labelId: string; inputId: string }) => void
      ) => void;
    };
    receiveUserImage: {
      send: (arg: string) => void;
    };
    addEventListenerForProductImages: {
      subscribe: (
        arg: (parameter: { labelId: string; inputId: string }) => void
      ) => void;
    };
    receiveProductImages: {
      send: (arg: Array<string>) => void;
    };
    toWideScreenMode: {
      send: (arg: null) => void;
    };
    toNarrowScreenMode: {
      send: (arg: null) => void;
    };
    saveAccessTokenToLocalStorage: {
      subscribe: (arg: (accessToken: string) => void) => void;
    };
    deleteAllFromLocalStorage: {
      subscribe: (arg: () => void) => void;
    };
    mainViewScrollToTop: {
      subscribe: (arg: () => void) => void;
    };
    elementScrollIntoView: {
      subscribe: (arg: (id: string) => void) => void;
    };
    replaceText: {
      subscribe: (
        arg: (parameter: { id: string; text: string }) => void
      ) => void;
    };
    changeSelectedIndex: {
      subscribe: (
        arg: (parameter: { id: string; index: number }) => void
      ) => void;
    };
    startListenRecommendProducts: {
      subscribe: (arg: (parameter: null) => void) => void;
    };
    receiveAllProducts: {
      send: (
        arg: Array<{
          id: string;
          category: string;
          condition: string;
          createdAt: number;
          description: string;
          imageIds: Array<string>;
          likedCount: number;
          name: Array<string>;
          price: number;
          sellerDisplayName: string;
          sellerId: string;
          sellerImageId: string;
          status: string;
          thumbnailImageId: string;
          updateAt: number;
        }>
      ) => void;
    };
  };
};
