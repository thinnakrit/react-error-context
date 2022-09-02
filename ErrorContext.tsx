import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";
import axios from 'axios'

export const ErrorContext = createContext({
    errorMessage: null as string | null,
    setErrorMessage: (value: string | null) => {},
    errorCode: null as number | null,
    setErrorCode: (value: number | null) => {},
    onErrorLog: (
        errorMessage: string | null,
        errorCode: string | null
    ) => {},
    onClearError: () => {},
  });

export const useError = () => useContext(ErrorContext);

export const ErrorProvider = (props: PropsWithChildren) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(
      null as unknown as string
    ); //for display error message
    const [errorCode, setErrorCode] = useState<number | null>(
      null as unknown as number
    ); //for keep error code

    const handleSetErrorMessage = (message: string | null) => {
        setErrorMessage(message)
    }

    const handleSetErrorCode = (code: number | null) => {
        setErrorCode(code)
    }

    const handleClearError = () => {
        handleSetErrorMessage(null)
        handleSetErrorCode(null)
    }

    const handleErrorLog = (errorMessage: string | null, errorCode: string | null) => {
        // investigated with log solution or third party services
    }

    // axios error listerner
    const _handleInterceptors = () => {
        axios.interceptors.request.use(
            config => config,
            error => Promise.reject(error)
        )
        axios.interceptors.response.use(
            response => response,
            error => {
                handleErrorLog(error.message, error.response?.status)
            }
        )
    }

    useEffect(() => {
        _handleInterceptors()
    }, [])

    return (
        <ErrorContext.Provider
          value={{
            errorMessage,
            setErrorMessage: handleSetErrorMessage,
            errorCode,
            setErrorCode: handleSetErrorCode,
            onErrorLog: handleErrorLog,
            onClearError: handleClearError,
          }}
        >
          {props.children}
        </ErrorContext.Provider>
    );
}
