export class DocumentUtils {
    static getDocumentName(filePath: string): string {
        if (filePath != null) {
            const parts = filePath.split('/');
            const fileNameWithExt = parts[parts.length - 1];
            const dotIndex = fileNameWithExt.lastIndexOf('.');
            // return dotIndex !== -1 ? fileNameWithExt.substring(0, dotIndex) : fileNameWithExt;
            return fileNameWithExt
        }
        return "Sample Name"
    }
}
