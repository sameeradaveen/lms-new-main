import { createContext, useContext, useEffect, useState } from "react"

interface SettingsContextType {
	theme: string
	setTheme: (theme: string) => void
	language: string
	setLanguage: (language: string) => void
	fontSize: number
	setFontSize: (fontSize: number) => void
	fontFamily: string
	setFontFamily: (fontFamily: string) => void
}

const defaultSettings = {
	theme: "dracula",
	language: "javascript",
	fontSize: 14,
	fontFamily: "Fira Code",
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const useSettings = () => {
	const context = useContext(SettingsContext)
	if (!context) {
		throw new Error("useSettings must be used within a SettingsProvider")
	}
	return context
}

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
	const storedSettings = JSON.parse(
		localStorage.getItem("settings") || "{}"
	)

	const [theme, setTheme] = useState<string>(
		storedSettings.theme !== undefined
			? storedSettings.theme
			: defaultSettings.theme
	)
	const [language, setLanguage] = useState<string>(
		storedSettings.language !== undefined
			? storedSettings.language
			: defaultSettings.language
	)
	const [fontSize, setFontSize] = useState<number>(
		storedSettings.fontSize !== undefined
			? storedSettings.fontSize
			: defaultSettings.fontSize
	)
	const [fontFamily, setFontFamily] = useState<string>(
		storedSettings.fontFamily !== undefined
			? storedSettings.fontFamily
			: defaultSettings.fontFamily
	)

	useEffect(() => {
		const settings = {
			theme,
			language,
			fontSize,
			fontFamily,
		}
		localStorage.setItem("settings", JSON.stringify(settings))
	}, [theme, language, fontSize, fontFamily])

	const value: SettingsContextType = {
		theme,
		setTheme,
		language,
		setLanguage,
		fontSize,
		setFontSize,
		fontFamily,
		setFontFamily,
	}

	return (
		<SettingsContext.Provider value={value}>
			{children}
		</SettingsContext.Provider>
	)
}
