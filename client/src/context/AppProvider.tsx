import { ReactNode } from "react"
import { AppContextProvider } from "./AppContext"
import { FileContextProvider } from "./FileContext"
import { RunCodeContextProvider } from "./RunCodeContext"
import { SettingsProvider } from "./SettingContext"
import { SocketProvider } from "./SocketContext"

interface AppProviderProps {
	children: ReactNode
}

const AppProvider = ({ children }: AppProviderProps) => {
	return (
		<AppContextProvider>
			<SocketProvider>
				<FileContextProvider>
					<RunCodeContextProvider>
						<SettingsProvider>
							{children}
						</SettingsProvider>
					</RunCodeContextProvider>
				</FileContextProvider>
			</SocketProvider>
		</AppContextProvider>
	)
}

export default AppProvider
