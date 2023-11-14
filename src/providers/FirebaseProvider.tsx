import React, { createContext, useContext, useEffect, useMemo } from "react";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFunctions,
  Functions,
  connectFunctionsEmulator,
} from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

type FirebaseContextType = {
  app: FirebaseApp;
  functions: Functions;
};

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const useFirebase = (): FirebaseContextType => {
  const firebaseContext = useContext(FirebaseContext);
  if (!firebaseContext) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return firebaseContext;
};

type FirebaseProviderProps = {
  firebaseConfig: Object;
  children: React.ReactNode;
};

export const FirebaseProvider = ({
  firebaseConfig,
  children,
}: FirebaseProviderProps) => {
  const app = useMemo(() => initializeApp(firebaseConfig), [firebaseConfig]);
  const functions = useMemo(() => getFunctions(app), [app]);

  useEffect(() => {
    if (app) {
      getAnalytics(app);
    }
  }, [app]);

  console.log(window.location.hostname);

  if (  ["127.0.0.1", "localhost"].includes(window.location.hostname)) {
    console.log("connecting to functions emulator");
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
  }

  return (
    <FirebaseContext.Provider value={{ app, functions }}>
      {children}
    </FirebaseContext.Provider>
  );
};
