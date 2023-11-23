function getIsLoadingStyle(isLoading) {
    return isLoading ? {
        style: {
            pointerEvents: isLoading ? 'none' : 'auto',
            opacity: isLoading ? 0.5 : 1,
        },
    } : {};
}

function setWarningColor(percentage) {
    const green = [0, 255, 0]; // RGB values for green
    const red = [255, 0, 0]; // RGB values for red

    const transformedColor = green.map((greenValue, index) => {
        const redValue = red[index];
        const transformedValue = Math.round(greenValue + ((redValue - greenValue) * Math.sqrt(percentage / 100)));
        return transformedValue;
    });

    const rgbColor = `rgb(${transformedColor[0]}, ${transformedColor[1]}, ${transformedColor[2]})`;
    return rgbColor;
}


export { setWarningColor, getIsLoadingStyle }