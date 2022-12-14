
// Perform inference with the provided model and input data
async function PerformInferenceAsync(model, float32Data, shape) {

    const outputData = tf.tidy(() => {
        // Initialize the input tensor
        const input_tensor = tf.tensor(float32Data, shape, 'float32');
        // Make a prediction.
        return model.predict(input_tensor);
    });
    return await outputData.data();
}

// Source: https://github.com/microsoft/onnxruntime-nextjs-template/blob/60c0254beb2277431e96f15ec6613d781c2ad294/utils/modelHelper.ts#L42
//The softmax transforms values to be between 0 and 1
function softmax(resultArray) {
    // Get the largest value in the array.
    const largestNumber = Math.max(...resultArray);
    // Apply exponential function to each result item subtracted by the largest number, use reduce to get the previous result number and the current number to sum all the exponentials results.
    const sumOfExp = resultArray.map((resultItem) => Math.exp(resultItem - largestNumber)).reduce((prevNumber, currentNumber) => prevNumber + currentNumber);
    //Normalizes the resultArray by dividing by the sum of all exponentials; this normalization ensures that the sum of the components of the output vector is 1.
    return resultArray.map((resultValue, index) => {
        return Math.exp(resultValue - largestNumber) / sumOfExp;
    });
}

// Get the index for the array element with the highest value
function argMax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}