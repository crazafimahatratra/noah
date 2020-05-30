export const groupBy = (array, key) => {
    // Return the end result
    return array.reduce((result, currentValue) => {
        // If an array already present for key, push it to the array. Else create an array and push the object
        (result[currentValue[key]] = result[currentValue[key]] || []).push(
            currentValue
        );
        // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
        return result;
    }, {}); // empty object is the initial value for result object
};

export const sumByGroup = (array, groupProperty, sumProperty, other=null) => {
    let grouped = groupBy(array, groupProperty);
    let values = Object.entries(grouped).map(g => {
        let x = g[0];
        let y = g[1].map(t => t[sumProperty]).reduce((a, b) =>  a + b);
        let otherFields = null;
        if(other) {
            otherFields = {[other]: g[1].length > 0 ? g[1][0][other] : null}
        }
        return {[groupProperty]: x, [sumProperty]: y, ...otherFields}
    });
    return values;
}
