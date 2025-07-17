import { useAppContext } from "@/context/AppContext"
import useWindowDimensions from "@/hooks/useWindowDimensions"
import { useCallback, useEffect } from "react"
import { HistoryEntry, TLRecord, Tldraw, useEditor } from "tldraw"

function DrawingEditor() {
    const { isMobile } = useWindowDimensions()

    return (
        <Tldraw
            inferDarkMode
            forceMobile={isMobile}
            defaultName="Editor"
            className="z-0"
        >
            <LocalEditor />
        </Tldraw>
    )
}

function LocalEditor() {
    const editor = useEditor()
    const { drawingData, setDrawingData } = useAppContext()

    const handleChangeEvent = useCallback(
        (change: HistoryEntry<TLRecord>) => {
            // Update the drawing data in the context (local only)
            setDrawingData(editor.store.getSnapshot())
        },
        [editor.store, setDrawingData],
    )

    useEffect(() => {
        // Load the drawing data from the context
        if (drawingData && Object.keys(drawingData).length > 0) {
            editor.store.loadSnapshot(drawingData)
        }
    }, [])

    useEffect(() => {
        // Listen for local drawing changes only
        const cleanupFunction = editor.store.listen(handleChangeEvent, {
            source: "user",
            scope: "document",
        })
        // Cleanup
        return () => {
            cleanupFunction()
        }
    }, [drawingData, editor.store, handleChangeEvent])

    return null
}

export default DrawingEditor
