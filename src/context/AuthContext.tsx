import { createContext, useCallback, useEffect, useState } from "react";
import { IUser } from "../models/IUser";
import { api } from "../services/api";
import AuthService, { ISignUpData } from "../services/AuthService";

interface IAuthContext {
  isAuthenticated: boolean;
  user: IUser | null;
  needSignUp: boolean;
  phoneNumber: string;
  isTrainer: boolean;
  signIn: (phoneNumber: string, callback?: (err?: any) => void) => void;
  signUp: (data: ISignUpData, callback?: (err?: any) => void) => void;
  signOut: () => void;
  phoneNumberMask: (str: string) => string;
}

export const AuthContext = createContext({} as IAuthContext);

export const AuthProvider: React.FC = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [user, setUser] = useState<IUser | null>(null);
  const [needSignUp, setNeedSignUp] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isTrainer, setIsTrainer] = useState<boolean>(false);

  const phoneNumberMask = useCallback((str: string) => {
    return str
      .replace(/\D/g, "")
      .replace(/(\d{1,2})(\d{0,5})(\d{4}).*/g, "($1) $2-$3");
  }, []);

  const signIn = useCallback(
    (phoneNumber: string, callback?: (err?: any) => void) => {
      phoneNumber = phoneNumber.replace(/\D/g, "").trim();

      if (phoneNumber.length < 10) {
        alert("Número de telefone inválido!");

        return;
      }

      setPhoneNumber(phoneNumber);

      AuthService.signIn(phoneNumber)
        .then((response) => {
          const { token, user } = response.data;

          (api.defaults.headers as any).Authorization = `Bearer ${token}`;

          localStorage.setItem("phone_number", user.phone_number);

          setUser(user);
          setIsTrainer(user.is_trainer);
          setIsAuthenticated(true);

          callback && callback();
        })
        .catch((err) => {
          if (err.response?.status === 401) setNeedSignUp(true);
          else {
            alert("Não foi possível realizar o Login");

            callback && callback(err);
          }
        });
    },
    []
  );

  const signUp = useCallback((data: ISignUpData, callback?: () => void) => {
    data.phone_number = data.phone_number.replace(/\D/g, "").trim();

    if (data.phone_number.length < 10) {
      alert("Número de telefone inválido!");

      return;
    }

    AuthService.signUp(data)
      .then(() => {
        setNeedSignUp(false);

        alert("Cadastro realizado com sucesso!");
      })
      .catch((err) => {
        if (err.response?.status === 401)
          alert("Este código de convite não é válido!");
        else if (err.response?.status === 409)
          alert("Este telefone já está cadastrado!");
        else alert("Não foi possível realizar o Cadastro");
      });
  }, []);

  const signOut = useCallback(() => {
    (api.defaults.headers as any).Authorization = undefined;

    localStorage.removeItem("phone_number");

    setUser(null);
    setIsTrainer(false);
    setNeedSignUp(false);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const phoneNumber = localStorage.getItem("phone_number");

    phoneNumber ? signIn(phoneNumber, (err) => err && signOut()) : signOut();
  }, [signIn, signOut]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        needSignUp,
        phoneNumber,
        isTrainer,
        signIn,
        signUp,
        signOut,
        phoneNumberMask,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
