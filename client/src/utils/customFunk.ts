const parseIntoFormatText = (text: string, regex: any) => {
    if (regex.test(text)) {
        return text.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
    }
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const fileReader = (file: File) => {
    return new Promise((resolve, reject) => {
        const newFileReader = new FileReader();
        newFileReader.readAsDataURL(file);

        newFileReader.onload = () => {
            resolve(newFileReader.result)
        };

        newFileReader.onerror = (err: any) => {
            if (err) {
                reject(new Error(err))
            }
        }
    })
}

export {
    parseIntoFormatText, fileReader
}