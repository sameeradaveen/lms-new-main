import { ReactNode } from "react"
import { AppContextProvider } from "./AppContext"
import { FileContextProvider } from "./FileContext"
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
					<SettingsProvider>
						{children}
					</SettingsProvider>
				</FileContextProvider>
			</SocketProvider>
		</AppContextProvider>
	)
}

export default AppProvider
