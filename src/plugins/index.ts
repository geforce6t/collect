import SheetPlugin from "./sheets/sheet.plugin";

export const initializePlugins = () => {
    const sheetPlugin = new SheetPlugin();

    return {
        sheetPlugin
    }
}