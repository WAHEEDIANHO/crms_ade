exports.error = (message = "error processing data") =>{
    const err = new Error();
    err.message = message;
    throw err
}